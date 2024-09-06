import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "double", // or 'double'
    semi: true,
    overrides: {
      "style/brace-style": "off",
    },
  },
  typescript: {
    overrides: {
      "ts/no-explicit-any": ["error"],
      "node/prefer-global/process": "off",
      "no-console": "warn",
      "unicorn/throw-new-error": "off",
      "ts/consistent-type-definitions": ["error", "type"],
    },
  },
}).removeRules("");
