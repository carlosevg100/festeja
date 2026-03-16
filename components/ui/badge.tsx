'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border border-success/30',
  warning: 'bg-warning/10 text-warning border border-warning/30',
  error: 'bg-error/10 text-error border border-error/30',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  pending: 'bg-text-muted/10 text-text-muted border border-text-muted/30',
  accent: 'bg-accent-pink/10 text-accent-pink border border-accent-pink/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-xs rounded-md gap-1.5',
  md: 'px-3 py-1.5 text-sm rounded-lg gap-2',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-blue-400',
  pending: 'bg-text-muted',
  accent: 'bg-accent-pink',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'info',
      size = 'md',
      dot = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold transition-colors duration-200 font-display',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              dotColors[variant],
            )}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
