import {builtinModules} from 'node:module';

import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import * as pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint, {configs as tseslintConfigs} from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore patterns
  {
    ignores: ['dist', 'coverage'],
  },

  // Base configs - these provide most of our rules
  pluginJs.configs.recommended,
  ...tseslintConfigs.recommended,

  // React configs
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/prop-types': 'off', // We use TypeScript
      'react/no-unescaped-entities': 'off', // Allow apostrophes
    },
    settings: {
      react: {version: 'detect'},
    },
  },
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],

  // Global settings for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'react-refresh': pluginReactRefresh,
      'jsx-a11y': pluginJsxA11y,
    },
    rules: {
      // Import management
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // Side effects
            ['^node:', `^(${builtinModules.join('|')})(/.*|$)`], // Node builtins
            ['^react$', '^@?\\w'], // React first, then packages
            ['^@/'], // Internal imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Relative imports
          ],
        },
      ],

      // Project-specific overrides
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/array-type': ['error', {default: 'array'}],
    },
    settings: {
      'import/internal-regex': '^@/',
      'import/resolver': {
        typescript: {alwaysTryTypes: true, project: './tsconfig.app.json'},
        node: true,
      },
    },
  },

  // Strict type-aware rules for source files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Type safety rules (our most important custom rules)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true,
          allowNumber: true,
          allowNullableObject: true,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/unbound-method': 'error',
    },
  },

  // Component size limits (excluding tests and generated files)
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    ignores: [
      '**/__tests__/**',
      '**/*.{test,spec}.{ts,tsx}',
      '**/types/database.types.ts',
      'src/App.tsx',
    ],
    rules: {
      'max-lines': [
        'error',
        {max: 300, skipBlankLines: true, skipComments: true},
      ],
    },
  },

  // Exception overrides
  {
    files: ['src/contexts/**/*.{ts,tsx}', '**/*Context.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off', // Contexts export multiple items
    },
  },

  // Test files - disable strict rules
  {
    files: [
      '**/__tests__/**/*.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'import/first': 'off',
    },
  },

  // Declaration files - minimal rules
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },

  // Config files - minimal rules
  {
    files: ['*.config.{js,ts,mjs}', 'vite.config.ts', 'vitest.config.ts'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // Node.js files
  {
    files: ['**/*.cjs'],
    languageOptions: {globals: globals.node},
  },

  // Prettier must be last
  configPrettier,
];
