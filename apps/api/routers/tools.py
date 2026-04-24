from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
from apps.api.core.database import get_session
from apps.api.models.models import Tool
import uuid

router = APIRouter()

@router.get("/", response_model=List[Tool])
async def list_tools(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Tool))
    return result.scalars().all()

@router.post("/", response_model=Tool)
async def create_tool(tool: Tool, session: AsyncSession = Depends(get_session)):
    session.add(tool)
    await session.commit()
    await session.refresh(tool)
    return tool
