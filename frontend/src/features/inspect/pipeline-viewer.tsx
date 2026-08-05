import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";

import type { PipelineStage } from "@/api/types";
import * as styles from "./pipeline-viewer.css";

/** 단계 키 → 화면 표기 (새 전처리 단계가 추가되면 여기에 매핑만 추가) */
const STAGE_LABELS: Record<string, { title: string; description: string }> = {
  original: { title: "원본", description: "업로드된 이미지" },
  clahe: { title: "CLAHE", description: "적응형 조명 보정" },
  denoise: { title: "Denoise", description: "가우시안 노이즈 제거" },
};

interface PipelineViewerProps {
  pipeline: PipelineStage[];
  detectedImageUrl: string;
}

/** OpenCV 전처리 → YOLO 검출까지의 이미지 처리 과정 시각화 */
export function PipelineViewer({ pipeline, detectedImageUrl }: PipelineViewerProps) {
  const [open, setOpen] = useState(false);

  const stages = [
    ...pipeline.map((stage) => ({
      url: stage.url,
      title: STAGE_LABELS[stage.name]?.title ?? stage.name,
      description: STAGE_LABELS[stage.name]?.description ?? "전처리 단계",
    })),
    { url: detectedImageUrl, title: "YOLO 검출", description: "결함 위치 탐지" },
  ];

  return (
    <div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown size={14} aria-hidden />
        ) : (
          <ChevronRight size={14} aria-hidden />
        )}
        이미지 처리 과정 보기 (OpenCV 전처리 → 검출)
      </button>

      {open && (
        <div className={styles.track}>
          {stages.map((stage, i) => (
            <Fragment key={stage.title}>
              {i > 0 && (
                <ArrowRight size={16} className={styles.arrow} aria-hidden />
              )}
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
      )}
    </div>
  );
}
