from fastapi import APIRouter

router = APIRouter(prefix="/tank", tags=["tank"])


@router.get("")
def get_tank() -> dict[str, str]:
    return {"message": "Tank endpoint"}
