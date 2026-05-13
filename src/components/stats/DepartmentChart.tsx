import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type DepartmentStats, num, prettyDept } from "@/lib/stats-api";

interface Props {
  departments: DepartmentStats[];
}

const COLORS = {
  accuracy: "oklch(0.7 0.18 45)",
  score: "oklch(0.65 0.15 240)",
  passRate: "oklch(0.7 0.16 155)",
};

export function DepartmentChart({ departments }: Props) {
  const data = useMemo(
    () =>
      departments.map((d) => ({
        name: prettyDept(d.departmentId),
        Accuracy: num(d.averageAccuracy),
        Score: num(d.averagePercentage),
        "Pass Rate": num(d.passRate),
      })),
    [departments],
  );

  const isSingle = data.length === 1;

  return (
    <Card className="p-5 sm:p-6 border-border/60 shadow-[var(--shadow-card)]">
      <div className="mb-4">
        <h3 className="font-bold text-foreground">Department Performance</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Accuracy, Average Score and Pass Rate by department
        </p>
      </div>
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          No department data.
        </div>
      ) : (
        <div className="h-72 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
              barCategoryGap={isSingle ? "30%" : "20%"}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.015 70)"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "oklch(0.5 0.02 60)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "oklch(0.3 0.02 60)", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "oklch(0.95 0.015 75)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.9 0.015 70)",
                  boxShadow: "var(--shadow-card)",
                  fontSize: 12,
                }}
                formatter={(v) => typeof v === 'number' ? `${v.toFixed(1)}%` : ''}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Bar dataKey="Accuracy" radius={[0, 6, 6, 0]} fill={COLORS.accuracy} />
              <Bar dataKey="Score" radius={[0, 6, 6, 0]} fill={COLORS.score} />
              <Bar dataKey="Pass Rate" radius={[0, 6, 6, 0]} fill={COLORS.passRate} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
