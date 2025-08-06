from enum import Enum

from pydantic import BaseModel


class DishContext(str, Enum):
    CATERING = "кейтеринг"
    BANQUET = "банкет"
    SEMI_FINISHED = "полуфабрикаты"


class DishCategory(str, Enum):
    # Кейтеринг
    SANDWICH = "бутерброды"
    CUTE_PANCAKES = "блинчики"
    COOL_SANDWICH = "сэндвичи"
    BAKERY = "выпечка"
    CANAPES = "канапе"
    TARTALETS = "тарталетки"
    DRINKS = "напитки"
    DESSERTS = "десерты"
    # Банкетное меню
    SALADS = "салаты"
    ASSORTED = "ассорти"
    MAIN_COURSES = "основные блюда"
    ADDITIONAL = "дополнительно"
    # Полуфабрикаты
    SYRNIKI = "сырники"
    MEAT_AND_FISH = "мясные и рыбные"
    VEGETABLE = "овощные"
    HAND_MOLDING = "ручная лепка"
    STRICT_PANCAKES = "блины"


class Dish(BaseModel):
    index: str
    title: str
    price: int
    context: DishContext
    category: DishCategory
    quantity: str | None
    composition: str | None
