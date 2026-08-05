import { CheckCircle2 } from "lucide-react";

import type { Defect } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import * as styles from "./defect-list.css";

export function DefectList({ defects }: { defects: Defect[] }) {
  if (defects.length === 0) {
    return (
      <div className={styles.cleanNotice}>
        <CheckCircle2 size={16} aria-hidden />
        결함이 검출되지 않았습니다.
      </div>
    );
  }

  return (
    <ul className={styles.list} aria-label="검출된 결함 목록">
      {defects.map((defect, i) => (
        <li key={i} className={styles.item}>
          <Badge variant="secondary">{defect.type}</Badge>
          <ConfidenceRing value={defect.confidence} />
        </li>
      ))}
    </ul>
  );
}

const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** 확신도 원형 게이지 — 링이 채워진 비율 = confidence */
function ConfidenceRing({ value }: { value: number }) {
  const percent = Math.round(value * 100);

  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="확신도"
    >
      <circle cx={18} cy={18} r={RADIUS} strokeWidth={3} className={styles.ringTrack} />
      <circle
        cx={18}
        cy={18}
        r={RADIUS}
        strokeWidth={3}
        strokeDasharray={`${CIRCUMFERENCE * value} ${CIRCUMFERENCE}`}
        transform="rotate(-90 18 18)"
        className={styles.ringFill}
      />
      <text
        x={18}
        y={18}
        textAnchor="middle"
        dominantBaseline="central"
        className={styles.ringText}
      >
        {percent}%
      </text>
    </svg>
  );
}
