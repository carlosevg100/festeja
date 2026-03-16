'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/ui/step-indicator';
import { Card } from '@/components/ui/card';
import { EventWizardData, EventType } from '@/types';
import WizardStepType from '@/components/event/wizard-step-type';
import WizardStepDetails from '@/components/event/wizard-step-details';
import WizardStepVisual from '@/components/event/wizard-step-visual';
import WizardStepGifts from '@/components/event/wizard-step-gifts';
import WizardStepReview from '@/components/event/wizard-step-review';

const steps = [
  { id: 'type', label: 'Tipo de Festa' },
  { id: 'details', label: 'Detalhes' },
  { id: 'visual', label: 'Visual' },
  { id: 'gifts', label: 'Presentes' },
  { id: 'review', label: 'Revisar' },
];

const initialWizardData: EventWizardData = {
  title: '',
  eventType: EventType.BIRTHDAY,
  honoree_name: '',
  honoree_age: undefined,
  event_date: new Date(),
  event_end_date: undefined,
  location_name: '',
  location_address: '',
  theme: '',
  color_primary: '#FF6B9D',
  color_secondary: '#C44569',
  dress_code: '',
  observations: '',
  max_guests: undefined,
  allow_plus_ones: true,
  ask_dietary_restrictions: false,
  pix_enabled: false,
  photo_wall_enabled: true,
  message_board_enabled: true,
};

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

export default function EventWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<EventWizardData>(initialWizardData);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStepChange = (step: number) => {
    // Only allow going backwards or to current step
    if (step <= currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Type selection
        if (!wizardData.eventType) {
          newErrors.eventType = 'Selecione um tipo de festa';
        }
        break;

      case 1: // Details
        if (!wizardData.title.trim()) {
          newErrors.title = 'Nome do evento é obrigatório';
        }
        if (!wizardData.honoree_name.trim()) {
          newErrors.honoree_name = 'Nome do homenageado é obrigatório';
        }
        if (!wizardData.event_date) {
          newErrors.event_date = 'Data do evento é obrigatória';
        }
        if (wizardData.eventType === EventType.BIRTHDAY && !wizardData.honoree_age) {
          newErrors.honoree_age = 'Idade é obrigatória para aniversários';
        }
        break;

      case 2: // Visual
        if (!wizardData.theme) {
          newErrors.theme = 'Selecione um tema';
        }
        break;

      case 3: // Gifts
        // Gifts are optional
        break;

      case 4: // Review
        // Ready to publish
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateWizardData = (updates: Partial<EventWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const addGift = (gift: Gift) => {
    setGifts((prev) => [...prev, { ...gift, id: Math.random().toString(36) }]);
  };

  const removeGift = (giftId: string) => {
    setGifts((prev) => prev.filter((g) => g.id !== giftId));
  };

  const moveGiftUp = (giftId: string) => {
    const index = gifts.findIndex((g) => g.id === giftId);
    if (index > 0) {
      const newGifts = [...gifts];
      [newGifts[index], newGifts[index - 1]] = [newGifts[index - 1], newGifts[index]];
      setGifts(newGifts);
    }
  };

  const moveGiftDown = (giftId: string) => {
    const index = gifts.findIndex((g) => g.id === giftId);
    if (index < gifts.length - 1) {
      const newGifts = [...gifts];
      [newGifts[index], newGifts[index + 1]] = [newGifts[index + 1], newGifts[index]];
      setGifts(newGifts);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <WizardStepType
            value={wizardData.eventType}
            onChange={(type) => updateWizardData({ eventType: type })}
            error={errors.eventType}
          />
        );

      case 1:
        return (
          <WizardStepDetails
            data={wizardData}
            onChange={updateWizardData}
            errors={errors}
          />
        );

      case 2:
        return (
          <WizardStepVisual
            data={wizardData}
            onChange={updateWizardData}
            error={errors.theme}
          />
        );

      case 3:
        return (
          <WizardStepGifts
            gifts={gifts}
            onAddGift={addGift}
            onRemoveGift={removeGift}
            onMoveUp={moveGiftUp}
            onMoveDown={moveGiftDown}
          />
        );

      case 4:
        return (
          <WizardStepReview
            data={wizardData}
            gifts={gifts}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent-pink to-[#FF1493] bg-clip-text text-transparent">
            Criar Novo Evento
          </h1>
          <p className="text-text-secondary">
            Crie um evento incrível em apenas alguns passos
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 overflow-x-auto pb-4"
        >
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepChange}
            orientation="horizontal"
          />
        </motion.div>

        {/* Content */}
        <Card variant="elevated" className="min-h-[500px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: currentStep > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center gap-4"
        >
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={<ChevronLeft size={20} />}
            iconPosition="left"
          >
            Voltar
          </Button>

          <div className="text-sm text-text-secondary">
            Passo {currentStep + 1} de {steps.length}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            icon={<ChevronRight size={20} />}
            iconPosition="right"
          >
            {currentStep === steps.length - 1 ? 'Pronto' : 'Próximo'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
