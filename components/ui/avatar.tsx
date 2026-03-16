'use client';

import { forwardRef, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  ring?: boolean;
  icon?: ReactNode;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-base' },
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      name,
      initials,
      size = 'md',
      ring = false,
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    const { container, text } = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={cn(
          container,
          'rounded-full flex items-center justify-center flex-shrink-0',
          'overflow-hidden bg-gradient-to-br from-accent-pink to-accent-coral',
          ring && 'ring-2 ring-accent-pink ring-offset-2 ring-offset-bg-primary',
          className,
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : icon ? (
          <div className={cn('flex items-center justify-center', text)}>
            {icon}
          </div>
        ) : (
          <span
            className={cn(
              'font-bold text-white font-display',
              text,
            )}
          >
            {initials || (name ? getInitials(name) : '?')}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps, AvatarSize };
