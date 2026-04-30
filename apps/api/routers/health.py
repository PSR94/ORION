from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from apps.api.services.orchestrator import subscribe_to_telemetry, unsubscribe_from_telemetry

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "service": "ORION Control Plane"
    }

@router.websocket("/system/telemetry")
async def stream_telemetry(websocket: WebSocket):
    await websocket.accept()
    queue = subscribe_to_telemetry()
    try:
        while True:
            update = await queue.get()
            await websocket.send_json(update)
    except WebSocketDisconnect:
        unsubscribe_from_telemetry(queue)
    except Exception as e:
        unsubscribe_from_telemetry(queue)
        await websocket.close()
