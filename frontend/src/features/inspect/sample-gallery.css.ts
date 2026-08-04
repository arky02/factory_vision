import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const grid = style({
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(2, 1fr)",
  "@media": {
    "(min-width: 640px)": { gridTemplateColumns: "repeat(3, 1fr)" },
    "(min-width: 1024px)": { gridTemplateColumns: "repeat(6, 1fr)" },
  },
});

export const item = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  padding: 0,
  border: "none",
  background: "none",
  cursor: "pointer",
  textAlign: "left",
  selectors: {
    "&:disabled": { cursor: "not-allowed", opacity: 0.6 },
  },
});

export const thumbnail = style({
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  transition: "border-color 150ms, transform 150ms",
  selectors: {
    [`${item}:hover:not(:disabled) &`]: {
      borderColor: vars.primary,
      transform: "translateY(-2px)",
    },
  },
});

export const itemWide = style({
  gridColumn: "span 2",
});

export const thumbnailWide = style({
  aspectRatio: "2 / 1",
});

export const label = style({
  fontSize: font.xs,
  fontWeight: 500,
  color: vars.foreground,
});

export const expected = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});
