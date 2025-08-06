from enum import Enum

from pydantic import BaseModel


class CurrentMenuCategory(str, Enum):
    COMPLEX = "complex"
    BASE = "base"


class CPFCModel(BaseModel):  # per 100g
    calories: float
    proteins: float
    fats: float
    carbs: float


class CurrentMenuDish(BaseModel):
    index: str
    title: str  # (аналогично текущей реализации меню)
    category: CurrentMenuCategory
    subcategory: str
    quantity: str  # (выход, гр)
    price: int
    stock: bool | None = None
    notes: str | None = None  # уточнения
    cpfc: CPFCModel | None = None
