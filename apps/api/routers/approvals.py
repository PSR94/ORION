from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
from apps.api.core.database import get_session
from apps.api.models.models import Approval, WorkflowRun
from apps.api.services.orchestrator import Orchestrator
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Approval])
async def list_approvals(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Approval).where(Approval.status == "pending"))
    return result.scalars().all()

@router.post("/{approval_id}/decide")
async def decide_approval(
    approval_id: uuid.UUID, 
    approved: bool, 
    approver: str,
    session: AsyncSession = Depends(get_session)
):
    approval = await session.get(Approval, approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    
    approval.status = "approved" if approved else "rejected"
    approval.approver = approver
    approval.decided_at = datetime.utcnow()
    
    session.add(approval)
    await session.commit()
    
    # Resume orchestrator
    orchestrator = Orchestrator(session)
    await orchestrator.resume_run(approval.run_id, approved)
    
    return {"status": "success", "decision": approval.status}
