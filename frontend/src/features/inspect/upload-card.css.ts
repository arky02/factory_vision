import { keyframes, style } from "@vanilla-extract/css";

import { font, vars } from "../../styles/theme.css";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
});

/* 미리보기와 버튼 사이 간격 — 카드 기본 간격(1.5rem)보다 좁게 붙인다 */
export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const titleRow = style({
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
  minWidth: 0,
});

export const previewFrame = style({
  position: "relative",
  overflow: "hidden",
  height: "20rem", // 드롭존과 동일한 고정 높이 → 상태 전환 시 layout shift 없음
  borderRadius: `calc(${vars.radius} - 2px)`,
  border: `1px solid ${vars.border}`,
  backgroundColor: `color-mix(in oklab, ${vars.muted} 30%, transparent)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const previewImage = style({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

export const removeButton = style({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  width: "1.75rem",
  height: "1.75rem",
});

export const fileName = style({
  minWidth: 0,
  fontSize: font.xs,
  fontWeight: 400,
  color: vars.mutedForeground,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
