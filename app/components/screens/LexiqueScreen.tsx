'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { useLexiqueStore } from '../../stores/lexiqueStore';
import type { LexiqueEntry } from '../../data/lexiqueConsent';
import type { ModuleId } from '../../modules';

interface LexiqueScreenProps {
  namespace: string;
  entries: LexiqueEntry[];
  moduleId: ModuleId;
  onComplete?: () => void;
}

type NiveauFilter = 'all' | 'debutant' | 'intermediaire' | 'expert';

const NIVEAU_COLORS: Record<string, { bg: string; text: string }> = {
  debutant:      { bg: '#10b98118', text: '#10b981' },
  intermediaire: { bg: '#f5973318', text: '#f59733' },
  expert:        { bg: '#8b5cf618', text: '#8b5cf6' },
};

const CATEGORIE_COLORS: Record<string, string> = {
  juridique:  '#3b82f6',
  pratique:   '#10b981',
  emotionnel: '#ec4899',
  medical:    '#f59733',
};

export function LexiqueScreen({ namespace, entries, moduleId, onComplete }: LexiqueScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const { unlockedIds, unlock } = useLexiqueStore();
  const [niveauFilter, setNiveauFilter] = useState<NiveauFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = niveauFilter === 'all'
    ? entries
    : entries.filter((e) => e.niveau === niveauFilter);

  const unlockedCount = entries.filter((e) => unlockedIds.includes(e.id)).length;
  const allUnlocked = unlockedCount === entries.length;

  const handleTap = (entry: LexiqueEntry) => {
    if (!unlockedIds.includes(entry.id)) {
      unlock(entry.id);
    }
    setExpandedId((prev) => (prev === entry.id ? null : entry.id));
  };

  const handleFinish = () => {
    complete(moduleId);
    onComplete?.();
  };

  const niveaux: NiveauFilter[] = ['all', 'debutant', 'intermediaire', 'expert'];

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {t(`${namespace}.lexique.title`)}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
          {t(`${namespace}.lexique.subtitle`)}
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <motion.div
              animate={{ width: `${(unlockedCount / entries.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: colors.accentGradient ?? colors.accent }}
            />
          </div>
          <span className="text-xs font-medium shrink-0" style={{ color: colors.textMuted }}>
            {unlockedCount} / {entries.length}
          </span>
        </div>

        {/* Niveau filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {niveaux.map((n) => (
            <button
              key={n}
              onClick={() => setNiveauFilter(n)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: niveauFilter === n ? colors.accent : colors.bgSecondary,
                color: niveauFilter === n ? 'white' : colors.textSecondary,
              }}
            >
              {n === 'all' ? t(`${namespace}.lexique.filterAll`) : t(`${namespace}.lexique.niveaux.${n}`)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 scrollbar-hide space-y-2">
        {filtered.map((entry, i) => {
          const isUnlocked = unlockedIds.includes(entry.id);
          const isExpanded = expandedId === entry.id;
          const niveauColor = NIVEAU_COLORS[entry.niveau] ?? NIVEAU_COLORS.debutant;
          const catColor = CATEGORIE_COLORS[entry.categorie] ?? colors.textMuted;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                onClick={() => handleTap(entry)}
                className="w-full text-left p-4 rounded-2xl transition-all"
                style={{
                  background: isUnlocked ? colors.bgCard : `${colors.bgCard}cc`,
                  border: `1px solid ${isUnlocked ? colors.border : colors.border}`,
                  opacity: isUnlocked ? 1 : 0.8,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Lock / unlock icon */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isUnlocked ? `${colors.success}20` : `${colors.textMuted}15`,
                    }}
                  >
                    {isUnlocked
                      ? <CheckCircle size={16} style={{ color: colors.success }} />
                      : <Lock size={14} style={{ color: colors.textMuted }} />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                        {isUnlocked ? t(`${namespace}.lexique.${entry.id}.terme`) : '???'}
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: niveauColor.bg, color: niveauColor.text }}
                      >
                        {t(`${namespace}.lexique.niveaux.${entry.niveau}`)}
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: `${catColor}18`, color: catColor }}
                      >
                        {t(`${namespace}.lexique.categories.${entry.categorie}`)}
                      </span>
                      {!isUnlocked && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: '#f9731618', color: '#f97316' }}
                        >
                          {t(`${namespace}.lexique.heatEarned`)}
                        </span>
                      )}
                    </div>

                    <AnimatePresence>
                      {isUnlocked && isExpanded && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs leading-relaxed mt-2"
                          style={{ color: colors.textSecondary }}
                        >
                          {t(`${namespace}.lexique.${entry.id}.definition`)}
                        </motion.p>
                      )}
                      {!isUnlocked && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs mt-1 flex items-center gap-1"
                          style={{ color: colors.textMuted }}
                        >
                          <Unlock size={11} />
                          {t(`${namespace}.lexique.btnUnlock`)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Finish CTA */}
      {allUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 px-5 pt-2 pb-6 safe-area-bottom"
          style={{ background: `linear-gradient(180deg, transparent, ${colors.bgPrimary} 25%)` }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleFinish}
            className="w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`,
              color: 'white',
              boxShadow: `0 4px 20px ${colors.accent}44`,
            }}
          >
            <Sparkles size={16} />
            {t(`${namespace}.lexique.markDone`)}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
