import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * apps/web e2e config (Phase 0 scope only — 05-MODULE-BOOKING.md's real
 * booking/checkout flow doesn't exist yet). Free/local-only per CLAUDE.md's
 * tooling budget: HTML reporter and traces are written to disk, nothing
 * uploads to Playwright's paid cloud trace-viewer service.
 *
 * `webServer` builds a production bundle and serves it with `next start`,
 * so the smoke test exercises the actual build output rather than the dev
 * server — self-contained, so it also works outside of `pnpm turbo run e2e`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm run build && pnpm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
