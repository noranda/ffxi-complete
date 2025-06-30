# no-duplicate-module-exports

## Description

Prevents duplicate export statements for the same identifier and consolidates multiple export
statements from the same source module for cleaner export organization.

**Category:** Import/Export

## Rule Details

This rule detects duplicate export statements and multiple exports from the same source module,
automatically consolidating them for improved code organization and preventing potential conflicts.

## Examples

### ❌ Bad

```javascript
// Duplicate export statements
export {Button} from './Button';
export {Button} from './components/Button';

// Multiple exports from same source
export {Card} from './components';
export {CardHeader} from './components';
export {CardContent} from './components';
```

### ✅ Good

```javascript
// Single export statement
export {Button} from './components/Button';

// Consolidated exports from same source
export {Card, CardHeader, CardContent} from './components';
```

## Configuration

```javascript
{
  "local-rules/no-duplicate-module-exports": ["error", {
    "autoFix": true,
    "warnEmptyExports": false
  }]
}
```

### Options

- `autoFix` (default: `true`): Automatically fix duplicate exports by combining them
- `warnEmptyExports` (default: `false`): Warn about empty export statements

## When To Use

Use this rule when you want to:

- Maintain clean export organization in index files
- Prevent duplicate export conflicts
- Improve module interface clarity
- Follow JavaScript/TypeScript best practices for module exports

## Implementation

This rule is auto-fixable and will automatically consolidate duplicate and multiple exports from
the same source module while maintaining proper export syntax.

For more details, see the main [README.md](../README.md).
