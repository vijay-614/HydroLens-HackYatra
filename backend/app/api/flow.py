from fastapi import APIRouter

router = APIRouter(prefix="/flow", tags=["flow"])


@router.get("")
def get_flow() -> dict[str, str]:
    return {"message": "Flow endpoint"}
