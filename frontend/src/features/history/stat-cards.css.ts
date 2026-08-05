import { style } from "@vanilla-extract/css";

import { font, statusColors, vars } from "../../styles/theme.css";

export const grid = style({
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(2, 1fr)",
  "@media": {
    // 데스크톱: 고정 크기 2×2 블록 (우측 차트가 이 높이에 맞춰짐)
    "(min-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 11rem)",
      gridAutoRows: "6.5rem",
    },
  },
});

export const cardWarn = style({
  borderColor: `color-mix(in oklab, ${statusColors.failDot} 40%, transparent)`,
});

export const cardBody = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
});

export const statText = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const statLabel = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
});

export const statValue = style({
  fontSize: font.xxl,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

export const statValueWarn = style({
  color: statusColors.failFg,
});

export const statIcon = style({
  color: vars.mutedForeground,
});

export const statIconWarn = style({
  color: statusColors.failDot,
});

export const topDefectCard = style({
  gridColumn: "span 2",
  "@media": {
    "(min-width: 1024px)": { gridColumn: "span 4" },
  },
});

export const topDefectBody = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: font.sm,
});

export const topDefectLabel = style({
  color: vars.mutedForeground,
});

export const topDefectValue = style({
  fontWeight: 500,
});

export const topDefectCount = style({
  color: vars.mutedForeground,
  fontWeight: 400,
});
