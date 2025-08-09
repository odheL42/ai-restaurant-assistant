from src.models.menu import MenuDish
from src.storage.menu import MenuStore


class CurrentMenuPrompt:
    _current_menu_template = """
---

**Меню, доступное пользователю сейчас**:

$menu
"""

    @classmethod
    def _format_dish(cls, dish: MenuDish) -> str:
        parts = [f"Индекс. {dish.index}"]
        parts.append(f"Назввание: {dish.title}")
        parts.append(f"Категория: {dish.category}")
        parts.append(f"Порция: {dish.quantity}")
        parts.append(f"Цена: {dish.price}")

        if dish.stock is False:
            parts.append("Нет в наличии")

        if dish.cpfc:
            cpfc = dish.cpfc
            parts.append(
                f"Пищевая ценность (на 100г): {cpfc.calories} ккал, Б: {cpfc.proteins}г, Ж: {cpfc.fats}г, У: {cpfc.carbs}г"
            )

        if dish.notes:
            parts.append(f"Примечание: {dish.notes}")

        return "\n".join(parts)

    @classmethod
    async def get(cls) -> dict:
        dishes: list[MenuDish] = await MenuStore.list()
        if not dishes:
            return {"menu": "_Сейчас меню недоступно._"}

        formatted_items = [cls._format_dish(dish) for dish in dishes]
        menu_text = "\n\n".join(formatted_items)
        return {"menu": menu_text}
