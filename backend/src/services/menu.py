import base64
import json
import re

from loguru import logger
from pydantic import Base64Str, ValidationError

from src.chat.prompts.templates.render import render_prompt
from src.connectors.openai import OpenAIVisual
from src.models.completions import ChatMessage
from src.models.menu import MenuDish


class MenuRecognitionService:
    def __init__(self) -> None:
        self.completions = OpenAIVisual()

    def build_system_prompt(self) -> ChatMessage:
        content = render_prompt("menu_recognition_system.j2", context={})

        return ChatMessage(role="system", content=content)

    def _to_base64(self, file: bytes) -> Base64Str:
        encoded = base64.b64encode(file).decode("utf-8")

        return encoded

    def parse_from_response(self, txt: str) -> list[dict]:
        cleaned = txt.strip("` \n")
        try:
            if cleaned.startswith("["):
                return json.loads(cleaned)
            match = re.search(r"\[\s*{.*?}\s*]", cleaned, re.S)

            if not match:
                raise ValueError
            return json.loads(match.group(0))
        except Exception as err:
            logger.error(err)

    async def recognize(self, file: bytes) -> list[MenuDish]:
        system_prompt = self.build_system_prompt()
        image = self._to_base64(file)
        response = await self.completions.create_from_image(
            image=image, system_prompt=system_prompt
        )
        parsed = self.parse_from_response(response)
        try:
            return [MenuDish.model_validate(_raw) for _raw in parsed]
        except ValidationError as err:
            logger.error(err)
