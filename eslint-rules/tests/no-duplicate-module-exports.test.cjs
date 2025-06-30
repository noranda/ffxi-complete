const {RuleTester} = require('eslint');

const rule = require('../rules/no-duplicate-module-exports.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parser: require('@typescript-eslint/parser'),
    sourceType: 'module',
  },
});

ruleTester.run('no-duplicate-module-exports', rule, {
  invalid: [
    // Duplicate exports from same module
    {
      code: 'export { Button } from "./components";\nexport { Card } from "./components";',
      errors: [{messageId: 'duplicateExport'}],
      output: 'export {Button, Card} from "./components";\n',
    },

    // Multiple duplicate exports
    {
      code: 'export { Button } from "./components";\nexport { Card } from "./components";\nexport { Input } from "./components";',
      errors: [{messageId: 'duplicateExport'}],
      output: 'export {Button, Card, Input} from "./components";\n\n',
    },

    // Type and regular exports
    {
      code: 'export { createUser } from "./api";\nexport type { User } from "./api";',
      errors: [{messageId: 'duplicateExport'}],
      output: 'export {createUser, type User} from "./api";\n',
    },

    // Mixed exports with aliases
    {
      code: 'export { Button as Btn } from "./components";\nexport { Card } from "./components";',
      errors: [{messageId: 'duplicateExport'}],
      output: 'export {Button as Btn, Card} from "./components";\n',
    },
  ],

  valid: [
    // Single export from module
    'export { Button } from "./components";',

    // Different modules
    'export { Button } from "./components";\nexport { User } from "./types";',

    // Already combined exports
    'export { Button, Card, Input } from "./components";',
    'export { createUser, type User, type UserConfig } from "./api";',

    // Local exports (no source)
    'export const localVar = "value";',
    'export function localFunction() {}',
  ],
});
