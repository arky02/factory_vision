import { History, ScanSearch, Video } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import * as styles from "./sidebar-nav.css";

const NAV_ITEMS = [
  { to: "/inspect", label: "검사", icon: ScanSearch },
  { to: "/history", label: "검사 이력", icon: History },
  { to: "/live", label: "실시간 검사", icon: Video },
] as const;

export function SidebarNav() {
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
          <Icon size={16} aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
