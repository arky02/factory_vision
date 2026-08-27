"""DB 엔진·세션 설정.

DATABASE_URL 환경변수로 접속 대상을 결정한다.
  - 미설정 시: SQLite 파일 (로컬 개발용, 설치 불필요)
  - Docker Compose: postgresql+psycopg://... 로 주입 (코드 변경 없음)
"""

import os

from sqlalchemy import create_engine, inspect, text
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


def ensure_columns(table: str, columns: dict[str, str]) -> None:
    """이미 존재하는 테이블에 누락된 컬럼만 ALTER로 보충한다.

    create_all()은 테이블을 새로 만들 뿐 기존 테이블에 컬럼을 추가하지 못한다.
    운영 DB에는 이미 검사 이력이 쌓여 있으므로, 마이그레이션 도구 없이 컬럼을
    더하기 위한 최소 장치다. (스키마 변경이 잦아지면 Alembic으로 전환할 것)
    """
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return  # create_all이 새로 만들 테이블 — 이미 최신 스키마다
    existing = {c["name"] for c in inspector.get_columns(table)}
    missing = {name: ddl for name, ddl in columns.items() if name not in existing}
    if not missing:
        return
    with engine.begin() as conn:
        for name, ddl in missing.items():
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
    print(f"[FactoryVision] {table} 컬럼 추가: {', '.join(missing)}")


def get_db():
    """FastAPI 의존성 — 요청마다 세션을 열고 응답 후 닫는다."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
