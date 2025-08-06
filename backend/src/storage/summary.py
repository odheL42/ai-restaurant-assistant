import json
from pathlib import Path

import aiofiles  # type:ignore

from src.config import config
from src.context.session import SessionContext
from src.models.summary import DBHistorySummary


class HistorySummaryStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.summary_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.summary_dir / f"{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("{}", encoding="utf-8")

        return path

    @classmethod
    async def get(cls) -> DBHistorySummary:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
        return DBHistorySummary.model_validate(json.loads(raw))

    @classmethod
    async def save(cls, db_summary: DBHistorySummary) -> None:
        path = cls._ensure_path()

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(
                json.dumps(db_summary.model_dump(), indent=4, ensure_ascii=False)
            )
