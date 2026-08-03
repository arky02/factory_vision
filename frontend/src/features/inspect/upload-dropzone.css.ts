import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const zone = style({
  display: "flex",
  height: "16rem",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `2px dashed color-mix(in oklab, ${vars.mutedForeground} 25%, transparent)`,
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "border-color 150ms, background-color 150ms",
  selectors: {
    "&:hover": {
      borderColor: `color-mix(in oklab, ${vars.mutedForeground} 50%, transparent)`,
      backgroundColor: `color-mix(in oklab, ${vars.muted} 30%, transparent)`,
    },
  },
});

export const zoneDragOver = style({
  borderColor: vars.primary,
  backgroundColor: `color-mix(in oklab, ${vars.primary} 5%, transparent)`,
});

export const icon = style({
  color: vars.mutedForeground,
});

export const helpText = style({
  textAlign: "center",
  fontSize: font.sm,
  color: vars.mutedForeground,
});

export const helpTextStrong = style({
  fontWeight: 500,
  color: vars.foreground,
});

export const input = style({
  display: "none",
});
