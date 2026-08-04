import { globalStyle, style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const tableCard = style({
  paddingBlock: 0,
  overflow: "hidden",
});

/** 표 스크롤 영역 — 헤더는 sticky로 고정, 좁은 화면에서는 가로 스크롤 */
export const scrollArea = style({
  maxHeight: "26rem",
  overflow: "auto",
});

/** 컬럼이 뭉개지지 않도록 표 최소 폭 확보 (모바일에서는 가로 스크롤) */
export const tableMin = style({
  minWidth: "34rem",
});

globalStyle(`${scrollArea} thead`, {
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: vars.card,
});

export const empty = style({
  display: "flex",
  height: "12rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  color: vars.mutedForeground,
});

export const emptyText = style({
  fontSize: font.sm,
});

export const thumbnail = style({
  height: "3rem",
  width: "4rem",
  borderRadius: `calc(${vars.radius} - 4px)`,
  border: `1px solid ${vars.border}`,
  objectFit: "cover",
  transition: "transform 150ms",
  selectors: {
    "&:hover": { transform: "scale(1.05)" },
  },
});

export const timeCell = style({
  fontSize: font.sm,
  fontVariantNumeric: "tabular-nums",
  color: vars.mutedForeground,
});

export const defectBadges = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
});

export const badgeConfidence = style({
  marginLeft: "0.25rem",
  fontVariantNumeric: "tabular-nums",
  color: vars.mutedForeground,
  fontWeight: 400,
});

export const noDefect = style({
  fontSize: font.sm,
  color: vars.mutedForeground,
});

export const colImage = style({ width: "6rem" });
export const colTime = style({ width: "10rem" });
export const colResult = style({ width: "5rem" });
