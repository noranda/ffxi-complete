# FFXI Tracker Custom ESLint Rules

A streamlined collection of 5 custom ESLint rules for the FFXI Tracker project, designed for effectiveness and maintainability.

## Overview

This package contains 5 focused custom ESLint rules that enforce code quality, consistency,
and project-specific patterns. The rules have been simplified and optimized for reliability and performance.

### Available Rules

#### Code Quality Rules

- **prefer-cn-for-classname** - Enforces using `cn()` utility for dynamic className props
- **no-redundant-default-props** - Removes redundant prop values in JSX when set to defaults

#### Import/Export Rules

- **no-duplicate-imports** - Prevents duplicate import statements from the same module
- **no-duplicate-module-exports** - Prevents duplicate module exports from the same module
- **prefer-type-imports** - Consolidates separate type and regular imports from the same module

## Installation & Setup

The rules are integrated into this project via `eslint-plugin-local-rules`. They're configured in `eslint.config.js`:

```javascript
'local-rules/prefer-cn-for-classname': 'error',
'local-rules/no-redundant-default-props': 'error',
'local-rules/no-duplicate-imports': 'error',
'local-rules/no-duplicate-module-exports': 'error',
'local-rules/prefer-type-imports': 'error',
```

## Rule Details

### prefer-cn-for-classname

Enforces using the `cn()` utility function for dynamic className props instead of template literals.  
Automatically adds the `cn` import if missing.

```javascript
// ❌ Bad - Template literal with interpolation
<div className={`text-sm ${condition ? 'active' : 'inactive'}`} />

// ✅ Good - Using cn() utility
<div className={cn('text-sm', condition ? 'active' : 'inactive')} />
```

### no-redundant-default-props

Removes redundant prop values when explicitly setting props to their default values.

```javascript
// ❌ Bad - Explicitly setting default values
<Button variant="default" size="default">Click me</Button>

// ✅ Good - Let components use their defaults
<Button>Click me</Button>
```

### no-duplicate-imports

Prevents duplicate import statements from the same module by consolidating them.

```javascript
// ❌ Bad - Duplicate imports
import {useState} from 'react';
import {useEffect} from 'react';

// ✅ Good - Consolidated
import {useEffect, useState} from 'react';
```

### no-duplicate-module-exports

Prevents duplicate module exports by combining multiple export statements from the same source.

```javascript
// ❌ Bad - Duplicate exports
export {Button} from './components';
export {Card} from './components';

// ✅ Good - Combined export
export {Button, Card} from './components';
```

### prefer-type-imports

Consolidates separate type and regular imports from the same module into a single import statement.

```typescript
// ❌ Bad - Separate imports
import type {User} from './types';
import {createUser} from './types';

// ✅ Good - Consolidated
import {createUser, type User} from './types';
```

## Development Commands

```bash
# Test all rules
yarn test:rules

# Validate rules against ESLint standards
yarn validate:rules

# Run complete rules pipeline (test + validate)
yarn maintain:rules
```

## Testing

Each rule has comprehensive tests in `eslint-rules/tests/[rule-name].test.cjs`:

```bash
# Test specific rule
node eslint-rules/tests/prefer-cn-for-classname.test.cjs

# Test all rules
for test in eslint-rules/tests/*.test.cjs; do node "$test"; done
```

## Architecture

Simplified flat structure for maximum maintainability:

```text
eslint-rules/
├── rules/                     # Rule implementations (5 files)
│   ├── prefer-cn-for-classname.cjs
│   ├── no-redundant-default-props.cjs
│   ├── no-duplicate-imports.cjs
│   ├── no-duplicate-module-exports.cjs
│   └── prefer-type-imports.cjs
├── tests/                     # Test suites (5 files)
│   ├── prefer-cn-for-classname.test.cjs
│   ├── no-redundant-default-props.test.cjs
│   ├── no-duplicate-imports.test.cjs
│   ├── no-duplicate-module-exports.test.cjs
│   └── prefer-type-imports.test.cjs
├── docs/                      # Individual rule documentation
└── index.cjs                  # Main export file
```

## Design Principles

- **Simplicity**: Flat architecture with minimal complexity
- **Reliability**: Focus on common use cases, avoid edge case complexity
- **Performance**: Efficient AST traversal with minimal overhead
- **Maintainability**: Self-contained rules with comprehensive tests
- **Auto-fixing**: All rules provide safe automatic fixes

## Contributing

When modifying rules:

1. **Update tests first** - Ensure tests cover the change
2. **Test thoroughly** - Run `yarn test:rules` to verify all tests pass
3. **Validate compliance** - Run `yarn validate:rules` to ensure ESLint compliance
4. **Run full pipeline** - Run `yarn maintain:rules` to test everything
5. **Test in context** - Run `yarn lint` to test against the actual codebase

## License

Part of the FFXI Tracker project - see main project LICENSE file.
