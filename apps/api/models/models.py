from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from enum import Enum
import uuid

class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"  # Waiting for approval
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Agent(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: str
    role: str
    system_prompt: str
    version: str = "1.0.0"
    config: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    runs: List["WorkflowRun"] = Relationship(back_populates="agent")

class Tool(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: str
    parameters: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    permissions: List[str] = Field(default=[], sa_column=Column(JSON))
    requires_approval: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Workflow(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: str
    definition: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    runs: List["WorkflowRun"] = Relationship(back_populates="workflow")

class WorkflowRun(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    agent_id: uuid.UUID = Field(foreign_key="agent.id")
    workflow_id: Optional[uuid.UUID] = Field(default=None, foreign_key="workflow.id")
    status: RunStatus = Field(default=RunStatus.PENDING)
    input_data: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    output_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    risk_score: float = 0.0
    risk_level: RiskLevel = Field(default=RiskLevel.LOW)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    finished_at: Optional[datetime] = Field(default=None)
    
    agent: Agent = Relationship(back_populates="runs")
    workflow: Optional[Workflow] = Relationship(back_populates="runs")
    traces: List["ExecutionTrace"] = Relationship(back_populates="run")

class ExecutionTrace(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    run_id: uuid.UUID = Field(foreign_key="workflowrun.id")
    step_name: str
    step_type: str  # "llm", "tool", "approval", "condition"
    input: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    output: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    latency_ms: int = 0
    token_usage: Dict[str, int] = Field(default={}, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    run: WorkflowRun = Relationship(back_populates="traces")

class Approval(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    run_id: uuid.UUID = Field(foreign_key="workflowrun.id")
    trace_id: uuid.UUID = Field(foreign_key="executiontrace.id")
    requested_action: str
    context: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    status: str = "pending"  # pending, approved, rejected
    approver: Optional[str] = None
    decided_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    event_type: str
    action: str
    actor: str
    target_id: Optional[str] = None
    details: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
