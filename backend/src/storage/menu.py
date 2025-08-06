import json
from pathlib import Path

import aiofiles

from src.config import config
from src.models.current_menu import CurrentMenuDish


class MenuStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        config.menu_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.menu_dir / "menu.json")

        if not path.exists():
            path.write_text("[]", encoding="utf-8")

        return path

    @classmethod
    async def _load(cls) -> list[CurrentMenuDish]:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
            data = json.loads(raw)
            return [CurrentMenuDish.model_validate(item) for item in data]

    @classmethod
    async def _save(cls, dishes: list[CurrentMenuDish]) -> None:
        path = cls._ensure_path()
        data = [dish.model_dump(mode="json") for dish in dishes]

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(json.dumps(data, indent=4, ensure_ascii=False))

    @classmethod
    async def list(cls) -> list[CurrentMenuDish]:
        return await cls._load()

    @classmethod
    async def add(cls, dish: CurrentMenuDish) -> None:
        dishes = await cls._load()
        dishes.append(dish)
        await cls._save(dishes)

    @classmethod
    async def update(cls, index: str, new_dish: CurrentMenuDish) -> bool:
        dishes = await cls._load()
        for i, dish in enumerate(dishes):
            if dish.index == index:
                dishes[i] = new_dish
                await cls._save(dishes)
                return True
        return False

    @classmethod
    async def remove(cls, index: str) -> bool:
        dishes = await cls._load()
        updated = [dish for dish in dishes if dish.index != index]
        if len(updated) != len(dishes):
            await cls._save(updated)
            return True
        return False

    @classmethod
    async def erase(cls) -> None:
        await cls._save([])
