/**
 * 배포된 모델(best-seg.pt)의 실측 성능.
 * 검증 데이터셋 1,592장(결함 3,266개)으로 model.val()을 실행해 얻은 값이다.
 * 모델을 교체하면 재평가 후 이 값과 public/model/ 의 플롯 이미지를 갱신할 것.
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
  box: { map50: 0.912, map5095: 0.4798, precision: 0.8767, recall: 0.8942 },
  mask: { map50: 0.8382, map5095: 0.3477, precision: 0.8214, recall: 0.8394 },
  perClass: [
    { name: "missing_hole", map50: 0.993, map5095: 0.614 },
    { name: "spur", map50: 0.868, map5095: 0.341 },
    { name: "spurious_copper", map50: 0.865, map5095: 0.354 },
    { name: "short", map50: 0.781, map5095: 0.251 },
    { name: "mouse_bite", map50: 0.77, map5095: 0.274 },
    { name: "open_circuit", map50: 0.745, map5095: 0.249 },
  ],
} as const;
