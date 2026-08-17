from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter(prefix="/pipelines", tags=["pipelines"])

@router.get("")
def get_pipelines():
    """Return pipeline data.
    The mock JSON file is located at `frontend/public/mock-data/pipelines.json`.
    If the file is missing, an empty list is returned.
    """
    project_root = Path(__file__).resolve().parents[4]
    mock_path = project_root / "frontend" / "public" / "mock-data" / "pipelines.json"
    if mock_path.is_file():
        return json.loads(mock_path.read_text())
    return []
