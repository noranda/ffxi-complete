/**
 * ESLint rule to prevent duplicate module exports
 * Simplified version focusing on common cases
 */

module.exports = {
  create(context) {
    const sourceCode = context.getSourceCode();
    const moduleExports = new Map();

    /**
     * Combines multiple export statements from the same module
     * @param exports
     */
    function combineExports(exports) {
      if (exports.length <= 1) return null;

      const firstExport = exports[0];
      const source = sourceCode.getText(firstExport.source);

      // Collect all specifiers
      const regularSpecifiers = [];
      const typeSpecifiers = [];

      for (const exportNode of exports) {
        for (const specifier of exportNode.specifiers) {
          if (exportNode.exportKind === 'type') {
            typeSpecifiers.push(specifier);
          } else {
            regularSpecifiers.push(specifier);
          }
        }
      }

      // Format specifiers
      const formatSpecifier = (spec, isType = false) => {
        if (spec.local.name === spec.exported.name) {
          return isType ? `type ${spec.local.name}` : spec.local.name;
        } else {
          return isType
            ? `type ${spec.local.name} as ${spec.exported.name}`
            : `${spec.local.name} as ${spec.exported.name}`;
        }
      };

      // Combine and sort specifiers
      const regular = regularSpecifiers.map(spec => formatSpecifier(spec, false)).sort();
      const types = typeSpecifiers.map(spec => formatSpecifier(spec, true)).sort();
      const combined = [...regular, ...types].join(', ');

      return `export {${combined}} from ${source};`;
    }

    return {
      ExportNamedDeclaration(node) {
        // Only handle re-exports (exports with source)
        if (!node.source) return;

        const moduleName = node.source.value;
        if (!moduleExports.has(moduleName)) {
          moduleExports.set(moduleName, []);
        }
        moduleExports.get(moduleName).push(node);
      },

      Program() {
        moduleExports.clear();
      },

      'Program:exit'() {
        // Check for duplicates and report
        for (const [, exports] of moduleExports) {
          if (exports.length > 1) {
            const combinedText = combineExports(exports);
            if (combinedText) {
              // Report on the first export, fix by combining all
              context.report({
                fix(fixer) {
                  const fixes = [];

                  // Replace first export with combined version
                  fixes.push(fixer.replaceText(exports[0], combinedText));

                  // Remove subsequent exports
                  for (let i = 1; i < exports.length; i++) {
                    fixes.push(fixer.remove(exports[i]));
                  }

                  return fixes;
                },
                messageId: 'duplicateExport',
                node: exports[0],
              });
            }
          }
        }
      },
    };
  },

  meta: {
    docs: {
      category: 'Import/Export',
      description: 'Prevent duplicate export statements from the same module',
    },
    fixable: 'code',
    messages: {
      duplicateExport: 'Multiple exports from the same module should be combined',
    },
    schema: [],
    type: 'suggestion',
  },
};
