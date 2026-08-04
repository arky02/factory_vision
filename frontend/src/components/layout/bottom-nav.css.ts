import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const nav = style({
  position: "fixed",
  bottom: 0,
  insetInline: 0,
  zIndex: 20,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  borderTop: `1px solid ${vars.border}`,
  backgroundColor: vars.card,
  paddingBottom: "env(safe-area-inset-bottom)",
  "@media": {
    "(min-width: 768px)": { display: "none" },
  },
});

export const link = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.5rem 0 0.625rem",
  fontSize: font.xs,
  fontWeight: 500,
  color: vars.mutedForeground,
  textDecoration: "none",
});

export const linkActive = style({
  color: vars.primary,
});
