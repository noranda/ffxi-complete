import {Slot} from '@radix-ui/react-slot';
import {tv, type VariantProps} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Button component variants using tailwind-variants
 * Provides consistent styling for different button states and sizes
 */
const buttonVariants = tv({
  base: `focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: `h-9 px-4 py-2 has-[>svg]:px-3`,
      icon: 'size-9',
      lg: `h-10 rounded-md px-6 has-[>svg]:px-4`,
      sm: `h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5`,
    },
    variant: {
      default: `bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs`,
      destructive: `bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs`,
      ghost: `hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50`,
      link: `text-primary underline-offset-4 hover:underline`,
      outline: `bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs`,
    },
  },
});

/**
 * Button component props extending HTML button attributes
 * with variant styling and asChild composition pattern
 */
type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render as child component using Radix Slot */
    asChild?: boolean;
  };

/**
 * Versatile button component with multiple variants and sizes.
 * Supports composition pattern through asChild prop using Radix Slot.
 */
const Button: React.FC<ButtonProps> = ({asChild = false, className, size, variant, ...props}) => {
  // Use Slot for composition or regular button element
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(buttonVariants({className, size, variant}))} data-slot="button" {...props} />;
};

export {Button, type ButtonProps};
