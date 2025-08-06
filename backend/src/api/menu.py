from fastapi import APIRouter, Body, HTTPException, Query

from src.connectors.catering_menu import get_dish_by_id as get_catering_dish_by_id
from src.connectors.catering_menu import get_menu as get_catering_menu
from src.connectors.current_menu import get_current_menu, get_dish_by_id
from src.models.catering_menu import Dish
from src.models.current_menu import CurrentMenuDish
from src.storage.menu import MenuStore

router = APIRouter()


@router.get("/menu/byid", tags=["Menu"])
async def get_dish(index: str, is_catering: bool) -> CurrentMenuDish | Dish:
    if is_catering:
        dish = await get_catering_dish_by_id(index)
    else:
        dish = await get_dish_by_id(index)
    if dish is None:
        raise HTTPException(status_code=404, detail=f"Dish with id '{index}' not found")
    return dish


@router.get("/menu", tags=["Menu"])
async def get_full_menu(is_catering: bool) -> list[CurrentMenuDish | Dish]:
    if is_catering:
        return await get_catering_menu()
    else:
        return await get_current_menu()


@router.post("/menu", tags=["Menu"])
async def add_dish(dish: CurrentMenuDish):
    await MenuStore.add(dish)
    return {"status": "ok"}


@router.put("/menu", tags=["Menu"])
async def update_dish(index: str = Query(...), dish: CurrentMenuDish = Body(...)):
    updated = await MenuStore.update(index, dish)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Dish with id '{index}' not found")
    return {"status": "updated"}


@router.delete("/menu", tags=["Menu"])
async def delete_dish(index: str):
    removed = await MenuStore.remove(index)
    if not removed:
        raise HTTPException(status_code=404, detail=f"Dish with id '{index}' not found")
    return {"status": "deleted"}
