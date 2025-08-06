from .completions import router as completions_router
from .health import router as health_router
from .history import router as history_router
from .menu import router as menu_router
from .notes import router as notes_router

__all__ = [
    "completions_router",
    "health_router",
    "history_router",
    "menu_router",
    "notes_router",
]
