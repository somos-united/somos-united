// Note: ESLint's shareable-config naming convention mangles a scoped
// package subpath like "@somos/config/eslint/base.js" (it tries to insert
// "eslint-config-" after the scope, which only makes sense for third-party
// packages actually named that way, e.g. "next/core-web-vitals" ->
// "eslint-config-next/core-web-vitals"). require.resolve() sidesteps that:
// it hands ESLint an absolute path, which it loads directly.
module.exports = {
  root: true,
  extends: [require.resolve("@somos/config/eslint/base.js")],
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
};
