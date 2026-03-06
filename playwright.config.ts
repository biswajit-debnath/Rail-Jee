import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load test credentials from .env.test.local
dotenv.config({ path: '.env.test.local' });

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  globalSetup: './e2e/setup/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // Tests that do NOT need a logged-in user
      name: 'unauthenticated',
      testMatch: 'e2e/auth.spec.ts',
    },
    {
      // Tests that require a logged-in session
      name: 'authenticated',
      testMatch: 'e2e/authenticated.spec.ts',
      use: { storageState: 'e2e/auth.json' },
    },
    {
      // Department list + detail pages (requires auth)
      name: 'departments',
      testMatch: 'e2e/departments.spec.ts',
      use: { storageState: 'e2e/auth.json' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
