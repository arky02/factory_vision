import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const tableSection = style({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const tableTitle = style({
  fontSize: font.sm,
  fontWeight: 600,
  color: vars.foreground,
});
