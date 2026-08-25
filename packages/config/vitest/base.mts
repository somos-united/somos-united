import { defineConfig } from "vitest/config";

/**
 * Shared Vitest base config (Node test environment, no DOM) — the single
 * source every workspace package/app imports instead of hand-rolling its own
 * Vitest setup (00-MASTER-PLAN.md §0: no per-package island config, mirrors
 * how ../eslint and ../tailwind are shared). Used directly by packages with
 * nothing to render (@somos/lib, @somos/types, and the three Next.js apps
 * until they grow component-level tests) and extended by ./react.mts for
 * anything that renders React components (@somos/ui).
 *
 * `.mts` (not `.ts`): none of these workspaces set `"type": "module"` in
 * their package.json (some, like @somos/config itself, mix in CommonJS
 * config files that must stay `require()`-able — see ../eslint), so a plain
 * `.ts` extension is ambiguous CJS/ESM and Vite's native config loader has
 * to guess. `.mts` is unambiguous ESM regardless of the package's "type".
 *
 * `passWithNoTests: true` is intentional for Phase 0: several workspaces
 * have no test files yet (barely any business logic exists), and `vitest
 * run` must still exit 0 in CI rather than hard-failing on "no tests found".
 *
 * Every package.json that depends on "vitest" also pins an explicit
 * "vite" devDependency (currently 8.2.2) alongside it. Without that, pnpm's
 * peer resolution reuses the older vite@4.x that Sanity Studio's own
 * tooling (studio/) pulls in transitively, which doesn't satisfy vitest 4's
 * required vite ^6/^7/^8 range and breaks `vitest run` at startup.
 */
export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
    restoreMocks: true,
  },
});
