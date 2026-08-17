from fastapi import APIRouter

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("")
def get_maintenance() -> dict[str, str]:
    return {"message": "Maintenance endpoint"}
