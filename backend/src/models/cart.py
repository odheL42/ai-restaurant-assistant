import re

from pydantic import BaseModel, field_validator


class Cart(BaseModel):
    items: dict[str, int]  # dish_id -> amount

    @field_validator("items")
    @classmethod
    def validate_keys(cls, values: dict[str, int]) -> dict[str, int]:
        for key in values.keys():
            if not re.fullmatch(r"dish_\d+", key):
                raise ValueError(
                    f"Invalid dish ID: {key}. Expected format 'dish_<number>'"
                )
        return values
