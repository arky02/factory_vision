"""DB 엔진·세션 설정.

DATABASE_URL 환경변수로 접속 대상을 결정한다.
  - 미설정 시: SQLite 파일 (로컬 개발용, 설치 불필요)
  - Docker Compose: postgresql+psycopg://... 로 주입 (코드 변경 없음)
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./factory_vision.db")

engine = create_engine(
    DATABASE_URL,
    # SQLite는 기본적으로 단일 스레드 접근만 허용하므로 해제 (FastAPI는 멀티스레드)
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI 의존성 — 요청마다 세션을 열고 응답 후 닫는다."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
