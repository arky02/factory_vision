"""YOLO 추론 래퍼. 모델은 서버 시작 시 1회만 로드된다 (main.py lifespan 참조).

세그멘테이션 가중치(best-seg.pt)면 결함의 외곽 폴리곤과 픽셀 면적까지 산출하고,
검출 전용 가중치(best.pt)면 bbox만 반환한다. 라우터는 두 경우를 같은 코드로 처리한다.
"""

from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

# 폴리곤 점 수를 줄여 응답·저장 크기를 낮춘다 (둘레 대비 허용 오차 비율)
POLYGON_EPSILON_RATIO = 0.004


def _outline(points: np.ndarray) -> tuple[list[list[int]] | None, float | None]:
    """마스크 외곽점을 단순화하고 픽셀 면적을 계산한다. 좌표계는 원본 이미지 기준."""
    if points is None or len(points) < 3:
        return None, None
    contour = points.astype(np.float32)
    area = round(float(cv2.contourArea(contour)), 1)
    approx = cv2.approxPolyDP(contour, POLYGON_EPSILON_RATIO * cv2.arcLength(contour, True), True)
    simplified = [[int(x), int(y)] for x, y in approx.reshape(-1, 2)]
    # 단순화 결과가 면이 되지 못하면 폴리곤은 버리고 면적만 남긴다
    return (simplified if len(simplified) >= 3 else None), area


class Detector:
    def __init__(self, weights: str | Path):
        self.model = YOLO(str(weights))
        # 세그멘테이션 모델일 때만 면적 계측을 제공한다
        self.supports_mask = getattr(self.model, "task", None) == "segment"

    def predict(self, image: np.ndarray, conf: float = 0.25):
        """불량 검출을 수행한다.

        Returns:
            defects: [{"type", "confidence", "bbox", "polygon", "area_px"}, ...]
                     polygon·area_px는 세그멘테이션 모델일 때만 채워진다.
            plotted: 검출 결과(마스크 포함)가 그려진 BGR 이미지
        """
        result = self.model.predict(image, conf=conf, verbose=False)[0]
        outlines = result.masks.xy if result.masks is not None else None

        defects = []
        for i, box in enumerate(result.boxes):
            polygon, area_px = None, None
            if outlines is not None and i < len(outlines):
                polygon, area_px = _outline(outlines[i])
            defects.append({
                "type": result.names[int(box.cls)],
                "confidence": round(float(box.conf), 4),
                "bbox": [int(v) for v in box.xyxy[0]],
                "polygon": polygon,
                "area_px": area_px,
            })

        return defects, result.plot()
