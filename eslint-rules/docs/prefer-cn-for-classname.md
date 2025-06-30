# prefer-cn-for-classname

## Description

Enforces using the `cn()` utility function for dynamic className props instead of template literals.
Automatically adds the `cn` import if missing and provides auto-fix functionality.

**Category:** Code Quality
**Severity:** Error
**Auto-fixable:** ✅ Yes

## Rule Details

This rule detects template literals in className props containing interpolation and enforces using the cn()
utility function instead. The rule provides auto-fix functionality that converts patterns like
`className={`text-sm ${condition ? 'class1' : 'class2'}`}` to `className={cn('text-sm', condition ? 'class1' : 'class2')}`
and automatically adds the cn import if missing.

The `cn()` utility function provides proper class merging capabilities, handles conflicts between classes,
and follows the established patterns in modern React component libraries like shadcn/ui.

### Why This Rule Exists

- **Proper Class Merging**: Template literals can't handle class conflicts (e.g., `bg-red-500 bg-blue-500`)
- **Conditional Logic**: Template literals with complex conditions become hard to read
- **Consistency**: Ensures all dynamic className usage follows the same pattern
- **Auto-Import**: Automatically adds the cn import when needed

## Examples

### ❌ Bad

```javascript
// Template literal with interpolation - can't handle class conflicts
<div className={`text-sm ${condition ? 'active' : 'inactive'}`} />

// String concatenation - prone to spacing issues
<Button className={'btn ' + variant} />

// Complex conditional logic - becomes unreadable
<Card className={`base ${isSelected ? 'selected' : ''} ${size === 'large' ? 'large' : ''}`} />

// Multiple conditions with spacing issues
<Dialog className={`dialog${isOpen ? ' open' : ''}${hasError ? ' error' : ''}`} />

// Nested ternary in template literal
<Alert className={`alert ${type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'}`} />
```

### ✅ Good

```javascript
// Using cn() utility for proper class merging
<div className={cn('text-sm', condition ? 'active' : 'inactive')} />

// Clean conditional logic with cn()
<Button className={cn('btn', variant)} />

// Complex conditionals handled properly with object syntax
<Card className={cn('base', {
  'selected': isSelected,
  'large': size === 'large'
})} />

// Clean multiple conditions
<Dialog className={cn('dialog', {
  'open': isOpen,
  'error': hasError
})} />

// Readable nested conditions
<Alert className={cn('alert', {
  'alert-error': type === 'error',
  'alert-warning': type === 'warning',
  'alert-info': type === 'info'
})} />

// Array syntax for complex logic
<Component className={cn([
  'base-class',
  variant && `variant-${variant}`,
  isActive && 'active',
  disabled && 'disabled'
])} />
```

## Configuration

```javascript
{
  "local-rules/prefer-cn-for-classname": ["error", {
    "cnImportName": "cn",
    "allowSimpleStrings": true,
    "allowTemplateLiteralsWithoutExpressions": true
  }]
}
```

### Options

- `cnImportName` (default: `"cn"`): Name of the cn utility function import
- `allowSimpleStrings` (default: `true`): Allow simple string literals without interpolation
- `allowTemplateLiteralsWithoutExpressions` (default: `true`): Allow template literals that contain no expressions

### Advanced Configuration Examples

```javascript
// Strict mode - require cn() for all className usage
{
  "local-rules/prefer-cn-for-classname": ["error", {
    "allowSimpleStrings": false,
    "allowTemplateLiteralsWithoutExpressions": false
  }]
}

// Custom utility function name
{
  "local-rules/prefer-cn-for-classname": ["error", {
    "cnImportName": "classNames"
  }]
}
```

## When To Use

Use this rule when you want to ensure consistent use of a class merging utility like `cn()` for dynamic className props.
This is particularly useful in:

- **Component Libraries**: Where proper class merging is important for theme overrides
- **Design Systems**: To maintain consistent className patterns
- **TailwindCSS Projects**: Where class conflicts need proper resolution
- **Large Codebases**: To enforce consistent patterns across teams

### Benefits

1. **Automatic Class Merging**: Handles conflicting classes properly
2. **Better Readability**: Complex conditions are more readable with object/array syntax
3. **Auto-Import**: Automatically adds imports when needed
4. **Consistency**: Enforces the same pattern throughout the codebase
5. **Type Safety**: Works well with TypeScript for better autocompletion

## Implementation

This rule is auto-fixable and will automatically:

- Convert template literals to cn() calls
- Add the cn import if missing from @/lib/utils (with configurable import name)
- Handle complex conditional logic appropriately
- Preserve existing spacing and formatting when possible

### Auto-Fix Examples

```javascript
// Before auto-fix
className={`base ${active ? 'active' : ''}`}

// After auto-fix (with auto-import added)
import {cn} from '@/lib/utils';
// ...
className={cn('base', active && 'active')}
```

### Technical Details

The rule uses AST analysis to:

1. Detect template literals in className/class props
2. Identify interpolated expressions within template literals
3. Parse conditional logic and convert to appropriate cn() syntax
4. Check for existing cn imports and add if missing
5. Generate appropriate fixes while preserving logic

## Related Rules

- `@stylistic/jsx-curly-newline` - Controls JSX expression formatting
- `react/jsx-curly-brace-presence` - Controls when to use braces in JSX props

For more details, see the main [README.md](../README.md).
