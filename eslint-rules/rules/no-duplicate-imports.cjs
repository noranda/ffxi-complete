/**
 * ESLint rule to prevent duplicate imports from the same module
 * Simplified version focusing on common cases
 */

module.exports = {
  create(context) {
    const sourceCode = context.getSourceCode();
    const moduleImports = new Map();

    /**
     * Combines multiple import statements from the same module
     * @param imports
     */
    function combineImports(imports) {
      if (imports.length <= 1) return null;

      const firstImport = imports[0];
      const source = sourceCode.getText(firstImport.source);

      // Collect all specifiers
      const defaultImports = [];
      const namespaceImports = [];
      const namedImports = [];
      const typeImports = [];

      for (const importNode of imports) {
        for (const specifier of importNode.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier') {
            defaultImports.push(specifier.local.name);
          } else if (specifier.type === 'ImportNamespaceSpecifier') {
            namespaceImports.push(`* as ${specifier.local.name}`);
          } else if (specifier.type === 'ImportSpecifier') {
            const importText =
              specifier.imported.name === specifier.local.name
                ? specifier.imported.name
                : `${specifier.imported.name} as ${specifier.local.name}`;

            // Check both the import statement and individual specifier for type modifier
            if (importNode.importKind === 'type' || specifier.importKind === 'type') {
              typeImports.push(`type ${importText}`);
            } else {
              namedImports.push(importText);
            }
          }
        }
      }

      // Combine all imports
      const allParts = [];

      if (defaultImports.length > 0) {
        allParts.push(defaultImports[0]); // Only one default import allowed
      }

      if (namespaceImports.length > 0) {
        allParts.push(namespaceImports[0]); // Only one namespace import allowed
      }

      // Combine named and type imports
      const combinedNamed = [...namedImports.sort(), ...typeImports.sort()];
      if (combinedNamed.length > 0) {
        allParts.push(`{${combinedNamed.join(', ')}}`);
      }

      return `import ${allParts.join(', ')} from ${source};`;
    }

    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value;
        if (!moduleImports.has(moduleName)) {
          moduleImports.set(moduleName, []);
        }
        moduleImports.get(moduleName).push(node);
      },

      Program() {
        moduleImports.clear();
      },

      'Program:exit'() {
        // Check for duplicates and report
        for (const [, imports] of moduleImports) {
          if (imports.length > 1) {
            const combinedText = combineImports(imports);
            if (combinedText) {
              // Report on the first import, fix by combining all
              context.report({
                fix(fixer) {
                  const fixes = [];

                  // Replace first import with combined version
                  fixes.push(fixer.replaceText(imports[0], combinedText));

                  // Remove subsequent imports
                  for (let i = 1; i < imports.length; i++) {
                    fixes.push(fixer.remove(imports[i]));
                  }

                  return fixes;
                },
                messageId: 'duplicateImport',
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
      category: 'Import/Export',
      description: 'Prevent multiple import statements from the same module',
    },
    fixable: 'code',
    messages: {
      duplicateImport: 'Multiple imports from the same module should be combined',
    },
    schema: [],
    type: 'suggestion',
  },
};
