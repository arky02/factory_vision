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
          개) 기준 실측 ({m.evaluatedAt})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.modelGrid}>
          <ModelBlock metrics={m.detect} primary="mAP50" />
          <ModelBlock metrics={m.segment} primary="Mask mAP50" />
        </div>

        <p className={styles.note}>
          두 지표는 채점 기준이 되는 라벨이 서로 달라 직접 비교할 수 없습니다. 판정
          모델은 사람이 그린 원본 어노테이션으로, 계측 모델은 SAM으로 생성한 폴리곤
          라벨로 평가했습니다. 계측 모델을 원본 박스 기준으로 재보면 mAP50이 0.604로
          판정에는 맞지 않는데, SAM 마스크가 원본 박스보다 결함에 밀착해 예측 박스가
          좁게 나오기 때문입니다. 그래서 판정과 계측을 나눴습니다.
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
