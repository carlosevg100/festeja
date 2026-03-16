'use client';

import { ReactNode, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) => {
  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) onClose();
  }, [closeOnBackdropClick, onClose]);

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') onClose();
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleEscapeKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'bg-bg-secondary/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl',
                'shadow-2xl shadow-black/30 overflow-hidden',
                sizeStyles[size],
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                  {title && (
                    <h2 id="modal-title" className="text-base font-bold text-text-primary font-display">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-text-muted hover:text-text-primary ml-auto"
                      aria-label="Close modal"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              )}

              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps, ModalSize };
