# ORION: Enterprise AI AgentOps Control Plane

![ORION Banner](https://img.shields.io/badge/ORION-AgentOps-blueviolet?style=for-the-badge&logo=openai)
![Status](https://img.shields.io/badge/Status-Production--Grade-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**ORION** is a local-first platform for managing, monitoring, and governing AI agents across enterprise workflows. It moves teams from isolated AI assistants to reliable, auditable, and production-grade agent systems.

---

## 🌌 Overview

ORION provides a centralized "Control Plane" for AI operations (AgentOps). It focuses on three core pillars:
1. **Observability**: Deep execution traces, prompt/response logs, and tool call history.
2. **Governance**: Human-in-the-loop approval gates, risk scoring, and permission management.
3. **Reliability**: Deterministic workflow orchestration with structured error handling.

![ORION Dashboard](assets/dashboard.png)
*Real-time observability and risk scoring dashboard.*

![Trace Viewer](assets/trace_viewer.png)
*Execution trace viewer with human-in-the-loop approval gate.*

---

## ✨ Feature Grid

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Agent Registry** | Centralized catalog of agents with versioning and role definitions. | ✅ |
| **Trace Viewer** | Inspect every step, thought process, and tool call in real-time. | ✅ |
| **Approval Gates** | Pause sensitive actions (e.g., prod deploys) for human review. | ✅ |
| **Risk Scoring** | Automated signals for privacy, compliance, and tool-usage risks. | ✅ |
| **Tool Registry** | Manage tool permissions and discovery across agent teams. | ✅ |
| **Audit Logs** | Immutable record of all system and agent activities. | ✅ |

---

## 🏗️ Architecture

```mermaid
graph TD
    User((User)) --> Web[Next.js Frontend]
    Web --> API[FastAPI Backend]
    API --> DB[(PostgreSQL)]
    API --> Cache[(Redis)]
    API --> Orchestrator[Workflow Orchestrator]
    Orchestrator --> LLM[Mock LLM Provider]
    Orchestrator --> Tools[Tool Execution Engine]
    Orchestrator --> Approvals[Approval Gates]
```

### Agent Lifecycle
1. **Definition**: Register agent role, system prompt, and allowed tools.
2. **Orchestration**: Trigger workflows via API or UI.
3. **Governance**: Intercept sensitive tool calls via Approval Gates.
4. **Audit**: Permanent storage of execution traces and decisions.

---

## 🚀 Local Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (optional for local dev)
- Node.js 18+ (optional for local dev)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-repo/orion.git
cd orion

# 2. Spin up the platform
make up

# 3. Seed realistic enterprise data
make seed
```

The platform will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Design Decisions

- **Local-First Mocking**: Uses a deterministic mock LLM provider to allow full testing without API costs or key management.
- **Async-First**: The backend uses Python `asyncio` for high-throughput workflow orchestration.
- **Shadcn UI + Framer Motion**: Provides a premium, responsive interface that feels "alive" with micro-animations.
- **SQLModel**: Unifies Pydantic and SQLAlchemy for clean, typed data access.

---

## 🗺️ Roadmap

- [ ] Integration with LangChain and LlamaIndex.
- [ ] Real-time WebSocket streaming for live traces.
- [ ] Multi-tenant organization support.
- [ ] Automated red-teaming for agent responses (ARGUS integration).

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
