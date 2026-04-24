from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List, Dict, Any
from apps.api.core.database import get_session
from apps.api.models.models import WorkflowRun, ExecutionTrace, Agent
from apps.api.services.orchestrator import Orchestrator
import uuid

router = APIRouter()

@router.post("/", response_model=WorkflowRun)
async def create_run(
    agent_id: uuid.UUID, 
    input_data: Dict[str, Any], 
    session: AsyncSession = Depends(get_session)
):
    orchestrator = Orchestrator(session)
    return await orchestrator.start_run(agent_id, input_data)

@router.get("/", response_model=List[WorkflowRun])
async def list_runs(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(WorkflowRun).order_by(WorkflowRun.started_at.desc()))
    return result.scalars().all()

@router.get("/{run_id}", response_model=WorkflowRun)
async def get_run(run_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    run = await session.get(WorkflowRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/{run_id}/traces", response_model=List[ExecutionTrace])
async def get_run_traces(run_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(ExecutionTrace).where(ExecutionTrace.run_id == run_id).order_by(ExecutionTrace.timestamp.asc())
    )
    return result.scalars().all()
