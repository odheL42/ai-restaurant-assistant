from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health", tags=["Health"])
async def healthcheck() -> None:
    return JSONResponse(content={"status": "ok"})
