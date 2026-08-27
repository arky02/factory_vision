/** 백엔드의 UTC naive datetime을 로컬 시각으로 보정해 파싱 */
export function parseUtc(iso: string): Date {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`);
}

export function formatDateTime(iso: string): string {
  return parseUtc(iso).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatPercent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** 결함 면적 — 세그멘테이션 마스크에서 산출한 픽셀 수 */
export function formatArea(px: number): string {
  return `${Math.round(px).toLocaleString("ko-KR")} px`;
}
