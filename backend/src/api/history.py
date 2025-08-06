from fastapi import APIRouter

from src.models.storage import DBChatMessage
from src.storage.history import HistoryStore
from src.storage.summary import DBHistorySummary, HistorySummaryStore

router = APIRouter()


@router.get("/history", tags=["History"])
async def history() -> list[DBChatMessage]:
    return await HistoryStore.list()


@router.post("/erase_history", tags=["History"])
async def erase_history() -> None:
    await HistorySummaryStore.save(DBHistorySummary())
    await HistoryStore.erase()
