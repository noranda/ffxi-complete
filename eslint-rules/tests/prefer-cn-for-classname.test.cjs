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
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("base ", condition ? "active" : "")} />;',
    },
    {
      code: 'const el = <div className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", variant === "primary" ? "btn-primary" : "btn-secondary")} />;',
    },

    // Single quotes in template literal expressions
    {
      code: "const el = <div className={`base ${condition ? 'active' : 'inactive'}`} />;",
      errors: [{messageId: 'preferCn'}],
      output:
        "import {cn} from '@/lib/utils';\n\nconst el = <div className={cn(\"base \", condition ? 'active' : 'inactive')} />;",
    },

    // Multiple interpolations in template literal
    {
      code: 'const el = <div className={`${baseClass} ${isActive && "active"} ${size}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn(baseClass, " ", isActive && "active", " ", size)} />;',
    },

    // Logical AND operator
    {
      code: 'const el = <div className={`btn ${isLoading && "btn-loading"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", isLoading && "btn-loading")} />;',
    },

    // Logical OR operator
    {
      code: 'const el = <div className={`card ${theme || "card-default"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("card ", theme || "card-default")} />;',
    },

    // Nullish coalescing operator
    {
      code: 'const el = <div className={`btn ${variant ?? "primary"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", variant ?? "primary")} />;',
    },

    // Object property access
    {
      code: 'const el = <div className={`card ${props.className}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("card ", props.className)} />;',
    },

    // Nested object property access
    {
      code: 'const el = <div className={`btn ${theme.colors.primary}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", theme.colors.primary)} />;',
    },

    // Function call in template literal
    {
      code: 'const el = <div className={`card ${getVariantClass(type)}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("card ", getVariantClass(type))} />;',
    },

    // Array access
    {
      code: 'const el = <div className={`btn ${classes[0]}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", classes[0])} />;',
    },

    // Nested ternary operators
    {
      code: 'const el = <div className={`btn ${size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "btn-md"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "btn-md")} />;',
    },

    // Complex boolean expressions
    {
      code: 'const el = <div className={`card ${(isActive && !isDisabled) ? "card-active" : ""}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("card ", (isActive && !isDisabled) ? "card-active" : "")} />;',
    },

    // Template literal with only expressions (no static text)
    {
      code: 'const el = <div className={`${baseClass}${modifier}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: "import {cn} from '@/lib/utils';\n\nconst el = <div className={cn(baseClass, modifier)} />;",
    },

    // Different spacing patterns
    {
      code: 'const el = <div className={`btn  ${variant}   ${size}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn  ", variant, "   ", size)} />;',
    },

    // Template literal with escape characters
    {
      code: 'const el = <div className={`btn\\n${variant}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn\\n", variant)} />;',
    },

    // Self-closing component with template literal
    {
      code: 'const el = <Button className={`btn ${isPrimary && "btn-primary"}`} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <Button className={cn("btn ", isPrimary && "btn-primary")} />;',
    },

    // Component with multiple props and template literal
    {
      code: 'const el = <div id="test" className={`flex ${direction}`} onClick={handler} />;',
      errors: [{messageId: 'preferCn'}],
      output:
        'import {cn} from \'@/lib/utils\';\n\nconst el = <div id="test" className={cn("flex ", direction)} onClick={handler} />;',
    },

    // Template literal with mathematical expressions
    {
      code: 'const el = <div className={`grid-cols-${columns + 1}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("grid-cols-", columns + 1)} />;',
    },

    // Template literal with template string method calls
    {
      code: 'const el = <div className={`btn ${variant.toLowerCase()}`} />;',
      errors: [{messageId: 'preferCn'}],
      output: 'import {cn} from \'@/lib/utils\';\n\nconst el = <div className={cn("btn ", variant.toLowerCase())} />;',
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

    // Already using cn() with multiple arguments
    'const el = <div className={cn("btn", variant === "primary" && "btn-primary", size)} />;',

    // cn() with complex expressions
    'const el = <div className={cn(baseClass, {active: isActive, disabled: isDisabled})} />;',

    // Static string className
    'const el = <div className="flex items-center justify-between" />;',

    // Variable without template literal interpolation
    'const el = <div className={dynamicClass} />;',

    // Function call returning className
    'const el = <div className={getClassName(props)} />;',

    // Conditional without template literal
    'const el = <div className={isActive ? "active" : "inactive"} />;',

    // Array join without template literal
    'const el = <div className={classes.join(" ")} />;',

    // Object with computed property
    'const el = <div className={styles[variant]} />;',

    // Template literal without interpolation (just static text)
    'const el = <div className={`btn-primary`} />;',

    // Empty template literal
    'const el = <div className={``} />;',

    // Non-className attributes with template literals (should not trigger)
    'const el = <div id={`user-${id}`} className="static" />;',
    'const el = <div title={`Hello ${name}`} className="static" />;',
    'const el = <div data-test={`test-${type}`} className="static" />;',

    // cn() already imported and used
    'import {cn} from "@/lib/utils";\nconst el = <div className={cn("base", condition && "active")} />;',

    // Multiple className usages with cn()
    'const el = <div className={cn("btn")} />; const el2 = <div className={cn("card")} />;',
  ],
});
