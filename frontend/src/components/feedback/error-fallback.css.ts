import { style } from "@vanilla-extract/css";

export const root = style({
  maxWidth: "28rem",
  margin: "0 auto",
  paddingTop: "4rem",
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.75rem",
});
