import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import {
  defectDistributionQuery,
  inspectionsQuery,
  statsSummaryQuery,
} from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChartsSection } from "./charts-section";
import * as styles from "./history-page.css";
import { InspectionTable } from "./inspection-table";
import { StatCards } from "./stat-cards";

export function HistoryPage() {
  const queryClient = useQueryClient();

  const [
    { data: inspections },
    { data: summary },
    { data: distribution, isFetching },
  ] = useSuspenseQueries({
    queries: [
      inspectionsQuery(100),
      statsSummaryQuery(),
      defectDistributionQuery(),
    ],
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["inspections"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  return (
    <>
      <PageHeader
        title="검사 이력"
        description="전체 검사 현황 요약 및 검사 목록"
      >
        <Button variant="outline" size="sm" onClick={refresh} disabled={isFetching}>
          <RotateCcw size={14} aria-hidden />
          새로고침
        </Button>
      </PageHeader>

      <StatCards summary={summary} />

      <ChartsSection distribution={distribution} />

      <section className={styles.tableSection} aria-label="최근 검사 목록">
        <h2 className={styles.tableTitle}>최근 검사 목록</h2>
        <InspectionTable inspections={inspections} />
      </section>
    </>
  );
}
