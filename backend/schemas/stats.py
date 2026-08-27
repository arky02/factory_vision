from pydantic import BaseModel


class TopDefect(BaseModel):
    type: str
    count: int


class StatsSummary(BaseModel):
    window_hours: int | None  # None이면 전체 기간
    total: int
    ok: int
    ng: int
    defect_rate: float  # 0.0 ~ 1.0
    top_defect: TopDefect | None


class HourlyPoint(BaseModel):
    hour: str  # ISO (UTC) — 해당 시각 정각 버킷
    total: int
    ng: int


class DefectShare(BaseModel):
    type: str
    count: int
