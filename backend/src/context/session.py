from contextvars import ContextVar

from src.models.session import UserContext


class SessionContext:
    _user_context: ContextVar[UserContext] = ContextVar("user_context", default=None)

    @classmethod
    def set_user_context(cls, context: UserContext) -> None:
        cls._user_context.set(context)

    @classmethod
    def get_user_context(cls) -> UserContext | None:
        return cls._user_context.get()
