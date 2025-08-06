import json
from pathlib import Path

import aiofiles  # type: ignore

from src.config import config
from src.context.session import SessionContext
from src.models.completions import ChatMessage
from src.models.storage import DBChatMessage


class HistoryStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.history_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.history_dir / f"{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("[]", encoding="utf-8")

        return path

    @classmethod
    async def _load(cls) -> list[DBChatMessage]:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
            data = json.loads(raw)
            return [DBChatMessage.model_validate(item) for item in data]

    @classmethod
    async def _save(cls, completions: list[DBChatMessage]) -> None:
        path = cls._ensure_path()
        data = [c.model_dump(mode="json") for c in completions]

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(json.dumps(data, indent=4, ensure_ascii=False))

    @classmethod
    async def add(cls, chat_message: ChatMessage) -> DBChatMessage:
        completions = await cls._load()
        db_chat_message = DBChatMessage(message=chat_message)
        completions.append(db_chat_message)
        await cls._save(completions)
        return db_chat_message

    @classmethod
    async def last(cls) -> DBChatMessage | None:
        history = await cls._load()
        if history:
            return history[-1]
        return None

    @classmethod
    async def list(cls) -> list[DBChatMessage]:
        return await cls._load()

    @classmethod
    async def pop(cls) -> DBChatMessage | None:
        completions = await cls._load()
        if completions:
            db_chat_message = completions.pop()
            await cls._save(completions)
            return db_chat_message
        return None

    @classmethod
    async def update(cls, chat_message: ChatMessage) -> DBChatMessage | None:
        completions = await cls._load()
        if completions:
            completions[-1] = DBChatMessage(message=chat_message)
            await cls._save(completions)
            return completions[-1]
        return None

    @classmethod
    async def erase(cls) -> None:
        await cls._save([])
