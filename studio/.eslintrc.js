// See packages/ui/.eslintrc.js for why require.resolve() is needed here.
module.exports = {
  root: true,
  extends: [require.resolve("@somos/config/eslint/base.js")],
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
};
