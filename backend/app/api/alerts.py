from fastapi import APIRouter

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
def get_alerts() -> dict[str, str]:
    return {"message": "Alerts endpoint"}
