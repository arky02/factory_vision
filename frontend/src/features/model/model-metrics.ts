/**
 * 배포된 모델(best-seg.pt)의 실측 성능.
 * 검증 데이터셋 1,592장(결함 3,266개)에 model.val()을 독립 실행해 얻은 값이다.
 * 학습 직후 검증값과 0.01 내외로 차이가 나는데, 여기서는 재현이 쉬운
 * 독립 실행 결과를 싣는다. 모델을 교체하면 재평가 후 이 값과
 * public/model/ 의 플롯 이미지를 갱신할 것.
 *
 * Box는 결함 위치(사각형) 검출 성능, Mask는 결함 영역(픽셀 단위) 분할 성능이다.
 * 면적 계측은 Mask에 근거하므로 대표 지표로 Mask mAP50을 쓴다.
 */
export const MODEL_METRICS = {
  model: "YOLO11n-seg fine-tuned",
  dataset: "PCB 결함 6클래스",
  trainImages: 5583,
  valImages: 1592,
  valInstances: 3266,
  evaluatedAt: "2026-08-27",
  box: { map50: 0.9133, map5095: 0.4805, precision: 0.878, recall: 0.894 },
  mask: { map50: 0.8289, map5095: 0.3306, precision: 0.8122, recall: 0.8285 },
  perClass: [
    { name: "missing_hole", map50: 0.9915, map5095: 0.593 },
    { name: "spurious_copper", map50: 0.8533, map5095: 0.334 },
    { name: "spur", map50: 0.8531, map5095: 0.323 },
    { name: "short", map50: 0.7851, map5095: 0.247 },
    { name: "mouse_bite", map50: 0.7604, map5095: 0.259 },
    { name: "open_circuit", map50: 0.73, map5095: 0.228 },
  ],
} as const;
