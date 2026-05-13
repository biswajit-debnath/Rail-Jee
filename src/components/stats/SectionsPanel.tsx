import { useState, useEffect } from "react";
import { Layers, Target, Clock, CheckCircle2, XCircle, FileText, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DepartmentStats, type PaperCodeStats, num, fmtPct, fmtTime, prettyDept } from "@/lib/stats-api";
import { cn } from "@/lib/utils";

interface Props {
  dept: DepartmentStats | null;
}

export function SectionsPanel({ dept }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    setOpenIdx(0);
  }, [dept?.departmentId]);

  if (!dept) {
    return (
      <Card className="h-full min-h-[520px] p-8 border-border/60 shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-foreground">Select a Department</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Choose any department on the left to view its section level breakdown here.
        </p>
      </Card>
    );
  }

  const sections = dept.paperCodeStats || [];
  const accuracy = num(dept.averageAccuracy);

  return (
    <Card className="h-full min-h-[520px] flex flex-col overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      <div className="px-5 sm:px-6 py-4 border-b border-border/60 bg-[image:var(--gradient-surface)] flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-xl bg-[image:var(--gradient-primary)] text-white flex items-center justify-center shadow-md">
          <Layers className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
              Now Viewing
            </Badge>
            <h3 className="font-bold text-foreground truncate">
              {prettyDept(dept.departmentId)} · Sections
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {sections.length} Section{sections.length !== 1 ? "s" : ""} · {dept.totalExams} Exam
            {dept.totalExams !== 1 ? "s" : ""} · {fmtPct(accuracy)} Accuracy
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
        {sections.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No section data for this department.
          </div>
        ) : (
          <ul className="space-y-3">
            {sections.map((s, i) => {
              const isOpen = openIdx === i;
              return (
                <SectionItem
                  key={i}
                  s={s}
                  isOpen={isOpen}
                  onToggle={() => setOpenIdx(isOpen ? null : i)}
                />
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}

function SectionItem({
  s,
  isOpen,
  onToggle,
}: {
  s: PaperCodeStats;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const acc = num(s.averageAccuracy);
  const score = num(s.averagePercentage);
  const pass = num(s.passRate);
  const totalQ = (s.totalAttemptedQuestions || 0) + (s.totalUnattemptedQuestions || 0);
  const code = s.paperCode || "";
  const isFull = code === "NA" || code === "";
  const label = isFull ? "Full Paper" : code;

  return (
    <li className="rounded-xl border border-border/60 bg-background/50 hover:shadow-[var(--shadow-card)] transition-shadow overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">{label}</div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {s.totalExams} Exam{s.totalExams !== 1 ? "s" : ""} · {s.passedCount}/
              {s.totalExams} Passed
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="secondary"
            className={cn(
              "font-semibold tabular-nums",
              isFull ? "bg-primary/10 text-primary" : "bg-info/10 text-info",
            )}
          >
            {isFull ? "Full" : "Section"}
          </Badge>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <SectionMetric label="Accuracy" value={fmtPct(acc)} pct={acc} color="bg-primary" />
            <SectionMetric label="Avg Score" value={fmtPct(score)} pct={score} color="bg-info" />
            <SectionMetric label="Pass Rate" value={fmtPct(pass)} pct={pass} color="bg-success" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border/60">
            <Tiny icon={Target} label="Questions" value={`${s.totalAttemptedQuestions}/${totalQ}`} />
            <Tiny icon={Clock} label="Time Spent" value={fmtTime(s.totalTimeTaken)} />
            <Tiny icon={CheckCircle2} label="Correct" value={String(s.totalCorrectAnswers)} positive />
            <Tiny icon={XCircle} label="Incorrect" value={String(s.totalIncorrectAnswers)} negative />
          </div>
        </div>
      )}
    </li>
  );
}

function SectionMetric({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-2.5">
      <div className="flex items-baseline justify-between gap-1 mb-1">
        <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}

function Tiny({
  icon: Icon,
  label,
  value,
  positive,
  negative,
}: {
  icon: any;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        className={cn(
          "w-3.5 h-3.5 mt-0.5 shrink-0",
          positive && "text-success",
          negative && "text-destructive",
          !positive && !negative && "text-muted-foreground",
        )}
      />
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground">{label}</div>
        <div className="text-xs font-semibold tabular-nums truncate">{value}</div>
      </div>
    </div>
  );
}
