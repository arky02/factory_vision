import { style, styleVariants } from "@vanilla-extract/css";

import { font, statusColors, vars } from "../../styles/theme.css";

export const root = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: font.xs,
  color: vars.mutedForeground,
});

const dotBase = style({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "9999px",
});

export const dot = styleVariants({
  ok: [dotBase, { backgroundColor: statusColors.passDot }],
  error: [dotBase, { backgroundColor: statusColors.failDot }],
  pending: [dotBase, { backgroundColor: statusColors.warnDot }],
});
