import json
from pathlib import Path

import aiofiles  # type: ignore

from src.config import config
from src.context.menu import MenuContext
from src.context.session import SessionContext
from src.models.summary import DBNotes


class NotesStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.notes_dir.mkdir(exist_ok=True, parents=True)
        prefix = "catering" if MenuContext.is_catering() else "main_menu"
        path = Path(config.notes_dir / f"{prefix}_{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("{}", encoding="utf-8")

        return path

    @classmethod
    async def get(cls) -> DBNotes:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
        return DBNotes.model_validate(json.loads(raw))

    @classmethod
    async def save(cls, db_notes: DBNotes) -> None:
        path = cls._ensure_path()

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(
                json.dumps(db_notes.model_dump(), indent=4, ensure_ascii=False)
            )

    @classmethod
    async def add(cls, new_part: str) -> None:
        db_notes = await cls.get()
        db_notes.notes += new_part

        if len(db_notes.notes) > config.notes_max_char:
            return

        await cls.save(db_notes)
