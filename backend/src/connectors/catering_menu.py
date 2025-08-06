import re
from enum import Enum
from typing import TypeVar

import aiofiles  # type: ignore
from bs4 import BeautifulSoup, Tag

from src.models.catering_menu import Dish, DishCategory, DishContext

E = TypeVar("E", bound=Enum)


def parse_enum(value: str, enum_cls: type[E]) -> E:
    normalized = normalize(value)
    for member in enum_cls:
        if member.value == normalized:
            return member
    raise ValueError(f"{value!r} is not a valid {enum_cls.__name__}")


async def get_html_from_file(file_path: str) -> str:
    async with aiofiles.open(file_path, encoding="utf-8") as f:
        html = await f.read()

    return html


def normalize(raw: str | None) -> str | None:
    if raw:
        return " ".join(raw.strip("— \n\t").lower().split())
    return None


def split_description(description: str) -> tuple[str | None, str | None]:
    quantity_re = re.compile(
        r"\b\d+(?:\/\d+)?(?:[–/-]\d+)?\s*(?:шт/уп|гр|г|мл|шт|уп|л)\b", re.IGNORECASE
    )

    # Ищем все количественные выражения
    quantities = quantity_re.findall(description)

    # Удаляем все такие выражения из описания
    composition = quantity_re.sub("", description).strip(" .,") if description else None

    quantity = ", ".join(quantities) if quantities else None

    return normalize(quantity), normalize(composition)


def parse_card(card: Tag) -> dict:
    title_tag = card.find("div", class_="t1025__title")
    title = title_tag.get_text(strip=True) if title_tag else ""
    title = normalize(title)

    descr_tag = card.find("div", class_="t1025__descr")
    description = descr_tag.get_text(strip=True) if descr_tag else ""

    quantity, composition = split_description(description)

    price_tag = card.find_next("div", class_="t1025__price-value")
    price = price_tag.get_text(strip=True) if price_tag else ""

    return {
        "title": title,
        "composition": composition,
        "quantity": quantity,
        "price": price,
    }


class IDGenerator:
    counter: int = 0

    @classmethod
    def get_next_index(cls) -> str:
        result = f"dish_{str(cls.counter)}"
        cls.counter += 1
        return result

    @classmethod
    def flush(cls) -> None:
        cls.counter = 0


_cached_menu: list[Dish] | None = None


async def get_menu() -> list[Dish]:
    IDGenerator.flush()

    global _cached_menu
    if _cached_menu is not None:
        return _cached_menu
    html = await get_html_from_file("./src/connectors/teplitsamenu.ru.html")

    soup = BeautifulSoup(markup=html, features="html.parser")

    dish = {"context": None, "category": None, "title": None}

    result = []
    for tag in soup.find_all(True):
        tag_classes = tag.get("class", [])

        if "t030__title" in tag_classes:
            context = tag.get_text(strip=True)
            if "ДОСТАВКА" in context:
                break
            dish["context"] = parse_enum(context, DishContext)
        elif "t030__descr" in tag_classes:
            category = tag.get_text(strip=True)
            dish["category"] = parse_enum(category, DishCategory)
        elif "t1025__item" in tag_classes:
            card = parse_card(tag)
            dish.update(card)
            dish["index"] = IDGenerator.get_next_index()  # type: ignore  # index is str, expected by downstream
            result.append(Dish(**dish))

    return result


async def get_dish_by_id(index: str) -> Dish | None:
    menu = await get_menu()

    for dish in menu:
        if dish.index == index:
            return dish
    return None
