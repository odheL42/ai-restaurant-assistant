from pydantic import BaseModel


class DBCafeInfo(BaseModel):
    cafe_info: str = ""

class RequestSetCafeInfo(BaseModel):
    cafe_info: str