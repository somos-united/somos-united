/**
 * Shared ESLint config for the three Next.js apps (web, admin, trainer).
 * Layers eslint-config-next on top of the shared base preset so lint rules
 * stay identical across apps (01-ARCHITECTURE.md §1: "keine abweichenden
 * Regeln pro App").
 */
module.exports = {
  root: false,
  extends: ["./base.js", "next/core-web-vitals"],
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
