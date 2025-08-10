from fastapi import APIRouter

from src.models.cafe_info import DBCafeInfo, RequestSetCafeInfo
from src.storage.cafe_info import CafeInfoStore

router = APIRouter()


#здесь методы save и update?

@router.post("/save_cafe_info", tags=["CafeInfo"])
async def save_cafe_info(cafe_info: RequestSetCafeInfo) -> None:
    await CafeInfoStore.save(DBCafeInfo(cafe_info=cafe_info.cafe_info))


@router.get("/get_cafe_info", tags=["CafeInfo"])
async def get_cafe_info() -> str:
    db_cafe_info = await CafeInfoStore.get()
    return db_cafe_info.cafe_info
