/** POST /detect 응답의 개별 불량 */
export interface Defect {
  type: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  polygon: [number, number][] | null; // 결함 외곽 (세그멘테이션 모델일 때만)
  area_px: number | null; // 결함 픽셀 면적
}

/** 전처리 파이프라인 단계 이미지 */
export interface PipelineStage {
  name: string; // "original" | "clahe" | "denoise" 등
  url: string;
}

/** POST /detect 응답 */
export interface DetectionResponse {
  result: "OK" | "NG";
  confidence: number | null;
  detected_image_url: string;
  defects: Defect[];
  pipeline: PipelineStage[];
  image_width: number; // 파이프라인 이미지를 결함 위치로 확대할 때 필요
  image_height: number;
}

/** GET /inspections 응답의 개별 불량 (DB 컬럼명 기준) */
export interface InspectionDefect {
  defect_type: string;
  confidence: number;
  bbox: number[];
  polygon: [number, number][] | null;
  area_px: number | null;
}

/** GET /stats/summary 응답 */
export interface StatsSummary {
  window_hours: number | null; // null이면 전체 기간
  total: number;
  ok: number;
  ng: number;
  defect_rate: number; // 0.0 ~ 1.0
  top_defect: { type: string; count: number } | null;
}

/** GET /stats/hourly 응답의 시간 버킷 */
export interface HourlyPoint {
  hour: string; // ISO (UTC)
  total: number;
  ng: number;
}

/** GET /stats/defect-distribution 응답 항목 */
export interface DefectShare {
  type: string;
  count: number;
}

/** GET /inspections 응답의 검사 이력 1건 */
export interface Inspection {
  id: number;
  image_path: string;
  detected_image_path: string;
  inspection_result: "OK" | "NG";
  inspection_time: string; // ISO (UTC, 타임존 표기 없음 — format.ts에서 보정)
  defects: InspectionDefect[];
}
