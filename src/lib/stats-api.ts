// src/lib/stats-api.ts
// RailJee Stats API client (Next.js / production).
//
// IMPORTANT: This module no longer reads credentials from localStorage.
// The caller (stats page) MUST pass a fresh Supabase access token + business
// userId on every request. This guarantees we always use a non-expired token
// and works with the project's existing auth flow.

import { API_ENDPOINTS } from "./apiConfig";

// ---------- Types ----------
export interface PaperCodeStats {
  paperCode: string;
  totalExams: number;
  averageScore: string;
  averagePercentage: string;
  averageAccuracy: string;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  totalAttemptedQuestions: number;
  totalUnattemptedQuestions: number;
  totalTimeTaken: { hours: number; minutes: number; seconds: number };
  passedCount: number;
  failedCount: number;
  passRate: string;
}

export interface DepartmentStats {
  departmentId: string;
  totalExams: number;
  averageScore: string;
  averagePercentage: string;
  averageAccuracy: string;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  totalAttemptedQuestions: number;
  totalUnattemptedQuestions: number;
  totalTimeTaken: { hours: number; minutes: number; seconds: number };
  passedCount: number;
  failedCount: number;
  passRate: string;
  paperCodeStats: PaperCodeStats[];
}

export interface UserExamStats {
  totalExams: number;
  totalDepartments: number;
  departmentExams: DepartmentStats[];
  /** General/cross-department papers (Computer, GK, Hindi etc.) */
  generalExams?: PaperCodeStats[];
  /** Computed: departmentExams + synthetic General department (if any). */
  allDepartments: DepartmentStats[];
}

export interface ExamHistoryRecord {
  _id: string;
  examId: string;
  paperId: string;
  paperName: string;
  paperCode?: string;
  paperType: "full" | "sectional" | "general" | string;
  departmentId: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeTaken: { hours: number; minutes: number; seconds: number };
  isPassed: boolean;
  passPercentage: number;
  createdAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const GENERAL_DEPT_ID = "general";

export interface AuthCreds {
  token: string;
  userId: string;
  /** Optional AbortSignal — wire React Query / unmount cancellation here. */
  signal?: AbortSignal;
}

// ---------- HTTP ----------
async function apiGet<T>(url: string, creds: AuthCreds): Promise<T> {
  if (!creds?.token) throw new Error("Not signed in");
  if (!creds?.userId) throw new Error("Missing business user id");

  const res = await fetch(url, {
    headers: {
      accept: "*/*",
      authorization: `Bearer ${creds.token}`,
    },
    signal: creds.signal,
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

// ---------- Synthetic "General" department ----------
function buildGeneralDepartment(
  generalExams: PaperCodeStats[] | undefined,
): DepartmentStats | null {
  const list = Array.isArray(generalExams) ? generalExams.filter(Boolean) : [];
  if (list.length === 0) return null;

  let totalExams = 0;
  let correct = 0;
  let incorrect = 0;
  let attempted = 0;
  let unattempted = 0;
  let passed = 0;
  let failed = 0;
  let scoreSum = 0;
  let pctSum = 0;
  let accSum = 0;
  let weightDen = 0;
  let secs = 0;

  for (const p of list) {
    const ex = p.totalExams || 0;
    totalExams += ex;
    correct += p.totalCorrectAnswers || 0;
    incorrect += p.totalIncorrectAnswers || 0;
    attempted += p.totalAttemptedQuestions || 0;
    unattempted += p.totalUnattemptedQuestions || 0;
    passed += p.passedCount || 0;
    failed += p.failedCount || 0;
    scoreSum += num(p.averageScore) * ex;
    pctSum += num(p.averagePercentage) * ex;
    accSum += num(p.averageAccuracy) * ex;
    weightDen += ex;
    secs += totalSeconds(p.totalTimeTaken);
  }

  const w = weightDen || 1;
  return {
    departmentId: GENERAL_DEPT_ID,
    totalExams,
    averageScore: (scoreSum / w).toFixed(2),
    averagePercentage: (pctSum / w).toFixed(2),
    averageAccuracy: (accSum / w).toFixed(2),
    totalCorrectAnswers: correct,
    totalIncorrectAnswers: incorrect,
    totalAttemptedQuestions: attempted,
    totalUnattemptedQuestions: unattempted,
    totalTimeTaken: {
      hours: Math.floor(secs / 3600),
      minutes: Math.floor((secs % 3600) / 60),
      seconds: secs % 60,
    },
    passedCount: passed,
    failedCount: failed,
    passRate:
      totalExams > 0 ? ((passed / totalExams) * 100).toFixed(2) : "0.00",
    paperCodeStats: list,
  };
}

// ---------- Public API ----------
export async function fetchUserStats(creds: AuthCreds): Promise<UserExamStats> {
  const r = await apiGet<ApiEnvelope<Omit<UserExamStats, "allDepartments">>>(
    API_ENDPOINTS.USER_EXAM_STATS(creds.userId),
    creds,
  );
  const data = r.data ?? ({} as UserExamStats);
  const departmentExams = Array.isArray(data.departmentExams)
    ? data.departmentExams
    : [];
  const generalExams = Array.isArray(data.generalExams)
    ? data.generalExams
    : [];
  const general = buildGeneralDepartment(generalExams);
  const allDepartments = general
    ? [...departmentExams, general]
    : [...departmentExams];
  return {
    totalExams: data.totalExams ?? 0,
    totalDepartments: data.totalDepartments ?? departmentExams.length,
    departmentExams,
    generalExams,
    allDepartments,
  };
}

export async function fetchExamHistory(creds: AuthCreds, limit = 20) {
  const r = await apiGet<
    ApiEnvelope<{ exams: ExamHistoryRecord[]; total: number }>
  >(API_ENDPOINTS.USER_EXAM_HISTORY(creds.userId, `?limit=${limit}`), creds);
  const exams = (r.data?.exams ?? []).map((e) => ({
    ...e,
    departmentId: e.paperType === "general" ? GENERAL_DEPT_ID : e.departmentId,
  }));
  return { exams, total: r.data?.total ?? exams.length };
}

// ---------- Helpers ----------
export const num = (v: string | number | undefined | null): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export const fmtPct = (v: string | number) => `${num(v).toFixed(1)}%`;

export const fmtTime = (t?: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  if (!t) return "0s";
  const { hours: h, minutes: m, seconds: s } = t;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const totalSeconds = (t?: {
  hours: number;
  minutes: number;
  seconds: number;
}) => (t ? t.hours * 3600 + t.minutes * 60 + t.seconds : 0);

export const prettyDept = (id: string) =>
  id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
