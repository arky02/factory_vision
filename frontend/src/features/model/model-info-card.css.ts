import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const layout = style({
  display: "grid",
  gap: "1.5rem",
  "@media": {
    "(min-width: 1024px)": { gridTemplateColumns: "1fr 1fr" },
  },
});

export const summaryGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "0.75rem",
  marginBottom: "1.25rem",
  "@media": {
    "(min-width: 640px)": { gridTemplateColumns: "repeat(4, 1fr)" },
  },
});

export const summaryItem = style({
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  padding: "0.75rem",
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

/** 박스 지표와의 대조 설명 */
export const note = style({
  marginBottom: "1.25rem",
  fontSize: font.xs,
  lineHeight: 1.6,
  color: vars.mutedForeground,
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
  marginBottom: "0.75rem",
  fontSize: font.sm,
  fontWeight: 600,
});
