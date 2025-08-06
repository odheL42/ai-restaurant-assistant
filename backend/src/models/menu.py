from nanoid import generate
from pydantic import BaseModel, Field, RootModel

alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"


def generate_dish_id(length: int = 4) -> str:
    return f"dish_{generate(alphabet, size=length)}"


class CPFCModel(BaseModel):  # per 100g
    calories: int
    proteins: int
    fats: int
    carbs: int


class MenuDish(BaseModel):
    index: str = Field(default_factory=generate_dish_id)
    title: str
    price: int
    category: str | None
    quantity: str | None  # (выход, гр)
    stock: bool | None = None
    notes: str | None = None  # уточнения
    cpfc: CPFCModel | None = None


class MenuDishCreate(BaseModel):
    title: str
    price: int
    category: str | None
    quantity: str | None  # (выход, гр)
    stock: bool | None = None
    notes: str | None = None  # уточнения
    cpfc: CPFCModel | None = None


class MenuMap(RootModel[dict[str, MenuDish]]):
    """Модель-обёртка над словарём {index: dish}"""

    def to_list(self) -> list[MenuDish]:
        return list(self.root.values())

    def to_dict(self) -> dict[str, MenuDish]:
        return self.root

    @classmethod
    def from_list(cls, dishes: list[MenuDish]) -> "MenuMap":
        return cls({dish.index: dish for dish in dishes})

    def get(self, index: str) -> MenuDish | None:
        return self.root.get(index)

    def remove(self, index: str) -> None:
        self.root.pop(index, None)

    def add_or_replace(self, dish: MenuDish) -> None:
        self.root[dish.index] = dish
