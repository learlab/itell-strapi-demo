import { nextJsConfig } from "@itell/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
    ...nextJsConfig,
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      rules: {
        "no-undef": "off",
        "prefer-const": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }],
        "react/display-name": "off",
        "react/no-unescaped-entities": "off",
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "turbo/no-undeclared-env-vars": "off",
        "@next/next/no-html-link-for-pages": "off", 
        "@next/next/no-img-element": "off", 
        "@typescript-eslint/ban-ts-comment": ["warn", {
          "ts-ignore": false,
        }]
      }
    },
    {
        files: ["**/*.{mjs,env.mjs}", "**/next.config.mjs"],
        languageOptions: {
          sourceType: "module",
          globals: {
            process: "readonly"
          }
        },
        rules: {
          "no-undef": "off"  
        }
      }
  ];