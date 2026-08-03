import { CheckCircle2 } from "lucide-react";

import type { Defect } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/format";
import * as styles from "./defect-list.css";

export function DefectList({ defects }: { defects: Defect[] }) {
  if (defects.length === 0) {
    return (
      <div className={styles.cleanNotice}>
        <CheckCircle2 size={16} aria-hidden />
        불량이 검출되지 않았습니다.
      </div>
    );
  }

  return (
    <ul className={styles.list} aria-label="검출된 불량 목록">
      {defects.map((defect, i) => (
        <li key={i} className={styles.item}>
          <Badge variant="secondary">{defect.type}</Badge>
          <ConfidenceMeter value={defect.confidence} />
        </li>
      ))}
    </ul>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className={styles.meterGroup}>
      <div
        className={styles.meterTrack}
        role="meter"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="확신도"
      >
        <div className={styles.meterFill} style={{ width: `${value * 100}%` }} />
      </div>
      <span className={styles.meterValue}>{formatPercent(value)}</span>
    </div>
  );
}
