'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  goal: number;
  label?: string;
  showLabel?: boolean;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const heightStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const ProgressBar = ({
  current,
  goal,
  label,
  showLabel = true,
  showPercentage = true,
  height = 'md',
  animated = true,
}: ProgressBarProps) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between">
          {showLabel && label && (
            <p className="text-sm font-medium text-text-secondary">{label}</p>
          )}
          {showPercentage && (
            <p className="text-sm font-semibold text-accent-pink">
              {Math.round(percentage)}%
            </p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn('w-full bg-surface rounded-full overflow-hidden border border-border')}>
        <motion.div
          initial={animated ? { width: '0%' } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 1.2, ease: 'easeOut', delay: 0.2 }
              : { duration: 0 }
          }
          className={cn(
            'h-full rounded-full bg-gradient-primary',
            'shadow-glow-pink transition-all duration-300',
          )}
        />
      </div>

      {/* Footer Info */}
      {goal > 0 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <p>
            <span className="text-accent-pink font-semibold">
              {current.toLocaleString()}
            </span>
            {' '}
            de
            {' '}
            <span>{goal.toLocaleString()}</span>
          </p>
          {remaining > 0 && (
            <p>
              Faltam
              {' '}
              <span className="text-accent-coral font-semibold">
                {remaining.toLocaleString()}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
export type { ProgressBarProps };
