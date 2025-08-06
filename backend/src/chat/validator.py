from loguru import logger
from pydantic import ValidationError

from src.chat.prompts.builder import (
    build_system_validator_prompt,
    build_validator_prompt,
)
from src.connectors.openai import OpenAIValidator
from src.models.completions import ChatMessage
from src.models.validator import ValidatorResponse


class ValidatorService:
    def __init__(self) -> None:
        self.completions = OpenAIValidator()

    def _parse_response(self, response: str) -> ValidatorResponse | None:
        try:
            return ValidatorResponse.model_validate_json(response)
        except ValidationError:
            logger.warning(f"Invalid validator response: {response}")
            return None

    async def validate(self, query: str) -> ValidatorResponse | None:
        user_prompt = ChatMessage(role="user", content=build_validator_prompt(query))
        system_prompt = ChatMessage(
            role="system", content=build_system_validator_prompt()
        )
        response = await self.completions.create(
            query=user_prompt,
            history=[],
            system_prompt=system_prompt,
        )
        return self._parse_response(response)
