/**
 * FFXI Tracker Custom ESLint Rules
 *
 * Simplified ESLint plugin with essential rules for code quality.
 * Used with eslint-plugin-local-rules for local rule development.
 */

const noDuplicateImports = require('./rules/no-duplicate-imports.cjs');
const noDuplicateModuleExports = require('./rules/no-duplicate-module-exports.cjs');
// Import all simplified rules
const noRedundantDefaultProps = require('./rules/no-redundant-default-props.cjs');
const preferCnForClassname = require('./rules/prefer-cn-for-classname.cjs');
const preferTypeImports = require('./rules/prefer-type-imports.cjs');
const preferUiComponents = require('./rules/prefer-ui-components.cjs');

/**
 * Export all rules in the format expected by eslint-plugin-local-rules
 *
 * Simplified rules focusing on essential code quality patterns:
 * - Code Quality: JSX/React improvements and prop optimizations
 * - Imports/Exports: Module organization and deduplication
 * - TypeScript: Type-only import management
 * - UI Components: Consistent component usage patterns
 */
module.exports = {
  // Essential rules in alphabetical order (6 total)
  'no-duplicate-imports': noDuplicateImports,
  'no-duplicate-module-exports': noDuplicateModuleExports,
  'no-redundant-default-props': noRedundantDefaultProps,
  'prefer-cn-for-classname': preferCnForClassname,
  'prefer-type-imports': preferTypeImports,
  'prefer-ui-components': preferUiComponents,
};
