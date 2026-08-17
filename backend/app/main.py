from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.alerts import router as alerts_router
from app.api.analytics import router as analytics_router
from app.api.dashboard import router as dashboard_router
from app.api.flow import router as flow_router
from app.api.leaks import router as leaks_router
from app.api.maintenance import router as maintenance_router
from app.api.pressure import router as pressure_router
from app.api.simulation import router as simulation_router
from app.api.tank import router as tank_router
from app.api.pipelines import router as pipelines_router

app = FastAPI(title="HydroLens AI", version="0.1.0")
# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router, prefix="/api")
app.include_router(pressure_router, prefix="/api")
app.include_router(flow_router, prefix="/api")
app.include_router(tank_router, prefix="/api")
app.include_router(leaks_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(maintenance_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(simulation_router, prefix="/api")


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "HydroLens AI backend is running"}
