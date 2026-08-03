import uuid
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from schemas.detection import DetectionResponse
from services import preprocess

router = APIRouter()

STATIC_DIR = Path(__file__).parent.parent / "static"


@router.post("/detect", response_model=DetectionResponse)
async def detect(request: Request, file: UploadFile = File(...)):
    data = await file.read()
    image = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="유효한 이미지 파일이 아닙니다.")

    image_id = uuid.uuid4().hex
    cv2.imwrite(str(STATIC_DIR / "uploads" / f"{image_id}.jpg"), image)

    processed = preprocess.run(image)
    defects, plotted = request.app.state.detector.predict(processed)

    detected_path = STATIC_DIR / "detections" / f"{image_id}.jpg"
    cv2.imwrite(str(detected_path), plotted)

    return DetectionResponse(
        result="NG" if defects else "OK",
        confidence=max((d["confidence"] for d in defects), default=None),
        detected_image_url=f"/static/detections/{image_id}.jpg",
        defects=defects,
    )
