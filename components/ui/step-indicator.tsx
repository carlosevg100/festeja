'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const StepIndicator = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
}: StepIndicatorProps) => {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col gap-6',
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              orientation === 'horizontal' && index < steps.length - 1 && 'flex-1',
            )}
          >
            {/* Step Circle */}
            <motion.button
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              whileHover={onStepClick ? { scale: 1.1 } : {}}
              whileTap={onStepClick ? { scale: 0.95 } : {}}
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                'font-semibold font-display text-sm transition-all duration-300 relative',
                onStepClick ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-success"
                >
                  <Check size={20} className="text-white" />
                </motion.div>
              ) : (
                <>
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full transition-all duration-300',
                      isCurrent
                        ? 'bg-gradient-primary shadow-glow-pink border border-accent-pink'
                        : 'bg-surface border border-border',
                    )}
                  />
                  <span
                    className={cn(
                      'relative font-bold transition-colors duration-300',
                      isCurrent ? 'text-white' : 'text-text-secondary',
                    )}
                  >
                    {index + 1}
                  </span>
                </>
              )}
            </motion.button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'relative transition-all duration-300',
                  orientation === 'horizontal'
                    ? 'flex-1 h-1 mx-2 rounded-full'
                    : 'w-1 h-16 ml-6',
                  isCompleted ? 'bg-success' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface VerticalStepIndicatorProps extends Omit<StepIndicatorProps, 'orientation'> {}

interface DetailedStepIndicatorProps extends StepIndicatorProps {
  showLabels?: boolean;
  showDescriptions?: boolean;
}

const DetailedStepIndicator = ({
  steps,
  currentStep,
  onStepClick,
  showLabels = true,
  showDescriptions = true,
}: DetailedStepIndicatorProps) => {
  return (
    <div className="flex flex-col gap-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex gap-4">
            {/* Step Circle */}
            <motion.button
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              whileHover={onStepClick ? { scale: 1.1 } : {}}
              whileTap={onStepClick ? { scale: 0.95 } : {}}
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                'font-semibold font-display text-sm transition-all duration-300 relative',
                onStepClick ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-success"
                >
                  <Check size={20} className="text-white" />
                </motion.div>
              ) : (
                <>
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full transition-all duration-300',
                      isCurrent
                        ? 'bg-gradient-primary shadow-glow-pink border border-accent-pink'
                        : 'bg-surface border border-border',
                    )}
                  />
                  <span
                    className={cn(
                      'relative font-bold transition-colors duration-300',
                      isCurrent ? 'text-white' : 'text-text-secondary',
                    )}
                  >
                    {index + 1}
                  </span>
                </>
              )}
            </motion.button>

            {/* Content */}
            {(showLabels || showDescriptions) && (
              <div className="flex-1 pt-1">
                {showLabels && (
                  <h3
                    className={cn(
                      'font-semibold font-display transition-colors duration-300',
                      isCurrent || isCompleted
                        ? 'text-text-primary'
                        : 'text-text-secondary',
                    )}
                  >
                    {step.label}
                  </h3>
                )}
                {showDescriptions && step.description && (
                  <p
                    className={cn(
                      'text-sm transition-colors duration-300 mt-1',
                      isCurrent || isCompleted
                        ? 'text-text-secondary'
                        : 'text-text-muted',
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            )}

            {/* Vertical Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-[1.625rem] top-16 w-1 h-12 transition-colors duration-300',
                  isCompleted ? 'bg-success' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

StepIndicator.displayName = 'StepIndicator';
DetailedStepIndicator.displayName = 'DetailedStepIndicator';

export { StepIndicator, DetailedStepIndicator };
export type { StepIndicatorProps, DetailedStepIndicatorProps, Step };
