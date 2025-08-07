import httpx

from src.config import secrets
from src.models.weather import WeatherResponse


async def get_weather() -> WeatherResponse:
    novosibirsk_coord = {"lat": 55.0415, "lon": 82.9346}
    params = {
        "appid": secrets.openweather_key.get_secret_value(),
        "units": "metric",
        "lang": "ru",
    }
    params.update(novosibirsk_coord)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.openweathermap.org/data/2.5/weather", params=params
        )
        response.raise_for_status()
    return WeatherResponse(**response.json())
