import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const toggle = style({
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  border: "none",
  background: "none",
  padding: 0,
  cursor: "pointer",
  fontSize: font.sm,
  fontWeight: 500,
  color: vars.mutedForeground,
  selectors: {
    "&:hover": { color: vars.foreground },
  },
});

export const track = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  overflowX: "auto",
  paddingBlock: "0.5rem",
});

export const stage = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  flexShrink: 0,
  width: "9rem",
});

export const stageImage = style({
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
});

export const stageName = style({
  fontSize: font.xs,
  fontWeight: 500,
  textAlign: "center",
});

export const stageDescription = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
  textAlign: "center",
});

export const arrow = style({
  flexShrink: 0,
  color: vars.mutedForeground,
});
