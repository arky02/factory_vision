import uuid
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from models.inspection import Defect, Inspection
from schemas.detection import DetectionResponse
from services import preprocess

router = APIRouter()

STATIC_DIR = Path(__file__).parent.parent / "static"


@router.post("/detect", response_model=DetectionResponse)
async def detect(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    data = await file.read()
    image = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="유효한 이미지 파일이 아닙니다.")

    image_id = uuid.uuid4().hex
    upload_path = f"/static/uploads/{image_id}.jpg"
    detected_path = f"/static/detections/{image_id}.jpg"
    cv2.imwrite(str(STATIC_DIR / "uploads" / f"{image_id}.jpg"), image)

    # 전처리 단계별 중간 이미지를 저장해 파이프라인 시각화에 사용
    stages = preprocess.run_with_stages(image)
    (STATIC_DIR / "pipeline").mkdir(exist_ok=True)
    pipeline = [{"name": "original", "url": upload_path}]
    for i, (name, stage_image) in enumerate(stages):
        stage_url = f"/static/pipeline/{image_id}_{i}_{name}.jpg"
        cv2.imwrite(str(STATIC_DIR / "pipeline" / f"{image_id}_{i}_{name}.jpg"), stage_image)
        pipeline.append({"name": name, "url": stage_url})

    processed = stages[-1][1] if stages else image
    defects, plotted = request.app.state.detector.predict(processed)
    cv2.imwrite(str(STATIC_DIR / "detections" / f"{image_id}.jpg"), plotted)

    inspection = Inspection(
        image_path=upload_path,
        detected_image_path=detected_path,
        inspection_result="NG" if defects else "OK",
        defects=[
            Defect(
                defect_type=d["type"],
                confidence=d["confidence"],
                bbox=d["bbox"],
                polygon=d["polygon"],
                area_px=d["area_px"],
            )
            for d in defects
        ],
    )
    db.add(inspection)
    db.commit()

    return DetectionResponse(
        result=inspection.inspection_result,
        confidence=max((d["confidence"] for d in defects), default=None),
        detected_image_url=detected_path,
        defects=defects,
        pipeline=pipeline,
    )
