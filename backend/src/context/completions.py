from contextvars import ContextVar

from src.models.cart import Cart
from src.models.preferences import Preferences


class CompletionsContext:
    _user_preferences: ContextVar[Preferences] = ContextVar(
        "user_preferences", default=None
    )
    _user_cart: ContextVar[Cart] = ContextVar("user_cart", default=None)
    _is_catering: ContextVar[bool] = ContextVar("is_catering", default=False)

    @classmethod
    def set_user_preferences(cls, prefs: Preferences) -> None:
        cls._user_preferences.set(prefs)

    @classmethod
    def get_user_preferences(cls) -> Preferences | None:
        return cls._user_preferences.get()

    @classmethod
    def set_user_cart(cls, cart: Cart) -> None:
        cls._user_cart.set(cart)

    @classmethod
    def get_user_cart(cls) -> Cart | None:
        return cls._user_cart.get()
