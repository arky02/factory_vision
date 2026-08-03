import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const header = style({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const imageFrame = style({
  overflow: "hidden",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: `color-mix(in oklab, ${vars.muted} 30%, transparent)`,
});

export const image = style({
  display: "block",
  margin: "0 auto",
  maxHeight: "20rem",
  objectFit: "contain",
});

export const pending = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const pendingImage = style({ height: "16rem", width: "100%" });
export const pendingBar = style({ height: "1rem", width: "12rem" });

export const pendingText = style({
  textAlign: "center",
  fontSize: font.sm,
  color: vars.mutedForeground,
});

export const empty = style({
  display: "flex",
  height: "16rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  color: vars.mutedForeground,
});

export const emptyText = style({
  fontSize: font.sm,
});
