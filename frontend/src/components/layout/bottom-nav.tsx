import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import * as styles from "./bottom-nav.css";
import { NAV_ITEMS } from "./nav-items";

/** 모바일 전용 하단 탭 네비게이션 (768px 미만에서만 표시) */
export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="주 메뉴">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(styles.link, isActive && styles.linkActive)
          }
        >
          <Icon size={20} aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
