import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import html from 'eslint-plugin-html'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.hbs', '**/*.handlebars', '**/*.html'],
    plugins: {
      html,
    },
  },
])
