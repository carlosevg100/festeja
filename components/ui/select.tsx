'use client';

import { forwardRef, useState, ReactNode, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      onChange,
      placeholder = 'Selecione uma opção',
      value = '',
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (optValue: string) => {
      setSelectedValue(optValue);
      onChange?.(optValue);
      setIsOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isOpen]);

    return (
      <div className="w-full">
        <div className="relative" ref={containerRef}>
          {label && (
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {label}
            </label>
          )}

          {/* Hidden select for form submission */}
          <select
            ref={ref}
            value={selectedValue}
            onChange={(e) => handleSelect(e.target.value)}
            className="sr-only"
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom trigger button */}
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5 rounded-lg',
              'bg-surface border border-border text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent',
              'focus:bg-surface-hover transition-all duration-200',
              error && 'border-error focus:ring-error',
              className,
            )}
          >
            <span
              className={cn(
                'flex items-center gap-2',
                !selectedOption && 'text-text-muted',
              )}
            >
              {selectedOption?.icon && <span>{selectedOption.icon}</span>}
              <span>{selectedOption?.label || placeholder}</span>
            </span>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-text-secondary" />
            </motion.div>
          </motion.button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute top-full left-0 right-0 z-50 mt-2',
                  'bg-bg-secondary border border-border rounded-lg',
                  'backdrop-blur-xl shadow-card overflow-hidden',
                )}
              >
                <div className="max-h-72 overflow-y-auto">
                  {options.length > 0 ? (
                    options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-3 text-left',
                          'transition-colors duration-200 border-b border-border last:border-b-0',
                          selectedValue === opt.value
                            ? 'bg-surface-hover text-accent-pink'
                            : 'text-text-primary hover:bg-surface-hover',
                        )}
                      >
                        {opt.icon && <span>{opt.icon}</span>}
                        <span>{opt.label}</span>
                        {selectedValue === opt.value && (
                          <span className="ml-auto text-accent-pink">✓</span>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-text-muted text-sm">
                      Nenhuma opção disponível
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

Select.displayName = 'Select';

export { Select };
export type { SelectProps, SelectOption };
