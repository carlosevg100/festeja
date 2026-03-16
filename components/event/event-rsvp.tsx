'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface EventRSVPProps {
  event: Event;
}

interface RSVPFormState {
  name: string;
  plusOnes: number;
  dietaryRestrictions: string;
}

type RSVPStatus = 'idle' | 'going' | 'not_going' | 'maybe' | 'confirmed';

export function EventRSVP({ event }: EventRSVPProps) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('idle');
  const [formData, setFormData] = useState<RSVPFormState>({
    name: '',
    plusOnes: 0,
    dietaryRestrictions: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRSVPClick = (status: 'going' | 'not_going' | 'maybe') => {
    setRsvpStatus(status);
  };

  const handleConfirm = async () => {
    if (!formData.name.trim()) return;

    // Trigger confetti if going and window is available
    if (typeof window !== 'undefined' && rsvpStatus === 'going') {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti failed, but continue anyway
        console.error('Confetti error:', e);
      }
    }

    setShowSuccess(true);
    setRsvpStatus('confirmed');

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-bg-secondary"
    >
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center font-display"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Você vai?
        </motion.h2>

        {/* RSVP Buttons */}
        {rsvpStatus === 'idle' ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div variants={buttonVariants}>
              <Button
                onClick={() => handleRSVPClick('going')}
                className="w-full py-6 text-lg font-semibold bg-success/20 hover:bg-success/30 text-success border border-success/30 hover:border-success/50 transition-all duration-300"
              >
                ✅ Vou!
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants}>
              <Button
                onClick={() => handleRSVPClick('not_going')}
                className="w-full py-6 text-lg font-semibold bg-error/20 hover:bg-error/30 text-error border border-error/30 hover:border-error/50 transition-all duration-300"
              >
                ❌ Não posso
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants}>
              <Button
                onClick={() => handleRSVPClick('maybe')}
                className="w-full py-6 text-lg font-semibold bg-warning/20 hover:bg-warning/30 text-warning border border-warning/30 hover:border-warning/50 transition-all duration-300"
              >
                🤔 Talvez
              </Button>
            </motion.div>
          </motion.div>
        ) : null}

        {/* Form - Animated In */}
        <AnimatePresence mode="wait">
          {rsvpStatus === 'going' ||
          rsvpStatus === 'maybe' ||
          rsvpStatus === 'not_going' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-surface border border-border p-6 sm:p-8">
                {/* Name Input */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Seu Nome *
                  </label>
                  <Input
                    type="text"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-bg-primary border-border text-white placeholder:text-text-muted"
                  />
                </div>

                {/* Plus Ones */}
                {event.allow_plus_ones && (
                  <div className="space-y-2 mb-6">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                      Acompanhantes
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.plusOnes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plusOnes: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="bg-bg-primary border-border text-white"
                    />
                  </div>
                )}

                {/* Dietary Restrictions */}
                {event.ask_dietary_restrictions && (
                  <div className="space-y-2 mb-6">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                      Restrições Alimentares (opcional)
                    </label>
                    <Textarea
                      placeholder="Vegetariano, alérgico a amendoim, sem glúten, etc..."
                      value={formData.dietaryRestrictions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: e.target.value,
                        })
                      }
                      className="bg-bg-primary border-border text-white placeholder:text-text-muted min-h-24"
                    />
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirm}
                  disabled={!formData.name.trim()}
                  className="w-full py-3 font-semibold bg-gradient-primary hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300"
                >
                  Confirmar
                </Button>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-success/20 border border-success/50 rounded-lg p-6 text-center"
            >
              <p className="text-lg font-semibold text-success">
                Presença confirmada! ✨
              </p>
              <p className="text-success/80 text-sm mt-2">
                Até lá,{' '}
                {formData.name}! Estamos ansiosos para te ver!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not Going Message */}
        <AnimatePresence>
          {rsvpStatus === 'not_going' && !showSuccess && (
            <motion.div
              key="not-going"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-text-secondary mb-4">
                Que pena! Esperamos contar com você em outro momento.
              </p>
              <Button
                onClick={() => {
                  setRsvpStatus('idle');
                  setFormData({
                    name: '',
                    plusOnes: 0,
                    dietaryRestrictions: '',
                  });
                }}
                className="px-4 py-2 text-sm bg-border hover:bg-border/80 text-text-secondary"
              >
                Voltar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Maybe Message */}
        <AnimatePresence>
          {rsvpStatus === 'maybe' && !showSuccess && (
            <motion.div
              key="maybe"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-text-secondary mb-4">
                Tudo bem! Avise-nos assim que souber. 🤞
              </p>
              <Button
                onClick={() => {
                  setRsvpStatus('idle');
                  setFormData({
                    name: '',
                    plusOnes: 0,
                    dietaryRestrictions: '',
                  });
                }}
                className="px-4 py-2 text-sm bg-border hover:bg-border/80 text-text-secondary"
              >
                Voltar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
