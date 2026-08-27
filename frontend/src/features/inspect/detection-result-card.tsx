import { Microscope } from "lucide-react";

import type { DetectionResponse } from "@/api/types";
import { ResultBadge } from "@/components/result-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatArea } from "@/lib/format";
import { DefectList } from "./defect-list";
import * as styles from "./detection-result-card.css";

interface DetectionResultCardProps {
  result: DetectionResponse | null;
  isPending: boolean;
}

export function DetectionResultCard({ result, isPending }: DetectionResultCardProps) {
  return (
    <Card>
      <CardHeader className={styles.header}>
        <CardTitle>검사 결과</CardTitle>
        {result && <ResultBadge result={result.result} />}
      </CardHeader>
      <CardContent>
        {isPending ? (
          <ResultPending />
        ) : result ? (
          <ResultContent result={result} />
        ) : (
          <ResultEmpty />
        )}
      </CardContent>
    </Card>
  );
}

function ResultPending() {
  return (
    <div className={styles.pending} aria-busy>
      <Skeleton className={styles.pendingImage} />
      <p className={styles.pendingText}>AI가 결함을 분석하고 있습니다…</p>
    </div>
  );
}

function ResultEmpty() {
  return (
    <div className={styles.empty}>
      <Microscope size={32} aria-hidden />
      <p className={styles.emptyText}>이미지를 업로드하고 검사를 시작하세요.</p>
    </div>
  );
}

function ResultContent({ result }: { result: DetectionResponse }) {
  // 세그멘테이션 모델일 때만 면적이 채워진다 — 검출 전용 모델이면 요약을 숨긴다
  const measured = result.defects.filter((d) => d.area_px !== null);
  const totalArea = measured.reduce((sum, d) => sum + (d.area_px ?? 0), 0);

  return (
    <div className={styles.content}>
      <div className={styles.imageFrame}>
        <img
          src={result.detected_image_url}
          alt="결함 영역이 표시된 검사 결과 이미지"
          className={styles.image}
        />
      </div>
      <aside className={styles.defectPanel}>
        <h3 className={styles.defectPanelTitle}>
          검출된 결함 {result.defects.length > 0 && `(${result.defects.length})`}
        </h3>
        {measured.length > 0 && (
          <p className={styles.totalArea}>
            총 결함 면적 <strong>{formatArea(totalArea)}</strong>
          </p>
        )}
        <div className={styles.defectPanelScroll}>
          <DefectList defects={result.defects} />
        </div>
      </aside>
    </div>
  );
}
