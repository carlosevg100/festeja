'use client';

import { useState } from 'react';
import type { Event, Gift, GiftType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift as GiftIcon,
  ShoppingBag,
  Sparkles,
  QrCode,
  Heart,
  Check,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatCurrency } from '@/lib/utils';
import { mockGifts, mockGiftContributions } from '@/lib/mock-data';

interface EventGiftListProps {
  event: Event;
}

type FilterTab = 'todos' | 'disponiveis' | 'cotas';

interface GiftModalState {
  isOpen: boolean;
  gift: Gift | null;
  contributerName: string;
  contributionAmount: string;
}

export function EventGiftList({ event }: EventGiftListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('todos');
  const [reservedGifts, setReservedGifts] = useState<Set<string>>(new Set());
  const [reservedBy, setReservedBy] = useState<Record<string, string>>({});
  const [giftContributions, setGiftContributions] = useState<
    Record<string, number>
  >({});
  const [modal, setModal] = useState<GiftModalState>({
    isOpen: false,
    gift: null,
    contributerName: '',
    contributionAmount: '',
  });

  // Get gifts for this event
  const eventGifts = mockGifts.filter((g) => g.event_id === event.id);

  // Initialize contributions
  const getGiftRaised = (giftId: string): number => {
    if (giftContributions[giftId]) {
      return giftContributions[giftId];
    }
    const gift = eventGifts.find((g) => g.id === giftId);
    return gift?.group_raised || 0;
  };

  // Filter gifts
  const filteredGifts = eventGifts.filter((gift) => {
    if (activeTab === 'disponiveis') {
      return !reservedGifts.has(gift.id) && gift.status !== 'purchased';
    }
    if (activeTab === 'cotas') {
      return gift.gift_type === 'quota' || gift.gift_type === 'experience' || gift.gift_type === 'pix';
    }
    return true;
  });

  const handleReserveClick = (gift: Gift) => {
    if (gift.gift_type === 'product') {
      setModal({
        isOpen: true,
        gift,
        contributerName: '',
        contributionAmount: '',
      });
    } else {
      // For group gifts, show contribution modal
      setModal({
        isOpen: true,
        gift,
        contributerName: '',
        contributionAmount: '',
      });
    }
  };

  const handleConfirmReservation = () => {
    if (!modal.gift || !modal.contributerName.trim()) return;

    if (modal.gift.gift_type === 'product') {
      setReservedGifts((prev) => new Set([...prev, modal.gift!.id]));
      setReservedBy((prev) => ({
        ...prev,
        [modal.gift!.id]: modal.contributerName,
      }));
    } else {
      // For group gifts, add contribution
      const amount = parseFloat(modal.contributionAmount) || 0;
      setGiftContributions((prev) => ({
        ...prev,
        [modal.gift!.id]: (prev[modal.gift!.id] || getGiftRaised(modal.gift!.id)) + amount,
      }));
    }

    setModal({
      isOpen: false,
      gift: null,
      contributerName: '',
      contributionAmount: '',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getGiftEmoji = (type: string | GiftType): string => {
    const emojis: Record<string, string> = {
      product: '🎁',
      quota: '🎯',
      experience: '✨',
      pix: '💰',
    };
    return emojis[type as string] || '🎁';
  };

  const isGiftReserved = (gift: Gift) =>
    reservedGifts.has(gift.id) || gift.status === 'reserved' || gift.status === 'purchased';

  const renderGiftCard = (gift: Gift) => {
    const isReserved = isGiftReserved(gift);
    const currentRaised = getGiftRaised(gift.id);

    return (
      <motion.div
        key={gift.id}
        variants={cardVariants}
        layoutId={`gift-${gift.id}`}
        className="h-full"
      >
        <Card
          className={cn(
            'overflow-hidden transition-all duration-300 flex flex-col h-full',
            isReserved
              ? 'opacity-60 bg-surface/50'
              : 'hover:border-accent-pink/50 bg-surface',
          )}
        >
          {/* Image/Placeholder */}
          <div
            className={cn(
              'relative h-40 sm:h-48 overflow-hidden group',
              isReserved ? 'bg-gray-800' : 'bg-gradient-to-br',
            )}
            style={
              !isReserved && gift.gift_type !== 'pix'
                ? {
                    backgroundImage: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                  }
                : isReserved
                  ? undefined
                  : {
                      backgroundImage: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
                    }
            }
          >
            {/* Product Image or Placeholder */}
            {gift.image_url && gift.gift_type !== 'pix' ? (
              <img
                src={gift.image_url}
                alt={gift.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">
                {getGiftEmoji(gift.gift_type)}
              </div>
            )}

            {/* Badge Overlay */}
            {isReserved && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center">
                  <Check className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">
                    {gift.status === 'purchased'
                      ? 'Meta atingida!'
                      : 'Reservado'}
                  </p>
                </div>
              </div>
            )}

            {/* Store Badge */}
            {gift.store_name && gift.gift_type === 'product' && !isReserved && (
              <div className="absolute top-3 right-3">
                <Badge variant="accent" size="sm">
                  {gift.store_name}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
            {/* Gift Type Badge */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{getGiftEmoji(gift.gift_type)}</span>
              <Badge variant="info" size="sm">
                {gift.gift_type === 'product'
                  ? 'Produto'
                  : gift.gift_type === 'quota'
                    ? 'Cota'
                    : gift.gift_type === 'experience'
                      ? 'Experiência'
                      : 'PIX'}
              </Badge>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">
              {gift.name}
            </h3>

            {/* Description */}
            {gift.description && (
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                {gift.description.length > 60
                  ? `${gift.description.substring(0, 60)}...`
                  : gift.description}
              </p>
            )}

            {/* Progress for group gifts */}
            {(gift.gift_type === 'quota' || gift.gift_type === 'experience' || gift.gift_type === 'pix') &&
            gift.group_goal ? (
              <div className="mt-auto pt-2">
                <ProgressBar
                  current={currentRaised}
                  goal={gift.group_goal}
                  showLabel={false}
                  showPercentage={true}
                  height="sm"
                  animated={false}
                />
              </div>
            ) : null}

            {/* Price */}
            <div className="mt-2 pt-3 border-t border-border">
              <p className="text-accent-pink font-semibold text-lg">
                {gift.price ? formatCurrency(gift.price) : 'Preço a consultar'}
              </p>
            </div>

            {/* Reserved By */}
            {isReserved && reservedBy[gift.id] && (
              <p className="text-xs text-text-muted">
                Reservado por{' '}
                <span className="text-accent-pink font-semibold">
                  {reservedBy[gift.id]}
                </span>
              </p>
            )}
          </div>

          {/* Action Button */}
          {!isReserved && (
            <div className="p-4 sm:p-5 border-t border-border mt-auto">
              <Button
                onClick={() => handleReserveClick(gift)}
                className="w-full py-2.5 text-sm font-semibold bg-gradient-primary hover:opacity-90 text-white transition-opacity"
              >
                {gift.gift_type === 'product' ? 'Quero dar esse!' : 'Contribuir'}
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-bg-primary"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          className="flex items-center gap-3 mb-8 justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GiftIcon className="w-8 h-8 text-accent-pink" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Lista de Presentes
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {(['todos', 'disponiveis', 'cotas'] as FilterTab[]).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300',
                activeTab === tab
                  ? 'bg-gradient-primary text-white'
                  : 'bg-border text-text-secondary hover:bg-border/80',
              )}
            >
              {tab === 'todos' ? 'Todos' : tab === 'disponiveis' ? 'Disponíveis' : 'Cotas & Experiências'}
            </Button>
          ))}
        </motion.div>

        {/* Gifts Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filteredGifts.map((gift) => renderGiftCard(gift))}
        </motion.div>

        {filteredGifts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GiftIcon className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted text-lg">
              Nenhum presente disponível nesta categoria
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() =>
          setModal({
            isOpen: false,
            gift: null,
            contributerName: '',
            contributionAmount: '',
          })
        }
        title={
          modal.gift?.gift_type === 'product'
            ? 'Reservar Presente'
            : 'Contribuir para o Presente'
        }
      >
        <div className="space-y-6">
          {/* Gift Preview */}
          {modal.gift && (
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-sm text-text-muted mb-1">Presente</p>
              <p className="font-semibold text-white">{modal.gift.name}</p>
              <p className="text-accent-pink font-semibold mt-2">
                {modal.gift.price ? formatCurrency(modal.gift.price) : 'Preço a consultar'}
              </p>
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">
              Seu Nome *
            </label>
            <Input
              type="text"
              placeholder="João Silva"
              value={modal.contributerName}
              onChange={(e) =>
                setModal({
                  ...modal,
                  contributerName: e.target.value,
                })
              }
              className="bg-bg-primary border-border"
            />
          </div>

          {/* Amount for group gifts */}
          {modal.gift &&
          (modal.gift.gift_type === 'quota' ||
            modal.gift.gift_type === 'experience' ||
            modal.gift.gift_type === 'pix') ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">
                Quanto quer contribuir? (R$) *
              </label>
              <Input
                type="number"
                placeholder="100.00"
                value={modal.contributionAmount}
                onChange={(e) =>
                  setModal({
                    ...modal,
                    contributionAmount: e.target.value,
                  })
                }
                className="bg-bg-primary border-border"
                step="10"
                min="0"
              />
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() =>
                setModal({
                  isOpen: false,
                  gift: null,
                  contributerName: '',
                  contributionAmount: '',
                })
              }
              className="flex-1 bg-border text-text-secondary hover:bg-border/80"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReservation}
              disabled={
                !modal.contributerName.trim() ||
                (modal.gift != null &&
                  (modal.gift.gift_type === 'quota' ||
                    modal.gift.gift_type === 'experience' ||
                    modal.gift.gift_type === 'pix') &&
                  !modal.contributionAmount) ||
                modal.gift == null
              }
              className="flex-1 bg-gradient-primary hover:opacity-90 text-white disabled:opacity-50"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}

// Helper function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((cls): cls is string => typeof cls === 'string' && cls.length > 0)
    .join(' ');
}
