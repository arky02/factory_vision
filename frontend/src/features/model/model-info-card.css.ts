import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const layout = style({
  display: "grid",
  gap: "1.5rem",
  "@media": {
    "(min-width: 1024px)": { gridTemplateColumns: "1fr 1fr" },
  },
});

/** 판정 모델 / 계측 모델을 나란히 배치 */
export const modelGrid = style({
  display: "grid",
  gap: "0.75rem",
  marginBottom: "1rem",
  "@media": {
    "(min-width: 640px)": { gridTemplateColumns: "repeat(2, 1fr)" },
  },
});

export const modelBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  padding: "1rem",
});

export const modelRole = style({
  fontSize: font.xs,
  fontWeight: 600,
  color: vars.foreground,
});

export const modelName = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
  fontVariantNumeric: "tabular-nums",
});

export const headline = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "0.5rem",
  marginTop: "0.25rem",
});

export const headlineLabel = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const headlineValue = style({
  fontSize: font.xxl,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

export const subMetrics = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
  margin: 0,
});

export const subMetricRow = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "0.5rem",
});

export const subMetricValue = style({
  margin: 0,
  fontSize: font.xs,
  fontVariantNumeric: "tabular-nums",
  color: vars.foreground,
});

export const basis = style({
  marginTop: "0.25rem",
  paddingTop: "0.5rem",
  borderTop: `1px solid ${vars.border}`,
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const summaryLabel = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const summaryValue = style({
  fontSize: font.xl,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

export const classList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const classRow = style({
  display: "grid",
  gridTemplateColumns: "8.5rem 1fr 3.25rem 3.25rem",
  alignItems: "center",
  gap: "0.5rem",
});

export const className = style({
  fontSize: font.xs,
  color: vars.foreground,
});

export const barTrack = style({
  height: "0.5rem",
  overflow: "hidden",
  borderRadius: "9999px",
  backgroundColor: vars.muted,
});

export const barFill = style({
  height: "100%",
  borderRadius: "9999px",
  backgroundColor: vars.primary,
});

export const barValue = style({
  textAlign: "right",
  fontSize: font.xs,
  fontVariantNumeric: "tabular-nums",
  color: vars.foreground,
});

/** 부가 지표(mAP50-95) — 주 지표보다 약하게 */
export const barValueSub = style({
  textAlign: "right",
  fontSize: font.xs,
  fontVariantNumeric: "tabular-nums",
  color: vars.mutedForeground,
});

export const matrixFigure = style({
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const matrixImage = style({
  width: "100%",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: "white",
});

export const caption = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const sectionTitle = style({
  marginBottom: "0.25rem",
  fontSize: font.sm,
  fontWeight: 600,
});

/** 제목 바로 아래 붙는 범례 */
export const sectionCaption = style({
  marginBottom: "0.75rem",
  fontSize: font.xs,
  color: vars.mutedForeground,
});
