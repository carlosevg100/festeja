'use client';

import { forwardRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, suffix, className, type = 'text', ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
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
                'absolute left-3 top-1/2 -translate-y-1/2 origin-left font-medium pointer-events-none',
                isFocused || hasValue
                  ? 'text-accent-pink'
                  : 'text-text-secondary',
              )}
            >
              {label}
            </motion.label>
          )}

          <div className="relative flex items-center">
            {icon && (
              <div className="absolute left-3 text-text-secondary pointer-events-none">
                {icon}
              </div>
            )}

            <input
              ref={ref}
              type={type}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className={cn(
                'w-full bg-surface border border-border rounded-lg transition-all duration-200 font-body',
                'text-text-primary placeholder-text-muted',
                'focus:outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent',
                'focus:bg-surface-hover',
                error ? 'border-error focus:ring-error focus:border-transparent' : '',
                icon ? 'pl-10' : '',
                suffix ? 'pr-10' : '',
                label ? 'pt-5 pb-2 px-3' : 'px-3 py-2.5',
                className,
              )}
              {...props}
            />

            {suffix && (
              <div className="absolute right-3 text-text-secondary pointer-events-none">
                {suffix}
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-error font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
