import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const titleBar = style({ height: "1.75rem", width: "10rem" });
export const descriptionBar = style({ height: "1rem", width: "16rem" });

export const cards = style({
  display: "grid",
  gap: "1rem",
  "@media": {
    "(min-width: 768px)": { gridTemplateColumns: "1fr 1fr" },
  },
});

export const card = style({ height: "18rem" });
