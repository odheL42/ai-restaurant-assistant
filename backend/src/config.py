from pathlib import Path
from typing import Literal
from zoneinfo import ZoneInfo

import yaml  # type: ignore
from loguru import logger
from pydantic import BaseModel, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Secrets(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_env: Literal["prod", "dev"]

    openweather_key: SecretStr
    openai_key: SecretStr
    openai_validator_key: SecretStr
    openai_summary_key: SecretStr
    openai_visual_key: SecretStr

    def is_dev(self) -> bool:
        return self.app_env == "dev"


class Config(BaseModel):
    history_dir: Path
    summary_dir: Path
    menu_dir: Path
    notes_dir: Path

    notes_max_char: int

    uvicorn_host: str
    uvicorn_port: int
    uvicorn_workers: int
    uvicorn_reload: bool

    cors_allow_origins: list[str]

    openai_model: str
    openai_base_url: str
    openai_temperature: float
    openai_max_tokens: int

    openai_validator_model: str
    openai_validator_base_url: str
    openai_validator_temperature: float
    openai_validator_max_tokens: int

    openai_summary_model: str
    openai_summary_base_url: str
    openai_summary_temperature: float
    openai_summary_max_tokens: int

    openai_visual_model: str
    openai_visual_base_url: str
    openai_visual_temperature: float
    openai_visual_max_tokens: int

    # Cookie
    cookie_name: str
    cookie_max_age: int


def load_config(env: str) -> Config:
    with open(f"./config.{env}.yaml") as f:
        raw = yaml.safe_load(f)

    return Config(**raw)


timezone = ZoneInfo("Asia/Novosibirsk")

secrets = Secrets()
config = load_config(secrets.app_env)

logger.info(f"Application environment: {secrets.app_env}")
