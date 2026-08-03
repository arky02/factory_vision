from pydantic import BaseModel


class Defect(BaseModel):
    type: str
    confidence: float
    bbox: list[int]  # [x1, y1, x2, y2]


class DetectionResponse(BaseModel):
    result: str  # "OK" | "NG"
    confidence: float | None  # 검출된 불량 중 최고 confidence (없으면 null)
    detected_image_url: str
    defects: list[Defect]
