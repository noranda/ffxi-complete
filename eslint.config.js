import pluginJs from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
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
      // Prefer string literals over unnecessary expressions in JSX attributes
      'react/jsx-curly-brace-presence': [
        'error',
        {
          children: 'never',
          propElementValues: 'always',
          props: 'never',
        },
      ],
      // JSX formatting rules to catch spacing issues automatically
      'react/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ],
      'react/jsx-newline': [
        'error',
        {
          allowMultilines: true,
          prevent: false,
        },
      ],
      // Prevent unnecessary JSX fragments and nested markup
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true, // Allow <>{condition && <Component />}</>
        },
      ],
      'react/jsx-one-expression-per-line': [
        'error',
        {
          allow: 'single-child',
        },
      ],
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
      // Prevent one-letter variables except for common exceptions
      'id-length': [
        'error',
        {
          exceptions: ['_', 'x', 'y', 'z', 'i', 'j', 'k'], // Allow underscore and common coordinates/loop vars
          min: 2,
          properties: 'never', // Don't check object properties
        },
      ],
      // Import management (Perfectionist handles sorting)
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      // Enforce importing from index files instead of directly from internal modules
      'import/no-internal-modules': [
        'error',
        {
          allow: [
            // Allow imports from specific directories where direct imports are acceptable
            '**/types/**',
            '**/*.types',
            // Allow @/* path alias imports (our internal module pattern)
            '@/**',
            // Allow standard library submodules
            'react-dom/**',
            'vitest/**',
            '@testing-library/**',
            // Allow specific patterns that don't use index files
            '**/contexts/**', // Context files often imported directly
          ],
        },
      ],
      // Project-specific overrides
      'react-refresh/only-export-components': ['error', {allowConstantExport: true}],
    },
    settings: {
      'import/internal-regex': '^@/',
      'import/resolver': {
        node: true,
        typescript: {alwaysTryTypes: true, project: './tsconfig.app.json'},
      },
    },
  },

  // Strict type-aware rules for source files - catch ALL TypeScript compilation errors
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
      // Use ALL TypeScript ESLint type-checked rules as errors
      ...tseslintConfigs.strictTypeChecked.rules,
      ...tseslintConfigs.stylisticTypeChecked.rules,
      // Override specific rules that we want to allow or configure differently
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: false,
          ignoreVoidOperator: false,
        },
      ], // Enable to catch useEffect return type errors
      '@typescript-eslint/no-explicit-any': 'error', // Keep as error in source files
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: true,
            attributes: true,
            properties: true,
            returns: true,
            variables: true,
          },
        },
      ], // Re-enable to catch useEffect return type errors
    },
  },

  // Component size limits (excluding tests and generated files)
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/*.{test,spec}.{ts,tsx}', '**/types/database.types.ts', 'src/App.tsx'],
    rules: {
      'max-lines': ['error', {max: 300, skipBlankLines: true, skipComments: true}],
    },
  },

  // Exception overrides
  {
    files: ['src/contexts/**/*.{ts,tsx}', '**/*Context.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off', // Contexts export multiple items
    },
  },

  // Test files - catch ALL TypeScript errors but disable some strict rules
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Add Node.js globals for test setup files
        global: 'readonly',
        process: 'readonly',
        // React is needed for JSX transform and types
        React: 'readonly',
        // Explicitly DO NOT include vitest globals to force explicit imports
        // describe, it, expect, beforeEach, etc. must be imported
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Use ALL TypeScript ESLint type-checked rules as errors in tests too
      ...tseslintConfigs.strictTypeChecked.rules,
      ...tseslintConfigs.stylisticTypeChecked.rules,
      // Allow more flexibility in tests
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      // Keep argument type checking enabled to catch type mismatches
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'import/first': 'off',
      // Ensure test functions must be explicitly imported
      'no-undef': 'error',
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
    files: ['*.config.{js,ts,mjs}', 'vite.config.ts', 'vitest.config.ts', 'eslint-custom-rules.js'],
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
          'jsx-expression-spacing': customRulesConfig.plugins['ffxi-custom'].rules['jsx-expression-spacing'],
          'jsx-multiline-spacing': customRulesConfig.plugins['ffxi-custom'].rules['jsx-multiline-spacing'],
          'no-unnecessary-div-wrapper': customRulesConfig.plugins['ffxi-custom'].rules['no-unnecessary-div-wrapper'],
          'prefer-cn-for-classname': customRulesConfig.plugins['ffxi-custom'].rules['prefer-cn-for-classname'],
          'prefer-div-over-p': customRulesConfig.plugins['ffxi-custom'].rules['prefer-div-over-p'],
          'prefer-single-line-arrow-functions':
            customRulesConfig.plugins['ffxi-custom'].rules['prefer-single-line-arrow-functions'],
          'react-fc-pattern': customRulesConfig.plugins['ffxi-custom'].rules['react-fc-pattern'],
        },
      },
    },
    rules: {
      'ffxi-custom/jsx-expression-spacing': 'error',
      'ffxi-custom/jsx-multiline-spacing': 'error',
      'ffxi-custom/no-unnecessary-div-wrapper': 'error',
      'ffxi-custom/prefer-cn-for-classname': 'error',
      'ffxi-custom/prefer-div-over-p': 'error',
      'ffxi-custom/prefer-single-line-arrow-functions': 'error',
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

  // Condensed code style - prefer single-line statements and concise expressions
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': pluginStylistic,
    },
    rules: {
      // Keep function calls condensed when possible
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      // Force arrow function bodies to be beside the arrow
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      // Condensed JSX expressions - use stylistic plugin instead of custom rule
      '@stylistic/jsx-curly-newline': ['error', {multiline: 'forbid', singleline: 'forbid'}],
      // Prefer concise conditional expressions
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      // Enforce single-line statements to be beside their parent
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      // Condensed object formatting for simple objects
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: {consistent: true, minProperties: 4},
          ObjectPattern: {consistent: true, minProperties: 4},
        },
      ],
      // Disable TypeScript rules that conflict with condensed style
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      // Enforce condensed arrow functions for expressions (return statements)
      'arrow-body-style': ['error', 'as-needed'],
      // Allow single-line if statements without braces for simple cases
      curly: ['error', 'multi-line'],
      // Enforce consistent 120-character line length limit
      'max-len': ['error', {code: 120, ignoreComments: true, ignoreUrls: true}],
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
    files: ['src/**/*.{ts,tsx}'], // Apply to all source files including tests
    ignores: ['**/__tests__/**', '**/*.{test,spec}.{ts,tsx}'],
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
      // Forbid specific JSDoc tags to enforce minimal approach (description only)
      'jsdoc/no-restricted-syntax': [
        'error',
        {
          contexts: [
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="param"])',
              message: '@param tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="returns"])',
              message: '@returns tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="return"])',
              message: '@return tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="example"])',
              message: '@example tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="arg"])',
              message: '@arg tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="argument"])',
              message: '@argument tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="throws"])',
              message: '@throws tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="yields"])',
              message: '@yields tags are not allowed. Use minimal JSDoc with description only.',
            },
          ],
        },
      ],
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
          require: {
            ArrowFunctionExpression: false, // Don't require JSDoc for arrow functions
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: false, // Don't require JSDoc for function expressions
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

  // JSDoc restrictions for test files (minimal - only tag restrictions, no requirement for JSDoc)
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    plugins: {
      jsdoc: pluginJsdoc,
    },
    rules: {
      // But if JSDoc is present, require basic formatting
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      // Forbid specific JSDoc tags (same as source files)
      'jsdoc/no-restricted-syntax': [
        'error',
        {
          contexts: [
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="param"])',
              message: '@param tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="returns"])',
              message: '@returns tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="return"])',
              message: '@return tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="example"])',
              message: '@example tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="arg"])',
              message: '@arg tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="argument"])',
              message: '@argument tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="throws"])',
              message: '@throws tags are not allowed. Use minimal JSDoc with description only.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTag[tag="yields"])',
              message: '@yields tags are not allowed. Use minimal JSDoc with description only.',
            },
          ],
        },
      ],
      'jsdoc/require-description': 'error', // If JSDoc is present, require description
      // Don't require JSDoc on test functions
      'jsdoc/require-jsdoc': 'off',
      // Explicitly disable these to avoid warnings
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },

  // TypeScript-specific linting for enhanced type checking
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Basic TypeScript rules without type checking
      ...tseslintConfigs.recommended.rules,
    },
  },

  // Prettier must be last
  configPrettier,
];
