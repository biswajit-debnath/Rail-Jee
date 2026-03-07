# TODO List

---

## Future Plan: Shareable Public Exam Preview Page

### Overview
Keep the current exam flow (`/exam/[examId]`) completely untouched. Add a separate public-facing page that shows exam metadata (instructions, stats) without requiring login and without fetching any questions or answers data.

### How it should work
- The **current** `/exam/[examId]` route stays as-is — full exam flow, login required.
- A **new public preview page** is added (e.g. `/exam/[examId]/info` or the same `/exam/[examId]` route opened to unauthenticated users via middleware relaxation).
- The preview page fetches **only** exam metadata: name, duration, total questions, passing %, negative marking, instructions. No questions, no answers.
- The **Start Exam button is replaced with a locked button** (lock icon) for unauthenticated users. Clicking it redirects to `/auth/signin?redirect=/exam/[examId]`.
- After successful login, the auth callback reads the `redirect` param and sends users directly back to the exam preview page.

### Implementation Steps
1. **Extract `ExamInfoPanel` server component** — pull the stats cards (questions/duration/passing %/negative marking) and instructions list out of `ExamInstructions.tsx` into a shared server component. Both pages use it.
2. **Create public SSR preview page** — new route with `fetch` for exam metadata only, rendered server-side. Add proper `<meta og:title>` and `<meta og:description>` tags for social sharing / SEO. Use `revalidate` for caching.
3. **Lock button component** — if `session === null`, render a locked Start button that redirects to `/auth/signin?redirect=/exam/${examId}`. If authenticated, render the current mode selector + Start button.
4. **Auth callback redirect handling** — ensure `/auth/callback` reads the `redirect` query param and uses `router.push(redirect)` instead of always going to `/`.
5. **Middleware update** — allow the preview route to be accessed without a session (currently middleware may block unauthenticated access to `/exam/*`).
6. **Attempt history** — shown only when user is authenticated (conditional server fetch or client-side hydration island).

### Key Constraints
- No changes to `ExamPageClient.tsx` or the live exam flow.
- Post-login redirect **must** work correctly — users who click the lock and log in must land back on the exam preview page, not home.
- The public page must not expose any question content or answers.

### Reference
- Industry precedent: Testbook, BYJU'S, Unacademy all use this pattern.
- Discussed on: 2026-03-07

---

- [ ] My stats page to aligned with current pramod user and update the overall design and info 
- [ ] Logo and home navbar(height)
- [ ] Department showcase icons align it with department list icons page
- [ ] Home exam cards icons change to appropriate departments currently all are same
- [ ] Update the footer with appropriate data and links
- [ ] Department list page overall design with animation
- [ ] On clicking on a department from the department list there is hold delay instead if need show the loading . Same when starting exam from papers selection page.
- [ ] Loading screen from department list to papers list is not good.
- [ ] Percentage logic to link and work from backend to frontend properly.
- [ ] A delay going from exam review to start even if the data is already preloaded.
- [ ] Department logic flow with refresh and cache check it properly all the cases.
