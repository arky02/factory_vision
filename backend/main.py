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
# 세그멘테이션 가중치를 우선 사용한다 (결함 면적 계측 지원). 없으면 검출 전용으로 폴백.
WEIGHTS_CANDIDATES = [WEIGHTS_DIR / "best-seg.pt", WEIGHTS_DIR / "best.pt"]
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    # 기존 검사 이력이 있는 DB에는 세그멘테이션 컬럼이 없으므로 여기서 보충한다
    ensure_columns("defects", {"polygon": "JSON", "area_px": "FLOAT"})
    # 학습된 가중치가 하나도 없으면 사전학습 기본 모델로 폴백 (파이프라인 개발용)
    weights = next((p for p in WEIGHTS_CANDIDATES if p.exists()), "yolo11n.pt")
    app.state.detector = Detector(weights)
    mode = "segmentation (면적 계측 지원)" if app.state.detector.supports_mask else "detection"
    print(f"[FactoryVision] model loaded: {weights} — {mode}")
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
