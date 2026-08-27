from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine, ensure_columns
from models import inspection as _models  # 테이블 정의 등록  # noqa: F401
from routers import detect, inspections, stats
from services.inference import Detector

BASE_DIR = Path(__file__).parent
WEIGHTS_DIR = BASE_DIR / "yolo" / "weights"
# 판정은 검출 전용 모델이, 면적 계측은 세그멘테이션 모델이 담당한다 (services/inference.py 참조)
DETECT_WEIGHTS = WEIGHTS_DIR / "best.pt"
SEGMENT_WEIGHTS = WEIGHTS_DIR / "best-seg.pt"
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    # 기존 검사 이력이 있는 DB에는 세그멘테이션 컬럼이 없으므로 여기서 보충한다
    ensure_columns("defects", {"polygon": "JSON", "area_px": "FLOAT"})
    # 판정 모델이 없으면 사전학습 기본 모델로 폴백 (가중치 없는 클론에서도 서버가 뜬다)
    detect = DETECT_WEIGHTS if DETECT_WEIGHTS.exists() else "yolo11n.pt"
    segment = SEGMENT_WEIGHTS if SEGMENT_WEIGHTS.exists() else None
    app.state.detector = Detector(detect, segment)
    print(f"[FactoryVision] 판정 모델: {detect}")
    print(f"[FactoryVision] 계측 모델: {segment or '없음 (면적 계측 비활성)'}")
    yield


app = FastAPI(title="FactoryVision API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

(STATIC_DIR / "uploads").mkdir(parents=True, exist_ok=True)
(STATIC_DIR / "detections").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(detect.router, prefix="/api")
app.include_router(inspections.router, prefix="/api")
app.include_router(stats.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
