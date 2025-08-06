from collections.abc import AsyncGenerator
from contextlib import aclosing

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from loguru import logger

from src.chat.service import ChatService
from src.context.completions import CompletionsContext
from src.context.menu import MenuContext
from src.models.completions import APICompletionsRequest, ChunkResponse

router = APIRouter()
chat = ChatService()


@router.post("/completions", tags=["Completions"])
async def create_completions(request: APICompletionsRequest) -> StreamingResponse:
    logger.debug(f"Request: {request}")
    CompletionsContext.set_user_cart(request.cart)
    CompletionsContext.set_user_preferences(request.preferences)
    MenuContext.set_catering(request.is_catering)

    async def streaming_wrapper() -> AsyncGenerator[ChunkResponse, None]:
        try:
            generator = chat.stream(request.query)
            async with aclosing(generator) as _generator:
                async for chunk in _generator:
                    yield ChunkResponse(text=chunk).model_dump_json() + "\n\n"
        except Exception as err:
            logger.exception(err)
            yield (
                ChunkResponse(
                    type="error", text="Internal server error"
                ).model_dump_json()
                + "\n\n"
            )

    return StreamingResponse(
        content=streaming_wrapper(),
        media_type="application/json",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
