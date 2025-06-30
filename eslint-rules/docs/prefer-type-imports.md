# prefer-type-imports

## Description

Enforces using TypeScript's `import type` syntax for type-only imports and consolidates separate type-only
and regular imports from the same module into single mixed imports with inline type annotations.

**Category:** TypeScript

## Rule Details

This rule enforces the use of `import type` for type-only imports and automatically consolidates imports
from the same module. It provides auto-fix functionality that groups regular imports first, then type
imports (both alphabetically sorted within groups).

## Examples

### ❌ Bad

```typescript
// Separate imports from same module
import type {User} from '@/lib/user';
import {createUser} from '@/lib/user';

// Regular import for type-only usage
import {ComponentProps} from 'react';
type ButtonProps = ComponentProps;
```

### ✅ Good

```typescript
// Consolidated mixed import
import {createUser, type User} from '@/lib/user';

// Proper type-only import
import type {ComponentProps} from 'react';
type ButtonProps = ComponentProps;
```

## Configuration

```javascript
{
  "local-rules/prefer-type-imports": ["error", {
    "prefer": "inline-type-imports",
    "disallowTypeAnnotations": true,
    "fixMixedImportsInline": true
  }]
}
```

### Options

- `prefer` (default: `"type-imports"`): Style preference - `"type-imports"` or `"inline-type-imports"`
- `disallowTypeAnnotations` (default: `true`): Whether to disallow TypeScript type annotations in imports
- `fixMixedImportsInline` (default: `true`): Whether to fix mixed imports using inline type annotations

## When To Use

Use this rule when you want to:

- Maintain clear separation between type and runtime imports
- Reduce bundle size by enabling better tree-shaking
- Consolidate imports for cleaner code organization
- Follow TypeScript best practices for import organization

## Implementation

This rule is auto-fixable and will automatically:

- Convert runtime imports used only for types to `import type`
- Consolidate separate imports from the same module
- Sort imports with regular imports first, then type imports
- Preserve alphabetical ordering within each group

For more details, see the main [README.md](../README.md).
