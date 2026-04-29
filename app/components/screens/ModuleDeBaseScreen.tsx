'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { MODULE_DE_BASE_SLIDES, MODULE_DE_BASE_SLIDES_MINEUR } from '../../data/moduleDeBase';
import { ONBOARDING_ICON_MAP } from '../../utils/onboardingIcons';
import type { Screen } from '../../types';

interface ModuleDeBaseScreenProps {
  isAdult: boolean | null;
  onNavigate: (screen: Screen) => void;
}

export function ModuleDeBaseScreen({ isAdult, onNavigate }: ModuleDeBaseScreenProps) {
  const { colors } = useTheme();
  const completeModule = useModuleComplete();
  const markOnboardingSkipped = useModuleProgressStore((s) => s.markOnboardingSkipped);

  const slides = isAdult === false ? MODULE_DE_BASE_SLIDES_MINEUR : MODULE_DE_BASE_SLIDES;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  const handleNext = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
    } else {
      completeModule('module-de-base');
      onNavigate('home');
    }
  };

  const handleSkip = () => {
    markOnboardingSkipped();
    onNavigate('home');
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col overflow-hidden"
      style={{ background: colors.bgGradient ?? colors.bgPrimary }}
    >
      {/* Skip button */}
      <div className="shrink-0 flex justify-end px-5 pt-5 safe-area-top">
        <button
          onClick={handleSkip}
          className="text-sm font-medium px-4 py-2 rounded-full"
          style={{ color: colors.textMuted, background: colors.bgSecondary }}
        >
          Passer pour l&apos;instant
        </button>
      </div>

      {/* Progress dots */}
      <div className="shrink-0 flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === index ? 24 : 8, opacity: i <= index ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full"
            style={{ background: colors.accent }}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center text-center gap-5 py-2"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
              className="flex justify-center"
            >
              {(() => {
                const Icon = ONBOARDING_ICON_MAP[slide.iconName];
                return Icon ? <Icon size={64} color={colors.accent} /> : null;
              })()}
            </motion.div>

            <h1 className="text-2xl font-black leading-tight" style={{ color: colors.textPrimary }}>
              {slide.title}
            </h1>

            <p
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div
        className="shrink-0 px-6 pb-6 pt-3 safe-area-bottom flex flex-col gap-3"
        style={{
          background: `linear-gradient(180deg, transparent, ${colors.bgPrimary} 18%)`,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`,
            color: 'white',
            boxShadow: `0 6px 24px ${colors.accent}44`,
          }}
        >
          {isLast ? (
            <>
              J&apos;ai compris · Voir mes cartes
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              Suivant
              <ChevronRight size={18} />
            </>
          )}
        </motion.button>

        <p className="text-center text-xs" style={{ color: colors.textMuted }}>
          {index + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
}
