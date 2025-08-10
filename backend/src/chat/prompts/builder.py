from loguru import logger

from src.connectors.openweather import get_weather
from src.models.validator import ValidatorResponse
from src.storage.cafe_info import CafeInfoStore
from src.storage.notes import NotesStore
from src.storage.summary import HistorySummaryStore

from .components.cart import CartPrompt
from .components.current_menu import CurrentMenuPrompt
from .components.preferences import PreferencesPrompt
from .components.time_context import get_time_context
from .templates.summary import system_summary_prompt
from .templates.system_main_menu import system_main_menu_template
from .templates.validator import (
    system_validator_prompt,
    user_query_wrapper,
    validator_prompt,
)


def build_validator_prompt(query: str) -> str:
    return validator_prompt.format(query=query)


def build_system_validator_prompt() -> str:
    return system_validator_prompt


def wrap_user_prompt(query: str, response: ValidatorResponse) -> str:
    return user_query_wrapper.format(query=query, reason=response.reason)


class GeneratorPromptBuilder:
    @classmethod
    async def _build_main_menu_system_prompt(cls) -> str:
        fields = dict()

        weather = await get_weather()
        fields["weather_temperature"] = weather.main.temp
        fields["weather_description"] = weather.weather[0].description

        fields.update(await CurrentMenuPrompt.get())
        fields.update(get_time_context())
        fields.update(PreferencesPrompt.get())
        fields.update(await CartPrompt.get())

        db_notes = await NotesStore.get()
        fields["notes"] = db_notes.notes

        db_cafe_info = await CafeInfoStore.get()
        fields["cafe_info"] = db_cafe_info.cafe_info

        return system_main_menu_template.substitute(**fields)

    @classmethod
    async def build(cls) -> str:
        prompt = await cls._build_main_menu_system_prompt()

        logger.debug(f"[PROMPT TO MODEL]\n{prompt}")
        return prompt


async def build_summary_system_prompt() -> str:
    old_summary = await HistorySummaryStore.get()
    notes = await NotesStore.get()
    cafe_info = await CafeInfoStore.get()
    return system_summary_prompt.substitute(
        old_summary=old_summary.summary, notes=notes.notes, cafe_info=cafe_info.cafe_info
    )
