import baseConfig from "@somos/config/vitest/base.mts";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

// apps/web has no unit tests yet in Phase 0 (its home page is a placeholder
// redirect — see e2e/smoke.spec.ts for the real coverage of that behavior).
// This wiring exists so `pnpm turbo run test` has something to run once the
// booking/checkout flow (05-MODULE-BOOKING.md) lands business logic here.
//
// `e2e/**` is excluded from Vitest's own discovery: those specs import
// `test`/`expect` from `@playwright/test`, not `vitest`, and must only run
// through Playwright's `pnpm run e2e` (see playwright.config.ts).
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, "e2e/**"],
    },
  }),
);
