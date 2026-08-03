from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Defect(BaseModel):
    type: str
    confidence: float
    bbox: list[int]  # [x1, y1, x2, y2]


class DetectionResponse(BaseModel):
    result: str  # "OK" | "NG"
    confidence: float | None  # 검출된 불량 중 최고 confidence (없으면 null)
    detected_image_url: str
    defects: list[Defect]


class DefectItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    defect_type: str
    confidence: float
    bbox: list[int]


class InspectionItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_path: str
    detected_image_path: str
    inspection_result: str
    inspection_time: datetime
    defects: list[DefectItem]
