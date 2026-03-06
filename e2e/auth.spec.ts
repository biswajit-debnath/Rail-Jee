import { test, expect } from '@playwright/test';

// ─── Middleware / redirect behaviour ─────────────────────────────────────────

test('unauthenticated user visiting /departments is redirected to signin', async ({ page }) => {
  await page.goto('/departments');
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test('unauthenticated user visiting /profile is redirected to signin', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test('redirect param is preserved when bounced from a protected route', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveURL(/redirect=%2Fprofile/);
});

test('signin page is accessible without authentication (no redirect loop)', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page).toHaveURL('/auth/signin');
});

test('signup page is accessible without authentication', async ({ page }) => {
  await page.goto('/auth/signup');
  await expect(page).toHaveURL('/auth/signup');
});

// ─── Sign-in page UI ─────────────────────────────────────────────────────────

test('signin page renders correctly', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  await expect(page.getByLabel('Email Address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  // The button text is rendered via a conditional expression; match by type to avoid
  // comment-node interference with Playwright's accessible-name resolution.
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('signin form shows a loading state while submitting', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email Address').fill('test@example.com');
  await page.getByLabel('Password').fill('somepassword');
  await page.locator('button[type="submit"]').click();

  // The button text should briefly change to "Signing In..." while the request runs
  await expect(page.getByText('Signing In...')).toBeVisible();
});

test('signin form shows error for invalid credentials', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email Address').fill('notexist@railji.test');
  await page.getByLabel('Password').fill('wrongpassword123');
  await page.locator('button[type="submit"]').click();

  // Supabase returns "Invalid login credentials" — the page surfaces it
  await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 10_000 });
});

test('signin page links to signup page', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/auth/signup');
});

test('signin page links to forgot-password page', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.getByRole('link', { name: /forgot password/i })).toHaveAttribute('href', '/auth/forgot-password');
});

// ─── Sign-up page UI ──────────────────────────────────────────────────────────

test('signup page renders correctly', async ({ page }) => {
  await page.goto('/auth/signup');
  await expect(page.getByLabel('Full Name')).toBeVisible();
  await expect(page.getByLabel('Email Address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
});

test('signup form does not submit with empty fields (HTML5 required)', async ({ page }) => {
  await page.goto('/auth/signup');
  await page.getByRole('button', { name: 'Create Account' }).click();
  // Page should stay on signup — no navigation occurred
  await expect(page).toHaveURL('/auth/signup');
});

test('signup page links back to signin page', async ({ page }) => {
  await page.goto('/auth/signup');
  await expect(page.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/auth/signin');
});

// ─── Forgot-password page UI──────────────────────────────────────────────────

test('forgot-password page renders correctly', async ({ page }) => {
  await page.goto('/auth/forgot-password');
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
});

// ─── Public pages not redirected ─────────────────────────────────────────────

test('privacy policy page is accessible without auth', async ({ page }) => {
  await page.goto('/privacy-policy');
  await expect(page).toHaveURL('/privacy-policy');
});

test('terms of service page is accessible without auth', async ({ page }) => {
  await page.goto('/terms-of-service');
  await expect(page).toHaveURL('/terms-of-service');
});

test('about page is accessible without auth', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveURL('/about');
});

// ─── Signup flow (email confirmation required) ────────────────────────────────

test('signup with valid data shows email verification modal', async ({ page }) => {
  await page.goto('/auth/signup');

  // Use a unique email so Supabase does not reject it as a duplicate
  const uniqueEmail = `test+${Date.now()}@mailinator.com`;

  await page.getByLabel('Full Name').fill('Test User');
  await page.getByLabel('Email Address').fill(uniqueEmail);
  await page.getByLabel('Password').fill('TestPassword123');
  await page.getByRole('button', { name: 'Create Account' }).click();

  // App should show the "Check your email" verification modal
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Please verify your account before signing in.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to Sign In' })).toBeVisible();
});

test('clicking "Go to Sign In" on verification modal navigates to signin', async ({ page }) => {
  await page.goto('/auth/signup');

  const uniqueEmail = `test+${Date.now()}@mailinator.com`;
  await page.getByLabel('Full Name').fill('Test User');
  await page.getByLabel('Email Address').fill(uniqueEmail);
  await page.getByLabel('Password').fill('TestPassword123');
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByRole('button', { name: 'Go to Sign In' })).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Go to Sign In' }).click();

  await expect(page).toHaveURL('/auth/signin');
});
