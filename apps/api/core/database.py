import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, create_engine
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://orion:orion@localhost:5432/orion")
    ASYNC_DATABASE_URL: str = os.getenv("ASYNC_DATABASE_URL", "postgresql+asyncpg://orion:orion@localhost:5432/orion")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-development")
    
    class Config:
        env_file = ".env"

settings = Settings()

# Sync engine for migrations/initialization
engine = create_engine(settings.DATABASE_URL)

# Async engine for application logic
async_engine = create_async_engine(settings.ASYNC_DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

async def init_db():
    # In a real app, use Alembic. For this portfolio, we'll create tables directly if needed.
    pass

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
