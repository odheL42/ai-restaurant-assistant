from pydantic import BaseModel


def format_pydantic_model_json(model: BaseModel) -> str:
    lines = [f"{k}={v}" for k, v in model.model_dump().items() if v]
    return "{\n" + "\n".join(lines) + "\n}"
