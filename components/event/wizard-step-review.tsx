'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  User,
  Package,
  Target,
  Sparkles,
  Banknote,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { EventWizardData } from '@/types';
import { formatCurrency, generateSlug, getEventTypeLabel } from '@/lib/utils';

interface Gift {
  id: string;
  type: 'product' | 'quota' | 'experience' | 'pix';
  name: string;
  price?: number;
  group_goal?: number;
}

interface WizardStepReviewProps {
  data: EventWizardData;
  gifts: Gift[];
}

function Confetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {confetti.map((conf) => (
        <motion.div
          key={conf.id}
          initial={{
            x: `${conf.left}vw`,
            y: '-10px',
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: '100vh',
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: conf.duration,
            delay: conf.delay,
            ease: 'easeIn',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#FF6B9D', '#FF1493', '#FFB6C1', '#FF69B4'][
              Math.floor(Math.random() * 4)
            ],
          }}
        />
      ))}
    </div>
  );
}

export default function WizardStepReview({
  data,
  gifts,
}: WizardStepReviewProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const slug = generateSlug(data.title);
  const totalGifts = gifts.length;
  const totalValue = gifts.reduce((sum, gift) => sum + ((gift.price || gift.group_goal) || 0), 0);

  const giftsByType = {
    product: gifts.filter(g => g.type === 'product').length,
    quota: gifts.filter(g => g.type === 'quota').length,
    experience: gifts.filter(g => g.type === 'experience').length,
    pix: gifts.filter(g => g.type === 'pix').length,
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowConfetti(true);
      addToast({
        type: 'success',
        message: '🎉 Evento publicado com sucesso!',
        duration: 4000,
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erro ao publicar evento. Tente novamente.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDraft = () => {
    addToast({
      type: 'success',
      message: 'Evento salvo como rascunho',
    });
    router.push('/dashboard');
  };

  const eventTypeLabel = getEventTypeLabel(data.eventType);

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Revisar & Publicar
          </h2>
          <p className="text-text-secondary">
            Confira todos os detalhes antes de publicar seu evento
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="space-y-4"
        >
          {/* Event Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="space-y-4">
              {/* Theme Preview */}
              <div
                className="h-32 rounded-xl flex items-end p-4 bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${data.color_primary} 0%, ${data.color_secondary} 100%)`,
                }}
              >
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {data.title}
                  </h3>
                </div>
              </div>

              {/* Basic Info */}
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>{eventTypeLabel}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Honoree */}
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-accent-pink flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-secondary">Homenageado</p>
                      <p className="font-medium text-white">
                        {data.honoree_name}
                        {data.eventType === 'birthday' && data.honoree_age !== undefined && (
                          <span className="text-text-secondary"> • {data.honoree_age} anos</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-accent-pink flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-secondary">Data</p>
                      <p className="font-medium text-white">
                        {data.event_date.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {data.location_name && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin size={20} className="text-accent-pink flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-text-secondary">Local</p>
                        <p className="font-medium text-white">{data.location_name}</p>
                        {data.location_address && (
                          <p className="text-sm text-text-secondary">{data.location_address}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dress Code */}
                {data.dress_code && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Dress Code:</span>
                    <span className="text-white font-medium">{data.dress_code}</span>
                  </div>
                )}

                {/* Observations */}
                {data.observations && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-text-secondary mb-1">Observações</p>
                    <p className="text-white text-sm">{data.observations}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Gifts Summary */}
          {totalGifts > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card variant="elevated" className="p-4">
                <h3 className="font-semibold text-white mb-4">
                  Presentes ({totalGifts})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {giftsByType.product > 0 && (
                    <div className="bg-surface rounded-lg p-3 text-center">
                      <Package size={20} className="mx-auto text-blue-400 mb-1" />
                      <p className="text-xs text-text-secondary">Presentes</p>
                      <p className="font-bold text-white">{giftsByType.product}</p>
                    </div>
                  )}
                  {giftsByType.quota > 0 && (
                    <div className="bg-surface rounded-lg p-3 text-center">
                      <Target size={20} className="mx-auto text-amber-400 mb-1" />
                      <p className="text-xs text-text-secondary">Cotas</p>
                      <p className="font-bold text-white">{giftsByType.quota}</p>
                    </div>
                  )}
                  {giftsByType.experience > 0 && (
                    <div className="bg-surface rounded-lg p-3 text-center">
                      <Sparkles size={20} className="mx-auto text-violet-400 mb-1" />
                      <p className="text-xs text-text-secondary">Experiências</p>
                      <p className="font-bold text-white">{giftsByType.experience}</p>
                    </div>
                  )}
                  {giftsByType.pix > 0 && (
                    <div className="bg-surface rounded-lg p-3 text-center">
                      <Banknote size={20} className="mx-auto text-green-400 mb-1" />
                      <p className="text-xs text-text-secondary">PIX</p>
                      <p className="font-bold text-white">{giftsByType.pix}</p>
                    </div>
                  )}
                </div>

                {totalValue > 0 && (
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                    <span className="text-text-secondary">Valor total estimado:</span>
                    <span className="font-bold text-accent-pink text-lg">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* QR Code Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card variant="elevated" className="p-4">
              <h3 className="font-semibold text-white mb-4">
                Link do Evento
              </h3>

              <div className="flex items-center justify-between bg-surface rounded-lg p-4 border border-border mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary mb-1">
                    URL do seu evento
                  </p>
                  <p className="font-mono text-sm text-accent-pink break-all">
                    festeja.com/{slug}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(`festeja.com/${slug}`);
                    addToast({
                      type: 'success',
                      message: 'Link copiado!',
                      duration: 2000,
                    });
                  }}
                  className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <QrCode size={48} className="mx-auto text-text-muted mb-2" />
                    <p className="text-xs text-text-muted font-mono">QR Code</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download size={16} />}
                  iconPosition="left"
                  onClick={() => {
                    addToast({
                      type: 'info',
                      message: 'QR Code será gerado após publicar',
                    });
                  }}
                >
                  Baixar QR Code
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex gap-3 pt-4 border-t border-border"
        >
          <Button
            variant="secondary"
            onClick={handleDraft}
            disabled={isPublishing}
            fullWidth
          >
            Salvar Rascunho
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            loading={isPublishing}
            fullWidth
          >
            {isPublishing ? 'Publicando...' : 'Publicar Evento 🎉'}
          </Button>
        </motion.div>
      </div>
    </>
  );
}
