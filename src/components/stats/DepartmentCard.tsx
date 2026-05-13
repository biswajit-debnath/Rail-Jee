import { BookOpen, Target, Clock, CheckCircle2, MousePointerClick, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DepartmentStats, num, fmtPct, fmtTime, prettyDept } from "@/lib/stats-api";
import { cn } from "@/lib/utils";

interface Props {
  dept: DepartmentStats;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
}

const accents = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-fuchsia-500",
  "from-rose-500 to-pink-500",
];

export function DepartmentCard({ dept, index, selected, onSelect }: Props) {
  const accent = accents[index % accents.length];
  const accuracy = num(dept.averageAccuracy);
  const score = num(dept.averagePercentage);
  const passRate = num(dept.passRate);
  const totalQ = (dept.totalAttemptedQuestions || 0) + (dept.totalUnattemptedQuestions || 0);
  const sections = dept.paperCodeStats || [];

  return (
    <Card
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      aria-pressed={selected}
      aria-label={`View sections for ${prettyDept(dept.departmentId)}`}
      className={cn(
        "group relative overflow-hidden border-border/60 shadow-[var(--shadow-card)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "ring-2 ring-primary shadow-[var(--shadow-glow)]"
          : "hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:border-primary/40",
      )}
    >
      {selected && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-1 bg-[image:var(--gradient-primary)]"
        />
      )}
      <div className="p-5 border-b border-border/60 flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-md", accent)}>
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground truncate">{prettyDept(dept.departmentId)}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dept.totalExams} exam{dept.totalExams !== 1 ? "s" : ""} · {dept.passedCount}/{dept.totalExams} passed
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 font-semibold gap-1",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary group-hover:bg-primary/15",
          )}
        >
          {selected ? (
            <>
              <Eye className="w-3 h-3" /> Viewing
            </>
          ) : (
            <>
              <MousePointerClick className="w-3 h-3" /> View Sections
            </>
          )}
        </Badge>
      </div>

      <div className="p-5 space-y-3">
        <Metric label="Accuracy" display={fmtPct(accuracy)} value={accuracy} accent="bg-primary" />
        <Metric label="Avg Score" display={fmtPct(score)} value={score} accent="bg-info" />
        <Metric label="Pass Rate" display={fmtPct(passRate)} value={passRate} accent="bg-success" />

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60">
          <Stat icon={Target} label="Questions" value={`${dept.totalAttemptedQuestions}/${totalQ}`} />
          <Stat icon={Clock} label="Time Spent" value={fmtTime(dept.totalTimeTaken)} />
          <Stat icon={CheckCircle2} label="Correct" value={String(dept.totalCorrectAnswers)} positive />
          <Stat icon={CheckCircle2} label="Incorrect" value={String(dept.totalIncorrectAnswers)} negative />
        </div>

      </div>
    </Card>
  );
}

function Metric({ label, display, value, accent }: { label: string; display: string; value: number; accent: string }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs tracking-wide font-semibold text-muted-foreground">{label}</span>
        <span className="text-sm font-bold tabular-nums">{display}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", accent)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, positive, negative }: { icon: any; label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", positive && "text-success", negative && "text-destructive", !positive && !negative && "text-muted-foreground")} />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold tabular-nums truncate">{value}</div>
      </div>
    </div>
  );
}
