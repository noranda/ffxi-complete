import {tv} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Typography component variants using tailwind-variants
 * Provides consistent styling for different text elements
 */
const typographyVariants = tv({
  base: 'text-foreground',
  defaultVariants: {
    variant: 'p',
  },
  variants: {
    variant: {
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      code: 'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      large: 'text-lg font-semibold',
      lead: 'text-muted-foreground text-xl',
      muted: 'text-muted-foreground text-sm',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      small: 'text-sm leading-none font-medium',
    },
  },
});

/**
 * Typography component props
 */
type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'blockquote' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  children?: React.ReactNode;
  className?: string;
  variant?: 'blockquote' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'large' | 'lead' | 'muted' | 'p' | 'small';
};

/**
 * Mapping of typography variants to their corresponding HTML elements
 */
const variantElementMap = {
  blockquote: 'blockquote',
  code: 'code',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  large: 'p',
  lead: 'p',
  muted: 'p',
  p: 'p',
  small: 'p',
} as const;

/**
 * Typography component with semantic HTML elements and consistent styling.
 * Provides a flexible foundation for text content with multiple variants.
 */
const Typography: React.FC<TypographyProps> = ({as, className, variant = 'p', ...props}) => {
  const Component = as || variantElementMap[variant] || 'p';

  return <Component className={cn(typographyVariants({variant}), className)} {...props} />;
};

/**
 * Text component for simple paragraph text
 */
const Text: React.FC<TypographyProps> = ({className, ...props}) => (
  <Typography className={className} variant="p" {...props} />
);

export {Text, Typography};
export type {TypographyProps};
