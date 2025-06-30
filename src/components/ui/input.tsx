import {tv, type VariantProps} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Input component variants using tailwind-variants
 * Provides consistent styling for different input sizes
 */
const inputVariants = tv({
  base: [
    // Base styles with file input and placeholder styling
    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    // Focus states with ring styling
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    // Error states for accessibility
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40',
  ],
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: 'h-9 px-3 py-1 file:h-7',
      lg: 'h-10 px-4 py-2 file:h-8',
      sm: 'h-8 px-2.5 py-1.5 text-sm file:h-6',
    },
  },
});

/**
 * Input component props extending HTML input attributes
 * with variant styling support
 */
type InputProps = React.ComponentProps & VariantProps;

/**
 * Styled input component with consistent design system integration.
 * Provides accessible form input with proper focus and validation states.
 */
const Input: React.FC = ({className, size, type, ...props}) => (
  // eslint-disable-next-line local-rules/prefer-ui-components
  <input className={cn(inputVariants({className, size}))} data-slot="input" type={type} {...props} />
);

export {Input, type InputProps};
