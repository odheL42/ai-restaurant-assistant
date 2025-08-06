from fastapi import APIRouter, Body, File, HTTPException, UploadFile
from loguru import logger

from src.models.menu import MenuDish, MenuDishCreate, MenuMap
from src.services.menu import MenuRecognitionService
from src.storage.menu import MenuStore

router = APIRouter()
recognition_service = MenuRecognitionService()


@router.get("/menu", tags=["Menu"])
async def get_full_menu() -> list[MenuDish]:
    menu = await MenuStore.list()

    return menu


@router.post("/menu", tags=["Menu"])
async def add_dish(dish: MenuDishCreate) -> str:
    dish = MenuDish(**dish.model_dump())
    await MenuStore.add(dish)
    return dish.index


@router.put("/menu", tags=["Menu"])
async def update_dish(dish: MenuDish = Body(...)):
    updated = await MenuStore.update(dish.index, dish)
    if not updated:
        raise HTTPException(
            status_code=404, detail=f"Dish with id '{dish.index}' not found"
        )
    return {"status": "updated"}


@router.delete("/menu", tags=["Menu"])
async def delete_dish(index: str):
    removed = await MenuStore.remove(index)
    if not removed:
        raise HTTPException(status_code=404, detail=f"Dish with id '{index}' not found")
    return {"status": "deleted"}


@router.post("/ocr", tags=["Menu"])
async def recognize_dishes(file: UploadFile = File(...)) -> list[MenuDish]:
    contents = await file.read()
    dishes = await recognition_service.recognize(contents)

    return dishes


@router.put("/menu/all", tags=["Menu"])
async def update_full_menu(dishes: list[MenuDish]):
    logger.debug(dishes)
    if not isinstance(dishes, list) or not all(isinstance(d, MenuDish) for d in dishes):
        raise HTTPException(status_code=400, detail="Invalid menu format")

    dishes_map = MenuMap.from_list(dishes)
    await MenuStore.save(dishes_map)
    return {"status": "ok", "count": len(dishes)}
