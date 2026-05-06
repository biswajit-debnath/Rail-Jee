'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import Navbar from '@/components/common/Navbar';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { emitExternalApiError } from '@/lib/externalApiError';
import { apiFetch, ApiError } from '@/lib/apiUtil';
import { createClient } from '@/lib/supabase/client';

const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

interface Department {
  id: string;
  departmentId?: string;
  name: string;
  fullName: string;
  description: string;
  icon: React.ReactNode;
  color: {
    gradient: string;
    bg: string;
  };
  paperCount: number;
  materialCount: number;
  hasAccess: boolean;
}

// ─── Department Color Palette ────────────────────────────────────────
// Keyed by department slug. Curated for a professional, cohesive grid.
//
// Palette logic:
//   Technical/Engineering → warm tones (red, amber, orange, rose)
//   Operations/Transport  → blue family (blue, indigo, sky)
//   Admin/Support         → cool/neutral tones (slate, emerald, teal, violet)
//   Misc/Fallback         → neutral gray-blue
// ─────────────────────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, { gradient: string; bg: string }> = {
  // ── Technical / Engineering ──
  mechanical:       { gradient: 'from-rose-700 to-red-900',       bg: 'bg-rose-50' },
  electrical:       { gradient: 'from-amber-600 to-orange-800',   bg: 'bg-amber-50' },
  civil:            { gradient: 'from-orange-700 to-red-800',     bg: 'bg-orange-50' },
  'signal-telecom': { gradient: 'from-sky-600 to-blue-800',       bg: 'bg-sky-50' },

  // ── Operations / Transport ──
  operating:        { gradient: 'from-blue-700 to-indigo-900',    bg: 'bg-blue-50' },
  commercial:       { gradient: 'from-indigo-600 to-indigo-800',  bg: 'bg-indigo-50' },

  // ── Admin / Support / Services ──
  accounts:         { gradient: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-50' },
  personnel:        { gradient: 'from-violet-600 to-purple-800',   bg: 'bg-violet-50' },
  stores:           { gradient: 'from-teal-600 to-teal-800',       bg: 'bg-teal-50' },
  medical:          { gradient: 'from-red-600 to-rose-800',        bg: 'bg-red-50' },
  security:         { gradient: 'from-slate-600 to-slate-800',     bg: 'bg-slate-50' },
  legal:            { gradient: 'from-zinc-600 to-zinc-800',       bg: 'bg-zinc-50' },

  // ── Catch-all ──
  others:           { gradient: 'from-stone-600 to-stone-800',     bg: 'bg-stone-50' },
};

const FALLBACK_COLOR = { gradient: 'from-stone-600 to-stone-800', bg: 'bg-stone-50' };

function getDeptColor(deptId: string): { gradient: string; bg: string } {
  const id = (deptId || '').toLowerCase().trim();
  return DEPT_COLORS[id] ?? FALLBACK_COLOR;
}

function mapDepartments(raw: any[]): Department[] {
  return raw.map((dept) => {
    const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
    return {
      id: deptId,
      name: dept.name || dept.fullName || 'Department',
      fullName: dept.fullName || dept.name || 'Department',
      description: dept.description || 'Department description',
      icon: getDepartmentIcon(deptId),
      color: getDeptColor(deptId),
      paperCount: dept.paperCount || 0,
      materialCount: dept.materialCount || 0,
      departmentId: dept.departmentId,
      hasAccess: dept.hasAccess || false,
    };
  });
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentBanner, setShowPaymentBanner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  // Check for payment success query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        setShowPaymentBanner(true);
        window.history.replaceState({}, '', '/departments');
        setTimeout(() => setShowPaymentBanner(false), 10000);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Check if returning from payment
        const params = new URLSearchParams(window.location.search);
        const paymentSuccess = params.get('payment') === 'success';
        const purchasedDeptId = params.get('dept');
        
        // Skip cache if returning from payment, otherwise use cache
        if (!paymentSuccess) {
          const cached = departmentCache.get();
          if (cached?.departments && cached.departments.length > 0) {
            setDepartments(mapDepartments(cached.departments));
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data from API
        const apiData = await apiFetch(API_ENDPOINTS.DEPARTMENTS, { requireAuth: false });
        const raw = apiData.data || [];

        // Optimistic update: If backend webhook hasn't processed yet, 
        // manually set hasAccess for the purchased department
        if (paymentSuccess && purchasedDeptId) {
          const pendingDept = raw.find((d: any) => 
            d.slug === purchasedDeptId || 
            d.id === purchasedDeptId || 
            d.departmentId === purchasedDeptId
          );
          
          if (pendingDept && !pendingDept.hasAccess) {
            // Backend hasn't updated yet, optimistically set access
            pendingDept.hasAccess = true;
            console.log(`Optimistically granting access to ${purchasedDeptId}`);
          }
          
          // Clean up pending subscription marker
          sessionStorage.removeItem('pending_subscription');
        }

        departmentCache.set({ departments: raw });
        setDepartments(mapDepartments(raw));
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          console.log('Viewing departments without authentication');
          setError(null);
          return;
        }
        setError((err as Error).message || 'Failed to load departments');
        emitExternalApiError();
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentClick = (e: React.MouseEvent<HTMLAnchorElement>, deptId: string) => {
    if (isAuthenticated === false) {
      e.preventDefault();
      router.push(`/auth/signin?redirect=/departments/${deptId}`);
    }
  };

  if (loading) {
    return (
      <>
        <LoadingScreen
          isLoading={true}
          message="Loading departments..."
          animationPath="/animation/Trainbasic.lottie/a/Scene.json"
        />
        <div className="min-h-screen bg-[#faf9f7]" />
      </>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#faf9f7]" />;
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar
        variant="departments"
        title="Select Department"
        subtitle="Choose your preparation area"
        backHref="/"
      />

      {/* Payment Success Banner */}
      {showPaymentBanner && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg flex items-start gap-3 animate-slide-down">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                Payment Successful!
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                Your subscription is being activated. You&apos;ll have access to premium content within a few moments.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentBanner(false)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Title */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-2 sm:mb-3">
            What are you preparing for?
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto px-4">
            Select your department to access specialized practice tests and study materials
          </p>
        </div>

        {/* Animated Train SVG */}
        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <img
            src="/images/train-svg.svg"
            alt="Train"
            className="h-14 lg:h-24 w-auto mx-auto"
            style={{
              filter: 'brightness(0) saturate(100%) invert(27%) sepia(93%) saturate(2345%) hue-rotate(346deg) brightness(93%) contrast(101%)',
            }}
          />
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 pb-6">
          {departments.map((dept, index) => {
            const isSubscribed = dept.hasAccess;

            return (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                onClick={(e) => handleDepartmentClick(e, dept.id)}
                className="bounce-card group relative overflow-hidden rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 active:opacity-50"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  boxShadow: '0 8px 20px -4px rgba(0,0,0,0.25), 0 12px 25px -5px rgba(0,0,0,0.15)',
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.color.gradient}`} />

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[90px] sm:min-h-[130px] lg:min-h-[140px]">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-0.5 sm:mb-1">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight">
                        {dept.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1 py-px sm:px-2 sm:py-0.5 text-[7px] sm:text-[10px] font-semibold uppercase tracking-tight sm:tracking-wide border shadow-sm whitespace-nowrap ${
                          isSubscribed
                            ? 'bg-emerald-500/90 border-emerald-300/80 text-white shadow-emerald-900/20'
                            : 'bg-white/20 border-white/30 text-white/90 backdrop-blur-sm'
                        }`}
                      >
                        {isSubscribed ? (
                          <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 11V8.5a4 4 0 118 0V11" />
                            <rect x="5" y="11" width="14" height="10" rx="2.5" strokeWidth={1.8} />
                            <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
                          </svg>
                        )}
                        {isSubscribed ? 'Subscribed' : 'Preview'}
                      </span>
                    </div>
                    <p className="text-white/70 text-xxs sm:text-xs line-clamp-2">
                      {dept.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-1.5 sm:mt-3 lg:mt-4">
                    <div className="w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
                      <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                    <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-yellow-400/80 bg-white/90 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <div className="text-red-700 scale-50 sm:scale-90 lg:scale-100">
                        {dept.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}