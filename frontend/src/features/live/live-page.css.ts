import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const placeholder = style({
  display: "flex",
  height: "16rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  color: vars.mutedForeground,
});

export const text = style({
  fontSize: font.sm,
});

export const subText = style({
  fontSize: font.xs,
});
