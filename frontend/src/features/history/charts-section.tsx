import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DefectShare } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { chartColors } from "@/styles/theme.css";
import * as styles from "./charts-section.css";

const AXIS_TICK = { fontSize: 11, fill: chartColors.axisInk };

export function ChartsSection({ distribution }: { distribution: DefectShare[] }) {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle>결함 유형 분포</CardTitle>
        <CardDescription>전체 기간 · 검출된 결함 수 기준</CardDescription>
      </CardHeader>
      <CardContent className={styles.contentFill}>
        <DefectDistributionChart distribution={distribution} />
      </CardContent>
    </Card>
  );
}

function DefectDistributionChart({ distribution }: { distribution: DefectShare[] }) {
  if (distribution.length === 0) {
    return <div className={styles.empty}>아직 검출된 결함이 없습니다.</div>;
  }

  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  const data = distribution.map((d) => ({
    ...d,
    share: d.count / total,
  }));

  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} />
          <XAxis
            dataKey="type"
            tickLine={false}
            axisLine={{ stroke: chartColors.baseline }}
            tick={AXIS_TICK}
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
          />
          <Tooltip
            content={<DistributionTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar
            dataKey="count"
            fill={chartColors.bar}
            maxBarSize={40}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="count"
              position="top"
              style={{ fontSize: 11, fill: chartColors.axisInk }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DistributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { type: string; count: number; share: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { type, count, share } = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{type}</div>
      <div className={styles.tooltipRow}>
        {count}건 · 전체의 {formatPercent(share)}
      </div>
    </div>
  );
}
