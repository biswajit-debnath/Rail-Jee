import { useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type UserExamStats, num } from "@/lib/stats-api";

interface Props {
  stats: UserExamStats;
}

/** Donut/radial showing total correct vs incorrect vs unattempted across all exams. */
export function AnswerBreakdown({ stats }: Props) {
  const totals = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const source = stats.allDepartments ?? stats.departmentExams ?? [];
    for (const d of source) {
      correct += d.totalCorrectAnswers || 0;
      incorrect += d.totalIncorrectAnswers || 0;
      unattempted += d.totalUnattemptedQuestions || 0;
    }
    const total = correct + incorrect + unattempted;
    const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
    return {
      correct, incorrect, unattempted, total,
      data: [
        { name: "Unattempted", value: pct(unattempted), fill: "oklch(0.85 0.02 70)" },
        { name: "Incorrect", value: pct(incorrect), fill: "oklch(0.65 0.2 25)" },
        { name: "Correct", value: pct(correct), fill: "oklch(0.7 0.16 155)" },
      ],
    };
  }, [stats]);

  const accuracy = useMemo(() => {
    const att = totals.correct + totals.incorrect;
    return att > 0 ? (totals.correct / att) * 100 : 0;
  }, [totals]);

  return (
    <Card className="p-5 sm:p-6 border-border/60 shadow-[var(--shadow-card)]">
      <div className="mb-2">
        <h3 className="font-bold text-foreground">Answer Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Across all {stats.totalExams} attempts
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="h-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="55%"
              outerRadius="100%"
              data={totals.data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "oklch(0.95 0.015 75)" }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-3xl font-bold tabular-nums">{accuracy.toFixed(1)}%</div>
            <div className="text-[11px] tracking-wide text-muted-foreground font-semibold">
              Accuracy
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Row label="Correct" value={totals.correct} color="bg-success" total={totals.total} />
          <Row label="Incorrect" value={totals.incorrect} color="bg-destructive" total={totals.total} />
          <Row label="Unattempted" value={totals.unattempted} color="bg-muted-foreground/40" total={totals.total} />
          <div className="pt-2 border-t border-border/60 flex justify-between text-xs">
            <span className="text-muted-foreground">Total questions seen</span>
            <span className="font-bold tabular-nums">{totals.total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Row({
  label, value, color, total,
}: { label: string; value: number; color: string; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <span className="text-foreground/80">{label}</span>
        </span>
        <span className="font-semibold tabular-nums">
          {value} <span className="text-muted-foreground text-xs">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
