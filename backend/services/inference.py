"""YOLO 추론 래퍼. 모델은 서버 시작 시 1회만 로드된다 (main.py lifespan 참조)."""

from pathlib import Path

import numpy as np
from ultralytics import YOLO


class Detector:
    def __init__(self, weights: str | Path):
        self.model = YOLO(str(weights))

    def predict(self, image: np.ndarray, conf: float = 0.25):
        """불량 검출을 수행한다.

        Returns:
            defects: [{"type", "confidence", "bbox": [x1, y1, x2, y2]}, ...]
            plotted: Bounding Box가 그려진 BGR 이미지
        """
        result = self.model.predict(image, conf=conf, verbose=False)[0]

        defects = []
        for box in result.boxes:
            defects.append({
                "type": result.names[int(box.cls)],
                "confidence": round(float(box.conf), 4),
                "bbox": [int(v) for v in box.xyxy[0]],
            })

        return defects, result.plot()
