import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const card = style({
  gap: 0, // 접힘 상태에서 헤더만 컴팩트하게 보이도록
});

export const headerToggle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  width: "100%",
  padding: "0 1.5rem",
  border: "none",
  background: "none",
  cursor: "pointer",
  textAlign: "left",
});

export const headerText = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const headerTitle = style({
  fontSize: font.sm,
  fontWeight: 600,
  color: vars.foreground,
});

export const headerDescription = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const chevron = style({
  flexShrink: 0,
  color: vars.mutedForeground,
  transition: "transform 200ms",
});

export const chevronOpen = style({
  transform: "rotate(180deg)",
});

export const content = style({
  paddingTop: "1rem",
});

export const track = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  overflowX: "auto",
  paddingBlock: "0.25rem",
});

export const stage = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  flexShrink: 0,
  width: "8.5rem",
});

export const stageImage = style({
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
});

export const stageName = style({
  fontSize: font.xs,
  fontWeight: 500,
  textAlign: "center",
});

export const stageDescription = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
  textAlign: "center",
});

export const arrow = style({
  flexShrink: 0,
  color: vars.mutedForeground,
});

export const placeholder = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 0",
  fontSize: font.sm,
  color: vars.mutedForeground,
});
