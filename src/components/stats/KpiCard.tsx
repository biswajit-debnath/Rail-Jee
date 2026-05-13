import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  caption?: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "info" | "warm";
  trend?: { value: number; positive: boolean };
}

const variantStyles: Record<NonNullable<KpiCardProps["variant"]>, string> = {
  primary: "bg-[image:var(--gradient-primary)]",
  success: "bg-[image:var(--gradient-success)]",
  info: "bg-[image:var(--gradient-info)]",
  warm: "bg-[image:var(--gradient-warm)]",
};

export function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
  variant = "primary",
  trend,
}: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl bg-primary group-hover:opacity-20 transition-opacity" />
      <div className="p-5 sm:p-6 relative">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shadow-md text-white",
              variantStyles[variant],
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                trend.positive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {trend.positive ? "▲" : "▼"} {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </div>
          <div className="text-sm tracking-wide text-muted-foreground mt-2 font-semibold">
            {label}
          </div>
          {caption && (
            <div className="text-xs text-muted-foreground/80 mt-1">{caption}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
