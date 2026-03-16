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
  Users,
  Zap,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

const giftTypeConfig: Record<string, { icon: any; gradient: string; label: string }> = {
  product: { icon: ShoppingBag, gradient: 'from-accent-pink to-accent-coral', label: 'Produto' },
  quota: { icon: Users, gradient: 'from-accent-purple to-violet-500', label: 'Cota' },
  experience: { icon: Sparkles, gradient: 'from-accent-gold to-amber-500', label: 'Experiencia' },
  pix: { icon: Zap, gradient: 'from-emerald-400 to-green-500', label: 'PIX' },
};

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter((cls): cls is string => typeof cls === 'string' && cls.length > 0).join(' ');
}

export function EventGiftList({ event }: EventGiftListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('todos');
  const [reservedGifts, setReservedGifts] = useState<Set<string>>(new Set());
  const [reservedBy, setReservedBy] = useState<Record<string, string>>({});
  const [giftContributions, setGiftContributions] = useState<Record<string, number>>({});
  const [modal, setModal] = useState<{
    isOpen: boolean;
    gift: Gift | null;
    contributerName: string;
    contributionAmount: string;
  }>({
    isOpen: false,
    gift: null,
    contributerName: '',
    contributionAmount: '',
  });

  const eventGifts = mockGifts.filter((g) => g.event_id === event.id);

  const getGiftRaised = (giftId: string): number => {
    if (giftContributions[giftId]) return giftContributions[giftId];
    const gift = eventGifts.find((g) => g.id === giftId);
    return gift?.group_raised || 0;
  };

  const filteredGifts = eventGifts.filter((gift) => {
    if (activeTab === 'disponiveis') return !reservedGifts.has(gift.id) && gift.status !== 'purchased';
    if (activeTab === 'cotas') return gift.gift_type === 'quota' || gift.gift_type === 'experience' || gift.gift_type === 'pix';
    return true;
  });

  const handleReserveClick = (gift: Gift) => {
    setModal({ isOpen: true, gift, contributerName: '', contributionAmount: '' });
  };

  const handleConfirmReservation = () => {
    if (!modal.gift || !modal.contributerName.trim()) return;
    if (modal.gift.gift_type === 'product') {
      setReservedGifts((prev) => new Set([...prev, modal.gift!.id]));
      setReservedBy((prev) => ({ ...prev, [modal.gift!.id]: modal.contributerName }));
    } else {
      const amount = parseFloat(modal.contributionAmount) || 0;
      setGiftContributions((prev) => ({
        ...prev,
        [modal.gift!.id]: (prev[modal.gift!.id] || getGiftRaised(modal.gift!.id)) + amount,
      }));
    }
    setModal({ isOpen: false, gift: null, contributerName: '', contributionAmount: '' });
  };

  const isGiftReserved = (gift: Gift) =>
    reservedGifts.has(gift.id) || gift.status === 'reserved' || gift.status === 'purchased';

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'disponiveis', label: 'Disponiveis' },
    { key: 'cotas', label: 'Cotas & PIX' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 sm:py-20 px-4 sm:px-6 bg-bg-primary"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-gold to-amber-500 flex items-center justify-center mx-auto mb-4">
            <GiftIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Lista de Presentes</h2>
          <p className="text-sm text-text-secondary">{eventGifts.length} itens na lista</p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-white/[0.08] text-text-primary border border-white/[0.10]'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGifts.map((gift, idx) => {
            const reserved = isGiftReserved(gift);
            const config = giftTypeConfig[gift.gift_type] || giftTypeConfig.product;
            const TypeIcon = config.icon;
            const currentRaised = getGiftRaised(gift.id);
            const isGroupGift = gift.gift_type === 'quota' || gift.gift_type === 'experience' || gift.gift_type === 'pix';

            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                layoutId={`gift-${gift.id}`}
              >
                <motion.div
                  whileHover={reserved ? {} : { y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'group rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col',
                    reserved
                      ? 'bg-white/[0.01] border border-white/[0.04] opacity-60'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]'
                  )}
                >
                  {/* Image area */}
                  <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                    {/* Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                      }} />
                    </div>

                    {gift.image_url && gift.gift_type !== 'pix' ? (
                      <img
                        src={gift.image_url}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <TypeIcon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Reserved overlay */}
                    {reserved && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium">
                        <TypeIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>

                    {gift.store_name && gift.gift_type === 'product' && !reserved && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium">
                          {gift.store_name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2">{gift.name}</h3>
                    {gift.description && (
                      <p className="text-xs text-text-muted mb-3 line-clamp-2">{gift.description}</p>
                    )}

                    {/* Progress for group gifts */}
                    {isGroupGift && gift.group_goal && (
                      <div className="mb-3">
                        <ProgressBar
                          current={currentRaised}
                          goal={gift.group_goal}
                          showLabel={false}
                          showPercentage={true}
                          height="sm"
                          animated={false}
                        />
                      </div>
                    )}

                    <div className="mt-auto">
                      {/* Price */}
                      <div className="pt-3 border-t border-white/[0.04]">
                        <p className="text-lg font-bold bg-gradient-to-r from-accent-pink to-accent-coral bg-clip-text text-transparent">
                          {gift.price ? formatCurrency(gift.price) : 'Valor livre'}
                        </p>
                      </div>

                      {reserved && reservedBy[gift.id] && (
                        <p className="text-[10px] text-text-muted mt-1">
                          Reservado por <span className="text-accent-pink font-medium">{reservedBy[gift.id]}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {!reserved && (
                    <div className="p-4 sm:p-5 pt-0">
                      <Button onClick={() => handleReserveClick(gift)} fullWidth size="md">
                        {gift.gift_type === 'product' ? 'Quero dar esse!' : 'Contribuir'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {filteredGifts.length === 0 && (
          <div className="text-center py-16">
            <GiftIcon className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
            <p className="text-text-muted text-sm">Nenhum presente nesta categoria</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, gift: null, contributerName: '', contributionAmount: '' })}
        title={modal.gift?.gift_type === 'product' ? 'Reservar Presente' : 'Contribuir'}
      >
        <div className="space-y-5">
          {modal.gift && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-text-muted mb-1">Presente</p>
              <p className="font-semibold text-text-primary text-sm">{modal.gift.name}</p>
              <p className="text-accent-pink font-bold mt-1">
                {modal.gift.price ? formatCurrency(modal.gift.price) : 'Valor livre'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">Seu Nome *</label>
            <Input
              type="text"
              placeholder="Joao Silva"
              value={modal.contributerName}
              onChange={(e) => setModal({ ...modal, contributerName: e.target.value })}
            />
          </div>

          {modal.gift && (modal.gift.gift_type === 'quota' || modal.gift.gift_type === 'experience' || modal.gift.gift_type === 'pix') && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2">Quanto quer contribuir? (R$) *</label>
              <Input
                type="number"
                placeholder="100.00"
                value={modal.contributionAmount}
                onChange={(e) => setModal({ ...modal, contributionAmount: e.target.value })}
                step="10"
                min="0"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setModal({ isOpen: false, gift: null, contributerName: '', contributionAmount: '' })}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              onClick={handleConfirmReservation}
              disabled={
                !modal.contributerName.trim() ||
                (modal.gift != null &&
                  (modal.gift.gift_type === 'quota' || modal.gift.gift_type === 'experience' || modal.gift.gift_type === 'pix') &&
                  !modal.contributionAmount) ||
                modal.gift == null
              }
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}
