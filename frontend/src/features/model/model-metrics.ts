/**
 * 배포된 모델(best.pt)의 실측 성능.
 * 검증 데이터셋(HRIPCB valid 2,616장)으로 model.val()을 실행해 얻은 값이다.
 * 모델을 교체하면 재평가 후 이 값과 public/model/ 의 플롯 이미지를 갱신할 것.
 */
export const MODEL_METRICS = {
  model: "YOLO11n fine-tuned",
  dataset: "HRIPCB (PCB 불량 6클래스)",
  trainImages: 5355,
  valImages: 2616,
  evaluatedAt: "2026-08-05",
  map50: 0.9842,
  map5095: 0.5304,
  precision: 0.9765,
  recall: 0.979,
  perClass: [
    { name: "missing_hole", map50: 0.9929 },
    { name: "mouse_bite", map50: 0.9877 },
    { name: "open_circuit", map50: 0.9855 },
    { name: "short", map50: 0.9724 },
    { name: "spur", map50: 0.9833 },
    { name: "spurious_copper", map50: 0.9832 },
  ],
} as const;
