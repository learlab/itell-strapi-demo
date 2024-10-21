module.exports = {
  root: true,
  extends: ["@itell/eslint-config/next.js", "plugin:drizzle/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
};
