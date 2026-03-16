'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { EventWizardData, EventType } from '@/types';

const dressCodeOptions = [
  { value: '', label: 'Sem dress code' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Esporte Fino', label: 'Esporte Fino' },
  { value: 'Traje Social', label: 'Traje Social' },
  { value: 'Fantasia', label: 'Fantasia' },
];

interface WizardStepDetailsProps {
  data: EventWizardData;
  onChange: (updates: Partial<EventWizardData>) => void;
  errors: Record<string, string>;
}

export default function WizardStepDetails({
  data,
  onChange,
  errors,
}: WizardStepDetailsProps) {
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseDateTimeLocal = (value: string): Date => {
    return new Date(value);
  };

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
          Detalhes do Evento
        </h2>
        <p className="text-text-secondary">
          Preencha as informações principais da sua festa
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Event Name */}
        <motion.div variants={itemVariants}>
          <Input
            label="Nome do evento"
            placeholder="Ex: Festa de Aniversário do Lucas"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            error={errors.title}
          />
        </motion.div>

        {/* Honoree Name */}
        <motion.div variants={itemVariants}>
          <Input
            label="Nome do homenageado"
            placeholder="Ex: Lucas Silva"
            value={data.honoree_name}
            onChange={(e) => onChange({ honoree_name: e.target.value })}
            error={errors.honoree_name}
          />
        </motion.div>

        {/* Age - Only for Birthday */}
        {data.eventType === EventType.BIRTHDAY && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Input
              label="Idade"
              type="number"
              placeholder="Ex: 5"
              value={data.honoree_age?.toString() || ''}
              onChange={(e) =>
                onChange({
                  honoree_age: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              error={errors.honoree_age}
            />
          </motion.div>
        )}

        {/* Event Date */}
        <motion.div variants={itemVariants}>
          <Input
            label="Data do evento"
            type="datetime-local"
            value={formatDateTimeLocal(data.event_date)}
            onChange={(e) => onChange({ event_date: parseDateTimeLocal(e.target.value) })}
            error={errors.event_date}
            icon={<Calendar size={18} />}
          />
        </motion.div>

        {/* End Date */}
        <motion.div variants={itemVariants}>
          <Input
            label="Data de término (opcional)"
            type="datetime-local"
            value={
              data.event_end_date ? formatDateTimeLocal(data.event_end_date) : ''
            }
            onChange={(e) =>
              onChange({
                event_end_date: e.target.value
                  ? parseDateTimeLocal(e.target.value)
                  : undefined,
              })
            }
            icon={<Calendar size={18} />}
          />
        </motion.div>

        {/* Location Name */}
        <motion.div variants={itemVariants}>
          <Input
            label="Local - Nome (ex: Buffet Alegria)"
            placeholder="Onde será o evento?"
            value={data.location_name || ''}
            onChange={(e) => onChange({ location_name: e.target.value })}
            icon={<MapPin size={18} />}
          />
        </motion.div>

        {/* Location Address */}
        <motion.div variants={itemVariants}>
          <Input
            label="Local - Endereço"
            placeholder="Rua, número, bairro, cidade"
            value={data.location_address || ''}
            onChange={(e) => onChange({ location_address: e.target.value })}
          />
        </motion.div>

        {/* Dress Code */}
        <motion.div variants={itemVariants}>
          <Select
            label="Dress Code"
            value={data.dress_code || ''}
            onChange={(value) => onChange({ dress_code: value })}
            options={dressCodeOptions}
          />
        </motion.div>

        {/* Observations */}
        <motion.div variants={itemVariants}>
          <Textarea
            label="Observações (opcional)"
            placeholder="Informações adicionais, avisos ou curiosidades sobre o evento"
            value={data.observations || ''}
            onChange={(e) => onChange({ observations: e.target.value })}
            rows={4}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
