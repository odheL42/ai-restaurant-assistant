from loguru import logger

from src.connectors.current_menu import get_dish_by_id
from src.context.completions import CompletionsContext
from src.models.cart import Cart


class CartPrompt:
    _cart_prompt = """
---

**Пользователь уже положил в корзину (количество, название)**:

"""

    @classmethod
    async def _format_cart(cls, cart: Cart) -> str:
        lines = ""
        for dish_id, amount in cart.items.items():
            dish = await get_dish_by_id(dish_id)
            lines += f"{amount} {dish.title}\n"

        return cls._cart_prompt + lines

    @classmethod
    async def get(cls) -> dict:
        cart = CompletionsContext.get_user_cart()
        if not cart:
            return {"cart": ""}

        prompt = await cls._format_cart(cart)
        logger.debug(f"CartPrompt:\n{prompt}")
        return {"cart": prompt}
