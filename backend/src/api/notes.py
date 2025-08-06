from fastapi import APIRouter

from src.models.summary import DBNotes, RequestSetNotes
from src.storage.notes import NotesStore

router = APIRouter()


@router.post("/save_notes", tags=["Notes"])
async def save_notes(notes: RequestSetNotes) -> None:
    await NotesStore.save(DBNotes(notes=notes.notes))


@router.get("/get_notes", tags=["Notes"])
async def get_notes() -> str:
    db_notes = await NotesStore.get()
    return db_notes.notes
