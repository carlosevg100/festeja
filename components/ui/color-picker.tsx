'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  presetColors?: string[];
  showCustomInput?: boolean;
}

const DEFAULT_PRESET_COLORS = [
  '#FF6B9D', // accent-pink
  '#FF6B6B', // accent-coral
  '#FFD700', // accent-gold
  '#A855F7', // accent-purple
  '#22C55E', // success
  '#EAB308', // warning
  '#EF4444', // error
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // rose
];

const ColorPicker = ({
  value = '#FF6B9D',
  onChange,
  label,
  presetColors = DEFAULT_PRESET_COLORS,
  showCustomInput = true,
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(value);
  const [isCustom, setIsCustom] = useState(
    !presetColors.includes(value.toUpperCase()),
  );

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    setIsCustom(false);
    onChange?.(color);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setIsCustom(true);
    onChange?.(newColor);
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <p className="text-sm font-medium text-text-secondary">{label}</p>
      )}

      {/* Preset Colors Grid */}
      <div className="grid grid-cols-5 gap-3">
        {presetColors.map((color) => (
          <motion.button
            key={color}
            onClick={() => handlePresetClick(color)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative w-12 h-12 rounded-lg border-2 transition-all duration-200',
              customColor.toUpperCase() === color.toUpperCase()
                ? 'border-white'
                : 'border-border hover:border-border-strong',
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
            title={color}
          >
            {customColor.toUpperCase() === color.toUpperCase() && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg"
              >
                <Check size={20} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Color Input */}
      {showCustomInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomChange}
                className={cn(
                  'w-full h-10 rounded-lg border border-border cursor-pointer',
                  'transition-all duration-200 hover:border-border-strong',
                  'focus:outline-none focus:ring-2 focus:ring-accent-pink',
                )}
              />
            </div>
            <input
              type="text"
              value={customColor.toUpperCase()}
              onChange={(e) => {
                const hex = e.target.value.startsWith('#')
                  ? e.target.value
                  : `#${e.target.value}`;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                  setCustomColor(hex);
                  setIsCustom(true);
                  onChange?.(hex);
                }
              }}
              placeholder="#FF6B9D"
              maxLength={7}
              className={cn(
                'w-24 px-3 py-2 rounded-lg border border-border',
                'bg-surface text-text-primary font-mono text-sm',
                'focus:outline-none focus:ring-2 focus:ring-accent-pink',
                'transition-all duration-200',
              )}
            />
          </div>

          {/* Color Preview */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface border border-border">
            <div
              className="w-8 h-8 rounded-lg border border-border-strong"
              style={{ backgroundColor: customColor }}
            />
            <span className="text-sm text-text-secondary font-mono">
              {customColor.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
export type { ColorPickerProps };
