/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["postcss.config.js"],
      env: {
        node: true,
      },
    },
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-redeclare": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};
