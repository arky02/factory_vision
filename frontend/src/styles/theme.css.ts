/**
 * 디자인 토큰.
 * shadcn(index.css)이 정의한 CSS 변수를 vanilla-extract에서 참조해
 * ui/ 컴포넌트(Tailwind)와 커스텀 컴포넌트(.css.ts)의 테마를 일치시킨다.
 */

export const vars = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  cardForeground: "var(--card-foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  border: "var(--border)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  destructive: "var(--destructive)",
  radius: "var(--radius)",
} as const;

/** 판정/상태용 시맨틱 컬러 */
export const statusColors = {
  passFg: "oklch(50.8% 0.118 165.6)", // emerald-700
  passBg: "oklch(97.9% 0.021 166.1)", // emerald-50
  passDot: "oklch(69.6% 0.17 162.5)", // emerald-500
  failFg: "oklch(50.5% 0.213 27.5)", // red-700
  failBg: "oklch(97.1% 0.013 17.4)", // red-50
  failDot: "oklch(63.7% 0.237 25.3)", // red-500
  warnDot: "oklch(79.5% 0.184 86.0)", // yellow-500
} as const;

/** 차트 전용 색 — dataviz 검증기 통과값 (흰 배경, CVD ΔE 23.8) */
export const chartColors = {
  ok: "#2a78d6", // 정상 (파랑)
  ng: "#d03b3b", // 불량 (빨강) — 파랑↔빨강은 색각이상에도 안전한 대비쌍
  bar: "#2a78d6", // 단일 계열 바
  grid: "#e1e0d9",
  axisInk: "#898781",
  baseline: "#c3c2b7",
} as const;

export const font = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  xl: "1.25rem",
  xxl: "1.5rem",
} as const;
