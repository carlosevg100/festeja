'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EventType } from '@/types';

interface EventTypeOption {
  type: EventType;
  emoji: string;
  title: string;
  description: string;
}

const eventTypeOptions: EventTypeOption[] = [
  {
    type: EventType.BIRTHDAY,
    emoji: '🎂',
    title: 'Aniversário Infantil',
    description: 'Festa de aniversário para crianças',
  },
  {
    type: EventType.BABY_SHOWER,
    emoji: '🍼',
    title: 'Chá de Bebê',
    description: 'Celebre a chegada do bebê',
  },
  {
    type: EventType.QUINCEANERA,
    emoji: '👑',
    title: '15 Anos',
    description: 'A festa de debutante',
  },
  {
    type: EventType.OTHER,
    emoji: '🎉',
    title: 'Outro',
    description: 'Qualquer tipo de celebração',
  },
];

interface WizardStepTypeProps {
  value: EventType;
  onChange: (type: EventType) => void;
  error?: string;
}

export default function WizardStepType({
  value,
  onChange,
  error,
}: WizardStepTypeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Que tipo de festa é?
        </h2>
        <p className="text-text-secondary">
          Escolha a categoria que melhor descreve seu evento
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {eventTypeOptions.map((option) => {
          const isSelected = value === option.type;

          return (
            <motion.button
              key={option.type}
              variants={itemVariants}
              onClick={() => onChange(option.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative p-6 rounded-2xl border-2 transition-all duration-300',
                'bg-surface overflow-hidden group',
                isSelected
                  ? 'border-accent-pink shadow-glow-pink'
                  : 'border-border hover:border-border-strong'
              )}
            >
              {/* Background gradient glow for selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  className="absolute inset-0 bg-gradient-to-r from-accent-pink to-[#FF1493]"
                  aria-hidden="true"
                />
              )}

              {/* Content */}
              <div className="relative z-10 text-center space-y-3">
                <motion.div
                  animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-4xl"
                >
                  {option.emoji}
                </motion.div>

                <h3 className="font-bold text-white text-sm sm:text-base">
                  {option.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary">
                  {option.description}
                </p>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex justify-center pt-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-pink" />
                  </motion.div>
                )}
              </div>

              {/* Hover glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.05 }}
                className="absolute inset-0 bg-gradient-to-r from-accent-pink to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
