/**
 * Shared ESLint base config — used by non-Next packages (@somos/ui, @somos/lib,
 * @somos/types) and extended by ./next.js for the three Next.js apps.
 */
module.exports = {
  root: false,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: false,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
  ],
  env: {
    es2022: true,
    node: true,
  },
  rules: {
    // "No hardcoding" principle (00-MASTER-PLAN.md §0): any TODO/FIXME left in
    // code must be visible, never silently shipped.
    "no-warning-comments": ["warn", { terms: ["fixme"], location: "anywhere" }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Strict TypeScript everywhere (01-ARCHITECTURE.md §1) — `any` requires a
    // comment justifying it, so we warn rather than silently allow.
    "@typescript-eslint/no-explicit-any": "warn",
  },
  ignorePatterns: ["dist/**", ".next/**", "node_modules/**", "*.config.js"],
};
