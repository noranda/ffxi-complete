const {RuleTester} = require('eslint');

const rule = require('../rules/prefer-cn-for-classname.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    sourceType: 'module',
  },
});

ruleTester.run('prefer-cn-for-classname', rule, {
  invalid: [
    // Template literal with interpolation should use cn()
    {
      code: 'const el = <div className={`base ${condition ? "active" : ""}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import { cn } from \'@/lib/utils\';\n\nconst el = <div className={cn("base ", condition ? "active" : "")} />;',
    },
    {
      code: 'const el = <div className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import { cn } from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", variant === "primary" ? "btn-primary" : "btn-secondary")} />;',
    },
  ],

  valid: [
    // Already using cn() utility
    'const el = <div className={cn("base", condition && "active")} />;',

    // Static className (no interpolation)
    'const el = <div className="static-class" />;',

    // No className prop
    'const el = <div id="test" />;',

    // Expression without template literal
    'const el = <div className={someVariable} />;',

    // Template literal without expressions
    'const el = <div className={`static-template`} />;',
  ],
});
