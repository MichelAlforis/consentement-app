'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, RefreshCw, Lock, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useHeat } from '../../context/HeatContext';
import { completeGameSession } from '../../lib/completeGameSession';

type ActionKey = 'massage' | 'roleplay' | 'exploration' | 'communication' | 'trust' | 'surprise';
type ModifierKey = 'silence' | 'blindfold' | 'turnbyturn' | 'slowly' | 'verbal' | 'accessory';

const ACTIONS: ActionKey[] = ['massage', 'roleplay', 'exploration', 'communication', 'trust', 'surprise'];
const MODIFIERS: ModifierKey[] = ['silence', 'blindfold', 'turnbyturn', 'slowly', 'verbal', 'accessory'];

const ACTION_EMOJIS: Record<ActionKey, string> = {
  massage:       '🤲',
  roleplay:      '🎭',
  exploration:   '🔍',
  communication: '💬',
  trust:         '🤝',
  surprise:      '✨',
};

const MODIFIER_EMOJIS: Record<ModifierKey, string> = {
  silence:    '🤫',
  blindfold:  '🙈',
  turnbyturn: '🔄',
  slowly:     '🐢',
  verbal:     '🗣️',
  accessory:  '🛒',
};

function pickRandom<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface ScenarioGameScreenProps {
  onBack?: () => void;
}

export function ScenarioGameScreen({ onBack: _onBack }: ScenarioGameScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { level } = useHeat();

  const [action, setAction] = useState<ActionKey | null>(null);
  const [modifier, setModifier] = useState<ModifierKey | null>(null);
  const [rolling, setRolling] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const isUnlocked = level >= 3;

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setAction(null);
    setModifier(null);
    setTimeout(() => {
      setAction(pickRandom(ACTIONS, action ?? undefined));
      setModifier(pickRandom(MODIFIERS, modifier ?? undefined));
      setRolling(false);
      if (!hasPlayed) {
        completeGameSession('dice');
        setHasPlayed(true);
      }
    }, 900);
  }, [rolling, action, modifier, hasPlayed, completeGameSession]);

  if (!isUnlocked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
          style={{ background: '#f9731620', border: '1px solid #f9731640' }}>
          <Lock size={28} style={{ color: '#f97316' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {t('scenarioGame.locked')}
        </h2>
        <p className="text-sm max-w-xs" style={{ color: colors.textSecondary }}>
          {t('scenarioGame.lockedSub')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
          <Dices size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {t('scenarioGame.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('scenarioGame.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Deux dés */}
      <div className="grid grid-cols-2 gap-3">
        <DieCard
          label={t('scenarioGame.die1Label')}
          emoji={action ? ACTION_EMOJIS[action] : '🎲'}
          resultLabel={action ? t(`scenarioGame.actions.${action}.label`) : null}
          rolling={rolling}
          colors={colors}
        />
        <DieCard
          label={t('scenarioGame.die2Label')}
          emoji={modifier ? MODIFIER_EMOJIS[modifier] : '🎲'}
          resultLabel={modifier ? t(`scenarioGame.modifiers.${modifier}.label`) : null}
          rolling={rolling}
          colors={colors}
        />
      </div>

      {/* Bouton lancer */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={roll}
        disabled={rolling}
        className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-3"
        style={{ background: rolling ? colors.textMuted : 'linear-gradient(135deg, #f97316, #ef4444)', opacity: rolling ? 0.6 : 1 }}
      >
        {action && modifier ? (
          <>
            <RefreshCw size={20} />
            {t('scenarioGame.rerollBtn')}
          </>
        ) : (
          <>
            <Dices size={22} />
            {t('scenarioGame.rollBtn')}
          </>
        )}
      </motion.button>

      {/* Résultat */}
      <AnimatePresence>
        {action && modifier && !rolling && (
          <motion.div
            key={`${action}-${modifier}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="rounded-2xl p-5"
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              {t('scenarioGame.resultTitle')}
            </p>
            <p className="text-base font-semibold mb-2" style={{ color: colors.textPrimary }}>
              {t(`scenarioGame.actions.${action}.instruction`)}
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {t(`scenarioGame.modifiers.${modifier}.how`)}
            </p>
            <div className="mt-4 pt-4 flex items-start gap-2"
              style={{ borderTop: `1px solid ${colors.border}` }}>
              <Heart size={14} className="text-pink-400 mt-0.5 shrink-0" />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {t('scenarioGame.consent')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DieCard({
  label,
  emoji,
  resultLabel,
  rolling,
  colors,
}: {
  label: string;
  emoji: string;
  resultLabel: string | null;
  rolling: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center min-h-[100px] justify-center"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>
        {label}
      </p>
      <motion.span
        key={emoji + rolling.toString()}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ fontSize: rolling ? 28 : 34 }}
        className={rolling ? 'animate-spin' : ''}
      >
        {rolling ? '🎲' : emoji}
      </motion.span>
      <AnimatePresence mode="wait">
        {resultLabel && !rolling && (
          <motion.p
            key={resultLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-semibold"
            style={{ color: colors.textPrimary }}
          >
            {resultLabel}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
