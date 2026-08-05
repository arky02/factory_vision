import { style } from "@vanilla-extract/css";

import { font, statusColors, vars } from "../../styles/theme.css";

export const cleanNotice = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  borderRadius: `calc(${vars.radius} - 2px)`,
  backgroundColor: statusColors.passBg,
  padding: "0.75rem",
  fontSize: font.sm,
  color: statusColors.passFg,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const item = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  padding: "0.5rem 0.625rem",
});

/* 확신도 원형 게이지 */
export const ringTrack = style({
  fill: "none",
  stroke: vars.muted,
});

export const ringFill = style({
  fill: "none",
  stroke: vars.primary,
  strokeLinecap: "round",
  transition: "stroke-dasharray 300ms ease",
});

export const ringText = style({
  fill: vars.foreground,
  fontSize: "0.5rem",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});
