import { defineConfig } from '@playwright/test'

// Integration tests against the real running gateway/Keycloak, without Vite fixtures.
export default defineConfig({
  testDir: './e2e',
  testMatch: 'keycloak.spec.ts',
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: process.env.AUTH_E2E_BASE_URL || 'http://localhost',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    reducedMotion: 'reduce',
    actionTimeout: 10000,
    navigationTimeout: 20000,
    screenshot: 'only-on-failure',
    trace: 'off', // OAuth requests contain tokens; do not write them into traces.
  },
})
