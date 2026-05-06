import React from 'react';

type DeptIconKey =
  | 'accounts'
  | 'civil'
  | 'commercial'
  | 'electrical'
  | 'legal'
  | 'mechanical'
  | 'medical'
  | 'operating'
  | 'personnel'
  | 'security'
  | 'signal-telecom'
  | 'stores'
  | 'others';

// SVG path content for each department — size-independent
const ICON_PATHS: Record<DeptIconKey, React.ReactNode> = {
  accounts: (
    <>
      {/* Calculator body */}
      <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Screen */}
      <rect x="7" y="5" width="10" height="4" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 1 buttons */}
      <circle cx="8.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      {/* Row 2 buttons */}
      <circle cx="8.5" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
      {/* Row 3 buttons */}
      <circle cx="8.5" cy="18.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="18.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),

  civil: (
    <>
      {/* Deck */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 16h22" />
      {/* Left tower */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V7" />
      {/* Right tower */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16V7" />
      {/* Left anchor cable */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 11L7 7" />
      {/* Right anchor cable */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 11L17 7" />
      {/* Main catenary cable */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7Q12 13 17 7" />
      {/* Suspenders */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.8 10.4V16M12 12.5V16M14.2 10.4V16" />
    </>
  ),

  commercial: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  ),

  electrical: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  ),

  legal: (
    <>
      {/* Scale beam pivot */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4" />
      {/* Balance beam */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
      {/* Left chain */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v5" />
      {/* Right chain */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7v5" />
      {/* Left pan (curved) */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12a3 3 0 006 0" />
      {/* Right pan (curved) */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 12a3 3 0 006 0" />
      {/* Pillar */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v12" />
      {/* Base */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19h4" />
    </>
  ),

  mechanical: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),

  medical: (
    <>
      {/* Heart shape */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      {/* Cross on heart */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v5M9.5 11h5" />
    </>
  ),

  operating: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  ),

  personnel: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  ),

  security: (
    <>
      {/* Shield outline */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </>
  ),

  'signal-telecom': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  ),

  stores: (
    <>
      {/* Box body */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5" />
      {/* Box lid */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      {/* Handle on box */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 10.125h4" />
    </>
  ),

  others: (
    <>
      {/* Three filled cells */}
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      {/* Bottom-right cell — dots for misc */}
      <circle cx="15.5" cy="17.5" r="1" />
      <circle cx="18.5" cy="17.5" r="1" />
      <circle cx="17" cy="14.5" r="1" />
    </>
  ),
};

function resolveKey(deptId: string): DeptIconKey {
  const id = (deptId || '').toLowerCase().trim();

  if (id === 'accounts' || id.includes('account') || id.includes('finance'))                                           return 'accounts';
  if (id === 'civil' || id === 'civil-engineering' || id.includes('civil'))                                             return 'civil';
  if (id === 'commercial' || id.includes('commercial') || id.includes('comm'))                                          return 'commercial';
  if (id === 'electrical' || id.includes('electrical') || id.includes('elect'))                                         return 'electrical';
  if (id === 'legal' || id.includes('legal') || id.includes('law'))                                                     return 'legal';
  if (id === 'mechanical' || id.includes('mechanical') || id.includes('mech'))                                          return 'mechanical';
  if (id === 'medical' || id.includes('medical') || id.includes('health'))                                              return 'medical';
  if (id === 'operating' || id.includes('operating') || id.includes('operat') || id.includes('traffic'))                return 'operating';
  if (id === 'personnel' || id.includes('personnel') || id.includes('person'))                                          return 'personnel';
  if (id === 'security' || id.includes('security') || id.includes('rpf') || id.includes('rpsf') || id.includes('protect')) return 'security';
  if (id === 'signal-telecom' || id === 'snt' || id.includes('signal') || id.includes('telecom') || id.includes('s&t'))    return 'signal-telecom';
  if (id === 'stores' || id.includes('stores') || id.includes('store') || id.includes('inventory'))                     return 'stores';

  return 'others';
}

export function getDepartmentIcon(deptId: string, sizeClass = 'w-8 h-8'): React.ReactNode {
  const key = resolveKey(deptId);
  return (
    <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {ICON_PATHS[key]}
    </svg>
  );
}