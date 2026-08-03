import { style } from "@vanilla-extract/css";

import { font, vars } from "../styles/theme.css";

export const root = style({
  marginBottom: "1.5rem",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
});

export const titleGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const title = style({
  fontSize: font.xl,
  fontWeight: 600,
  letterSpacing: "-0.025em",
});

export const description = style({
  fontSize: font.sm,
  color: vars.mutedForeground,
});
