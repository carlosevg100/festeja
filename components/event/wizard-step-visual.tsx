'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import { EventWizardData } from '@/types';

interface Theme {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  secondary: string;
}

const themes: Theme[] = [
  {
    id: 'safari',
    name: 'Safari',
    emoji: '🦁',
    primary: '#FF8C42',
    secondary: '#FFB84D',
  },
  {
    id: 'princess',
    name: 'Princesas',
    emoji: '👸',
    primary: '#FF69B4',
    secondary: '#FFB6C1',
  },
  {
    id: 'astronaut',
    name: 'Astronauta',
    emoji: '🚀',
    primary: '#5A67D8',
    secondary: '#667EEA',
  },
  {
    id: 'mermaid',
    name: 'Sereia',
    emoji: '🧜‍♀️',
    primary: '#00CED1',
    secondary: '#40E0D0',
  },
  {
    id: 'superhero',
    name: 'Super-heróis',
    emoji: '🦸',
    primary: '#FF1744',
    secondary: '#FF5252',
  },
  {
    id: 'minimalist',
    name: 'Minimalista',
    emoji: '✨',
    primary: '#E0E0E0',
    secondary: '#9E9E9E',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    emoji: '🌴',
    primary: '#FFD700',
    secondary: '#FF6347',
  },
  {
    id: 'custom',
    name: 'Personalizado',
    emoji: '🎨',
    primary: '#FF6B9D',
    secondary: '#C44569',
  },
];

interface WizardStepVisualProps {
  data: EventWizardData;
  onChange: (updates: Partial<EventWizardData>) => void;
  error?: string;
}

export default function WizardStepVisual({
  data,
  onChange,
  error,
}: WizardStepVisualProps) {
  const selectedTheme = themes.find((t) => t.id === data.theme);

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Tema e Cores
        </h2>
        <p className="text-text-secondary">
          Escolha um tema ou customize as cores do seu evento
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
        className="space-y-6"
      >
        {/* Theme Selection */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-white">Escolha um Tema</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((theme) => {
              const isSelected = data.theme === theme.id;

              return (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    onChange({
                      theme: theme.id,
                      color_primary: theme.primary,
                      color_secondary: theme.secondary,
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-accent-pink bg-surface-hover'
                        : 'border-border hover:border-border-strong bg-surface'
                    }
                  `}
                >
                  {/* Theme preview colors */}
                  <div className="flex gap-1 mb-2">
                    <div
                      className="flex-1 h-3 rounded-md"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="flex-1 h-3 rounded-md"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>

                  <div className="text-xl mb-1">{theme.emoji}</div>
                  <div className="text-xs font-medium text-white text-center">
                    {theme.name}
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-3 h-3 rounded-full bg-accent-pink"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Color Customization */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-white">Customize as Cores</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Cor Primária
              </label>
              <ColorPicker
                value={data.color_primary}
                onChange={(color) => onChange({ color_primary: color })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Cor Secundária
              </label>
              <ColorPicker
                value={data.color_secondary}
                onChange={(color) => onChange({ color_secondary: color })}
              />
            </div>
          </div>
        </motion.div>

        {/* Cover Image Upload */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-white">Imagem de Capa (Opcional)</h3>

          <div
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer
              transition-all duration-300 hover:border-border-strong hover:bg-surface-hover"
          >
            <Upload size={32} className="mx-auto mb-3 text-text-secondary" />
            <p className="text-white font-medium mb-1">
              Clique para fazer upload
            </p>
            <p className="text-sm text-text-secondary">
              ou arraste uma imagem aqui
            </p>
            <p className="text-xs text-text-muted mt-2">
              PNG, JPG ou GIF (máx. 10MB)
            </p>

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                // Placeholder - actual upload logic would go here
                if (e.target.files?.[0]) {
                  console.log('File selected:', e.target.files[0].name);
                }
              }}
            />
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div variants={itemVariants} className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-semibold text-white">Pré-visualização</h3>

          <div
            className="relative h-48 rounded-2xl overflow-hidden border border-border"
            style={{
              background: `linear-gradient(135deg, ${data.color_primary} 0%, ${data.color_secondary} 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {selectedTheme?.emoji || '🎉'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {data.title || 'Seu Evento'}
                </h2>
                <p className="text-white/80 text-sm">
                  {selectedTheme?.name || 'Tema Personalizado'}
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
