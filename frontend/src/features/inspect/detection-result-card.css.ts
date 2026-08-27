import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const header = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "1rem",
});

export const content = style({
  display: "grid",
  gap: "1rem",
  "@media": {
    "(min-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr) 12.5rem" },
  },
});

export const imageFrame = style({
  height: "20rem",
  overflow: "hidden",
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: `color-mix(in oklab, ${vars.muted} 30%, transparent)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const image = style({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

export const defectPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  maxHeight: "20rem",
});

export const defectPanelTitle = style({
  fontSize: font.sm,
  fontWeight: 600,
});

/** 세그멘테이션 마스크에서 합산한 총 결함 면적 */
export const totalArea = style({
  fontSize: font.xs,
  color: vars.mutedForeground,
  fontVariantNumeric: "tabular-nums",
});

export const defectPanelScroll = style({
  overflowY: "auto",
});

export const pending = style({
  display: "flex",
  height: "20rem",
  flexDirection: "column",
  gap: "0.75rem",
});

export const pendingImage = style({ flex: 1, width: "100%" });

export const pendingText = style({
  textAlign: "center",
  fontSize: font.sm,
  color: vars.mutedForeground,
});

export const empty = style({
  display: "flex",
  height: "20rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  color: vars.mutedForeground,
});

export const emptyText = style({
  fontSize: font.sm,
});
