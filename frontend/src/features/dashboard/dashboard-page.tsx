import { useSuspenseQuery } from "@tanstack/react-query";

import { inspectionsQuery } from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import * as styles from "./dashboard-page.css";
import { StatCards } from "./stat-cards";

export function DashboardPage() {
  // NOTE: Phase 5에서 서버 집계 API(GET /stats/…)로 대체 예정.
  // 지금은 최근 이력을 기반으로 클라이언트에서 통계를 계산한다.
  const { data: inspections } = useSuspenseQuery(inspectionsQuery(100));

  return (
    <>
      <PageHeader
        title="대시보드"
        description="검사 현황 요약 (최근 100건 기준)"
      />
      <StatCards inspections={inspections} />
      <p className={styles.note}>
        시간별 추이·불량 비율 차트는 Phase 5(통계 API + Recharts)에서 추가됩니다.
      </p>
    </>
  );
}
