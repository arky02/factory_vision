import { AlertTriangle, CircleCheck, CircleX, Gauge } from "lucide-react";

import type { Inspection } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import * as styles from "./stat-cards.css";

/** 불량률이 이 값을 넘으면 경고 색상으로 표시 (Phase 6 Alert 기준치) */
const DEFECT_RATE_WARN = 0.05;

export function StatCards({ inspections }: { inspections: Inspection[] }) {
  const total = inspections.length;
  const ngCount = inspections.filter((i) => i.inspection_result === "NG").length;
  const defectRate = total > 0 ? ngCount / total : 0;
  const topDefect = findTopDefect(inspections);

  const stats = [
    { label: "검사 건수", value: String(total), icon: Gauge },
    { label: "정상 (PASS)", value: String(total - ngCount), icon: CircleCheck },
    { label: "불량 (FAIL)", value: String(ngCount), icon: CircleX },
    {
      label: "불량률",
      value: formatPercent(defectRate),
      icon: AlertTriangle,
      warn: defectRate > DEFECT_RATE_WARN,
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
      {topDefect && (
        <Card className={styles.topDefectCard}>
          <CardContent className={styles.topDefectBody}>
            <span className={styles.topDefectLabel}>최다 발생 불량</span>
            <span className={styles.topDefectValue}>
              {topDefect.type}{" "}
              <span className={styles.topDefectCount}>({topDefect.count}건)</span>
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function findTopDefect(inspections: Inspection[]) {
  const counts = new Map<string, number>();
  for (const inspection of inspections) {
    for (const defect of inspection.defects) {
      counts.set(defect.defect_type, (counts.get(defect.defect_type) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? { type: top[0], count: top[1] } : null;
}
