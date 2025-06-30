# no-duplicate-imports

## Description

Prevents duplicate import statements from the same module and automatically consolidates them into
single import statements for cleaner code organization.

**Category:** Import/Export

## Rule Details

This rule detects multiple import statements from the same module source and consolidates them into
a single import statement. It handles both named imports and default imports appropriately.

## Examples

### ❌ Bad

```javascript
// Multiple imports from same module
import {useState} from 'react';
import {useEffect} from 'react';
import React from 'react';

// Duplicate utility imports
import {clsx} from 'clsx';
import {twMerge} from 'clsx';
```

### ✅ Good

```javascript
// Consolidated imports
import React, {useState, useEffect} from 'react';

// Single import from module
import {clsx, twMerge} from 'clsx';
```

## Configuration

```javascript
{
  "local-rules/no-duplicate-imports": ["error", {
    "caseSensitive": true,
    "ignoreTypeImports": false,
    "includeExports": false
  }]
}
```

### Options

- `caseSensitive` (default: `true`): Whether module path comparison should be case sensitive
- `ignoreTypeImports` (default: `false`): Whether to ignore type-only imports in duplicate detection
- `includeExports` (default: `false`): Whether to also check for duplicate export declarations

## When To Use

Use this rule when you want to:

- Maintain clean import organization
- Reduce code duplication in import statements
- Improve code readability
- Follow JavaScript/TypeScript best practices

## Implementation

This rule is auto-fixable and will automatically consolidate duplicate imports from the same module
while preserving both default and named imports appropriately.

For more details, see the main [README.md](../README.md).
