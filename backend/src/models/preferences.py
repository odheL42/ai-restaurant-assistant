from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class Preferences(BaseModel):
    gluten_free: bool
    lactose_free: bool
    vegan: bool
    vegetarian: bool
    spicy: bool
    nuts_free: bool
    sugar_free: bool
    halal: bool
    kosher: bool
    soy_free: bool

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
