from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("")
def get_analytics() -> dict[str, str]:
    return {"message": "Analytics endpoint"}
