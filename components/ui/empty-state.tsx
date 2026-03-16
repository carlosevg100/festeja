'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 py-12 px-6 rounded-2xl',
        'bg-gradient-to-br from-surface to-bg-secondary',
        'border border-border backdrop-blur-xl',
        'text-center',
        className,
      )}
    >
      {/* Icon Container */}
      {icon && (
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-accent-pink/20 to-accent-coral/20',
            'border border-accent-pink/30',
            'text-accent-pink',
          )}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold font-display text-text-primary">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="md"
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { EmptyStateProps };
