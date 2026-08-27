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

# 결함 표시 색 (BGR). PCB 녹색 위에서 서로 구분되는 색으로 골랐다.
CLASS_COLORS = {
    "missing_hole": (60, 60, 255),      # 빨강
    "mouse_bite": (0, 165, 255),        # 주황
    "open_circuit": (255, 60, 255),     # 자홍
    "short": (0, 255, 255),             # 노랑
    "spur": (255, 255, 0),              # 청록
    "spurious_copper": (255, 255, 255), # 흰색
}
DEFAULT_COLOR = (60, 60, 255)
MASK_ALPHA = 0.3

# 계측 모델의 검출 임계값. 결함의 존재 여부는 판정 모델이 이미 결정했으므로,
# 계측 모델은 낮은 임계값으로 후보를 넓게 잡아 면적을 찾을 확률을 높인다.
MEASURE_CONF = 0.10


FONT = cv2.FONT_HERSHEY_DUPLEX


def _render(image: np.ndarray, defects: list[dict]) -> np.ndarray:
    """검출 결과를 이미지에 그린다.

    Ultralytics의 result.plot()은 라벨 상자가 결함보다 커서 작은 결함의 형상을 가린다.
    PCB 결함은 수십 픽셀 수준이므로 윤곽선을 직접 그리고 라벨은 최소로 유지한다.
    업로드 해상도가 제각각이므로 선·글자 굵기는 이미지 크기에 비례시킨다.
    """
    out = image.copy()
    overlay = image.copy()
    h, w = image.shape[:2]

    scale = max(0.55, min(h, w) / 900)
    text_thick = max(2, round(scale * 2.2))
    line_thick = max(2, round(scale * 2.5))
    pad = round(6 * scale)

    for d in defects:
        color = CLASS_COLORS.get(d["type"], DEFAULT_COLOR)
        if d["polygon"]:
            pts = np.array(d["polygon"], np.int32)
            cv2.fillPoly(overlay, [pts], color)
            cv2.polylines(out, [pts], True, color, line_thick, cv2.LINE_AA)
            x, top, bottom = int(pts[:, 0].min()), int(pts[:, 1].min()), int(pts[:, 1].max())
        else:  # 계측 모델이 대응 인스턴스를 찾지 못한 경우 — 사각형으로 표시
            x1, y1, x2, y2 = d["bbox"]
            cv2.rectangle(out, (x1, y1), (x2, y2), color, line_thick)
            x, top, bottom = x1, y1, y2

        label = d["type"]
        (tw, th), _ = cv2.getTextSize(label, FONT, scale, text_thick)
        # 위쪽에 자리가 없으면 도형 아래에 그린다. 오른쪽으로 넘치면 안쪽으로 당긴다.
        ty = top - pad if top - th - pad >= 0 else bottom + th + pad
        tx = min(max(0, x), max(0, w - tw))

        cv2.putText(out, label, (tx, ty), FONT, scale, (0, 0, 0), text_thick + 3, cv2.LINE_AA)
        cv2.putText(out, label, (tx, ty), FONT, scale, color, text_thick, cv2.LINE_AA)

    return cv2.addWeighted(overlay, MASK_ALPHA, out, 1 - MASK_ALPHA, 0)


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
    """판정과 계측을 서로 다른 모델이 담당한다.

    판정(결함 유무·종류·위치)은 검출 전용 모델이 맡는다. 원본 어노테이션 기준으로
    Box mAP50 0.985로, 세그멘테이션 모델(0.604)보다 훨씬 정확하기 때문이다.
    세그멘테이션 모델은 SAM이 만든 밀착 마스크로 학습되어 예측 박스가 원본 박스보다
    좁게 나오는데, 이는 면적 계측에는 오히려 적합하지만 판정 기준으로는 맞지 않는다.

    따라서 계측 모델은 면적·외곽선만 공급하고, 어떤 결함이 존재하는지는 판정 모델이 정한다.
    """

    def __init__(self, weights: str | Path, seg_weights: str | Path | None = None):
        self.model = YOLO(str(weights))
        self.seg_model = YOLO(str(seg_weights)) if seg_weights else None
        # 판정 모델 자체가 세그멘테이션이거나, 별도 계측 모델이 있으면 면적을 낼 수 있다
        self.supports_mask = (
            getattr(self.model, "task", None) == "segment" or self.seg_model is not None
        )

    def _measure(self, image: np.ndarray) -> list[tuple[str, tuple, list, float]]:
        """계측 모델을 돌려 (클래스, 중심점, 폴리곤, 면적) 목록을 만든다."""
        result = self.seg_model.predict(image, conf=MEASURE_CONF, verbose=False)[0]
        if result.masks is None:
            return []
        out = []
        for box, pts in zip(result.boxes, result.masks.xy):
            polygon, area = _outline(pts)
            if polygon is None:
                continue
            arr = np.array(polygon)
            center = (float(arr[:, 0].mean()), float(arr[:, 1].mean()))
            out.append((result.names[int(box.cls)], center, polygon, area))
        return out

    def predict(self, image: np.ndarray, conf: float = 0.25):
        """불량 검출을 수행한다.

        Returns:
            defects: [{"type", "confidence", "bbox", "polygon", "area_px"}, ...]
                     polygon·area_px는 계측 모델이 대응 인스턴스를 찾은 경우에만 채워진다.
            plotted: 검출 결과가 그려진 BGR 이미지
        """
        result = self.model.predict(image, conf=conf, verbose=False)[0]
        own_outlines = result.masks.xy if result.masks is not None else None
        # 마스크 중심이 판정 박스 안에 들어오는지로 대응시킨다.
        # 마스크가 박스보다 훨씬 작아 IoU로는 짝을 못 찾기 때문이다.
        measured = self._measure(image) if self.seg_model else []

        defects = []
        for i, box in enumerate(result.boxes):
            name = result.names[int(box.cls)]
            x1, y1, x2, y2 = (int(v) for v in box.xyxy[0])
            polygon, area_px = None, None

            if own_outlines is not None and i < len(own_outlines):
                polygon, area_px = _outline(own_outlines[i])
            else:
                for j, (cls, (cx, cy), poly, area) in enumerate(measured):
                    if cls == name and x1 <= cx <= x2 and y1 <= cy <= y2:
                        polygon, area_px = poly, area
                        measured.pop(j)  # 한 인스턴스가 여러 박스에 중복 배정되지 않도록
                        break

            defects.append({
                "type": name,
                "confidence": round(float(box.conf), 4),
                "bbox": [x1, y1, x2, y2],
                "polygon": polygon,
                "area_px": area_px,
            })

        return defects, _render(image, defects)
