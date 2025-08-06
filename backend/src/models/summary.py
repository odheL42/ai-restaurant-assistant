from pydantic import BaseModel


class DBHistorySummary(BaseModel):
    summary: str = ""


class DBNotes(BaseModel):
    notes: str = ""


class RequestSetNotes(BaseModel):
    notes: str


class SummaryResponse(BaseModel):
    """
    Используется для валидации ответа модели
    """

    summary: str
    new_notes: str  # Новые предпочтения пользователя, выявленные по истории сообшений и старому саммари
