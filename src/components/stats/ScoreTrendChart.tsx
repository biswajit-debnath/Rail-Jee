import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type ExamHistoryRecord, formatDate } from "@/lib/stats-api";

interface Props {
  exams: ExamHistoryRecord[];
}

export function ScoreTrendChart({ exams }: Props) {
  const data = useMemo(() => {
    return [...exams]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((e) => ({
        date: formatDate(e.createdAt),
        percentage: Number(e.percentage.toFixed(2)),
        accuracy: Number(e.accuracy.toFixed(2)),
        paper: e.paperName,
        passed: e.isPassed,
      }));
  }, [exams]);

  return (
    <Card className="p-5 sm:p-6 border-border/60 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-foreground">Score Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data.length} Attempts · Oldest to Newest
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Score %</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-info" />
            <span className="text-muted-foreground">Accuracy %</span>
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          No exam attempts yet.
        </div>
      ) : (
        <div className="h-64 sm:h-72 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 45)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.7 0.18 45)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.15 240)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="oklch(0.65 0.15 240)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 70)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "oklch(0.5 0.02 60)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "oklch(0.5 0.02 60)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.9 0.015 70)",
                  boxShadow: "var(--shadow-card)",
                  fontSize: 12,
                }}
                formatter={(v: number, name) => [`${v.toFixed(2)}%`, name]}
                labelFormatter={(l, payload) => {
                  const p = payload?.[0]?.payload as { paper?: string };
                  return p?.paper ? `${l} · ${p.paper}` : l;
                }}
              />
              <ReferenceLine y={70} stroke="oklch(0.7 0.16 155)" strokeDasharray="4 4" label={{ value: "Pass 70%", position: "right", fill: "oklch(0.7 0.16 155)", fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="oklch(0.65 0.15 240)"
                strokeWidth={2}
                fill="url(#accFill)"
                dot={{ r: 3, fill: "oklch(0.65 0.15 240)" }}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                name="Percentage"
                stroke="oklch(0.7 0.18 45)"
                strokeWidth={2.5}
                fill="url(#scoreFill)"
                dot={{ r: 3.5, fill: "oklch(0.7 0.18 45)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
