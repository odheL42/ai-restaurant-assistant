from collections.abc import AsyncGenerator

from loguru import logger
from pydantic import ValidationError

from src.chat.prompts.builder import (
    GeneratorPromptBuilder,
    build_summary_system_prompt,
    wrap_user_prompt,
)
from src.chat.validator import ValidatorService
from src.connectors.openai import OpenAICompletionsGenerator, OpenAISummary
from src.models.completions import ChatMessage
from src.models.summary import DBHistorySummary, SummaryResponse
from src.models.validator import ValidatorResponse
from src.storage.history import HistoryStore
from src.storage.notes import NotesStore
from src.storage.summary import HistorySummaryStore


class PromptBuilder:
    def __init__(self) -> None:
        self.validator = ValidatorService()

    async def system(self) -> ChatMessage:
        prompt = await GeneratorPromptBuilder.build()
        # logger.debug(f"Меню успешно вставлено в prompt: {prompt}")
        return ChatMessage(role="system", content=prompt)

    async def user(self, query: str) -> ChatMessage:
        response: ValidatorResponse | None = await self.validator.validate(query)

        if not response or response.verdict:
            content = query
        else:
            content = wrap_user_prompt(query, response=response)

        logger.debug(
            {
                "verdict": response,
                "query": query,
                "rewritten": content if content != query else "unchanged",
            },
        )
        return ChatMessage(role="user", content=content)


class SummaryService:
    def __init__(self) -> None:
        self.summarizer = OpenAISummary()
        self.index = 0

    async def _make_summary(self, history: list[ChatMessage]) -> str:
        system_prompt = await build_summary_system_prompt()
        summarizer_params = {
            "system_prompt": ChatMessage(role="system", content=system_prompt),
            "history": history,
        }

        return await self.summarizer.create(**summarizer_params)

    async def _save_summary(self, db_summary: DBHistorySummary) -> None:
        await HistorySummaryStore.save(db_summary)

    async def maybe_summarize(self, history: list[ChatMessage]) -> list[ChatMessage]:
        if (len(history) - self.index) < 4:
            return history

        raw: str = await self._make_summary(history[self.index :])
        try:
            response = SummaryResponse.model_validate_json(raw)
        except ValidationError:
            logger.error(f"Response validation error: {raw}")
            return history

        # Saving history summary
        db_summary = DBHistorySummary(summary=response.summary)
        await self._save_summary(db_summary)

        # Updating user notes
        await NotesStore.add(response.new_notes)

        # Update index
        self.index = len(history)

        return [ChatMessage(role="assistant", content=db_summary.summary)]


class HistoryService:
    def __init__(self) -> None:
        self.buffer = ""

    async def update(self, chunk: str) -> None:
        if not self.buffer:
            await HistoryStore.add(ChatMessage(role="assistant", content=""))
        self.buffer += chunk
        msg = ChatMessage(role="assistant", content=self.buffer)
        await HistoryStore.update(msg)

    async def save_request(self, query: str) -> ChatMessage:
        chat_message = ChatMessage(role="user", content=query)
        await HistoryStore.add(chat_message)
        return chat_message

    async def list(self) -> list[ChatMessage]:
        return [c.message for c in await HistoryStore.list()]

    def flush(self) -> None:
        self.buffer = ""


class ChatService:
    def __init__(self) -> None:
        self.completions = OpenAICompletionsGenerator()
        self.prompt_builder = PromptBuilder()
        self.history = HistoryService()
        self.summary_service = SummaryService()

    async def stream(self, query: str) -> AsyncGenerator[str, None]:
        summarized_history = await self.summary_service.maybe_summarize(
            await self.history.list()
        )
        chat_message = await self.history.save_request(query)

        try:
            await self.prompt_builder.system()
        except Exception as e:
            logger.exception(e)

        params: dict[str, ChatMessage | list[ChatMessage]] = {
            "query": await self.prompt_builder.user(query),
            "history": summarized_history + [chat_message],
            "system_prompt": await self.prompt_builder.system(),
        }

        async for chunk in self.completions(**params):
            if chunk:
                await self.history.update(chunk)
                yield chunk

        self.history.flush()
