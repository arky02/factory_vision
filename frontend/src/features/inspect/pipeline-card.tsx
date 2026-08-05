import { ArrowRight, Workflow } from "lucide-react";
import { Fragment } from "react";

import type { DetectionResponse } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as styles from "./pipeline-card.css";

/** 단계 키 → 화면 표기 (새 전처리 단계가 추가되면 여기에 매핑만 추가) */
const STAGE_LABELS: Record<string, { title: string; description: string }> = {
  original: { title: "원본", description: "업로드된 이미지" },
  clahe: { title: "CLAHE", description: "적응형 조명 보정" },
  denoise: { title: "Denoise", description: "가우시안 노이즈 제거" },
};

/** OpenCV 전처리 → YOLO 검출까지의 이미지 처리 과정 시각화 */
export function PipelineCard({ result }: { result: DetectionResponse | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이미지 처리 과정</CardTitle>
        <CardDescription>
          업로드된 이미지는 OpenCV 전처리를 거친 뒤 YOLO 모델에 입력됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result ? <PipelineTrack result={result} /> : <PipelinePlaceholder />}
      </CardContent>
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
