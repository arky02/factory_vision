"""검사 통계 집계 API — 대시보드 차트가 사용한다."""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from models.inspection import Defect, Inspection
from schemas.stats import DefectShare, HourlyPoint, StatsSummary, TopDefect

router = APIRouter()

WindowHours = Query(default=24, ge=1, le=24 * 30)


def _since(hours: int) -> datetime:
    return datetime.utcnow() - timedelta(hours=hours)


@router.get("/stats/summary", response_model=StatsSummary)
def summary(hours: int = WindowHours, db: Session = Depends(get_db)):
    since = _since(hours)

    total = db.scalar(
        select(func.count(Inspection.id)).where(Inspection.inspection_time >= since)
    ) or 0
    ng = db.scalar(
        select(func.count(Inspection.id)).where(
            Inspection.inspection_time >= since,
            Inspection.inspection_result == "NG",
        )
    ) or 0

    top = db.execute(
        select(Defect.defect_type, func.count(Defect.id).label("cnt"))
        .join(Inspection, Defect.inspection_id == Inspection.id)
        .where(Inspection.inspection_time >= since)
        .group_by(Defect.defect_type)
        .order_by(func.count(Defect.id).desc())
        .limit(1)
    ).first()

    return StatsSummary(
        window_hours=hours,
        total=total,
        ok=total - ng,
        ng=ng,
        defect_rate=ng / total if total else 0.0,
        top_defect=TopDefect(type=top[0], count=top[1]) if top else None,
    )


@router.get("/stats/hourly", response_model=list[HourlyPoint])
def hourly(hours: int = WindowHours, db: Session = Depends(get_db)):
    """시간별 검사 건수·불량 건수. 검사가 없는 시간대도 0으로 채워 연속된 축을 만든다."""
    since = _since(hours)

    rows = db.execute(
        select(Inspection.inspection_time, Inspection.inspection_result).where(
            Inspection.inspection_time >= since
        )
    ).all()

    # SQLite/PostgreSQL 양쪽에서 동작하도록 시간 버킷팅은 Python에서 수행 (요청 규모가 작음)
    start = datetime.utcnow().replace(minute=0, second=0, microsecond=0) - timedelta(
        hours=hours - 1
    )
    buckets = {start + timedelta(hours=i): {"total": 0, "ng": 0} for i in range(hours)}

    for time, result in rows:
        bucket = time.replace(minute=0, second=0, microsecond=0)
        if bucket in buckets:
            buckets[bucket]["total"] += 1
            if result == "NG":
                buckets[bucket]["ng"] += 1

    return [
        HourlyPoint(hour=f"{hour.isoformat()}Z", total=c["total"], ng=c["ng"])
        for hour, c in sorted(buckets.items())
    ]


@router.get("/stats/defect-distribution", response_model=list[DefectShare])
def defect_distribution(hours: int = WindowHours, db: Session = Depends(get_db)):
    since = _since(hours)

    rows = db.execute(
        select(Defect.defect_type, func.count(Defect.id).label("cnt"))
        .join(Inspection, Defect.inspection_id == Inspection.id)
        .where(Inspection.inspection_time >= since)
        .group_by(Defect.defect_type)
        .order_by(func.count(Defect.id).desc())
    ).all()

    return [DefectShare(type=t, count=c) for t, c in rows]
