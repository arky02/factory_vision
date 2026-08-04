import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/theme.css";

export const root = style({
  display: "flex",
  minHeight: "100svh",
  backgroundColor: vars.background,
  color: vars.foreground,
});

/* 데스크톱 사이드바 — 모바일에서는 숨김 */
export const sidebar = style({
  position: "fixed",
  insetBlock: 0,
  left: 0,
  display: "none",
  flexDirection: "column",
  width: "14rem",
  borderRight: `1px solid ${vars.border}`,
  backgroundColor: vars.card,
  "@media": {
    "(min-width: 768px)": { display: "flex" },
  },
});

/* 모바일 상단바 — 데스크톱에서는 숨김 */
export const mobileTopbar = style({
  position: "fixed",
  top: 0,
  insetInline: 0,
  zIndex: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "3.25rem",
  padding: "0 1rem",
  borderBottom: `1px solid ${vars.border}`,
  backgroundColor: vars.card,
  "@media": {
    "(min-width: 768px)": { display: "none" },
  },
});

export const brand = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  borderBottom: `1px solid ${vars.border}`,
  padding: "1rem 1.25rem",
});

export const mobileBrand = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const brandName = style({
  fontSize: "1rem",
  fontWeight: 600,
  letterSpacing: "-0.025em",
});

export const brandIcon = style({
  color: vars.primary,
});

export const sidebarFooter = style({
  borderTop: `1px solid ${vars.border}`,
  padding: "0.75rem 1.25rem",
});

export const main = style({
  flex: 1,
  // 모바일: 상단바/하단탭 높이만큼 여백 확보
  padding: "4.25rem 1rem 5.5rem",
  minWidth: 0,
  "@media": {
    "(min-width: 768px)": {
      marginLeft: "14rem",
      padding: "1.5rem 2rem",
    },
  },
});
