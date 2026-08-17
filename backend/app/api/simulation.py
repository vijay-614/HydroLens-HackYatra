from fastapi import APIRouter

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.get("")
def get_simulation() -> dict[str, str]:
    return {"message": "Simulation endpoint"}
