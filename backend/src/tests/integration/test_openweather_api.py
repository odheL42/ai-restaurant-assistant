import pytest

from src.connectors.openweather import get_weather
from src.models.weather import WeatherResponse


@pytest.mark.integration
def test_get_weather_real_api() -> None:
    """Test actual OpenWeather API call for current weather in Novosibirsk."""
    result = get_weather()

    assert isinstance(result, WeatherResponse)
    assert isinstance(result.main.temp, float)
    assert isinstance(result.weather[0].description, str)
    assert len(result.weather[0].description) > 0
