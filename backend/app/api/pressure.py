from fastapi import APIRouter

router = APIRouter(prefix="/pressure", tags=["pressure"])


@router.get("")
def get_pressure() -> dict[str, str]:
    return {"message": "Pressure endpoint"}
