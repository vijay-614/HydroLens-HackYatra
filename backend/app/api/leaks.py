from fastapi import APIRouter

router = APIRouter(prefix="/leaks", tags=["leaks"])


@router.get("")
def get_leaks() -> dict[str, str]:
    return {"message": "Leaks endpoint"}
