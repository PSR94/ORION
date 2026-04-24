from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
from apps.api.core.database import get_session
from apps.api.models.models import Agent
import uuid

router = APIRouter()

@router.get("/", response_model=List[Agent])
async def list_agents(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Agent))
    return result.scalars().all()

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    agent = await session.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.post("/", response_model=Agent)
async def create_agent(agent: Agent, session: AsyncSession = Depends(get_session)):
    session.add(agent)
    await session.commit()
    await session.refresh(agent)
    return agent
