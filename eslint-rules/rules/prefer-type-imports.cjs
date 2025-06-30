/**
 * ESLint rule to consolidate separate type and regular imports from the same module
 * Simplified version that only handles literal separate import statements
 */

module.exports = {
  create(context) {
    const sourceCode = context.getSourceCode();
    const importsByModule = new Map();

    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value;
        if (!importsByModule.has(moduleName)) {
          importsByModule.set(moduleName, []);
        }
        importsByModule.get(moduleName).push(node);
      },

      Program() {
        importsByModule.clear();
      },

      'Program:exit'() {
        // Check for modules with multiple import statements
        for (const [, imports] of importsByModule) {
          if (imports.length > 1) {
            // Check if we have both type and regular imports that can be consolidated
            const hasTypeImport = imports.some(imp => imp.importKind === 'type');
            const hasRegularImport = imports.some(imp => imp.importKind !== 'type');

            if (hasTypeImport && hasRegularImport) {
              // Report on the first import
              context.report({
                fix(fixer) {
                  const fixes = [];

                  // Collect all specifiers
                  const regularSpecifiers = [];
                  const typeSpecifiers = [];

                  for (const importNode of imports) {
                    for (const spec of importNode.specifiers) {
                      if (spec.type === 'ImportSpecifier') {
                        const specText =
                          spec.imported.name === spec.local.name
                            ? spec.imported.name
                            : `${spec.imported.name} as ${spec.local.name}`;

                        if (importNode.importKind === 'type') {
                          typeSpecifiers.push(`type ${specText}`);
                        } else {
                          regularSpecifiers.push(specText);
                        }
                      }
                    }
                  }

                  // Create consolidated import
                  const allSpecifiers = [...regularSpecifiers.sort(), ...typeSpecifiers.sort()];
                  const source = sourceCode.getText(imports[0].source);
                  const consolidatedImport = `import {${allSpecifiers.join(', ')}} from ${source};`;

                  // Replace first import
                  fixes.push(fixer.replaceText(imports[0], consolidatedImport));

                  // Remove subsequent imports
                  for (let i = 1; i < imports.length; i++) {
                    fixes.push(fixer.remove(imports[i]));
                  }

                  return fixes;
                },
                messageId: 'consolidateImports',
                node: imports[0],
              });
            }
          }
        }
      },
    };
  },

  meta: {
    docs: {
      category: 'TypeScript',
      description: 'Consolidate separate type and regular imports from the same module',
    },
    fixable: 'code',
    messages: {
      consolidateImports: 'Consolidate separate imports from the same module into a single import',
    },
    schema: [],
    type: 'suggestion',
  },
};
