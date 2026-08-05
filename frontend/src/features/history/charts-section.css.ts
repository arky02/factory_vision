import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

/* 좌측 통계 블록 높이에 맞춰 늘어나는 카드 */
export const card = style({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const contentFill = style({
  flex: 1,
  minHeight: 0,
});

export const chartBox = style({
  width: "100%",
  height: "100%",
  minHeight: "10rem",
});

export const empty = style({
  display: "flex",
  height: "100%",
  minHeight: "10rem",
  alignItems: "center",
  justifyContent: "center",
  fontSize: font.sm,
  color: vars.mutedForeground,
});

/* 커스텀 툴팁 */
export const tooltip = style({
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: vars.card,
  padding: "0.5rem 0.75rem",
  fontSize: font.xs,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
});

export const tooltipTitle = style({
  fontWeight: 600,
  marginBottom: "0.25rem",
});

export const tooltipRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  color: vars.mutedForeground,
});
