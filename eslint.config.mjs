import globals from 'globals';
import eslintJs from '@eslint/js';
import google from 'eslint-config-google';

delete globals.browser['AudioWorkletGlobalScope '];
globals.browser.AudioWorkletGlobalScope = false;
delete google.rules['valid-jsdoc'];
delete google.rules['require-jsdoc'];

export default [
  {
    ignores: ['node_modules', '**/web/public/*', '**/test/*', 'index.mjs'],
  },
  {
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...google.rules,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ['**/*.js'],
    plugins: {
    },
    rules: {
      'max-len': [1, 1000, 2],
    },
  },
];
