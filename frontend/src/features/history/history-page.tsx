import { useSuspenseQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { inspectionsQuery } from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import * as styles from "./history-page.css";
import { InspectionTable } from "./inspection-table";
import { StatCards } from "./stat-cards";

export function HistoryPage() {
  const { data: inspections, refetch, isFetching } = useSuspenseQuery(
    inspectionsQuery(100),
  );

  return (
    <>
      <PageHeader
        title="검사 이력"
        description="검사 현황 요약과 최근 이력 (최근 100건 기준)"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RotateCcw size={14} aria-hidden />
          새로고침
        </Button>
      </PageHeader>

      <StatCards inspections={inspections} />

      <section className={styles.tableSection} aria-label="최근 검사 목록">
        <h2 className={styles.tableTitle}>최근 검사 목록</h2>
        <InspectionTable inspections={inspections} />
      </section>
    </>
  );
}
