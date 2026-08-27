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
  // 면적 계측은 마스크에 근거하므로 마스크 지표를 대표로 보여주고, 박스 지표는 대조로 둔다
  const summary = [
    { label: "Mask mAP50", value: formatPercent(m.mask.map50) },
    { label: "Mask mAP50-95", value: formatPercent(m.mask.map5095) },
    { label: "Mask Precision", value: formatPercent(m.mask.precision) },
    { label: "Mask Recall", value: formatPercent(m.mask.recall) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 모델 성능</CardTitle>
        <CardDescription>
          {m.model} · {m.dataset} · 학습 {m.trainImages.toLocaleString()}장 /
          검증 {m.valImages.toLocaleString()}장(결함{" "}
          {m.valInstances.toLocaleString()}개) 기준 실측 ({m.evaluatedAt})
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

        <p className={styles.note}>
          결함 위치를 사각형으로 찾는 성능(Box)은 mAP50{" "}
          <strong>{formatPercent(m.box.map50)}</strong>입니다. 영역을 픽셀 단위로
          분할하는 Mask 지표가 더 낮은 것은, 경계까지 맞춰야 해 채점 기준이 훨씬
          엄격하기 때문입니다.
        </p>

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
            <p className={styles.caption}>
              앞이 mAP50, 뒤가 mAP50-95(경계 정밀도). 홀 누락은 경계가 뚜렷한
              원형이라 두 지표 모두 높고, 단선처럼 &lsquo;있어야 할 것이
              없는&rsquo; 결함은 경계가 모호해 낮게 나옵니다.
            </p>
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
