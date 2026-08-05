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

/** 배포된 모델의 실측 성능 요약 (검증셋 평가 결과) */
export function ModelInfoCard() {
  const summary = [
    { label: "mAP50", value: formatPercent(m.map50) },
    { label: "mAP50-95", value: formatPercent(m.map5095) },
    { label: "Precision", value: formatPercent(m.precision) },
    { label: "Recall", value: formatPercent(m.recall) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 모델 성능</CardTitle>
        <CardDescription>
          {m.model} · {m.dataset} · 학습 {m.trainImages.toLocaleString()}장 /
          검증 {m.valImages.toLocaleString()}장 기준 실측 ({m.evaluatedAt})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.summaryGrid}>
          {summary.map(({ label, value }) => (
            <div key={label} className={styles.summaryItem}>
              <p className={styles.summaryLabel}>{label}</p>
              <p className={styles.summaryValue}>{value}</p>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <section>
            <h3 className={styles.sectionTitle}>클래스별 검출 정확도 (mAP50)</h3>
            <div className={styles.classList}>
              {m.perClass.map(({ name, map50 }) => (
                <div key={name} className={styles.classRow}>
                  <span className={styles.className}>{name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${map50 * 100}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{formatPercent(map50)}</span>
                </div>
              ))}
            </div>
          </section>

          <figure className={styles.matrixFigure}>
            <h3 className={styles.sectionTitle}>혼동 행렬 (Confusion Matrix)</h3>
            <img
              src="/model/confusion_matrix_normalized.png"
              alt="클래스별 예측-정답 혼동 행렬"
              loading="lazy"
              className={styles.matrixImage}
            />
            <figcaption className={styles.caption}>
              대각선이 진할수록 해당 클래스를 정확히 분류한다는 의미
            </figcaption>
          </figure>
        </div>
      </CardContent>
    </Card>
  );
}
