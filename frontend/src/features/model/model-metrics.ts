/**
 * 배포된 두 모델의 실측 성능. 검증 데이터셋 1,592장(결함 3,266개) 기준.
 *
 * 판정과 계측을 서로 다른 모델이 담당한다.
 *  - 판정 모델(YOLO11n): 결함의 유무·종류·위치. 원본 어노테이션 기준으로 평가.
 *  - 계측 모델(YOLO11n-seg): 결함 영역의 면적. SAM으로 생성한 폴리곤 라벨 기준으로 평가.
 *
 * 두 지표는 채점 기준이 되는 라벨이 서로 달라 직접 비교할 수 없다.
 * 계측 모델을 원본 박스 라벨로 재보면 Box mAP50이 0.604로, 판정에는 부적합하다.
 * SAM 마스크가 원본 박스보다 결함에 밀착해 예측 박스가 좁게 나오기 때문이다.
 */
export const MODEL_METRICS = {
  dataset: "PCB 결함 6클래스",
  trainImages: 5583,
  valImages: 1592,
  valInstances: 3266,
  evaluatedAt: "2026-08-27",

  detect: {
    model: "YOLO11n",
    role: "판정",
    basis: "원본 Annotation 기준",
    map50: 0.9849,
    map5095: 0.5525,
    precision: 0.9761,
    recall: 0.9852,
  },

  segment: {
    model: "YOLO11n-seg",
    role: "계측",
    basis: "SAM 폴리곤 라벨 기준",
    map50: 0.8891,
    map5095: 0.4306,
    precision: 0.8122,
    recall: 0.8285,
  },

  /** 클래스별 영역 분할 정확도 (계측 모델) */
  perClass: [
    { name: "missing_hole", map50: 0.9915, map5095: 0.593 },
    { name: "spurious_copper", map50: 0.8533, map5095: 0.334 },
    { name: "spur", map50: 0.8531, map5095: 0.323 },
    { name: "short", map50: 0.7851, map5095: 0.247 },
    { name: "mouse_bite", map50: 0.7604, map5095: 0.259 },
    { name: "open_circuit", map50: 0.73, map5095: 0.228 },
  ],
} as const;
