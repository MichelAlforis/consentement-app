'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Lock, CheckCircle, ChevronRight, ChevronLeft,
  Trophy, ThumbsUp, BookOpen, Flame, RotateCcw, Sparkles, Star, Zap,
  XCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useHeatLevel } from '../../lib/useHeatLevel';
import { Button } from '../ui';
import { QUIZ_ML_CORRECT, QUIZ_ML_QUESTIONS_COUNT, quizModuleId } from '../../data/quizMultiLevel';
import type { QuizTier } from '../../data/quizMultiLevel';

// ─── Types internes ───────────────────────────────────────────────────────────

type Stage = 'hub' | 'playing' | 'score';
type Rarity = 'common' | 'rare' | 'unique';

interface TierMeta {
  id: QuizTier;
  titleKey: string;
  descKey: string;
  lockKey: string | null;
  rarity: Rarity;
  color: string;
  icon: React.ReactNode;
  requiredHeat: number; // 1 = always open
}

const TIERS: TierMeta[] = [
  {
    id: 'd',
    titleKey: 'quizMl.ui.tierDebutant',
    descKey: 'quizMl.ui.tierDebutantDesc',
    lockKey: null,
    rarity: 'common',
    color: '#3b82f6',
    icon: <Brain size={18} color="#fff" />,
    requiredHeat: 1,
  },
  {
    id: 'i',
    titleKey: 'quizMl.ui.tierIntermediaire',
    descKey: 'quizMl.ui.tierIntermediaireDesc',
    lockKey: 'quizMl.ui.lockMsgI',
    rarity: 'rare',
    color: '#f59e0b',
    icon: <Zap size={18} color="#fff" />,
    requiredHeat: 2,
  },
  {
    id: 'e',
    titleKey: 'quizMl.ui.tierExpert',
    descKey: 'quizMl.ui.tierExpertDesc',
    lockKey: 'quizMl.ui.lockMsgE',
    rarity: 'unique',
    color: '#ef4444',
    icon: <Star size={18} color="#fff" />,
    requiredHeat: 4,
  },
];

// ─── Hub — liste des variants ─────────────────────────────────────────────────

function VariantCard({
  tier,
  variantIndex,
  locked,
  completed,
  onPlay,
}: {
  tier: TierMeta;
  variantIndex: number; // 0-based
  locked: boolean;
  completed: boolean;
  onPlay: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const v = variantIndex + 1;
  const titleKey = `quizMl.${tier.id}.v${v}.title`;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: variantIndex * 0.06 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      onClick={locked ? undefined : onPlay}
      disabled={locked}
      className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left"
      style={{
        background: colors.bgCard,
        border: `1px solid ${completed ? tier.color + '55' : locked ? colors.border : colors.border}`,
        opacity: locked ? 0.6 : 1,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: locked
            ? `color-mix(in srgb, ${colors.locked} 30%, transparent)`
            : completed
              ? tier.color
              : `${tier.color}22`,
        }}
      >
        {locked ? <Lock size={16} color={colors.textMuted} /> : completed
          ? <CheckCircle size={16} color="#fff" />
          : tier.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: locked ? colors.textMuted : colors.textPrimary }}>
          {t(titleKey)}
        </p>
        <p className="text-[11px]" style={{ color: colors.textMuted }}>
          {t('quizMl.ui.questionsCount', { n: String(QUIZ_ML_QUESTIONS_COUNT) })}
          {' · '}
          {t(tier.rarity === 'common' ? 'quizMl.ui.rewardCommon' : tier.rarity === 'rare' ? 'quizMl.ui.rewardRare' : 'quizMl.ui.rewardUnique')}
        </p>
      </div>

      {!locked && !completed && (
        <ChevronRight size={16} style={{ color: colors.textMuted }} />
      )}
      {completed && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${tier.color}22`, color: tier.color }}>
          {t('quizMl.ui.completedLabel')}
        </span>
      )}
    </motion.button>
  );
}

function TierSection({
  tier,
  heatLevel,
  completedModules,
  onPlay,
}: {
  tier: TierMeta;
  heatLevel: number;
  completedModules: string[];
  onPlay: (tier: QuizTier, variantIndex: number) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const locked = heatLevel < tier.requiredHeat;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: locked ? `color-mix(in srgb, ${colors.locked} 25%, transparent)` : tier.color }}
        >
          {locked ? <Lock size={14} color={colors.textMuted} /> : tier.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold" style={{ color: locked ? colors.textMuted : colors.textPrimary }}>
              {t(tier.titleKey)}
            </h3>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${tier.color}22`, color: tier.color }}>
              {t(tier.descKey)}
            </span>
          </div>
          {locked && tier.lockKey && (
            <p className="text-[11px] mt-0.5" style={{ color: '#f97316' }}>
              🔥 {t(tier.lockKey)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 pl-2">
        {[0, 1, 2].map((vi) => {
          const moduleId = quizModuleId(tier.id, vi);
          const completed = completedModules.includes(moduleId);
          return (
            <VariantCard
              key={vi}
              tier={tier}
              variantIndex={vi}
              locked={locked}
              completed={completed}
              onPlay={() => onPlay(tier.id, vi)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Écran de quiz actif ───────────────────────────────────────────────────────

function QuizPlayer({
  tier,
  variantIndex,
  onBack,
  onFinish,
}: {
  tier: QuizTier;
  variantIndex: number;
  onBack: () => void;
  onFinish: (score: number) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const v = variantIndex + 1;
  const correctIndices = QUIZ_ML_CORRECT[tier][variantIndex];
  const correctIndex = correctIndices[current];
  const total = QUIZ_ML_QUESTIONS_COUNT;

  const qKey = (field: string) => `quizMl.${tier}.v${v}.${current}.${field}`;

  const questionText = t(qKey('q'));
  const options = [0, 1, 2, 3].map(i => t(qKey(`o.${i}`)));
  const explanation = t(qKey('x'));
  const isCorrect = selected === correctIndex;

  const handleSelect = (i: number) => { if (!confirmed) setSelected(i); };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      const moduleId = quizModuleId(tier, variantIndex);
      complete(moduleId);
      onFinish(score); // score déjà mis à jour par handleConfirm
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const tierColor = TIERS.find(t => t.id === tier)?.color ?? '#3b82f6';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <button onClick={onBack} className="flex items-center gap-1.5 mb-5" style={{ color: colors.textMuted }}>
        <ChevronLeft size={18} />
        <span className="text-sm">{t('quizMl.ui.backToHub')}</span>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: colors.textMuted }}>
            {t('quizScreen.question', { current: String(current + 1), total: String(total) })}
          </p>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <motion.div
              animate={{ width: `${(current / total) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: tierColor }}
            />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          <Trophy size={14} color="#f59e0b" />
          <span className="text-sm font-bold" style={{ color: colors.textSecondary }}>{score}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.22 }}
        >
          <div className="mb-5 p-4 rounded-2xl shadow-sm border" style={{ background: colors.bgCard, borderColor: colors.border }}>
            <p className="text-base font-semibold leading-snug" style={{ color: colors.textPrimary }}>
              {questionText}
            </p>
          </div>

          <div className="space-y-2.5 mb-5">
            {options.map((opt, i) => {
              let style: React.CSSProperties = { background: colors.bgCard, borderColor: colors.border };
              let textColor = colors.textSecondary;
              let extraClass = '';
              if (confirmed) {
                if (i === correctIndex) { extraClass = 'bg-green-50 border-green-300'; textColor = '#166534'; style = {}; }
                else if (i === selected && selected !== correctIndex) { extraClass = 'bg-red-50 border-red-300'; textColor = '#991b1b'; style = {}; }
                else { textColor = colors.textMuted; }
              } else if (selected === i) {
                extraClass = 'bg-blue-50 border-blue-300'; textColor = '#1e40af'; style = {};
              }
              return (
                <motion.button
                  key={i}
                  whileTap={confirmed ? {} : { scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-3.5 rounded-xl border shadow-sm transition-all duration-200 ${extraClass}`}
                  style={style}
                >
                  <span className="text-sm font-medium" style={{ color: textColor }}>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-4 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <p className="text-sm font-semibold mb-1 flex items-center gap-1.5" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
                  {isCorrect ? <CheckCircle size={15} className="shrink-0" /> : <XCircle size={15} className="shrink-0" />}
                  {isCorrect ? t('quizScreen.correct') : t('quizScreen.incorrect')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isCorrect ? '#14532d' : '#7f1d1d' }}>
                  {explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!confirmed ? (
            <Button onClick={handleConfirm} fullWidth disabled={selected === null}>
              {t('quizScreen.validate')}
            </Button>
          ) : (
            <Button onClick={handleNext} fullWidth>
              {current + 1 < total ? t('quizScreen.next') : t('quizScreen.finish')}
              <ChevronRight size={18} />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Écran de score ────────────────────────────────────────────────────────────

function ScoreScreen({
  score,
  tier,
  variantIndex,
  onBack,
  onNavigateCards,
}: {
  score: number;
  tier: QuizTier;
  variantIndex: number;
  onBack: () => void;
  onNavigateCards: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const total = QUIZ_ML_QUESTIONS_COUNT;
  const tierMeta = TIERS.find(tt => tt.id === tier)!;
  const v = variantIndex + 1;

  const getResult = () => {
    const pct = score / total;
    if (pct >= 0.83) return { label: t('quizScreen.scoreLabels.excellent'), color: '#22c55e', Icon: Trophy };
    if (pct >= 0.66) return { label: t('quizScreen.scoreLabels.good'), color: '#3b82f6', Icon: ThumbsUp };
    if (pct >= 0.5)  return { label: t('quizScreen.scoreLabels.notBad'), color: '#f59e0b', Icon: BookOpen };
    return { label: t('quizScreen.scoreLabels.retry'), color: '#ef4444', Icon: Flame };
  };

  const result = getResult();
  const plural = score > 1 ? 's' : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-5"
    >
      <p className="text-xs font-semibold mb-4 px-3 py-1 rounded-full" style={{ background: `${tierMeta.color}22`, color: tierMeta.color }}>
        {t(`quizMl.${tier}.v${v}.title`)}
      </p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="mb-4"
      >
        <result.Icon size={60} color={result.color} />
      </motion.div>

      <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{result.label}</h2>
      <p className="mb-6" style={{ color: colors.textMuted }}>
        {t('quizScreen.score', { score: String(score), total: String(total), plural })}
      </p>

      <div className="w-48 h-3 rounded-full mb-8 overflow-hidden" style={{ background: colors.bgSecondary }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / total) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-full rounded-full"
          style={{ backgroundColor: result.color }}
        />
      </div>

      <Button onClick={onBack} variant="secondary" className="mb-3">
        <RotateCcw size={16} />
        {t('quizMl.ui.backToHub')}
      </Button>

      <Button onClick={onNavigateCards}>
        <Sparkles size={16} />
        {t('quizMl.ui.seeCard')}
      </Button>
    </motion.div>
  );
}

// ─── Hub principal ────────────────────────────────────────────────────────────

interface QuizHubScreenProps {
  onNavigate: (screen: import('../../types').Screen) => void;
}

export function QuizHubScreen({ onNavigate }: QuizHubScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { level: heatLevel } = useHeatLevel();
  const { completedModules } = useModuleProgressStore();

  const [stage, setStage] = useState<Stage>('hub');
  const [activeTier, setActiveTier] = useState<QuizTier>('d');
  const [activeVariant, setActiveVariant] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  const startQuiz = useCallback((tier: QuizTier, variantIndex: number) => {
    setActiveTier(tier);
    setActiveVariant(variantIndex);
    setLastScore(0);
    setStage('playing');
  }, []);

  const handleFinish = useCallback((score: number) => {
    setLastScore(score);
    setStage('score');
  }, []);

  if (stage === 'playing') {
    return (
      <QuizPlayer
        tier={activeTier}
        variantIndex={activeVariant}
        onBack={() => setStage('hub')}
        onFinish={handleFinish}
      />
    );
  }

  if (stage === 'score') {
    return (
      <ScoreScreen
        score={lastScore}
        tier={activeTier}
        variantIndex={activeVariant}
        onBack={() => setStage('hub')}
        onNavigateCards={() => onNavigate('hall-of-cards')}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <Brain size={22} color="#fff" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {t('quizMl.ui.hubTitle')}
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('quizMl.ui.hubSubtitle')}
          </p>
        </div>
      </motion.div>

      {TIERS.map((tier, i) => (
        <motion.div
          key={tier.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.1 }}
        >
          <TierSection
            tier={tier}
            heatLevel={heatLevel}
            completedModules={completedModules}
            onPlay={startQuiz}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
