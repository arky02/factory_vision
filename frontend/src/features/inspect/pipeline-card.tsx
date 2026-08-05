import { ArrowRight, ChevronDown, Workflow } from "lucide-react";
import { Fragment, useState } from "react";

import type { DetectionResponse } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as styles from "./pipeline-card.css";

/** 단계 키 → 화면 표기 (새 전처리 단계가 추가되면 여기에 매핑만 추가) */
const STAGE_LABELS: Record<string, { title: string; description: string }> = {
  original: { title: "원본", description: "업로드된 이미지" },
  clahe: { title: "CLAHE", description: "적응형 조명 보정" },
  denoise: { title: "Denoise", description: "가우시안 노이즈 제거" },
};

/** OpenCV 전처리 → YOLO 검출까지의 이미지 처리 과정 (기본 접힘) */
export function PipelineCard({ result }: { result: DetectionResponse | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className={styles.card}>
      <button
        type="button"
        className={styles.headerToggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={styles.headerText}>
          <span className={styles.headerTitle}>이미지 처리 과정 확인</span>
          <span className={styles.headerDescription}>
            OpenCV 전처리 → YOLO 검출 단계별 이미지
          </span>
        </span>
        <ChevronDown
          size={16}
          className={cn(styles.chevron, open && styles.chevronOpen)}
          aria-hidden
        />
      </button>

      {open && (
        <CardContent className={styles.content}>
          {result ? <PipelineTrack result={result} /> : <PipelinePlaceholder />}
        </CardContent>
      )}
    </Card>
  );
}

function PipelinePlaceholder() {
  return (
    <div className={styles.placeholder}>
      <Workflow size={16} aria-hidden />
      검사를 실행하면 단계별 처리 이미지가 표시됩니다.
    </div>
  );
}

function PipelineTrack({ result }: { result: DetectionResponse }) {
  const stages = [
    ...result.pipeline.map((stage) => ({
      url: stage.url,
      title: STAGE_LABELS[stage.name]?.title ?? stage.name,
      description: STAGE_LABELS[stage.name]?.description ?? "전처리 단계",
    })),
    {
      url: result.detected_image_url,
      title: "YOLO 검출",
      description: "결함 위치 탐지",
    },
  ];

  return (
    <div className={styles.track}>
      {stages.map((stage, i) => (
        <Fragment key={stage.title}>
          {i > 0 && <ArrowRight size={16} className={styles.arrow} aria-hidden />}
          <figure className={styles.stage}>
            <img
              src={stage.url}
              alt={`${stage.title} 단계 이미지`}
              loading="lazy"
              className={styles.stageImage}
            />
            <figcaption>
              <div className={styles.stageName}>{stage.title}</div>
              <div className={styles.stageDescription}>{stage.description}</div>
            </figcaption>
          </figure>
        </Fragment>
      ))}
    </div>
  );
}
