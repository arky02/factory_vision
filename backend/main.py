from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from models import inspection as _models  # 테이블 정의 등록  # noqa: F401
from routers import detect, inspections, stats
from services.inference import Detector

BASE_DIR = Path(__file__).parent
WEIGHTS_PATH = BASE_DIR / "yolo" / "weights" / "best.pt"
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    # best.pt가 없으면 사전학습 기본 모델로 폴백 (파이프라인 개발용)
    weights = WEIGHTS_PATH if WEIGHTS_PATH.exists() else "yolo11n.pt"
    app.state.detector = Detector(weights)
    print(f"[FactoryVision] model loaded: {weights}")
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
