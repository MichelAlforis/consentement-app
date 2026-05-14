'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';
import type { ScenarioItem } from '../../data/scenariosQuotidiens';
import type { ModuleId } from '../../modules';

interface ScenarioScreenProps {
  namespace: string;
  scenarios: ScenarioItem[];
  moduleId: ModuleId;
  onComplete?: () => void;
}

export function ScenarioScreen({ namespace, scenarios, moduleId, onComplete }: ScenarioScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const scenario = scenarios[scenarioIndex];
  const isLastScenario = scenarioIndex === scenarios.length - 1;

  const handleChoiceSelect = (choiceIdx: number) => {
    if (revealed) return;
    setSelectedChoice(choiceIdx);
    setRevealed(true);
  };

  const handleNext = () => {
    if (!isLastScenario) {
      setScenarioIndex((i) => i + 1);
      setSelectedChoice(null);
      setRevealed(false);
    } else {
      complete(moduleId);
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: `${colors.success}22` }}
        >
          <CheckCircle size={40} style={{ color: colors.success }} />
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Module terminé
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
            Ces scénarios n&apos;ont pas de bonne réponse unique — l&apos;objectif, c&apos;est la réflexion.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete?.()}
          className="w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`,
            color: 'white',
            boxShadow: `0 4px 20px ${colors.accent}44`,
          }}
        >
          <Sparkles size={16} />
          {t(`${namespace}.scenarios.btnDone`)}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {t(`${namespace}.scenarios.title`)}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
          {t(`${namespace}.scenarios.progress`, {
            current: String(scenarioIndex + 1),
            total: String(scenarios.length),
          })}
        </p>
        {/* Progress bar */}
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: colors.border }}>
          <motion.div
            animate={{ width: `${((scenarioIndex + (revealed ? 1 : 0)) / scenarios.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{ background: colors.accentGradient ?? colors.accent }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenarioIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Situation */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: colors.accent }}
              >
                Situation
              </p>
              <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                {t(`${namespace}.scenarios.${scenarioIndex}.situation`)}
              </p>
            </div>

            {/* Choices label */}
            <p className="text-xs font-semibold px-1" style={{ color: colors.textMuted }}>
              {t(`${namespace}.scenarios.labelChoix`)}
            </p>

            {/* Choices */}
            {scenario.choices.map((choice, ci) => {
              const isSelected = selectedChoice === ci;
              const isIdeal = choice.isIdeal;
              const showResult = revealed && isSelected;
              const fadeOut = revealed && !isSelected;

              return (
                <motion.div key={ci} animate={{ opacity: fadeOut ? 0.4 : 1 }} transition={{ duration: 0.2 }}>
                  <button
                    onClick={() => handleChoiceSelect(ci)}
                    disabled={revealed}
                    className="w-full text-left p-4 rounded-2xl transition-all"
                    style={{
                      background: showResult
                        ? isIdeal
                          ? `${colors.success}18`
                          : `${colors.warning ?? '#f97316'}18`
                        : colors.bgCard,
                      border: `1px solid ${
                        showResult
                          ? isIdeal
                            ? colors.success
                            : colors.warning ?? '#f97316'
                          : colors.border
                      }`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                        style={{
                          background: showResult
                            ? isIdeal
                              ? `${colors.success}30`
                              : `${colors.warning ?? '#f97316'}30`
                            : colors.bgSecondary,
                          color: showResult
                            ? isIdeal ? colors.success : colors.warning ?? '#f97316'
                            : colors.textMuted,
                        }}
                      >
                        {showResult
                          ? isIdeal
                            ? <CheckCircle size={14} />
                            : <XCircle size={14} />
                          : String.fromCharCode(65 + ci)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-snug" style={{ color: colors.textPrimary }}>
                          {t(`${namespace}.scenarios.${scenarioIndex}.c${ci}.texte`)}
                        </p>
                        {showResult && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <p
                              className="text-xs leading-relaxed mt-2 pt-2"
                              style={{
                                color: isIdeal ? colors.success : colors.textSecondary,
                                borderTop: `1px solid ${isIdeal ? `${colors.success}30` : colors.border}`,
                              }}
                            >
                              {t(`${namespace}.scenarios.${scenarioIndex}.c${ci}.consequence`)}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button — apparaît après sélection */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="shrink-0 px-5 pt-2 pb-6 safe-area-bottom"
            style={{ background: `linear-gradient(180deg, transparent, ${colors.bgPrimary} 25%)` }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`,
                color: 'white',
                boxShadow: `0 4px 20px ${colors.accent}44`,
              }}
            >
              {isLastScenario ? (
                <><Sparkles size={16} />{t(`${namespace}.scenarios.btnDone`)}</>
              ) : (
                <>{t(`${namespace}.scenarios.btnNext`)}<ChevronRight size={16} /></>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
