import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const note = style({
  marginTop: "1.5rem",
  fontSize: font.xs,
  color: vars.mutedForeground,
});
