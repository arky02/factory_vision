"""검사 통계 집계 API — 대시보드 차트가 사용한다.

hours를 생략하면 기간 제한 없이 전체 이력을 집계한다. 데모 환경에서는 마지막 검사가
언제였는지 알 수 없으므로 전체 집계가 기본이고, hours를 주면 최근 구간만 본다.
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from models.inspection import Defect, Inspection
from schemas.stats import DefectShare, HourlyPoint, StatsSummary, TopDefect

router = APIRouter()

WindowHours = Query(default=None, ge=1, le=24 * 365, description="생략 시 전체 기간")
MAX_HOURLY_BUCKETS = 24 * 30  # 시간별 차트가 무한정 길어지지 않도록 제한


def _window(hours: int | None):
    """기간 필터 조건을 만든다. hours가 없으면 조건 없음(전체 기간)."""
    if hours is None:
        return []
    return [Inspection.inspection_time >= datetime.utcnow() - timedelta(hours=hours)]


@router.get("/stats/summary", response_model=StatsSummary)
def summary(hours: int | None = WindowHours, db: Session = Depends(get_db)):
    window = _window(hours)

    total = db.scalar(select(func.count(Inspection.id)).where(*window)) or 0
    ng = db.scalar(
        select(func.count(Inspection.id)).where(
            *window, Inspection.inspection_result == "NG"
        )
    ) or 0

    top = db.execute(
        select(Defect.defect_type, func.count(Defect.id).label("cnt"))
        .join(Inspection, Defect.inspection_id == Inspection.id)
        .where(*window)
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
def hourly(hours: int | None = WindowHours, db: Session = Depends(get_db)):
    """시간별 검사 건수·불량 건수. 검사가 없는 시간대도 0으로 채워 연속된 축을 만든다."""
    window = _window(hours)

    rows = db.execute(
        select(Inspection.inspection_time, Inspection.inspection_result).where(*window)
    ).all()

    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    if hours is None:
        # 전체 기간이면 가장 오래된 검사부터 현재까지를 축으로 삼되 버킷 수를 제한한다
        earliest = min((t for t, _ in rows), default=now)
        span = int((now - earliest.replace(minute=0, second=0, microsecond=0)).total_seconds() // 3600) + 1
        span = max(1, min(span, MAX_HOURLY_BUCKETS))
    else:
        span = hours

    start = now - timedelta(hours=span - 1)
    buckets = {start + timedelta(hours=i): {"total": 0, "ng": 0} for i in range(span)}

    # SQLite/PostgreSQL 양쪽에서 동작하도록 시간 버킷팅은 Python에서 수행 (요청 규모가 작음)
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
def defect_distribution(hours: int | None = WindowHours, db: Session = Depends(get_db)):
    rows = db.execute(
        select(Defect.defect_type, func.count(Defect.id).label("cnt"))
        .join(Inspection, Defect.inspection_id == Inspection.id)
        .where(*_window(hours))
        .group_by(Defect.defect_type)
        .order_by(func.count(Defect.id).desc())
    ).all()

    return [DefectShare(type=t, count=c) for t, c in rows]
