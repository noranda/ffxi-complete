/**
 * ESLint rule to prefer cn() utility for className props
 * Simplified version focusing on common cases
 */

module.exports = {
  create(context) {
    const sourceCode = context.getSourceCode();

    /**
     * Checks if cn utility is imported
     */
    function isCnImported() {
      const imports = sourceCode.ast.body.filter(node => node.type === 'ImportDeclaration');
      return imports.some(importNode => {
        return importNode.specifiers?.some(spec => spec.type === 'ImportSpecifier' && spec.imported.name === 'cn');
      });
    }

    /**
     * Adds cn import to the file
     * @param fixer
     */
    function addCnImport(fixer) {
      const imports = sourceCode.ast.body.filter(node => node.type === 'ImportDeclaration');
      const lastImport = imports[imports.length - 1];

      const cnImport = "import {cn} from '@/lib/utils';";

      if (lastImport) {
        return fixer.insertTextAfter(lastImport, `\n${cnImport}`);
      } else {
        return fixer.insertTextBefore(sourceCode.ast.body[0], `${cnImport}\n\n`);
      }
    }

    /**
     * Converts template literal to cn() call
     * @param templateLiteral
     */
    function convertToCn(templateLiteral) {
      const parts = [];

      // Process quasis (string parts) and expressions
      for (let i = 0; i < templateLiteral.quasis.length; i++) {
        const quasi = templateLiteral.quasis[i];
        const expression = templateLiteral.expressions[i];

        // Add string part if not empty
        if (quasi.value.raw) {
          parts.push(`"${quasi.value.raw}"`);
        }

        // Add expression if exists
        if (expression) {
          parts.push(sourceCode.getText(expression));
        }
      }

      // Filter out empty strings
      const nonEmptyParts = parts.filter(part => part !== '""');

      return `cn(${nonEmptyParts.join(', ')})`;
    }

    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== 'className') return;

        // Only check template literals
        if (node.value?.type !== 'JSXExpressionContainer' || node.value.expression?.type !== 'TemplateLiteral') return;

        const templateLiteral = node.value.expression;

        // Only care about template literals with expressions
        if (templateLiteral.expressions.length === 0) return;

        context.report({
          fix(fixer) {
            const fixes = [];

            // Add cn import if not present
            if (!isCnImported()) {
              fixes.push(addCnImport(fixer));
            }

            // Convert template literal to cn() call
            const converted = convertToCn(templateLiteral);
            fixes.push(fixer.replaceText(node.value, `{${converted}}`));

            return fixes;
          },
          messageId: 'preferCn',
          node,
        });
      },
    };
  },

  meta: {
    docs: {
      category: 'Code Quality',
      description: 'Prefer cn() utility for dynamic className props',
    },
    fixable: 'code',
    messages: {
      preferCn: 'Use cn() utility for dynamic className instead of template literals',
    },
    schema: [],
    type: 'suggestion',
  },
};
