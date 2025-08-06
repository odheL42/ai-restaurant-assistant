import json

import aiofiles  # type: ignore

from src.models.current_menu import CPFCModel, CurrentMenuCategory, CurrentMenuDish

current_menu: list[CurrentMenuDish] | None = None


class IDGenerator:
    counter: int = 0

    @classmethod
    def get_next_index(cls) -> str:
        result = f"dish_{str(cls.counter)}"
        cls.counter += 1
        return result

    @classmethod
    def flush(cls) -> None:
        cls.counter = 0


async def get_current_menu() -> list[CurrentMenuDish]:
    IDGenerator.flush()
    path = "src/connectors/menu_21_july.json"
    global current_menu
    if current_menu:
        return current_menu
    async with aiofiles.open(path, encoding="utf-8") as f:
        data = await f.read()
        raw_data = json.loads(data)

    menu_items: list[CurrentMenuDish] = []

    for item in raw_data:
        menu_item = CurrentMenuDish(
            index=IDGenerator.get_next_index(),
            title=item["title"],
            category=CurrentMenuCategory(item["category"]),
            subcategory=item["subcategory"],
            quantity=item["quantity"],
            price=item["price"],
            stock=item.get("stock", True),
            notes=item.get("notes"),
            cpfc=CPFCModel(**item["cpfc"]) if item.get("cpfc") else None,
        )
        menu_items.append(menu_item)

    return menu_items


async def get_dish_by_id(index: str) -> CurrentMenuDish:
    menu = await get_current_menu()
    for dish in menu:
        if dish.index == index:
            return dish
    raise ValueError("dish_id not found")
