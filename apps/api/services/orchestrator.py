import asyncio
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional, Callable
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
import structlog
import json

from apps.api.models.models import WorkflowRun, ExecutionTrace, RunStatus, RiskLevel, Approval
from apps.api.services.mock_provider import mock_llm
from apps.api.services.security import sanitizer

logger = structlog.get_logger()

# In-memory pub/sub for WebSockets (for a single instance MVP)
# Mapping of run_id -> List of async queues
run_subscriptions: Dict[uuid.UUID, List[asyncio.Queue]] = {}

def subscribe_to_run(run_id: uuid.UUID) -> asyncio.Queue:
    if run_id not in run_subscriptions:
        run_subscriptions[run_id] = []
    queue = asyncio.Queue()
    run_subscriptions[run_id].append(queue)
    return queue

def unsubscribe_from_run(run_id: uuid.UUID, queue: asyncio.Queue):
    if run_id in run_subscriptions and queue in run_subscriptions[run_id]:
        run_subscriptions[run_id].remove(queue)
        if not run_subscriptions[run_id]:
            del run_subscriptions[run_id]

async def publish_trace_update(run_id: uuid.UUID, trace: ExecutionTrace):
    if run_id in run_subscriptions:
        # We must serialize it safely
        trace_dict = {
            "id": str(trace.id),
            "run_id": str(trace.run_id),
            "step_name": trace.step_name,
            "step_type": trace.step_type,
            "input": trace.input,
            "output": trace.output,
            "timestamp": trace.timestamp.isoformat(),
            "latency_ms": trace.latency_ms,
            "token_usage": trace.token_usage
        }
        for q in run_subscriptions[run_id]:
            await q.put({"type": "trace_update", "data": trace_dict})

class Orchestrator:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def start_run(self, agent_id: uuid.UUID, input_data: Dict[str, Any], workflow_id: Optional[uuid.UUID] = None) -> WorkflowRun:
        run = WorkflowRun(
            agent_id=agent_id,
            workflow_id=workflow_id,
            input_data=input_data,
            status=RunStatus.RUNNING,
            started_at=datetime.utcnow()
        )
        self.session.add(run)
        await self.session.commit()
        await self.session.refresh(run)
        
        # Start execution in background
        asyncio.create_task(self.execute_run(run.id))
        
        return run

    async def execute_run(self, run_id: uuid.UUID):
        # In a real app, this might be handled by Celery or Temporal
        # For this portfolio, we'll use a simplified async loop
        
        # We need a new session for the background task
        from apps.api.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            run = await session.get(WorkflowRun, run_id)
            if not run:
                return

            try:
                # Step 1: Initial LLM Analysis
                await self._add_trace(session, run_id, "initial_analysis", "llm", 
                                    input={"prompt": f"Analyze input: {run.input_data}"})
                
                llm_response = await mock_llm.generate_response(str(run.input_data), "Agent")
                
                await self._update_last_trace(session, run_id, output=llm_response)
                
                # Step 2: Handle Tool Calls
                for tool_call in llm_response.get("tool_calls", []):
                    # Check if tool requires approval
                    # For demo purposes, we'll assume 'escalate' requires approval
                    if "escalate" in tool_call["name"]:
                        await self._handle_approval_pause(session, run, tool_call)
                        return # Execution stops here until approved

                    await self._execute_tool(session, run_id, tool_call)

                # Step 3: Final Output
                run.status = RunStatus.COMPLETED
                run.output_data = {"summary": llm_response["content"]}
                run.finished_at = datetime.utcnow()
                session.add(run)
                await session.commit()

            except Exception as e:
                logger.error("run_failed", run_id=str(run_id), error=str(e))
                run.status = RunStatus.FAILED
                session.add(run)
                await session.commit()

    async def _add_trace(self, session: AsyncSession, run_id: uuid.UUID, name: str, type: str, input: Dict[str, Any]):
        trace = ExecutionTrace(
            run_id=run_id,
            step_name=name,
            step_type=type,
            input=sanitizer.sanitize(input),
            timestamp=datetime.utcnow()
        )
        session.add(trace)
        await session.commit()
        await session.refresh(trace)
        await publish_trace_update(run_id, trace)
        return trace

    async def _update_last_trace(self, session: AsyncSession, run_id: uuid.UUID, output: Dict[str, Any]):
        result = await session.execute(
            select(ExecutionTrace).where(ExecutionTrace.run_id == run_id).order_by(ExecutionTrace.timestamp.desc())
        )
        trace = result.scalars().first()
        if trace:
            trace.output = sanitizer.sanitize(output)
            session.add(trace)
            await session.commit()
            await publish_trace_update(run_id, trace)

    async def _execute_tool(self, session: AsyncSession, run_id: uuid.UUID, tool_call: Dict[str, Any]):
        await self._add_trace(session, run_id, tool_call["name"], "tool", input=tool_call["arguments"])
        
        # Simulate tool execution
        await asyncio.sleep(1)
        tool_output = {"status": "success", "data": f"Executed {tool_call['name']} successfully"}
        
        await self._update_last_trace(session, run_id, output=tool_output)

    async def _handle_approval_pause(self, session: AsyncSession, run: WorkflowRun, tool_call: Dict[str, Any]):
        trace = await self._add_trace(session, run.id, tool_call["name"], "approval", input=tool_call["arguments"])
        
        run.status = RunStatus.PAUSED
        session.add(run)
        
        approval = Approval(
            run_id=run.id,
            trace_id=trace.id,
            requested_action=tool_call["name"],
            context=tool_call["arguments"]
        )
        session.add(approval)
        await session.commit()
        logger.info("run_paused_for_approval", run_id=str(run.id), tool=tool_call["name"])

    async def resume_run(self, run_id: uuid.UUID, approved: bool):
        from apps.api.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            run = await session.get(WorkflowRun, run_id)
            if not run or run.status != RunStatus.PAUSED:
                return

            if approved:
                run.status = RunStatus.RUNNING
                session.add(run)
                await session.commit()
                # Resume execution
                asyncio.create_task(self.execute_run_from_pause(run_id))
            else:
                run.status = RunStatus.CANCELLED
                session.add(run)
                await session.commit()

    async def execute_run_from_pause(self, run_id: uuid.UUID):
        # Implementation to resume from the last point
        # For simplicity in this demo, we'll just complete it
        from apps.api.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            run = await session.get(WorkflowRun, run_id)
            run.status = RunStatus.COMPLETED
            run.output_data = {"summary": "Completed after human approval."}
            run.finished_at = datetime.utcnow()
            session.add(run)
            await session.commit()
