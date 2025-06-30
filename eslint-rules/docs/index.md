# ESLint Custom Rules Documentation

This directory contains comprehensive documentation for each of the 5 custom ESLint rules in the FFXI-Complete project.
All rules are production-ready with extensive testing, auto-fix capabilities, and TypeScript integration.

## Rule Categories

> **Legend:** ✅ Auto-fixable | 🔧 Configurable | 🎯 TypeScript-aware | ⚡ Performance-optimized

### Code Quality Rules

- **[prefer-cn-for-classname](./prefer-cn-for-classname.md)** ✅ 🔧 - Enforces using the `cn()` utility function for
  dynamic className props with auto-import functionality
- **[no-redundant-default-props](./no-redundant-default-props.md)** ✅ 🔧 🎯 - Removes redundant prop usage when values
  match component defaults

### Import/Export Rules

- **[no-duplicate-imports](./no-duplicate-imports.md)** ✅ 🔧 ⚡ - Prevents duplicate import statements and
  consolidates imports from the same module
- **[no-duplicate-module-exports](./no-duplicate-module-exports.md)** ✅ 🔧 ⚡ - Prevents duplicate export statements and
  consolidates exports for cleaner module interfaces

### TypeScript Rules

- **[prefer-type-imports](./prefer-type-imports.md)** ✅ 🔧 🎯 ⚡ - Enforces TypeScript `import type` syntax and
  intelligently consolidates imports

## Quick Reference

All rules are:

- **Auto-fixable** with safe automatic fixes
- **Configurable** with various options
- **Well-tested** with comprehensive test suites
- **Documented** with examples and use cases

## Usage

For general usage instructions and setup, see the main [README.md](../README.md).

For rule-specific configuration and examples, click on any rule above to view its detailed documentation.

## Most Commonly Used Rules

If you're new to these custom rules, start with these high-impact rules:

1. **[prefer-type-imports](./prefer-type-imports.md)** - Essential for TypeScript projects (bundle size & clarity)
2. **[no-duplicate-imports](./no-duplicate-imports.md)** - Keeps imports clean and organized
3. **[prefer-cn-for-classname](./prefer-cn-for-classname.md)** - Critical for TailwindCSS/component library projects

## Performance Impact

Rules marked with ⚡ have been optimized for performance in large codebases:

- **AST Caching**: Reuses parsed AST nodes to avoid redundant analysis
- **Early Bailout**: Skips analysis when patterns don't match
- **Lazy Evaluation**: Only performs expensive operations when necessary
- **Memory Efficiency**: Minimizes memory usage during linting

## TypeScript Integration

Rules marked with 🎯 include advanced TypeScript features:

- **Type-Aware Analysis**: Uses TypeScript compiler API for accurate type checking
- **Context Sensitivity**: Different behavior based on type context (e.g., React hooks)
- **Graceful Fallback**: Works in JavaScript files without TypeScript information
- **Version Compatibility**: Supports TypeScript 4.x and 5.x
