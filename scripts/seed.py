import asyncio
import uuid
from datetime import datetime
from sqlmodel import Session, create_engine
from apps.api.models.models import Agent, Tool, Workflow, WorkflowRun, ExecutionTrace, RunStatus, RiskLevel

DATABASE_URL = "postgresql+psycopg2://orion:orion@localhost:5432/orion"
engine = create_engine(DATABASE_URL)

def seed():
    with Session(engine) as session:
        # 1. Create Agents
        support_agent = Agent(
            name="Support-Escalator",
            role="Senior Support Automation",
            description="Specializes in handling complex billing and refund requests.",
            system_prompt="You are a senior support agent. If a refund is over $100, you MUST escalate.",
            config={"model": "gpt-4-mock", "temperature": 0}
        )
        release_agent = Agent(
            name="Release-Commander",
            role="DevOps Orchestrator",
            description="Manages canary deployments and health checks.",
            system_prompt="Analyze metrics and decide if deployment should proceed.",
            config={"model": "gpt-4-mock", "temperature": 0}
        )
        session.add(support_agent)
        session.add(release_agent)
        session.commit()

        # 2. Create Tools
        tools = [
            Tool(name="query_billing", description="Lookup customer invoices", requires_approval=False),
            Tool(name="process_refund", description="Issue a refund to customer", requires_approval=True),
            Tool(name="check_k8s_health", description="Query kubernetes cluster status", requires_approval=False),
            Tool(name="trigger_deploy", description="Push code to production", requires_approval=True),
        ]
        for t in tools:
            session.add(t)
        session.commit()

        # 3. Create a Run
        run = WorkflowRun(
            agent_id=support_agent.id,
            status=RunStatus.COMPLETED,
            input_data={"customer_id": "cust_123", "issue": "double charge"},
            output_data={"summary": "Issue resolved via manual check."},
            risk_score=0.2,
            risk_level=RiskLevel.LOW,
            started_at=datetime.utcnow()
        )
        session.add(run)
        session.commit()

        print("Seeding completed successfully.")

if __name__ == "__main__":
    seed()
