from loguru import logger

from src.context.completions import CompletionsContext
from src.models.cart import Cart
from src.storage.menu import MenuStore


class CartPrompt:
    _cart_prompt = """
---

**Пользователь уже положил в корзину (количество, название)**:

"""

    @classmethod
    async def _format_cart(cls, cart: Cart) -> str:
        lines = ""
        for dish_id, amount in cart.items.items():
            dish_map = await MenuStore.load()
            dish = dish_map.get(dish_id)
            # [dish_id]
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
