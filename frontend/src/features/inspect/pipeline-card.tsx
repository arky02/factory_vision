import { ArrowRight, ChevronDown } from "lucide-react";
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
  detect: { title: "YOLO 검출", description: "결함 영역 분할" },
};

/** 확대 시 결함이 타일에서 차지할 비율 — 이 값에 맞춰 배율을 역산한다 */
const DEFECT_FILL = 0.5;
const ZOOM_RANGE = [2, 6] as const;

/** OpenCV 전처리 → YOLO 검출까지의 이미지 처리 과정 */
export function PipelineCard({ result }: { result: DetectionResponse | null }) {
  const [open, setOpen] = useState(true);
  // 기본은 전체 이미지. 전처리 효과를 자세히 볼 때만 결함 부위를 확대한다.
  const [zoomed, setZoomed] = useState(false);

  return (
    <Card className={styles.card}>
      <button
        type="button"
        className={styles.headerToggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={styles.headerText}>
          <span className={styles.headerTitle}>이미지 처리 과정</span>
          <span className={styles.headerDescription}>OpenCV 전처리 → YOLO 검출</span>
        </span>
        <ChevronDown
          size={16}
          className={cn(styles.chevron, open && styles.chevronOpen)}
          aria-hidden
        />
      </button>

      {open && (
        <CardContent className={styles.content}>
          {result ? (
            <PipelineTrack
              result={result}
              zoomed={zoomed}
              onToggleZoom={() => setZoomed((prev) => !prev)}
            />
          ) : (
            <PipelinePlaceholder />
          )}
        </CardContent>
      )}
    </Card>
  );
}

function PipelinePlaceholder() {
  return (
    <div className={styles.placeholder}>
      * 검사한 이미지의 전처리 및 검출 과정을 확인할 수 있습니다.
    </div>
  );
}

/**
 * 결함 위치를 중심으로 확대할 배경 스타일을 만든다.
 * 전처리 효과(대비 보정·노이즈 제거)는 전체 이미지 축소본에서는 보이지 않으므로
 * 결함 부위를 확대해야 단계별 차이를 눈으로 확인할 수 있다.
 */
function zoomStyle(result: DetectionResponse, url: string) {
  const defect = result.defects[0];
  if (!defect) return undefined;

  const [x1, y1, x2, y2] = defect.bbox;
  const { image_width: w, image_height: h } = result;
  const size = Math.max(x2 - x1, y2 - y1, 1);
  const zoom = Math.min(
    ZOOM_RANGE[1],
    Math.max(ZOOM_RANGE[0], (Math.min(w, h) * DEFECT_FILL) / size),
  );

  return {
    backgroundImage: `url(${url})`,
    backgroundSize: `${zoom * 100}%`,
    // 이미지가 컨테이너보다 클 때 퍼센트 배경 위치는 이미지의 해당 지점을
    // 컨테이너의 같은 지점에 맞추므로, 결함 중심 비율을 그대로 넘기면 된다
    backgroundPosition: `${(((x1 + x2) / 2) / w) * 100}% ${(((y1 + y2) / 2) / h) * 100}%`,
  };
}

function PipelineTrack({
  result,
  zoomed,
  onToggleZoom,
}: {
  result: DetectionResponse;
  zoomed: boolean;
  onToggleZoom: () => void;
}) {
  // 검출 단계까지 포함해 백엔드가 파이프라인 전체를 내려준다
  const stages = result.pipeline.map((stage) => ({
    url: stage.url,
    title: STAGE_LABELS[stage.name]?.title ?? stage.name,
    description: STAGE_LABELS[stage.name]?.description ?? "전처리 단계",
  }));

  const canZoom = result.defects.length > 0;
  const showZoom = zoomed && canZoom;

  return (
    <>
      {canZoom && (
        <div className={styles.toolbar}>
          <button type="button" className={styles.zoomButton} onClick={onToggleZoom}>
            {showZoom ? "전체 보기" : "결함 확대"}
          </button>
        </div>
      )}

      <div className={styles.track}>
        {stages.map((stage, i) => (
          <Fragment key={stage.title}>
            {i > 0 && (
              <ArrowRight size={16} className={styles.arrow} aria-hidden />
            )}
            <figure className={styles.stage}>
              {showZoom ? (
                <div
                  className={styles.stageZoom}
                  style={zoomStyle(result, stage.url)}
                  role="img"
                  aria-label={`${stage.title} 단계 이미지 (결함 부위 확대)`}
                />
              ) : (
                <img
                  src={stage.url}
                  alt={`${stage.title} 단계 이미지`}
                  loading="lazy"
                  className={styles.stageImage}
                />
              )}
              <figcaption>
                <div className={styles.stageName}>{stage.title}</div>
                <div className={styles.stageDescription}>{stage.description}</div>
              </figcaption>
            </figure>
          </Fragment>
        ))}
      </div>
    </>
  );
}
