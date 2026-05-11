/**
 * Department Color Palette
 * Keyed by department slug. Curated for a professional, cohesive grid.
 *
 * Palette logic:
 *   Technical/Engineering → warm tones (red, amber, orange, rose)
 *   Operations/Transport  → blue family (blue, indigo, sky)
 *   Admin/Support         → cool/neutral tones (slate, emerald, teal, violet)
 *   Misc/Fallback         → neutral gray-blue
 */

export interface DeptColor {
  gradient: string;
  bg: string;
}

export const DEPT_COLORS: Record<string, DeptColor> = {
  // ── Technical / Engineering ──
  mechanical:       { gradient: 'from-rose-700 to-red-900',        bg: 'bg-rose-50' },
  electrical:       { gradient: 'from-amber-600 to-orange-800',    bg: 'bg-amber-50' },
  civil:            { gradient: 'from-orange-700 to-red-800',      bg: 'bg-orange-50' },
  'signal-telecom': { gradient: 'from-sky-600 to-blue-800',        bg: 'bg-sky-50' },

  // ── Operations / Transport ──
  operating:        { gradient: 'from-blue-700 to-indigo-900',     bg: 'bg-blue-50' },
  commercial:       { gradient: 'from-indigo-600 to-indigo-800',   bg: 'bg-indigo-50' },

  // ── Admin / Support / Services ──
  accounts:         { gradient: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-50' },
  personnel:        { gradient: 'from-violet-600 to-purple-800',   bg: 'bg-violet-50' },
  stores:           { gradient: 'from-teal-600 to-teal-800',       bg: 'bg-teal-50' },
  medical:          { gradient: 'from-red-600 to-rose-800',        bg: 'bg-red-50' },
  security:         { gradient: 'from-slate-600 to-slate-800',     bg: 'bg-slate-50' },
  legal:            { gradient: 'from-zinc-600 to-zinc-800',       bg: 'bg-zinc-50' },

  // ── Cross-department / Common subjects ──
  general:          { gradient: 'from-fuchsia-600 to-purple-700',  bg: 'bg-fuchsia-50' },

  // ── Catch-all ──
  others:           { gradient: 'from-stone-600 to-stone-800',     bg: 'bg-stone-50' },
};

export const FALLBACK_DEPT_COLOR: DeptColor = {
  gradient: 'from-stone-600 to-stone-800',
  bg: 'bg-stone-50',
};

export function getDeptColor(deptId: string): DeptColor {
  const id = (deptId || '').toLowerCase().trim();
  return DEPT_COLORS[id] ?? FALLBACK_DEPT_COLOR;
}
