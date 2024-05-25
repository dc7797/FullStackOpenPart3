import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { files: ["**/*.js"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "commonjs",
    globals: {
      ...globals.node,
      ...globals.commonjs,
    },
  },
},
  pluginJs.configs.recommended,
  {
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
          'error', 'always'
      ],
      'arrow-spacing': [
          'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    }
  },
  {
    ignores: ["**/temp.js", "config/*", "dist/*"]
}
];