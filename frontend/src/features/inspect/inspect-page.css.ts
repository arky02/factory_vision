import { style } from "@vanilla-extract/css";

export const grid = style({
  display: "grid",
  gap: "1.5rem",
  "@media": {
    "(min-width: 1024px)": { gridTemplateColumns: "1fr 1fr" },
  },
});
