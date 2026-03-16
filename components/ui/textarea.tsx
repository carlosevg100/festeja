'use client';

import { forwardRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  maxCharacters?: number;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      showCharCount = false,
      maxCharacters,
      autoResize = false,
      className,
      value,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : 0,
    );

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setHasValue(newValue.length > 0);
      setCharCount(newValue.length);

      if (autoResize && ref && typeof ref !== 'function') {
        const target = ref.current;
        if (target) {
          target.style.height = 'auto';
          target.style.height = `${Math.max(target.scrollHeight, 80)}px`;
        }
      }

      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <motion.label
              animate={{
                y: isFocused || hasValue ? -20 : 0,
                scale: isFocused || hasValue ? 0.85 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute left-3 top-5 origin-left font-medium pointer-events-none',
                isFocused || hasValue
                  ? 'text-accent-pink'
                  : 'text-text-secondary',
              )}
            >
              {label}
            </motion.label>
          )}

          <textarea
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            maxLength={maxCharacters}
            className={cn(
              'w-full bg-surface border border-border rounded-lg transition-all duration-200 font-body resize-none',
              'text-text-primary placeholder-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent',
              'focus:bg-surface-hover',
              error ? 'border-error focus:ring-error focus:border-transparent' : '',
              label ? 'pt-8 pb-2 px-3' : 'px-3 py-2.5',
              className,
            )}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error font-medium"
            >
              {error}
            </motion.p>
          )}

          {showCharCount && (
            <span
              className={cn(
                'text-sm font-medium',
                charCount > (maxCharacters || 0) * 0.9
                  ? 'text-warning'
                  : 'text-text-secondary',
              )}
            >
              {charCount}
              {maxCharacters && `/${maxCharacters}`}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
