from sqlalchemy import Column, Integer, String

from app.database.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    sensor_type = Column(String, nullable=False)
    value = Column(String, nullable=False)
