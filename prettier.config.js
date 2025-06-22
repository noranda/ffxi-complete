/** @type {import('prettier').Config} */
export default {
  arrowParens: 'avoid',
  bracketSpacing: false,
  endOfLine: 'lf',
  // Tailwind CSS class sorting
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['tv', 'cva', 'cn', 'clsx'],
  trailingComma: 'es5',
};
