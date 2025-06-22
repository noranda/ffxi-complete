import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginBetterTailwind from 'eslint-plugin-better-tailwindcss';
import pluginImport from 'eslint-plugin-import';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import pluginReact from 'eslint-plugin-react';
import * as pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint, {configs as tseslintConfigs} from 'typescript-eslint';

import {customRulesConfig} from './eslint-custom-rules.js';

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
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              importNames: [
                'ComponentType',
                'MouseEvent',
                'FormEvent',
                'ChangeEvent',
                'KeyboardEvent',
                'FocusEvent',
                'ReactNode',
                'ReactElement',
                'CSSProperties',
                'ComponentProps',
              ],
              message:
                'Do not import React types directly. Use React.ComponentType, React.MouseEvent, etc. inline instead.',
              name: 'react',
            },
          ],
        },
      ],
      // JSX formatting rules to catch spacing issues automatically
      'react/jsx-newline': ['error', {allowMultilines: true, prevent: false}],
      'react/jsx-one-expression-per-line': ['error', {allow: 'single-child'}],
      // Alphabetical prop sorting (disabled in favor of perfectionist/sort-jsx-props)
      'react/jsx-sort-props': 'off',
      // React import automation
      'react/no-deprecated': 'error', // Detect deprecated React methods
      'react/no-unescaped-entities': 'off', // Allow apostrophes
      'react/prop-types': 'off', // We use TypeScript
    },
    settings: {
      react: {version: 'detect'},
    },
  },
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],

  // Perfectionist plugin for comprehensive sorting automation
  {
    ...pluginPerfectionist.configs['recommended-natural'],
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },

  // JSDoc plugin for comprehensive documentation automation
  {
    ...pluginJsdoc.configs['flat/recommended-typescript-flavor'],
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },

  // Global settings for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      import: pluginImport,
      'jsx-a11y': pluginJsxA11y,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'array'}],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // React import automation
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {fixStyle: 'inline-type-imports', prefer: 'type-imports'},
      ],

      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      // Import management (Perfectionist handles sorting)
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      // Project-specific overrides
      'react-refresh/only-export-components': [
        'error',
        {allowConstantExport: true},
      ],
    },
    settings: {
      'import/internal-regex': '^@/',
      'import/resolver': {
        node: true,
        typescript: {alwaysTryTypes: true, project: './tsconfig.app.json'},
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
      '@typescript-eslint/no-confusing-void-expression': 'error',
      // Type safety rules (our most important custom rules)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowAny: false,
          allowNullableBoolean: false,
          allowNullableNumber: false,
          allowNullableObject: true,
          allowNullableString: false,
          allowNumber: true,
          allowString: true,
        },
      ],
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
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'import/first': 'off',
    },
  },

  // Declaration files and generated types - minimal rules
  {
    files: ['**/*.d.ts', '**/database.types.ts'],
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      // Disable JSDoc rules for generated files
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      // Disable all perfectionist rules for generated files
      'perfectionist/sort-array-includes': 'off',
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-intersection-types': 'off',
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-named-exports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-union-types': 'off',
    },
  },

  // Config files - minimal rules
  {
    files: [
      '*.config.{js,ts,mjs}',
      'vite.config.ts',
      'vitest.config.ts',
      'eslint-custom-rules.js',
    ],
    rules: {
      'import/no-unresolved': 'off',
      // Disable JSDoc rules for config files
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },

  // Node.js files
  {
    files: ['**/*.cjs'],
    languageOptions: {globals: globals.node},
  },

  // Custom rules for project-specific formatting (reduced set)
  {
    plugins: {
      'ffxi-custom': {
        rules: {
          'jsx-multiline-spacing':
            customRulesConfig.plugins['ffxi-custom'].rules[
              'jsx-multiline-spacing'
            ],
          'prefer-div-over-p':
            customRulesConfig.plugins['ffxi-custom'].rules['prefer-div-over-p'],
          'react-fc-pattern':
            customRulesConfig.plugins['ffxi-custom'].rules['react-fc-pattern'],
        },
      },
    },
    rules: {
      'ffxi-custom/jsx-multiline-spacing': 'error',
      'ffxi-custom/prefer-div-over-p': 'error',
      'ffxi-custom/react-fc-pattern': 'error',
    },
  },

  // Better Tailwind CSS rules for styling patterns automation
  {
    plugins: {
      'better-tailwind': pluginBetterTailwind,
    },
    rules: {
      'better-tailwind/no-duplicate-classes': 'error',
      'better-tailwind/no-unnecessary-whitespace': 'error',
    },
  },

  // Arrow body style automation - prefer implicit returns when possible
  {
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
    },
  },

  // Error handling automation - enforce Error objects and proper async patterns
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prevent misuse of promises in conditional statements
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksConditionals: true,
          checksVoidReturn: true,
        },
      ],
      '@typescript-eslint/only-throw-error': 'error',

      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      // Enforce Error objects for throw statements
      'no-throw-literal': 'off', // Disable base rule

      // Enforce Error objects for Promise rejections
      'prefer-promise-reject-errors': 'off', // Disable base rule
    },
  },

  // Error handling for JavaScript files (non-typed rules)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      // Enforce Error objects for throw statements (base rule for JS)
      'no-throw-literal': 'error',

      // Enforce Error objects for Promise rejections (base rule for JS)
      'prefer-promise-reject-errors': 'error',
    },
  },

  // Minimal JSDoc for function comments (error level)
  {
    files: ['src/**/*.{ts,tsx}'], // Only apply to source files, not tests or config
    ignores: ['**/*.test.{ts,tsx}', '**/__tests__/**/*'], // Exclude test files
    plugins: {
      jsdoc: pluginJsdoc,
    },
    rules: {
      // Keep some basic formatting consistent
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/check-param-names': 'error',
      // Allow simple comment blocks without @ tags
      'jsdoc/check-tag-names': 'off',
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      'jsdoc/no-undefined-types': 'off',
      // Require descriptions but don't enforce specific format
      'jsdoc/require-description': [
        'error',
        {
          contexts: ['any'],
        },
      ],
      // Require comment blocks on functions - minimal enforcement
      'jsdoc/require-jsdoc': [
        'error',
        {
          checkGetters: false,
          checkSetters: false,
          contexts: [
            // Also require on exported constants that are functions
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
          ],
          exemptEmptyConstructors: true,
          exemptEmptyFunctions: false,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: false, // Classes can have TypeScript interface docs
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      // Explicitly disable these to avoid warnings from base config
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/valid-types': 'off',
    },
  },

  // Prettier must be last
  configPrettier,
];
