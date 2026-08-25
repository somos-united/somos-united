// @somos/config has no runtime JS API — it is consumed via its sub-paths:
//   @somos/config/eslint/base   — shared ESLint rules (non-Next packages)
//   @somos/config/eslint/next   — shared ESLint rules + eslint-config-next (apps)
//   @somos/config/tailwind      — shared Tailwind preset (design tokens as theme)
//   @somos/config/tsconfig.base.json — shared strict tsconfig
//   @somos/config/vitest/base.mts  — shared Vitest config (Node environment)
//   @somos/config/vitest/react.mts — shared Vitest config + jsdom + React plugin
module.exports = {};
