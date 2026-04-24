from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
from apps.api.core.database import get_session
from apps.api.models.models import Workflow
import uuid

router = APIRouter()

@router.get("/", response_model=List[Workflow])
async def list_workflows(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Workflow))
    return result.scalars().all()

@router.post("/", response_model=Workflow)
async def create_workflow(workflow: Workflow, session: AsyncSession = Depends(get_session)):
    session.add(workflow)
    await session.commit()
    await session.refresh(workflow)
    return workflow
