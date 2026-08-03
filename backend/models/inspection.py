from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[int] = mapped_column(primary_key=True)
    image_path: Mapped[str] = mapped_column(String(255))
    detected_image_path: Mapped[str] = mapped_column(String(255))
    inspection_result: Mapped[str] = mapped_column(String(10))  # "OK" | "NG"
    inspection_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    defects: Mapped[list["Defect"]] = relationship(back_populates="inspection", cascade="all, delete-orphan")


class Defect(Base):
    __tablename__ = "defects"

    id: Mapped[int] = mapped_column(primary_key=True)
    inspection_id: Mapped[int] = mapped_column(ForeignKey("inspections.id"), index=True)
    defect_type: Mapped[str] = mapped_column(String(50), index=True)
    confidence: Mapped[float] = mapped_column(Float)
    bbox: Mapped[list] = mapped_column(JSON)  # [x1, y1, x2, y2]

    inspection: Mapped[Inspection] = relationship(back_populates="defects")
