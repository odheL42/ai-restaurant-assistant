from pydantic import BaseModel


class WeatherMain(BaseModel):
    temp: float  # Temperature in Kelvin by default


class WeatherDescription(BaseModel):
    main: str
    description: str


class WeatherResponse(BaseModel):
    weather: list[WeatherDescription]
    main: WeatherMain
    name: str  # City name
