from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models.inspection import Inspection
from schemas.detection import InspectionItem

router = APIRouter()


@router.get("/inspections", response_model=list[InspectionItem])
def list_inspections(limit: int = 20, offset: int = 0, db: Session = Depends(get_db)):
    """최근 검사 이력 (최신순)."""
    rows = db.scalars(
        select(Inspection)
        .options(selectinload(Inspection.defects))
        .order_by(Inspection.inspection_time.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return rows
