'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'custom';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circle: 'w-12 h-12 rounded-full',
    rect: 'w-full h-40 rounded-xl',
    custom: '',
  };

  const customDimensions = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-surface via-surface-hover to-surface',
        'animate-shimmer bg-[length:200%_100%]',
        variantStyles[variant],
        className,
      )}
      style={customDimensions}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps, SkeletonVariant };
