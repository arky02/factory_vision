import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DefectShare, HourlyPoint } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPercent, parseUtc } from "@/lib/format";
import { chartColors } from "@/styles/theme.css";
import * as styles from "./charts-section.css";

interface ChartsSectionProps {
  hourly: HourlyPoint[];
  distribution: DefectShare[];
}

export function ChartsSection({ hourly, distribution }: ChartsSectionProps) {
  return (
    <div className={styles.grid}>
      <Card>
        <CardHeader>
          <CardTitle>시간별 검사 추이</CardTitle>
          <CardDescription>최근 24시간 · 시간당 정상/불량 건수</CardDescription>
        </CardHeader>
        <CardContent>
          <HourlyChart hourly={hourly} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>결함 유형 분포</CardTitle>
          <CardDescription>최근 24시간 · 검출된 결함 수 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <DefectDistributionChart distribution={distribution} />
        </CardContent>
      </Card>
    </div>
  );
}

const AXIS_TICK = { fontSize: 11, fill: chartColors.axisInk };

function HourlyChart({ hourly }: { hourly: HourlyPoint[] }) {
  const data = hourly.map((point) => {
    const total = point.total;
    return {
      label: `${parseUtc(point.hour).getHours()}시`,
      정상: total - point.ng,
      불량: point.ng,
      불량률: total > 0 ? point.ng / total : null,
    };
  });

  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: chartColors.baseline }}
            tick={AXIS_TICK}
            interval={3}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
          />
          <Tooltip content={<HourlyTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="정상" stackId="a" fill={chartColors.ok} maxBarSize={18} />
          <Bar
            dataKey="불량"
            stackId="a"
            fill={chartColors.ng}
            maxBarSize={18}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  payload: { 불량률: number | null };
}

function HourlyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const rate = payload[0].payload.불량률;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ backgroundColor: entry.color }}
          />
          {entry.name} {entry.value}건
        </div>
      ))}
      {rate !== null && (
        <div className={styles.tooltipRow}>불량률 {formatPercent(rate)}</div>
      )}
    </div>
  );
}

function DefectDistributionChart({ distribution }: { distribution: DefectShare[] }) {
  if (distribution.length === 0) {
    return <div className={styles.empty}>최근 24시간 검출된 결함이 없습니다.</div>;
  }

  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  const data = distribution.map((d) => ({
    ...d,
    share: d.count / total,
  }));

  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 36, left: 8, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="type"
            width={110}
            tickLine={false}
            axisLine={{ stroke: chartColors.baseline }}
            tick={AXIS_TICK}
          />
          <Tooltip
            content={<DistributionTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="count" fill={chartColors.bar} maxBarSize={16} radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="count"
              position="right"
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
