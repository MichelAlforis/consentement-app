'use client';

import { motion } from 'framer-motion';
import { comfortLevels } from '../../data';

interface ComfortSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ComfortSlider({ value = 0, onChange, disabled = false }: ComfortSliderProps) {
  const currentLevel = comfortLevels[value] || comfortLevels[0];

  return (
    <div className="py-2">
      <div className="flex gap-1.5">
        {comfortLevels.map((level, idx) => (
          <motion.button
            key={idx}
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            disabled={disabled}
            onClick={() => !disabled && onChange(idx)}
            className={`
              flex-1 h-11 rounded-xl flex items-center justify-center
              transition-all duration-300 relative overflow-hidden
              ${disabled ? 'cursor-default' : 'cursor-pointer active:brightness-90'}
            `}
            style={{
              backgroundColor: value >= idx ? level.color : '#f3f4f6',
              opacity: value >= idx ? 1 : 0.4,
            }}
          >
            {value === idx && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-base"
              >
                {level.emoji}
              </motion.span>
            )}

            {/* Shine effect */}
            {value >= idx && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        layout
        className="flex justify-end mt-2"
      >
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            color: currentLevel.color,
            backgroundColor: `${currentLevel.color}15`
          }}
        >
          {currentLevel.label}
        </span>
      </motion.div>
    </div>
  );
}
