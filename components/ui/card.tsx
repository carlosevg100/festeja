'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'interactive';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isInteractive = variant === 'interactive';

    const baseClasses = cn(
      'rounded-2xl backdrop-blur-xl border',
      'transition-all duration-300',
      paddingStyles[padding],
    );

    const variantClasses = {
      default:
        'bg-surface border-border hover:border-border-strong hover:bg-surface-hover',
      elevated:
        'bg-surface border-border-strong shadow-lg hover:shadow-card-hover bg-gradient-to-br from-surface to-surface',
      interactive:
        'bg-surface border-border hover:border-border-strong cursor-pointer',
    };

    const content = (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );

    if (isInteractive) {
      return (
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  },
);

Card.displayName = 'Card';

export { Card };
export type { CardProps, CardVariant, CardPadding };
