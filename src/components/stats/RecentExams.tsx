import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ExamHistoryRecord, formatDate, fmtTime, prettyDept } from "@/lib/stats-api";
import { cn } from "@/lib/utils";

interface Props {
  exams: ExamHistoryRecord[];
  total?: number;
}

// Color the dot by percentage band, independent of the backend `isPassed` flag:
//   < 60   → red    (needs improvement)
//   60–69  → yellow (borderline)
//   ≥ 70   → green  (good)
function ScoreDot({ percentage }: { percentage: number }) {
  const tone =
    percentage >= 70 ? "good" : percentage >= 60 ? "warn" : "bad";
  const cls =
    tone === "good"
      ? "bg-success ring-success/20"
      : tone === "warn"
        ? "bg-warning ring-warning/20"
        : "bg-destructive ring-destructive/20";
  const label =
    tone === "good"
      ? "Good (≥70%)"
      : tone === "warn"
        ? "Borderline (60–69%)"
        : "Needs improvement (<60%)";
  return (
    <span
      className={cn("inline-block w-2.5 h-2.5 rounded-full shrink-0 ring-4", cls)}
      title={label}
    />
  );
}

function TypeBadge({ type }: { type: string }) {
  const isFull = type === "full";
  const isGeneral = type === "general";
  const label = isFull ? "Full" : isGeneral ? "General" : "Section";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] tracking-wide font-semibold border-2",
        isFull && "bg-primary/10 text-primary border-primary/30",
        isGeneral && "bg-warning/10 text-warning border-warning/30",
        !isFull && !isGeneral && "bg-info/10 text-info border-info/30",
      )}
    >
      {label}
    </Badge>
  );
}

export function RecentExams({ exams, total }: Props) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">Recent Exams</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing latest {exams.length}
            {total !== undefined && total > exams.length ? ` of ${total}` : ""}
          </p>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No recent exams to display.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="sm:hidden divide-y divide-border/60">
            {exams.map((e) => (
              <li key={e._id} className="p-4 flex items-start gap-3">
                <ScoreDot percentage={e.percentage} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {e.paperName}
                    </span>
                    <TypeBadge type={e.paperType} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {prettyDept(e.departmentId)} · {formatDate(e.createdAt)} · {fmtTime(e.timeTaken)}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-bold tabular-nums">
                      {e.score.toFixed(2)}
                      <span className="text-muted-foreground">/{e.maxScore}</span>
                    </span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        e.percentage >= 70
                          ? "text-success"
                          : e.percentage >= 60
                            ? "text-warning"
                            : "text-destructive",
                      )}
                    >
                      {e.percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted-foreground bg-muted/40">
                  <th className="px-5 py-3 font-semibold">Paper</th>
                  <th className="px-3 py-3 font-semibold">Department</th>
                  <th className="px-3 py-3 font-semibold text-right">Score</th>
                  <th className="px-3 py-3 font-semibold text-right">Percentage</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {exams.map((e) => (
                  <tr key={e._id} className="hover:bg-muted/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <ScoreDot percentage={e.percentage} />
                        <span className="font-medium text-foreground">{e.paperName}</span>
                        <TypeBadge type={e.paperType} />
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-foreground/80">{prettyDept(e.departmentId)}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums font-semibold">
                      {e.score.toFixed(2)}
                      <span className="text-muted-foreground font-normal">/{e.maxScore}</span>
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3.5 text-right tabular-nums font-bold",
                        e.percentage >= 70
                          ? "text-success"
                          : e.percentage >= 60
                            ? "text-warning"
                            : "text-destructive",
                      )}
                    >
                      {e.percentage.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground whitespace-nowrap">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
