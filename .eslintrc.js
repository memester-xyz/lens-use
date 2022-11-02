module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "standard-with-typescript", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  plugins: ["simple-import-sort", "react"],
  rules: {
    "react/react-in-jsx-scope": ["off"],
    "@typescript-eslint/strict-boolean-expressions": ["off"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/no-unescaped-entities": ["off"],
  },
  settings: {
    react: { version: "detect" },
  },
};
