import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const nav = style({
  flex: 1,
  padding: "1rem 0.75rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const link = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  borderRadius: `calc(${vars.radius} - 2px)`,
  padding: "0.5rem 0.75rem",
  fontSize: font.sm,
  fontWeight: 500,
  color: vars.mutedForeground,
  textDecoration: "none",
  transition: "background-color 150ms, color 150ms",
  selectors: {
    "&:hover": {
      backgroundColor: vars.muted,
      color: vars.foreground,
    },
  },
});

export const linkActive = style({
  backgroundColor: vars.primary,
  color: vars.primaryForeground,
  selectors: {
    "&:hover": {
      backgroundColor: vars.primary,
      color: vars.primaryForeground,
    },
  },
});
