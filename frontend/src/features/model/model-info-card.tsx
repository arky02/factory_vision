import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import * as styles from "./model-info-card.css";
import { MODEL_METRICS as m } from "./model-metrics";

/** 배포된 두 모델의 실측 성능 (검증셋 평가 결과) */
export function ModelInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 모델 성능</CardTitle>
        <CardDescription>
          {m.dataset} · 학습 {m.trainImages.toLocaleString()}장 / 검증{" "}
          {m.valImages.toLocaleString()}장(결함 {m.valInstances.toLocaleString()}
          개) 기준 실측 
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.modelGrid}>
          <ModelBlock metrics={m.detect} primary="mAP50" />
          <ModelBlock metrics={m.segment} primary="Mask mAP50" />
        </div>

        <p className={styles.note}></p>

        <div className={styles.layout}>
          <section>
            <h3 className={styles.sectionTitle}>클래스별 영역 분할 정확도</h3>
            <div className={styles.classList}>
              {m.perClass.map(({ name, map50, map5095 }) => (
                <div key={name} className={styles.classRow}>
                  <span className={styles.className}>{name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${map50 * 100}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{formatPercent(map50)}</span>
                  <span className={styles.barValueSub}>
                    {formatPercent(map5095)}
                  </span>
                </div>
              ))}
            </div>
            <p className={styles.caption}>왼쪽 mAP50 · 오른쪽 mAP50-95</p>
          </section>

          <figure className={styles.matrixFigure}>
            <h3 className={styles.sectionTitle}>혼동 행렬 (Confusion Matrix)</h3>
            <img
              src="/model/confusion_matrix_normalized.png"
              alt="클래스별 예측-정답 혼동 행렬"
              loading="lazy"
              className={styles.matrixImage}
            />
            
          </figure>
        </div>
      </CardContent>
    </Card>
  );
}

interface ModelMetrics {
  model: string;
  role: string;
  basis: string;
  map50: number;
  map5095: number;
  precision: number;
  recall: number;
}

function ModelBlock({
  metrics,
  primary,
}: {
  metrics: ModelMetrics;
  primary: string;
}) {
  const rows = [
    { label: "mAP50-95", value: metrics.map5095 },
    { label: "Precision", value: metrics.precision },
    { label: "Recall", value: metrics.recall },
  ];

  return (
    <div className={styles.modelBlock}>
      <p className={styles.modelRole}>{metrics.role}</p>
      <p className={styles.modelName}>{metrics.model}</p>
      <div className={styles.headline}>
        <span className={styles.headlineLabel}>{primary}</span>
        <span className={styles.headlineValue}>
          {formatPercent(metrics.map50)}
        </span>
      </div>
      <dl className={styles.subMetrics}>
        {rows.map(({ label, value }) => (
          <div key={label} className={styles.subMetricRow}>
            <dt className={styles.summaryLabel}>{label}</dt>
            <dd className={styles.subMetricValue}>{formatPercent(value)}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.basis}>{metrics.basis}</p>
    </div>
  );
}
