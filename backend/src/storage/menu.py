from pathlib import Path

import aiofiles

from src.config import config
from src.context.session import SessionContext
from src.models.menu import MenuDish, MenuMap


class MenuStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.menu_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.menu_dir / f"menu_{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("{}", encoding="utf-8")  # пустой словарь

        return path

    @classmethod
    async def load(cls) -> MenuMap:
        path = cls._ensure_path()
        async with aiofiles.open(path, encoding="utf-8") as f:
            raw = await f.read()
            return MenuMap.model_validate_json(raw)

    @classmethod
    async def save(cls, menu: MenuMap) -> None:
        path = cls._ensure_path()
        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(menu.model_dump_json(indent=4))

    @classmethod
    async def list(cls) -> list[MenuDish]:
        menu = await cls.load()
        return menu.to_list()

    @classmethod
    async def add(cls, dish: MenuDish) -> None:
        menu = await cls.load()
        menu.add_or_replace(dish)
        await cls.save(menu)

    @classmethod
    async def update(cls, index: str, new_dish: MenuDish) -> bool:
        menu = await cls.load()
        if index in menu.to_dict():
            menu.add_or_replace(new_dish)
            await cls.save(menu)
            return True
        return False

    @classmethod
    async def remove(cls, index: str) -> bool:
        menu = await cls.load()
        if index in menu.to_dict():
            menu.remove(index)
            await cls.save(menu)
            return True
        return False

    @classmethod
    async def erase(cls) -> None:
        await cls.save(MenuMap(__root__={}))
