/** POST /detect 응답의 개별 불량 */
export interface Defect {
  type: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
}

/** POST /detect 응답 */
export interface DetectionResponse {
  result: "OK" | "NG";
  confidence: number | null;
  detected_image_url: string;
  defects: Defect[];
}

/** GET /inspections 응답의 개별 불량 (DB 컬럼명 기준) */
export interface InspectionDefect {
  defect_type: string;
  confidence: number;
  bbox: number[];
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
