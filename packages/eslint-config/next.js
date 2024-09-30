const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/react"),
    require.resolve("@vercel/style-guide/eslint/next"),
    // Turborepo custom eslint configuration configures the following rules:
    //  - https://github.com/vercel/turborepo/blob/main/packages/eslint-plugin-turbo/docs/rules/no-undeclared-env-vars.md
    "eslint-config-turbo",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "no-nested-ternary": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
    "no-param-reassign": "warn",
    "func-names": "warn",
    "import/named": "warn",
    camelcase: "warn",
    "import/order": "off",
    "import/no-default-export": "off",
    "eslint-comments/require-description": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/only-throw-error": "warn",
    "@typescript-eslint/no-floating-promises": "off",
    "react/jsx-no-leaked-render": "error",
    "react/display-name": "off",
  },
};
