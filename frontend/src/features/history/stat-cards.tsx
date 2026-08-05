import { AlertTriangle, CircleCheck, CircleX, Gauge } from "lucide-react";

import type { StatsSummary } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import * as styles from "./stat-cards.css";

/** 불량률이 이 값을 넘으면 경고 색상으로 표시 (Phase 6 Alert 기준치) */
const DEFECT_RATE_WARN = 0.05;

export function StatCards({ summary }: { summary: StatsSummary }) {
  const warn = summary.defect_rate > DEFECT_RATE_WARN;

  const stats = [
    { label: "검사 건수", value: String(summary.total), icon: Gauge },
    { label: "정상", value: String(summary.ok), icon: CircleCheck },
    { label: "불량", value: String(summary.ng), icon: CircleX },
    {
      label: "불량률",
      value: formatPercent(summary.defect_rate),
      icon: AlertTriangle,
      warn,
    },
  ];

  return (
    <div className={styles.grid}>
      {stats.map(({ label, value, icon: Icon, warn }) => (
        <Card key={label} className={cn(warn && styles.cardWarn)}>
          <CardContent className={styles.cardBody}>
            <div className={styles.statText}>
              <p className={styles.statLabel}>{label}</p>
              <p className={cn(styles.statValue, warn && styles.statValueWarn)}>
                {value}
              </p>
            </div>
            <Icon
              size={20}
              className={warn ? styles.statIconWarn : styles.statIcon}
              aria-hidden
            />
          </CardContent>
        </Card>
      ))}
      {summary.top_defect && (
        <Card className={styles.topDefectCard}>
          <CardContent className={styles.topDefectBody}>
            <span className={styles.topDefectLabel}>최다 발생 결함</span>
            <span className={styles.topDefectValue}>
              {summary.top_defect.type}{" "}
              <span className={styles.topDefectCount}>
                ({summary.top_defect.count}건)
              </span>
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
