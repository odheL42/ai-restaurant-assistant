import locale
from datetime import datetime

from src.config import timezone


def get_time_context() -> dict:
    # Set locale to Russian for correct day and month names
    try:
        locale.setlocale(locale.LC_TIME, "ru_RU.UTF-8")
    except locale.Error:
        # fallback for Windows or systems without ru_RU.UTF-8
        locale.setlocale(locale.LC_TIME, "Russian_Russia.1251")

    now = datetime.now(timezone)

    day_part = ""
    hour = now.hour
    if 5 <= hour < 12:
        day_part = "утро"
    elif 12 <= hour < 18:
        day_part = "день"
    elif 18 <= hour < 23:
        day_part = "вечер"
    else:
        day_part = "ночь"

    return {
        "week_day": now.strftime("%A").lower(),  # день недели, строчными
        "day": now.day,
        "month": now.strftime("%B").lower(),  # месяц, строчными
        "year": now.year,
        "hours": f"{now.hour:02d}",
        "minutes": f"{now.minute:02d}",
        "day_part": day_part,
    }
