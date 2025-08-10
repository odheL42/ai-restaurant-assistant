import json
from pathlib import Path

import aiofiles  # type: ignore

from src.config import config
from src.context.session import SessionContext
from src.models.cafe_info import DBCafeInfo


class CafeInfoStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.cafe_info_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.cafe_info_dir / f"cafe_info_{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("{}", encoding="utf-8")

        return path

    @classmethod
    async def get(cls) -> DBCafeInfo:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
        return DBCafeInfo.model_validate(json.loads(raw))

    @classmethod
    async def save(cls, db_cafe_info: DBCafeInfo) -> None:
        path = cls._ensure_path()

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(
                json.dumps(db_cafe_info.model_dump(), indent=4, ensure_ascii=False)
            )

    @classmethod
    async def add(cls, new_part: str) -> None:
        db_cafe_info = await cls.get()
        db_cafe_info.cafe_info += new_part

        if len(db_cafe_info.cafe_info) > config.cafe_info_max_char:
            return

        await cls.save(db_cafe_info)
