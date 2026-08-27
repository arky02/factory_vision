import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const grid = style({
  display: "grid",
  gap: "1.5rem",
  alignItems: "start",
  "@media": {
    // 업로드 카드는 고정폭(이미지 20rem + 카드 패딩), 결과 카드가 나머지를 차지
    "(min-width: 1024px)": { gridTemplateColumns: "23rem minmax(0, 1fr)" },
  },
});

/* 좌우 컬럼 공통 — 카드를 세로로 쌓는다 */
export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  minWidth: 0,
});
