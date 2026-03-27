import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.planning/',
      'scripts/',
      'public/',
      'netlify/',
      'server/'
    ]
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn'
    }
  },
  {
    files: ['src/utils/logger.js'],
    rules: {
      'no-console': 'off'
    }
  }
]