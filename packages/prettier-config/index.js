module.exports = {
  trailingComma: "es5",
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  jsxSingleQuote: false,
  plugins: [
    "prettier-plugin-css-order",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^server-only$",
    "",
    "^(react/(.*)$)|^(react$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[./]",
  ],
  tailwindFunctions: ["clsx", "cn"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
