from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from src.models.cart import Cart
from src.models.preferences import Preferences


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "function"]
    content: str
    name: str | None = None


class APICompletionsRequest(BaseModel):
    is_catering: bool
    query: str
    cart: Cart
    preferences: Preferences

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Choice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str | None


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class ChunkResponse(BaseModel):
    type: Literal["error", "default"] = "default"
    text: str
