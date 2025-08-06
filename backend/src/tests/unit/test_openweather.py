import httpx
import pytest
import respx

from src.connectors.openweather import get_weather
from src.models.weather import WeatherResponse


@respx.mock
@pytest.mark.unit
def test_get_weather_success() -> None:
    city = "Новосибирск"
    mocked_response = {
        "weather": [{"main": "ok", "description": "ясно"}],
        "main": {"temp": 20.5},
        "name": city,
    }

    route = respx.get("https://api.openweathermap.org/data/2.5/weather").mock(
        return_value=httpx.Response(200, json=mocked_response)
    )

    result = get_weather()

    assert route.called
    assert isinstance(result, WeatherResponse)
    assert result.name == city
    assert result.main.temp == 20.5
    assert result.weather[0].description == "ясно"


@respx.mock
@pytest.mark.unit
def test_get_weather_http_error() -> None:
    respx.get("https://api.openweathermap.org/data/2.5/weather").mock(
        return_value=httpx.Response(401, json={"message": "Invalid API key"})
    )

    with pytest.raises(httpx.HTTPStatusError):
        get_weather()
