const {RuleTester} = require('eslint');

const rule = require('../rules/prefer-type-imports.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parser: require('@typescript-eslint/parser'),
    sourceType: 'module',
  },
});

ruleTester.run('prefer-type-imports', rule, {
  invalid: [
    // Separate type and regular imports from same module
    {
      code: 'import type { User } from "./api";\nimport { createUser } from "./api";',
      errors: [{messageId: 'consolidateImports'}],
      output: 'import {createUser, type User} from "./api";\n',
    },

    // Multiple separate imports
    {
      code: 'import type { User, Config } from "./types";\nimport { createUser, deleteUser } from "./types";',
      errors: [{messageId: 'consolidateImports'}],
      output: 'import {createUser, deleteUser, type Config, type User} from "./types";\n',
    },
  ],

  valid: [
    // Already consolidated imports
    'import { createUser, type User } from "./api";',
    'import type { User } from "./types";',

    // Single imports (no consolidation needed)
    'import { useState } from "react";',
    'import type { Props } from "./types";',

    // No imports
    'const value = "test";',

    // Multiple imports from different modules
    'import { useState } from "react";\nimport { Button } from "./components";',
  ],
});
