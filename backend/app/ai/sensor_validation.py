def validate_sensor_reading(data: dict[str, object]) -> dict[str, object]:
    return {"status": "ok", "valid": True, "input": data}
