from app.database.database import Base, engine
from app.database.models import SensorReading


def seed_data() -> None:
    Base.metadata.create_all(bind=engine)
    print("Database initialized")
