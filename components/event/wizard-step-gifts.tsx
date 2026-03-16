'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Package,
  Target,
  Sparkles,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Gift {
  id: string;
  type: 'product' | 'quota' | 'experience' | 'pix';
  name: string;
  price?: number;
  group_goal?: number;
  description?: string;
  product_url?: string;
  image_url?: string;
  store_name?: string;
  category?: string;
  pix_key?: string;
}

interface WizardStepGiftsProps {
  gifts: Gift[];
  onAddGift: (gift: Gift) => void;
  onRemoveGift: (giftId: string) => void;
  onMoveUp: (giftId: string) => void;
  onMoveDown: (giftId: string) => void;
}

const giftTypeOptions = [
  { value: 'product', label: '🎁 Presente' },
  { value: 'quota', label: '🎯 Cota' },
  { value: 'experience', label: '✨ Experiência' },
  { value: 'pix', label: '💰 PIX' },
];

const categoryOptions = [
  { value: '', label: 'Sem categoria' },
  { value: 'Brinquedos', label: 'Brinquedos' },
  { value: 'Eletrônicos', label: 'Eletrônicos' },
  { value: 'Livros', label: 'Livros' },
  { value: 'Roupas', label: 'Roupas' },
  { value: 'Decoração', label: 'Decoração' },
  { value: 'Alimentos', label: 'Alimentos' },
  { value: 'Outro', label: 'Outro' },
];

function GiftFormModal({
  isOpen,
  onClose,
  onSubmit,
  giftType,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gift: Gift) => void;
  giftType: 'product' | 'quota' | 'experience' | 'pix';
}) {
  const [formData, setFormData] = useState<Gift>({
    id: '',
    type: giftType,
    name: '',
  });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ id: '', type: giftType, name: '' });
      onClose();
    }
  };

  const updateForm = (updates: Partial<Gift>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar ${giftTypeOptions.find(g => g.value === giftType)?.label}`} size="md">
      <div className="space-y-4">
        <Input
          label="Nome do presente"
          placeholder="Ex: Bicicleta azul"
          value={formData.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />

        {(giftType === 'product' || giftType === 'quota' || giftType === 'experience') && (
          <>
            <Input
              label={giftType === 'product' ? 'Preço (R$)' : 'Meta (R$)'}
              type="number"
              placeholder="0,00"
              value={formData.price?.toString() || formData.group_goal?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                if (giftType === 'product') {
                  updateForm({ price: value });
                } else {
                  updateForm({ group_goal: value });
                }
              }}
            />
          </>
        )}

        {giftType === 'product' && (
          <>
            <Input
              label="URL do Produto (opcional)"
              placeholder="https://exemplo.com/produto"
              value={formData.product_url || ''}
              onChange={(e) => updateForm({ product_url: e.target.value })}
            />

            <Input
              label="URL da Imagem (opcional)"
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.image_url || ''}
              onChange={(e) => updateForm({ image_url: e.target.value })}
            />

            <Input
              label="Loja"
              placeholder="Ex: Loja de Brinquedos"
              value={formData.store_name || ''}
              onChange={(e) => updateForm({ store_name: e.target.value })}
            />

            <Select
              label="Categoria"
              value={formData.category || ''}
              onChange={(value) => updateForm({ category: value })}
              options={categoryOptions}
            />
          </>
        )}

        {(giftType === 'quota' || giftType === 'experience') && (
          <>
            <Textarea
              label="Descrição (opcional)"
              placeholder="Detalhes sobre este presente compartilhado"
              value={formData.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
            />

            <Input
              label="URL (opcional)"
              placeholder="https://exemplo.com"
              value={formData.product_url || ''}
              onChange={(e) => updateForm({ product_url: e.target.value })}
            />
          </>
        )}

        {giftType === 'pix' && (
          <Input
            label="Chave PIX (opcional)"
            placeholder="Seu CPF, email ou telefone"
            value={formData.pix_key || ''}
            onChange={(e) => updateForm({ pix_key: e.target.value })}
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            fullWidth
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function GiftCard({ gift, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: {
  gift: Gift;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const giftIcons = {
    product: <Package size={16} />,
    quota: <Target size={16} />,
    experience: <Sparkles size={16} />,
    pix: <Banknote size={16} />,
  };

  const giftColors = {
    product: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    quota: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    experience: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    pix: 'bg-green-500/10 text-green-400 border-green-500/30',
  };

  const giftLabels = {
    product: 'Presente',
    quota: 'Cota',
    experience: 'Experiência',
    pix: 'PIX',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="interactive" className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  'px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1',
                  giftColors[gift.type]
                )}
              >
                {giftIcons[gift.type]}
                {giftLabels[gift.type]}
              </div>
            </div>
            <h4 className="font-semibold text-white mb-1 break-words">
              {gift.name}
            </h4>
            {gift.description && (
              <p className="text-sm text-text-secondary truncate">
                {gift.description}
              </p>
            )}
            {(gift.price || gift.group_goal) && (
              <p className="text-sm text-accent-pink font-medium mt-1">
                {gift.type === 'product' ? `R$ ${gift.price?.toFixed(2)}` : `Meta: R$ ${(gift.group_goal || gift.price)?.toFixed(2)}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-2 text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Mover para cima"
            >
              <ChevronUp size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-2 text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Mover para baixo"
            >
              <ChevronDown size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="p-2 text-error hover:bg-error/10 transition-colors"
              title="Remover"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function WizardStepGifts({
  gifts,
  onAddGift,
  onRemoveGift,
  onMoveUp,
  onMoveDown,
}: WizardStepGiftsProps) {
  const [selectedGiftType, setSelectedGiftType] = useState<'product' | 'quota' | 'experience' | 'pix' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = (type: 'product' | 'quota' | 'experience' | 'pix') => {
    setSelectedGiftType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGiftType(null);
  };

  const totalValue = gifts.reduce((sum, gift) => sum + ((gift.price || gift.group_goal) || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Lista de Presentes
        </h2>
        <p className="text-text-secondary">
          Adicione os presentes que seus convidados podem contribuir (opcional)
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Add Gift Dropdown */}
        <motion.div variants={itemVariants} className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">
            Adicionar Presente
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {giftTypeOptions.map((option) => (
              <Button
                key={option.value}
                variant="secondary"
                size="sm"
                onClick={() => handleAddClick(option.value as 'product' | 'quota' | 'experience' | 'pix')}
                icon={<Plus size={16} />}
                iconPosition="left"
                fullWidth
              >
                {option.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Gift List */}
        {gifts.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">
                Presentes Adicionados ({gifts.length})
              </h3>
              {totalValue > 0 && (
                <p className="text-sm text-accent-pink font-medium">
                  Total: R$ {totalValue.toFixed(2)}
                </p>
              )}
            </div>

            <AnimatePresence>
              <div className="space-y-2">
                {gifts.map((gift, index) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    onRemove={() => onRemoveGift(gift.id)}
                    onMoveUp={() => onMoveUp(gift.id)}
                    onMoveDown={() => onMoveDown(gift.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < gifts.length - 1}
                  />
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}

        {gifts.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-8 text-text-secondary"
          >
            <Package size={48} className="mx-auto mb-3 opacity-50" />
            <p>Nenhum presente adicionado ainda</p>
            <p className="text-xs mt-1">Clique em um botão acima para começar</p>
          </motion.div>
        )}
      </motion.div>

      {selectedGiftType && (
        <GiftFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={onAddGift}
          giftType={selectedGiftType}
        />
      )}
    </div>
  );
}
