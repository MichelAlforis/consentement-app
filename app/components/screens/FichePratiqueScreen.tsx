'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { DynamicIcon } from '../../utils/iconFromName';
import { useModuleComplete } from '../../lib/useModuleComplete';
import type { FichePratiqueItem } from '../../data/pratiquesBase';
import type { ModuleId } from '../../modules';

interface FichePratiqueScreenProps {
  namespace: string;
  items: FichePratiqueItem[];
  moduleId: ModuleId;
  onComplete?: () => void;
}

type SectionKey = 'sectionDef' | 'sectionConsent' | 'sectionLoi' | 'sectionQuestion';

const SECTION_COLORS: Record<SectionKey, { bg: string; text: string; border: string }> = {
  sectionDef:      { bg: '#3b82f615', text: '#3b82f6', border: '#3b82f630' },
  sectionConsent:  { bg: '#10b98115', text: '#10b981', border: '#10b98130' },
  sectionLoi:      { bg: '#f5973315', text: '#f59733', border: '#f5973330' },
  sectionQuestion: { bg: '#8b5cf615', text: '#8b5cf6', border: '#8b5cf630' },
};

const CONTENT_KEYS: Array<{ section: SectionKey; content: string }> = [
  { section: 'sectionDef',      content: 'definition'   },
  { section: 'sectionConsent',  content: 'consentement' },
  { section: 'sectionLoi',      content: 'loi'          },
  { section: 'sectionQuestion', content: 'question'     },
];

export function FichePratiqueScreen({ namespace, items, moduleId, onComplete }: FichePratiqueScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [index, setIndex] = useState(0);

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
    } else {
      complete(moduleId);
      onComplete?.();
    }
  };

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <motion.div
        className="shrink-0 px-5 pt-5 pb-3"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {t(`${namespace}.fiches.title`)}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
          {t(`${namespace}.fiches.subtitle`)}
        </p>

        {/* Progress pills */}
        <div className="flex gap-1.5 mt-3">
          {items.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-all duration-300"
              style={{ background: i <= index ? colors.accent : colors.border }}
            />
          ))}
        </div>
      </motion.div>

      {/* Card */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-3"
          >
            {/* Card header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.premium ?? colors.accent})` }}
              >
                <DynamicIcon name={item.iconName} size={22} color="white" />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: colors.textPrimary }}>
                  {t(`${namespace}.fiches.${index}.titre`)}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  {index + 1} / {items.length}
                </p>
              </div>
            </motion.div>

            {/* 4 sections — stagger cascade à chaque navigation */}
            {CONTENT_KEYS.map(({ section, content }, si) => {
              const sectionColors = SECTION_COLORS[section];
              return (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + si * 0.07, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="p-4 rounded-2xl"
                  style={{ background: sectionColors.bg, border: `1px solid ${sectionColors.border}` }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: sectionColors.text }}
                  >
                    {t(`${namespace}.fiches.${section}`)}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                    {t(`${namespace}.fiches.${index}.${content}`)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div
        className="shrink-0 px-5 pt-3 pb-6 safe-area-bottom flex gap-3"
        style={{ background: `linear-gradient(180deg, transparent, ${colors.bgPrimary} 20%)` }}
      >
        {index > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="h-14 px-5 rounded-2xl flex items-center justify-center gap-1.5 font-semibold text-sm shrink-0"
            style={{ background: colors.bgSecondary, color: colors.textSecondary }}
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="flex-1 h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`,
            color: 'white',
            boxShadow: `0 4px 20px ${colors.accent}44`,
          }}
        >
          {isLast ? (
            <><Sparkles size={16} />{t(`${namespace}.fiches.markRead`)}</>
          ) : (
            <>{t('onboarding.next')}<ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
