'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import {
  STATS_DEPARTMENTS,
  getMockExamAttempts,
  computeOverviewStats,
  computePaperStats,
  formatTimeTaken,
  getDepartmentName,
} from '@/lib/mockStatsData';
import type {
  ExamAttemptRecord,
  PaperStats,
} from '@/lib/statsTypes';

// ====================== SHORT NAME MAP ======================
const DEPT_SHORT: Record<string, string> = {
  all: 'All Departments',
  DEPT001: 'Civil',
  DEPT002: 'Mechanical',
  DEPT003: 'Electrical',
  DEPT004: 'Commercial',
  DEPT007: 'S&T',
  GENERAL: 'GK',
};

const DEPT_TAB_ICONS: Record<string, string> = {
  DEPT001: '🏗️',
  DEPT002: '⚙️',
  DEPT003: '⚡',
  DEPT004: '📊',
  DEPT007: '📡',
  GENERAL: '📚',
};

// ====================== HELPER FUNCTIONS ======================

function computeStreak(attempts: ExamAttemptRecord[]): number {
  if (attempts.length === 0) return 0;
  const dateSet = new Set<string>();
  attempts.forEach(a => {
    const d = new Date(a.createdAt);
    dateSet.add(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    );
  });
  const sortedDates = Array.from(dateSet).sort().reverse();
  let streak = 0;
  const start = new Date(sortedDates[0] + 'T00:00:00Z');
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() - i);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    if (dateSet.has(key)) streak++;
    else break;
  }
  return streak;
}

function computeImprovement(attempts: ExamAttemptRecord[]): number | null {
  if (attempts.length < 4) return null;
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const mid = Math.ceil(sorted.length / 2);
  const earlyAvg = sorted.slice(0, mid).reduce((s, a) => s + a.percentage, 0) / mid;
  const recentAvg =
    sorted.slice(mid).reduce((s, a) => s + a.percentage, 0) / (sorted.length - mid);
  return Math.round(recentAvg - earlyAvg);
}

function computeWeeklyTrend(
  attempts: ExamAttemptRecord[]
): { week: string; avgScore: number }[] {
  if (attempts.length === 0) return [];
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const firstDate = new Date(sorted[0].createdAt).getTime();
  const weekMap = new Map<number, number[]>();
  sorted.forEach(a => {
    const weekNum = Math.floor(
      (new Date(a.createdAt).getTime() - firstDate) / (7 * 86400000)
    );
    if (!weekMap.has(weekNum)) weekMap.set(weekNum, []);
    weekMap.get(weekNum)!.push(a.percentage);
  });
  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([w, scores]) => ({
      week: `Week ${w + 1}`,
      avgScore: scores.reduce((s, v) => s + v, 0) / scores.length,
    }));
}

// ====================== SVG CHART COMPONENTS ======================

/** Score trend line chart — weekly averages */
function ScoreProgressionChart({
  data,
}: {
  data: { week: string; avgScore: number }[];
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  if (data.length === 0) return null;

  const W = 500,
    H = 200;
  const PAD_X = 45,
    PAD_Y = 20;
  const plotW = W - PAD_X * 2,
    plotH = H - PAD_Y * 2;
  const maxY = 100;

  const points = data.map((d, i) => ({
    x:
      PAD_X +
      (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2),
    y: PAD_Y + plotH - (d.avgScore / maxY) * plotH,
    ...d,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD_Y + plotH} L${points[0].x},${PAD_Y + plotH} Z`;

  const gridLines = [0, 25, 50, 75, 100].map(pct => ({
    y: PAD_Y + plotH - (pct / maxY) * plotH,
    label: pct,
  }));

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H + 30}`}
        className="w-full"
        style={{ maxHeight: 220 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaGradProg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD_X}
              y1={g.y}
              x2={W - PAD_X}
              y2={g.y}
              stroke="#e7e5e4"
              strokeWidth="0.8"
              strokeDasharray="3,3"
            />
            <text
              x={PAD_X - 6}
              y={g.y + 1}
              fill="#a8a29e"
              fontSize="11"
              textAnchor="end"
            >
              {g.label}
            </text>
          </g>
        ))}
        {/* Area */}
        <path d={areaPath} fill="url(#areaGradProg)" />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? '5.5' : '4'}
              fill="white"
              stroke="#f97316"
              strokeWidth="2"
            />
          </g>
        ))}
        {/* Week labels */}
        {points.map((p, i) => (
          <text
            key={`lbl-${i}`}
            x={p.x}
            y={PAD_Y + plotH + 18}
            fill="#a8a29e"
            fontSize="11"
            textAnchor="middle"
          >
            {p.week}
          </text>
        ))}
        {/* Hover tooltip */}
        {hoveredIdx !== null &&
          (() => {
            const p = points[hoveredIdx];
            const tW = 70,
              tH = 24;
            const tX = Math.min(Math.max(p.x - tW / 2, 2), W - 2 - tW);
            const tY = p.y - tH - 8 < PAD_Y ? p.y + 8 : p.y - tH - 8;
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tX}
                  y={tY}
                  width={tW}
                  height={tH}
                  rx="4"
                  fill="#1c1917"
                  opacity="0.9"
                />
                <text
                  x={tX + tW / 2}
                  y={tY + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="white"
                  fontWeight="600"
                >
                  {p.avgScore.toFixed(1)}%
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}

/** Radar / spider chart for section-wise performance */
function RadarChart({
  data,
}: {
  data: { name: string; percentage: number }[];
}) {
  const n = data.length;
  if (n < 3)
    return (
      <p className="text-xs text-stone-400 text-center py-8">
        Need at least 3 papers for radar chart
      </p>
    );

  const cx = 150,
    cy = 150,
    R = 95;
  const angles = data.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
  // 5 rings: 20%, 40%, 60%, 80%, 100%
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
  const ringLabels = [20, 40, 60, 80, 100];

  const pts = data.map((d, i) => {
    const pct = Math.min(d.percentage, 100) / 100;
    return {
      x: cx + Math.cos(angles[i]) * R * pct,
      y: cy + Math.sin(angles[i]) * R * pct,
    };
  });
  const polygon = pts.map(p => `${p.x},${p.y}`).join(' ');

  const labelR = R + 26;

  return (
    <svg viewBox="0 0 300 300" className="w-full" style={{ maxHeight: 260 }}>
      {/* Alternating ring fills */}
      {rings.map((ring, ri) => (
        <polygon
          key={`fill-${ri}`}
          points={Array.from(
            { length: n },
            (_, j) =>
              `${cx + Math.cos(angles[j]) * R * ring},${cy + Math.sin(angles[j]) * R * ring}`
          ).join(' ')}
          fill={ri % 2 === 0 ? 'rgba(231,229,228,0.45)' : 'rgba(255,255,255,0.6)'}
          stroke="none"
        />
      ))}
      {/* Ring outlines */}
      {rings.map((ring, ri) => (
        <polygon
          key={`ring-${ri}`}
          points={Array.from(
            { length: n },
            (_, j) =>
              `${cx + Math.cos(angles[j]) * R * ring},${cy + Math.sin(angles[j]) * R * ring}`
          ).join(' ')}
          fill="none"
          stroke="#c4c0bb"
          strokeWidth="0.9"
        />
      ))}
      {/* Axis lines */}
      {angles.map((angle, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(angle) * R}
          y2={cy + Math.sin(angle) * R}
          stroke="#c4c0bb"
          strokeWidth="0.8"
        />
      ))}
      {/* Data polygon fill */}
      <polygon
        points={polygon}
        fill="rgba(249,115,22,0.22)"
        stroke="none"
      />
      {/* Data polygon stroke */}
      <polygon
        points={polygon}
        fill="none"
        stroke="#f97316"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Ring percentage labels along the top axis */}
      {rings.map((ring, ri) => {
        const labelAngle = -Math.PI / 2; // top axis
        const lx = cx + Math.cos(labelAngle) * R * ring + 3;
        const ly = cy + Math.sin(labelAngle) * R * ring - 1;
        return (
          <text
            key={`label-${ri}`}
            x={lx}
            y={ly}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize="7"
            fill="#a8a29e"
          >
            {ringLabels[ri]}
          </text>
        );
      })}
      {/* Axis labels */}
      {data.map((d, i) => {
        const lx = cx + Math.cos(angles[i]) * labelR;
        const ly = cy + Math.sin(angles[i]) * labelR;
        const name = d.name.length > 20 ? d.name.slice(0, 19) + '…' : d.name;
        // Split long names into two lines
        const words = name.split(' ');
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            fill="#57534e"
            fontWeight="500"
          >
            {line2 ? (
              <>
                <tspan x={lx} dy="-5">{line1}</tspan>
                <tspan x={lx} dy="11">{line2}</tspan>
              </>
            ) : (
              name
            )}
          </text>
        );
      })}
    </svg>
  );
}

/** Donut chart for pass/fail ratio */
function DonutChart({
  passed,
  failed,
}: {
  passed: number;
  failed: number;
}) {
  const total = passed + failed;
  if (total === 0) return null;
  const passPct = passed / total;
  const failPct = 1 - passPct;
  const r = 42;
  const sw = 14;
  const c = 2 * Math.PI * r;
  // Add a small gap between segments (2% of circumference)
  const gap = c * 0.015;
  const passArc = c * passPct - gap;
  const failArc = c * failPct - gap;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 110 110"
        className="w-full h-auto max-w-[190px]"
      >
        {/* Failed (red) arc */}
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#ef4444"
          strokeWidth={sw}
          strokeDasharray={`${failArc} ${c - failArc}`}
          strokeDashoffset={-(c * passPct + gap / 2)}
          strokeLinecap="butt"
          transform="rotate(-90 55 55)"
        />
        {/* Passed (green) arc */}
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={sw}
          strokeDasharray={`${passArc} ${c - passArc}`}
          strokeDashoffset={gap / 2}
          strokeLinecap="butt"
          transform="rotate(-90 55 55)"
        />
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
          <span className="text-sm text-stone-600 font-medium">Passed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
          <span className="text-sm text-stone-600 font-medium">Failed</span>
        </div>
      </div>
      {/* Pass rate */}
      <div className="text-center">
        <p className="text-3xl font-bold text-stone-900">{Math.round(passPct * 100)}%</p>
        <p className="text-xs text-stone-500 mt-0.5">Overall Pass Rate</p>
      </div>
    </div>
  );
}

// ====================== MAIN COMPONENT ======================

export default function StatsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedDept, setSelectedDept] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [allRealAttempts, setAllRealAttempts] = useState<ExamAttemptRecord[]>(
    []
  );
  const [expandedPaper, setExpandedPaper] = useState<string | null>('__all__');
  const [expandedStrong, setExpandedStrong] = useState<string | null>(null);
  const [expandedWeak, setExpandedWeak] = useState<string | null>(null);


  // Auto-select first active dept once data loads
  useEffect(() => {
    if (allRealAttempts.length > 0 && selectedDept === 'all') {
      const ids = new Set(allRealAttempts.map(a => a.departmentId));
      const first = STATS_DEPARTMENTS.find(d => d.id !== 'all' && ids.has(d.id));
      if (first) setSelectedDept(first.id);
    }
  }, [allRealAttempts]);

  // Fetch data
  useEffect(() => {
    async function fetchUserAttempts() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setAllRealAttempts(getMockExamAttempts());
          setUsingMockData(true);
          setIsLoaded(true);
          return;
        }
        const response = await fetch(API_ENDPOINTS.USER_EXAM_ATTEMPTS(user.id));
        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        const attempts: ExamAttemptRecord[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        const submitted = attempts
          .filter(a => a.status === 'submitted')
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setAllRealAttempts(submitted);
      } catch {
        setAllRealAttempts(getMockExamAttempts());
        setUsingMockData(true);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchUserAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived data
  const attempts = useMemo(() => {
    if (selectedDept === 'all') return allRealAttempts;
    return allRealAttempts.filter(a => a.departmentId === selectedDept);
  }, [allRealAttempts, selectedDept]);

  const overview = useMemo(() => computeOverviewStats(attempts), [attempts]);
  const papers = useMemo(() => computePaperStats(attempts), [attempts]);
  const streak = useMemo(
    () => computeStreak(allRealAttempts),
    [allRealAttempts]
  );
  const improvement = useMemo(() => computeImprovement(attempts), [attempts]);
  const weeklyTrend = useMemo(() => computeWeeklyTrend(attempts), [attempts]);

  const activeDepts = useMemo(() => {
    const ids = new Set(allRealAttempts.map(a => a.departmentId));
    return STATS_DEPARTMENTS.filter(d => d.id !== 'all' && ids.has(d.id));
  }, [allRealAttempts]);
  // Radar data: paper averages for the selected department
  const radarData = useMemo(
    () =>
      papers
        .sort((a, b) => b.averagePercentage - a.averagePercentage)
        .slice(0, 6)
        .map(p => ({
          name:
            p.paperName.length > 20
              ? p.paperName.slice(0, 19) + '…'
              : p.paperName,
          percentage: p.averagePercentage,
        })),
    [papers]
  );

  // Strong: avg >= 50%, sorted desc
  const strongAreas = useMemo(
    () =>
      papers
        .filter(p => p.averagePercentage >= 50)
        .sort((a, b) => b.averagePercentage - a.averagePercentage)
        .slice(0, 5),
    [papers]
  );

  // Weak: avg < 50%, sorted asc
  const weakAreas = useMemo(
    () =>
      papers
        .filter(p => p.averagePercentage < 50)
        .sort((a, b) => a.averagePercentage - b.averagePercentage)
        .slice(0, 5),
    [papers]
  );

  const totalMinutes = useMemo(() => {
    const ts = overview.totalTimeSpent;
    return ts.hours * 60 + ts.minutes + Math.round(ts.seconds / 60);
  }, [overview]);

  const totalHoursDisplay = useMemo(() => {
    const ts = overview.totalTimeSpent;
    if (ts.hours > 0) return `${ts.hours}h`;
    return `${ts.minutes}m`;
  }, [overview]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="animate-pulse text-stone-400">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ==================== HEADER ==================== */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <svg
                className="w-5 h-5 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900">
                My Performance
              </h1>
              <p className="text-xs text-stone-500">
                Rail Jee · Exam Analytics Dashboard
              </p>
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full">
              <span className="text-base">🔥</span>
              <span className="text-sm font-semibold text-orange-700">
                {streak} day streak
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ==================== DEPARTMENT TABS ==================== */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {activeDepts.map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.id);
                  setExpandedPaper('__all__');
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium flex items-center gap-1.5 ${
                  selectedDept === dept.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200/50'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{DEPT_TAB_ICONS[dept.id] || '📄'}</span>
                {DEPT_SHORT[dept.id] || dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Mock data notice */}
        {usingMockData && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Showing demo data — your real stats will appear once the stats API is
            live.
          </div>
        )}

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Attempts */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-orange-100 font-medium">
              Total Attempts
            </p>
            <p className="text-3xl font-bold mt-1">{overview.totalAttempts}</p>
            <p className="text-xs text-orange-200 mt-1">
              {overview.uniqueExams} unique exams
            </p>
          </div>

          {/* Avg Score */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-xs text-stone-500 font-medium">Avg Score</p>
            <p className="text-3xl font-bold text-stone-900 mt-1">
              {overview.averageScore.toFixed(1)}%
            </p>
            {improvement !== null && (
              <p
                className={`text-xs mt-1 font-medium ${improvement >= 0 ? 'text-green-600' : 'text-red-500'}`}
              >
                {improvement >= 0 ? '↑' : '↓'} {Math.abs(improvement)}% vs
                earlier
              </p>
            )}
          </div>

          {/* Passed */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-green-100 font-medium">Passed</p>
            <p className="text-3xl font-bold mt-1">{overview.totalPassed}</p>
            <p className="text-xs text-green-200 mt-1">
              {overview.passRate.toFixed(0)}% pass rate
            </p>
          </div>

          {/* Time Practiced */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-blue-100 font-medium">Time Practiced</p>
            <p className="text-3xl font-bold mt-1">{totalHoursDisplay}</p>
            <p className="text-xs text-blue-200 mt-1">
              {totalMinutes} minutes total
            </p>
          </div>
        </div>

        {/* ============ CHARTS ROW: Score Progression + Radar ============ */}
        {overview.totalAttempts > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Progression */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col" style={{ minHeight: 420 }}>
              <h3 className="font-bold text-lg text-stone-900">Score Progression</h3>
              <p className="text-sm text-stone-500 mb-4">
                Your average score trend over time
              </p>
              <div className="flex-1 flex items-center">
                <ScoreProgressionChart data={weeklyTrend} />
              </div>
            </div>

            {/* Section-wise Performance (Radar) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col" style={{ minHeight: 320 }}>
              <h3 className="font-bold text-lg text-stone-900">
                Section-wise Performance
              </h3>
              <p className="text-sm text-stone-500 mb-2">
                Radar view of your strengths across sections
              </p>
              <div className="flex-1 flex items-center justify-center">
                <RadarChart data={radarData} />
              </div>
            </div>
          </div>
        )}



        {/* ============ PASS/FAIL + STRONG + WEAK — 3 Column ============ */}
        {overview.totalAttempts > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="font-bold text-lg text-stone-900">Pass / Fail Ratio</h3>
              <p className="text-sm text-stone-500 mb-5">
                Overall attempt outcomes
              </p>
              <DonutChart
                passed={overview.totalPassed}
                failed={overview.totalAttempts - overview.totalPassed}
              />
            </div>

            {/* Strong Areas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </span>
                <h3 className="font-bold text-lg text-stone-900">Strong Areas</h3>
              </div>
              {strongAreas.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  Take more exams to see your strengths
                </p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {strongAreas.map(paper => {
                    const deptName =
                      DEPT_SHORT[paper.departmentId] ||
                      getDepartmentName(paper.departmentId);
                    const isExpanded =
                      expandedStrong ===
                      paper.paperId + paper.departmentId;
                    return (
                      <div
                        key={paper.paperId + paper.departmentId}
                        className="border border-green-100 bg-green-50/30 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedStrong(
                              isExpanded
                                ? null
                                : paper.paperId + paper.departmentId
                            )
                          }
                          className="w-full p-3 text-left hover:bg-green-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-stone-800 text-sm truncate">
                                {paper.paperName}
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {deptName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  {paper.averagePercentage.toFixed(0)}%
                                </p>
                                <p className="text-[10px] text-stone-400">
                                  Best: {paper.bestPercentage.toFixed(0)}%
                                </p>
                              </div>
                              <svg
                                className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3 space-y-1.5 border-t border-green-100">
                            {paper.attempts
                              .slice()
                              .reverse()
                              .map((a, i) => (
                                <div
                                  key={a._id}
                                  className="flex items-center justify-between text-xs py-1.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                        a.isPassed
                                          ? 'bg-green-500 text-white'
                                          : 'bg-stone-200 text-stone-600'
                                      }`}
                                    >
                                      #{paper.attempts.length - i}
                                    </span>
                                    <span className="text-stone-500">
                                      {formatDate(a.createdAt)}
                                    </span>
                                  </div>
                                  <span
                                    className={`font-semibold ${a.isPassed ? 'text-green-600' : 'text-stone-600'}`}
                                  >
                                    {a.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weak Areas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </span>
                <h3 className="font-bold text-lg text-stone-900">
                  Weak Areas — Needs Practice
                </h3>
              </div>
              {weakAreas.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  Great job! No weak areas detected
                </p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {weakAreas.map(paper => {
                    const deptName =
                      DEPT_SHORT[paper.departmentId] ||
                      getDepartmentName(paper.departmentId);
                    const isExpanded =
                      expandedWeak ===
                      paper.paperId + paper.departmentId;
                    const passRate =
                      paper.attempts.length > 0
                        ? Math.round(
                            (paper.attempts.filter(a => a.isPassed).length /
                              paper.attempts.length) *
                              100
                          )
                        : 0;
                    return (
                      <div
                        key={paper.paperId + paper.departmentId}
                        className="border border-red-100 bg-red-50/30 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedWeak(
                              isExpanded
                                ? null
                                : paper.paperId + paper.departmentId
                            )
                          }
                          className="w-full p-3 text-left hover:bg-red-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-stone-800 text-sm truncate">
                                {paper.paperName}
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {deptName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <div className="text-right">
                                <p className="text-lg font-bold text-red-500">
                                  {paper.averagePercentage.toFixed(0)}%
                                </p>
                                <p className="text-[10px] text-stone-400">
                                  Pass: {passRate}%
                                </p>
                              </div>
                              {/* Retry icon */}
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  router.push('/departments');
                                }}
                                className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors"
                                title="Retake"
                              >
                                <svg
                                  className="w-3.5 h-3.5 text-orange-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              </button>
                              <svg
                                className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3 space-y-1.5 border-t border-red-100">
                            {paper.attempts
                              .slice()
                              .reverse()
                              .map((a, i) => (
                                <div
                                  key={a._id}
                                  className="flex items-center justify-between text-xs py-1.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                        a.isPassed
                                          ? 'bg-green-500 text-white'
                                          : 'bg-stone-200 text-stone-600'
                                      }`}
                                    >
                                      #{paper.attempts.length - i}
                                    </span>
                                    <span className="text-stone-500">
                                      {formatDate(a.createdAt)}
                                    </span>
                                  </div>
                                  <span
                                    className={`font-semibold ${a.isPassed ? 'text-green-600' : 'text-red-500'}`}
                                  >
                                    {a.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ EXAM ATTEMPT HISTORY ============ */}
        {papers.length > 0 && (
          <div>
            <div className="mb-4">
              <h3 className="font-bold text-xl text-stone-900">Exam Attempt History</h3>
              <p className="text-sm text-stone-500 mt-0.5">Detailed results for each paper attempt</p>
            </div>
            <div className="space-y-4">
              {papers.map(paper => {
                const paperKey = paper.paperId + paper.departmentId;
                const isExpanded = expandedPaper === paperKey || expandedPaper === '__all__';
                const deptInfo = STATS_DEPARTMENTS.find(d => d.id === paper.departmentId);
                const deptShort = DEPT_SHORT[paper.departmentId] || deptInfo?.name || '';
                const maxScore = paper.attempts[0]?.maxScore ?? 100;
                const passThreshold = paper.attempts[0]?.passPercentage ?? 40;

                return (
                  <div
                    key={paperKey}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
                  >
                    {/* Paper header — clickable to toggle */}
                    <button
                      onClick={() => setExpandedPaper(isExpanded ? null : paperKey)}
                      className="w-full flex items-center justify-between px-6 py-5 hover:bg-stone-50 transition-colors text-left"
                    >
                      <div>
                        <h4 className="font-bold text-stone-900 text-base">{paper.paperName}</h4>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {deptShort} · {maxScore} marks · Pass: {passThreshold}%+
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                          {paper.totalAttempts} attempt{paper.totalAttempts !== 1 ? 's' : ''}
                        </span>
                        <div
                          onClick={e => { e.stopPropagation(); router.push(`/departments/${paper.departmentId}`); }}
                          className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-200 transition-colors"
                          title="Retry"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <svg
                          className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Attempt rows */}
                    {isExpanded && (
                      <div className="divide-y divide-stone-100 border-t border-stone-100">
                        {paper.attempts
                          .slice()
                          .reverse()
                          .map((attempt, idx) => {
                            const attemptNum = paper.attempts.length - idx;
                            const passed = attempt.isPassed;
                            const scoreColor = passed ? 'text-green-600' : 'text-red-500';
                            const mins = Math.round((attempt.timeTaken?.minutes ?? 0) + (attempt.timeTaken?.seconds ?? 0) / 60);

                            return (
                              <div
                                key={attempt._id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors"
                              >
                                {/* Left: icon + label */}
                                <div className="flex items-center gap-4">
                                  {passed ? (
                                    <div className="w-10 h-10 rounded-full border-[2.5px] border-green-500 flex items-center justify-center flex-shrink-0">
                                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full border-[2.5px] border-red-400 flex items-center justify-center flex-shrink-0">
                                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-stone-800 text-sm">Attempt #{attemptNum}</p>
                                    <p className="text-xs text-stone-400">{formatDate(attempt.createdAt)}</p>
                                  </div>
                                </div>

                                {/* Right: score + time */}
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <p className={`text-xl font-bold ${scoreColor}`}>
                                      {attempt.score.toFixed(0)}/{maxScore}
                                    </p>
                                    <p className="text-xs text-stone-400">{attempt.percentage.toFixed(0)}%</p>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-sm text-stone-400 min-w-[48px]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{mins}m</span>
                                  </div>
                                  <button
                                    onClick={() => router.push(`/exam/result/${attempt.examId}`)}
                                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                                    title="View Result"
                                  >
                                    <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============ EMPTY STATE ============ */}
        {overview.totalAttempts === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">
              No Attempts Yet
            </h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              {selectedDept === 'all'
                ? 'Start taking exams to see your statistics and track your progress!'
                : `No exams attempted in ${STATS_DEPARTMENTS.find(d => d.id === selectedDept)?.name || 'this department'}. Start practicing!`}
            </p>
            <button
              onClick={() => router.push('/departments')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Exams
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
