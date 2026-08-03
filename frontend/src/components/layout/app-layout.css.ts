import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/theme.css";

export const root = style({
  display: "flex",
  minHeight: "100svh",
  backgroundColor: vars.background,
  color: vars.foreground,
});

export const sidebar = style({
  position: "fixed",
  insetBlock: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  width: "14rem",
  borderRight: `1px solid ${vars.border}`,
  backgroundColor: vars.card,
});

export const brand = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  borderBottom: `1px solid ${vars.border}`,
  padding: "1rem 1.25rem",
});

export const brandName = style({
  fontSize: "1rem",
  fontWeight: 600,
  letterSpacing: "-0.025em",
});

export const brandIcon = style({
  color: vars.primary,
});

export const sidebarFooter = style({
  borderTop: `1px solid ${vars.border}`,
  padding: "0.75rem 1.25rem",
});

export const main = style({
  marginLeft: "14rem",
  flex: 1,
  padding: "1.5rem 2rem",
});
