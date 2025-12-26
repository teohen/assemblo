import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'bin/**'] },
  { files: ['src/**/*.{js,mjs,cjs,ts}'], },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended[1].rules,
      'no-unused-vars': 'off',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
    }
  }
]