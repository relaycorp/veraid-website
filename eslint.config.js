import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ["node_modules/**"],
    files: ["**/*.{js,astro}"],
  },
];
