import re

from pydantic import BaseModel, field_validator


class Cart(BaseModel):
    items: dict[str, int]  # dish_id -> amount

    
