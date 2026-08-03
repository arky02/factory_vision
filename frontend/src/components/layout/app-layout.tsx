import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Factory } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";

import { ErrorFallback } from "@/components/feedback/error-fallback";
import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { ServerStatus } from "@/components/layout/server-status";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import * as styles from "./app-layout.css";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Factory size={20} className={styles.brandIcon} aria-hidden />
          <span className={styles.brandName}>FactoryVision</span>
        </div>

        <SidebarNav />

        <div className={styles.sidebarFooter}>
          <ServerStatus />
        </div>
      </aside>

      <main className={styles.main}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              key={location.pathname}
              onReset={reset}
              FallbackComponent={ErrorFallback}
            >
              <Suspense fallback={<PageSkeleton />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </main>
    </div>
  );
}
