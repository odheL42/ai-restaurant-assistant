from loguru import logger

from src.context.completions import CompletionsContext
from src.models.preferences import Preferences


class PreferencesPrompt:
    _preferences_prompt = """
---

📖 **Предпочтения и ограничения пользователя**:

"""

    _preference_to_string = {
        "gluten_free": "Без глютена",
        "lactose_free": "Без лактозы",
        "vegan": "Веган",
        "vegetarian": "Вегетарианец",
        "spicy": "Не острое",
        "nuts_free": "Без орехов",
        "sugar_free": "Без сахара",
        "halal": "Халяль",
        "kosher": "Кошерное",
        "soy_free": "Без сои",
    }

    @classmethod
    def _parse_preferences(cls, preferences: Preferences) -> list[str]:
        return [
            cls._preference_to_string[key]
            for key, value in preferences.model_dump().items()
            if value
        ]

    @classmethod
    def _format_preferences(cls, preferences: list[str]) -> str:
        if not preferences:
            return ""
        lines = ",\n".join(preferences)
        return cls._preferences_prompt + lines

    @classmethod
    def get(cls) -> dict:
        preferences = CompletionsContext.get_user_preferences()
        if not preferences:
            return {"preferences": ""}

        active_preferences = cls._parse_preferences(preferences)
        prompt = cls._format_preferences(active_preferences)
        logger.debug(f"PreferencesPrompt:\n{prompt}")
        return {"preferences": prompt}
