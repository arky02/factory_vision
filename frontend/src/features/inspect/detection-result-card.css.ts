import { style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

export const header = style({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

/* 좌: 결과 이미지 / 우: 결함 목록 — 높이 고정으로 layout shift 방지 */
export const content = style({
  display: "grid",
  gap: "1rem",
  "@media": {
    "(min-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr) 16rem" },
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
