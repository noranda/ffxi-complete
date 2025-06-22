import {cn} from '@/lib/utils';

/**
 * Input component props extending HTML input attributes
 */
type InputProps = React.ComponentProps<'input'>;

/**
 * Styled input component with consistent design system integration.
 * Provides accessible form input with proper focus and validation states.
 */
const Input: React.FC<InputProps> = ({className, type, ...props}) => (
  <input
    className={cn(
      // Base styles with file input and placeholder styling
      `border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
      // Focus states with ring styling
      `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`,
      // Error states for accessibility
      `aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40`,
      className
    )}
    data-slot="input"
    type={type}
    {...props}
  />
);
export {Input, type InputProps};
