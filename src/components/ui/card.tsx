import {tv, type VariantProps} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Card component variants using tailwind-variants
 * Provides consistent styling for different card sizes and visual styles
 */
const cardVariants = tv({
  base: 'bg-card text-card-foreground flex flex-col rounded-xl border',
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: 'gap-6 py-6',
      lg: 'gap-8 py-8',
      sm: 'gap-4 py-4',
    },
    variant: {
      default: 'shadow-sm',
      ghost: 'border-transparent shadow-none',
      outlined: 'shadow-none',
    },
  },
});

/**
 * Card spacing variants for sub-components
 * Provides consistent padding based on card size
 */
const cardSpacingVariants = tv({
  variants: {
    size: {
      default: 'px-6',
      lg: 'px-8',
      sm: 'px-4',
    },
  },
});

/**
 * Card title variants for typography sizing
 * Provides consistent title sizing based on card size
 */
const cardTitleVariants = tv({
  base: 'leading-none font-semibold',
  variants: {
    size: {
      default: 'text-lg',
      lg: 'text-xl',
      sm: 'text-base',
    },
  },
});

/**
 * Card description variants for consistent styling
 */
const cardDescriptionVariants = tv({
  base: 'text-muted-foreground text-sm',
});

/**
 * Card action variants for positioning
 */
const cardActionVariants = tv({
  base: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
});

/**
 * Card header variants for complex grid layout
 */
const cardHeaderVariants = tv({
  base: '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
});

/**
 * Card footer variants for layout
 */
const cardFooterVariants = tv({
  base: 'flex items-center [.border-t]:pt-6',
});

/**
 * Card action component props extending HTML div attributes
 */
type CardActionProps = React.ComponentProps;

/**
 * Card content component props extending HTML div attributes
 */
type CardContentProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Card description component props extending HTML div attributes
 */
type CardDescriptionProps = React.ComponentProps;

/**
 * Card footer component props extending HTML div attributes
 */
type CardFooterProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Card header component props extending HTML div attributes
 */
type CardHeaderProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Card component props extending HTML div attributes
 * with variant styling support
 */
type CardProps = React.ComponentProps & VariantProps;

/**
 * Card title component props extending HTML div attributes
 */
type CardTitleProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Main card container component with elevation and rounded styling.
 * Provides a flexible foundation for content cards with multiple size and style variants.
 */
const Card: React.FC = ({className, size, variant, ...props}) => (
  <div className={cn(cardVariants({className, size, variant}))} data-slot="card" {...props} />
);

/**
 * Card header component with grid layout for title and action areas.
 * Automatically handles layout when action components are present.
 */
const CardHeader: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(cardHeaderVariants(), cardSpacingVariants({size}), className)}
    data-slot="card-header"
    {...props}
  />
);

/**
 * Card title component with consistent typography.
 * Should be used within CardHeader for proper layout.
 */
const CardTitle: React.FC = ({className, size = 'default', ...props}) => (
  <div className={cn(cardTitleVariants({size}), className)} data-slot="card-title" {...props} />
);

/**
 * Card description component with muted text styling.
 * Provides secondary information below the title.
 */
const CardDescription: React.FC = ({className, ...props}) => (
  <div className={cn(cardDescriptionVariants(), className)} data-slot="card-description" {...props} />
);

/**
 * Card action component positioned in the top-right of the header.
 * Used for buttons, icons, or other interactive elements.
 */
const CardAction: React.FC = ({className, ...props}) => (
  <div className={cn(cardActionVariants(), className)} data-slot="card-action" {...props} />
);

/**
 * Card content area with consistent padding.
 * Contains the main body content of the card.
 */
const CardContent: React.FC = ({className, size = 'default', ...props}) => (
  <div className={cn(cardSpacingVariants({size}), className)} data-slot="card-content" {...props} />
);

/**
 * Card footer component with horizontal layout.
 * Typically used for actions or additional information.
 */
const CardFooter: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(cardFooterVariants(), cardSpacingVariants({size}), className)}
    data-slot="card-footer"
    {...props}
  />
);

export {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle};
export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
