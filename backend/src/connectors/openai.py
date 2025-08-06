from collections.abc import AsyncGenerator

from openai import AsyncOpenAI
from pydantic import Base64Str

from src.config import config, secrets
from src.models.completions import ChatMessage


class OpenAICompletionsGenerator:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=secrets.openai_key.get_secret_value(),
            base_url=config.openai_base_url,
        )

    async def __call__(
        self, query: ChatMessage, history: list[ChatMessage], system_prompt: ChatMessage
    ) -> AsyncGenerator[str, None]:
        generator = await self.client.chat.completions.create(
            model=config.openai_model,
            messages=[system_prompt] + history + [query],
            stream=True,
            temperature=config.openai_temperature,
            max_tokens=config.openai_max_tokens,
        )

        async for chunk in generator:
            yield chunk.choices[0].delta.content


class OpenAIValidator:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=secrets.openai_validator_key.get_secret_value(),
            base_url=config.openai_validator_base_url,
        )

    async def create(
        self, query: ChatMessage, history: list[ChatMessage], system_prompt: ChatMessage
    ) -> str:
        response = await self.client.chat.completions.create(
            model=config.openai_validator_model,
            messages=[system_prompt] + history + [query],
            stream=False,
            temperature=config.openai_validator_temperature,
            max_tokens=config.openai_validator_max_tokens,
        )

        return response.choices[0].message.content


class OpenAISummary:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=secrets.openai_summary_key.get_secret_value(),
            base_url=config.openai_summary_base_url,
        )

    async def create(
        self, system_prompt: ChatMessage, history: list[ChatMessage]
    ) -> str:
        response = await self.client.chat.completions.create(
            model=config.openai_summary_model,
            messages=[system_prompt] + history,
            stream=False,
            temperature=config.openai_summary_temperature,
            max_tokens=config.openai_summary_max_tokens,
        )

        return response.choices[0].message.content


class OpenAIVisual:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=secrets.openai_visual_key.get_secret_value(),
            base_url=config.openai_visual_base_url,
        )

    async def create_from_image(
        self,
        image: Base64Str,
        system_prompt: ChatMessage,
    ) -> str:
        messages = [
            system_prompt,
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image}",
                            "detail": "high",
                        },
                    },
                ],
            },
        ]

        response = await self.client.chat.completions.create(
            model=config.openai_visual_model,
            messages=messages,
            stream=False,
            temperature=config.openai_visual_temperature,
            max_tokens=config.openai_visual_max_tokens,
        )

        return response.choices[0].message.content
