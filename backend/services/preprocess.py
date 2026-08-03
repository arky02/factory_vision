"""OpenCV 전처리 파이프라인.

각 단계는 (BGR np.ndarray) -> (BGR np.ndarray) 함수이며,
PIPELINE 리스트의 구성만 바꾸면 단계를 추가·제거할 수 있다.
Resize·정규화는 Ultralytics가 내부 처리하므로 여기서는 화질 개선만 수행한다.
"""

import cv2
import numpy as np


def clahe(image: np.ndarray) -> np.ndarray:
    """적응형 히스토그램 평활화 — 조명 불균형 보정. L 채널에만 적용한다."""
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(l)
    return cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)


def denoise(image: np.ndarray) -> np.ndarray:
    """가우시안 블러 — 저비용 노이즈 제거."""
    return cv2.GaussianBlur(image, (3, 3), 0)


PIPELINE = [clahe, denoise]


def run(image: np.ndarray) -> np.ndarray:
    for step in PIPELINE:
        image = step(image)
    return image
