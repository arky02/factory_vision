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
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  padding: "0.75rem",
});

export const meterGroup = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const meterTrack = style({
  height: "0.375rem",
  width: "6rem",
  overflow: "hidden",
  borderRadius: "9999px",
  backgroundColor: vars.muted,
});

export const meterFill = style({
  height: "100%",
  borderRadius: "9999px",
  backgroundColor: vars.primary,
});

export const meterValue = style({
  width: "3rem",
  textAlign: "right",
  fontSize: font.xs,
  fontVariantNumeric: "tabular-nums",
  color: vars.mutedForeground,
});
