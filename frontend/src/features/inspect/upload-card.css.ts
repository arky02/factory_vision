import { keyframes, style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
});

export const preview = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const previewFrame = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: `color-mix(in oklab, ${vars.muted} 30%, transparent)`,
});

export const previewImage = style({
  display: "block",
  margin: "0 auto",
  maxHeight: "20rem",
  objectFit: "contain",
});

export const removeButton = style({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  width: "1.75rem",
  height: "1.75rem",
});

export const fileName = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const submitButton = style({
  width: "100%",
});
