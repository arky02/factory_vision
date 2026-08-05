import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

/* 상단 개요: 좌측 2×2 통계(고정) + 우측 분포 차트(가변 폭, 높이는 좌측에 맞춤) */
export const overview = style({
  display: "grid",
  gap: "1rem",
  alignItems: "stretch",
  "@media": {
    "(min-width: 1024px)": { gridTemplateColumns: "auto minmax(0, 1fr)" },
  },
});

export const tableSection = style({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const tableTitle = style({
  fontSize: font.sm,
  fontWeight: 600,
  color: vars.foreground,
});
