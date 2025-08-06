from contextvars import ContextVar


class MenuContext:
    _is_catering: ContextVar[bool] = ContextVar("is_catering", default=False)

    @classmethod
    def set_catering(cls, value: bool) -> None:
        cls._is_catering.set(value)

    @classmethod
    def is_catering(cls) -> bool:
        return cls._is_catering.get()
