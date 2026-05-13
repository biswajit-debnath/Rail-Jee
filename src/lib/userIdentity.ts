/**
 * User Identity Helper
 *
 * Resolves the backend "business" user id (e.g. "user-96hgtTtp") that is
 * required by the new exam stats / history endpoints:
 *   GET /business/v1/exams/stats/:userId
 *   GET /business/v1/exams/history/:userId
 *
 * Strategy:
 *   1. Return the in-memory cached value if present.
 *   2. Else read from sessionStorage (survives across page navigations).
 *   3. Else fetch from the backend `/business/v1/users/me` endpoint and cache.
 *
 * The backend resolves the user from the Supabase JWT in the Authorization
 * header (already attached by `apiFetch`).
 */

import { API_ENDPOINTS } from './apiConfig';
import { apiFetch, ApiError } from './apiUtil';

const STORAGE_KEY = 'railji_business_user_id';

let memoryCache: string | null = null;

/**
 * Try to extract a business userId (string starting with "user-") from an
 * arbitrary backend response shape. Backends commonly return either
 *   { data: { userId: "user-..." } }, or
 *   { data: { id: "user-..." } }, or
 *   { data: { _id: "user-..." } }.
 */
function pickUserId(payload: any): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const candidates: unknown[] = [
    payload.userId,
    payload.id,
    payload._id,
    payload.data?.userId,
    payload.data?.id,
    payload.data?._id,
    payload.user?.userId,
    payload.user?.id,
    payload.user?._id,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c;
  }
  return null;
}

export class UserIdentityError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'UserIdentityError';
  }
}

export function getCachedBusinessUserId(): string | null {
  if (memoryCache) return memoryCache;
  if (typeof window === 'undefined') return null;
  try {
    const v = window.sessionStorage.getItem(STORAGE_KEY);
    if (v) {
      memoryCache = v;
      return v;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function setCachedBusinessUserId(userId: string): void {
  memoryCache = userId;
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, userId);
    } catch {
      /* ignore quota errors */
    }
  }
}

export function clearCachedBusinessUserId(): void {
  memoryCache = null;
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Resolve the business userId for the currently authenticated user.
 * Throws `ApiError` (401/403) if the session is missing/expired,
 * or `UserIdentityError` if the response shape is unexpected.
 */
export async function getCurrentBusinessUserId(): Promise<string> {
  const cached = getCachedBusinessUserId();
  if (cached) return cached;

  let payload: any;
  try {
    payload = await apiFetch(API_ENDPOINTS.USERS_ME, { requireAuth: true });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new UserIdentityError('Failed to fetch user profile', err);
  }

  const userId = pickUserId(payload);
  if (!userId) {
    throw new UserIdentityError(
      'Backend did not return a business userId in /users/me response'
    );
  }

  setCachedBusinessUserId(userId);
  return userId;
}
