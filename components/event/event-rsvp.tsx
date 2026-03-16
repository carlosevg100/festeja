'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, UserCheck, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EventRSVPProps {
  event: Event;
}

type RSVPStatus = 'idle' | 'going' | 'not_going' | 'maybe' | 'confirmed';

export function EventRSVP({ event }: EventRSVPProps) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('idle');
  const [formData, setFormData] = useState({ name: '', plusOnes: 0, dietaryRestrictions: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRSVPClick = (status: 'going' | 'not_going' | 'maybe') => {
    setRsvpStatus(status);
  };

  const handleConfirm = async () => {
    if (!formData.name.trim()) return;
    if (typeof window !== 'undefined' && rsvpStatus === 'going') {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) { console.error('Confetti error:', e); }
    }
    setShowSuccess(true);
    setRsvpStatus('confirmed');
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const resetForm = () => {
    setRsvpStatus('idle');
    setFormData({ name: '', plusOnes: 0, dietaryRestrictions: '' });
  };

  const rsvpOptions = [
    {
      status: 'going' as const,
      label: 'Vou!',
      icon: Check,
      gradient: 'from-emerald-500 to-green-600',
      hoverBg: 'hover:bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      status: 'maybe' as const,
      label: 'Talvez',
      icon: HelpCircle,
      gradient: 'from-amber-500 to-yellow-600',
      hoverBg: 'hover:bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-400',
    },
    {
      status: 'not_going' as const,
      label: 'Nao posso',
      icon: X,
      gradient: 'from-red-500 to-rose-600',
      hoverBg: 'hover:bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 sm:py-20 px-4 sm:px-6 bg-bg-secondary"
    >
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Confirme sua presenca</h2>
          <p className="text-sm text-text-secondary">Leva menos de 30 segundos</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* RSVP Buttons */}
          {rsvpStatus === 'idle' && (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-3 gap-3"
            >
              {rsvpOptions.map((opt, idx) => {
                const OptIcon = opt.icon;
                return (
                  <motion.button
                    key={opt.status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRSVPClick(opt.status)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.02] border ${opt.borderColor} ${opt.hoverBg} transition-all duration-300`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center`}>
                      <OptIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${opt.textColor}`}>{opt.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Form */}
          {(rsvpStatus === 'going' || rsvpStatus === 'maybe') && !showSuccess && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-7 space-y-5">
                <button onClick={resetForm} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">Seu Nome *</label>
                  <Input
                    type="text"
                    placeholder="Joao Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {event.allow_plus_ones && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-2">Acompanhantes</label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.plusOnes}
                      onChange={(e) => setFormData({ ...formData, plusOnes: Math.max(0, parseInt(e.target.value) || 0) })}
                    />
                  </div>
                )}

                {event.ask_dietary_restrictions && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-2">Restricoes Alimentares</label>
                    <Textarea
                      placeholder="Vegetariano, alergico a amendoim..."
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                      className="min-h-20"
                    />
                  </div>
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={!formData.name.trim()}
                  fullWidth
                  size="lg"
                >
                  Confirmar presenca
                </Button>
              </div>
            </motion.div>
          )}

          {/* Not Going */}
          {rsvpStatus === 'not_going' && !showSuccess && (
            <motion.div
              key="not-going"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-7 space-y-5">
                <button onClick={resetForm} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">Seu Nome *</label>
                  <Input
                    type="text"
                    placeholder="Joao Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <Button onClick={handleConfirm} disabled={!formData.name.trim()} fullWidth size="lg" variant="secondary">
                  Enviar resposta
                </Button>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {showSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="bg-white/[0.02] border border-emerald-500/20 rounded-2xl p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' as const, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4"
                >
                  <Heart className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold font-display text-emerald-400 mb-2">
                  Presenca confirmada!
                </h3>
                <p className="text-sm text-text-secondary">
                  Ate la, {formData.name}! Estamos ansiosos.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
