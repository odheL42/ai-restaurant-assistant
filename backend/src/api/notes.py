from fastapi import APIRouter

from src.context.menu import MenuContext
from src.models.summary import DBNotes, RequestSetNotes
from src.storage.notes import NotesStore

router = APIRouter()


@router.post("/save_notes", tags=["Notes"])
async def save_notes(notes: RequestSetNotes) -> None:
    MenuContext.set_catering(notes.is_catering)
    await NotesStore.save(DBNotes(notes=notes.notes, is_catering=notes.is_catering))


@router.get("/get_notes", tags=["Notes"])
async def get_notes(is_catering: bool) -> str:
    MenuContext.set_catering(is_catering)
    db_notes = await NotesStore.get()
    return db_notes.notes
