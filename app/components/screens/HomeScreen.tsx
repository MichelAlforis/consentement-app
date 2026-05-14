'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, GalleryHorizontal, ChevronRight, BookOpen, ArrowRight, Star, Sparkles, Users } from 'lucide-react';
import { AppLogo, IconBox } from '../ui';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';
import { HeatThermometer } from '../ui/HeatThermometer';
import { HeatRoadmapSheet } from '../ui/HeatRoadmapSheet';
import { DailyQuestionCard } from '../ui/DailyQuestionCard';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useUnlockStore, useModuleProgressStore } from '../../stores';
import { getProgressLevel } from '../../lib/progressLevel';
import { useHeat } from '../../context/HeatContext';
import { isHeatUnlocked } from '../../lib/heatGate';
import { isModuleCompleted } from '../../lib/moduleIds';
import { collectorCards } from '../../data/cards-collector';
import { getModuleSequence } from '../../modules';

interface HomeScreenProps {
  isAdult: boolean | null;
  userName: string;
  onNavigate: (screen: Screen) => void;
}

function getNextModuleId(isAdult: boolean, completedModules: string[]): string | null {
  return getModuleSequence(isAdult).find((module) => !isModuleCompleted(module.id, completedModules, isAdult))?.id ?? null;
}

// ── Shared sub-components ────────────────────────────────────────────────────

function GreetingCard({ userName }: { userName: string }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl p-5 mb-4 flex items-start gap-3"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <AppLogo className="w-10 h-10 shrink-0 mt-0.5" variant="theme" animated={true} />
      <div>
        <h2 className="text-xl font-bold mb-0.5" style={{ color: colors.textPrimary }}>
          {t('homeAdult.greeting', { name: userName })}
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {t('homeAdult.subtitle')}
        </p>
      </div>
    </motion.div>
  );
}

function MinorBadge() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-5"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
        style={{ background: colors.bgSecondary }}>
        <span className="text-xs font-medium" style={{ color: colors.accent }}>{t('homeMinor.badge')}</span>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
        {t('homeMinor.title')}
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
        {t('homeMinor.subtitle')}
      </p>
    </motion.div>
  );
}

function CollectionButton({ ownedCount, onNavigate }: { ownedCount: number; onNavigate: (s: Screen) => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const totalCards = collectorCards.filter((c) => c.deck === 'A').length;
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onNavigate('hall-of-cards')}
      className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <IconBox size="sm" style={{ background: colors.bgSecondary }}>
        <GalleryHorizontal size={18} style={{ color: colors.accent }} />
      </IconBox>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm block" style={{ color: colors.textPrimary }}>
          {t('homeAdult.collection.title')}
        </span>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          {ownedCount === 0
            ? t('homeAdult.collection.empty')
            : t('homeAdult.collection.count', { owned: String(ownedCount), total: String(totalCards) })}
        </p>
      </div>
      <ChevronRight size={16} style={{ color: colors.textMuted, flexShrink: 0 }} />
    </motion.button>
  );
}

function HeatGatedExplicitMode({ delay }: { delay: number }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { points, level } = useHeat();
  const unlocked = isHeatUnlocked('explicit', level);

  if (unlocked) return <ExplicitModeToggle delay={delay} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3.5 rounded-2xl"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, opacity: 0.65 }}
    >
      <IconBox size="sm" style={{ background: '#ef444412' }}>
        <span style={{ fontSize: 18 }}>🔒</span>
      </IconBox>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
          {t('settings.explicit.title')}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          {t('heat.points_to_next', {
            n: String(12 - points > 0 ? 12 - points : 0),
            palier: t('heat.chaud'),
          })}
        </p>
      </div>
    </motion.div>
  );
}

function HeatBar() {
  const { points, level } = useHeat();
  const [showRoadmap, setShowRoadmap] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex justify-end mb-4"
      >
        <HeatThermometer points={points} compact onPress={() => setShowRoadmap(true)} />
      </motion.div>
      <AnimatePresence>
        {showRoadmap && (
          <HeatRoadmapSheet
            currentLevel={level}
            currentPoints={points}
            onClose={() => setShowRoadmap(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function PrivacyText({ text }: { text: string }) {
  const { colors } = useTheme();
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-xs text-center mt-4"
      style={{ color: colors.textMuted }}
    >
      {text}
    </motion.p>
  );
}

// ── Level 1 — Découverte ─────────────────────────────────────────────────────

function DiscoveryHome({ isAdult, userName, onNavigate }: HomeScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div data-testid="screen-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <HeatBar />

      {/* CTA principal */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate('apprendre')}
        className="w-full rounded-3xl p-5 mb-3 flex items-center gap-4"
        style={{ background: colors.accentGradient }}
      >
        <IconBox size="xl" rounded="2xl" className="bg-white/20">
          <BookOpen size={24} className="text-white" />
        </IconBox>
        <div className="flex-1 text-left">
          <span className="font-bold text-base text-white block mb-0.5">
            {isAdult ? t('homeV3.discovery.ctaAdult') : t('homeV3.discovery.ctaMinor')}
          </span>
          <p className="text-xs text-white/75">
            {t('homeV3.discovery.ctaDesc')}
          </p>
        </div>
        <ArrowRight size={20} className="text-white shrink-0" />
      </motion.button>

      {/* FOMO — Hall verrouillé */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <IconBox style={{ background: colors.bgSecondary }}>
          <Lock size={18} style={{ color: colors.textMuted }} />
        </IconBox>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm block" style={{ color: colors.textPrimary }}>
            {t('homeV3.discovery.fomoTitle')}
          </span>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            {t('homeV3.discovery.fomoDesc')}
          </p>
        </div>
      </motion.div>

      {isAdult && (
        <div className="mt-4 space-y-3">
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.45} />
          <HeatGatedExplicitMode delay={0.5} />
        </div>
      )}

      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </motion.div>
  );
}

// ── Level 2 — Apprentissage ──────────────────────────────────────────────────

function LearningHome({ isAdult, userName, onNavigate }: HomeScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const { completedModules } = useModuleProgressStore();
  const sequence = getModuleSequence(isAdult);
  const progress = sequence.filter((module) => isModuleCompleted(module.id, completedModules, isAdult)).length;
  const nextModuleId = getNextModuleId(isAdult ?? true, completedModules);
  const nextModule = sequence.find((module) => module.id === nextModuleId);
  const nextModuleScreen = nextModule?.screen ?? null;
  const nextModuleTitle = nextModule ? t(nextModule.titleKey) : null;

  return (
    <motion.div data-testid="screen-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <HeatBar />

      {/* Progression */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 mb-3"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {t('homeV3.learning.progressLabel')}
          </span>
          <span className="text-xs font-medium" style={{ color: colors.accent }}>
            {t('homeV3.learning.moduleCount', { progress: String(progress), total: String(sequence.length) })}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.bgSecondary }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / sequence.length) * 100}%` }}
            transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: colors.accentGradient }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
          {ownedCards.length === 1
            ? t('homeV3.learning.cardsOne')
            : t('homeV3.learning.cardsPlural', { count: String(ownedCards.length) })}
        </p>
      </motion.div>

      {/* Prochain module suggéré */}
      {nextModuleScreen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate(nextModuleScreen)}
          className="w-full rounded-2xl p-4 mb-3 flex items-center gap-3 text-left"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.accent}40`,
          }}
        >
          <IconBox style={{ background: colors.accentGradient }}>
            <Star size={18} className="text-white" />
          </IconBox>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
              style={{ color: colors.accent }}>{t('homeV3.learning.nextModuleLabel')}</p>
            <span className="font-semibold text-sm block" style={{ color: colors.textPrimary }}>
              {nextModuleTitle}
            </span>
          </div>
          <ArrowRight size={18} style={{ color: colors.accent, flexShrink: 0 }} />
        </motion.button>
      )}

      <CollectionButton ownedCount={ownedCards.length} onNavigate={onNavigate} />

      {isAdult && (
        <div className="mt-4 space-y-3">
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.38} />
          <HeatGatedExplicitMode delay={0.43} />
        </div>
      )}

      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </motion.div>
  );
}

// ── Level 3 — Maîtrise ───────────────────────────────────────────────────────

function MasteryHome({ isAdult, userName, onNavigate }: HomeScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const { completedModules } = useModuleProgressStore();

  const rareCount   = ownedCards.filter((c) => c.rarity === 'rare').length;
  const uniqueCount = ownedCards.filter((c) => c.rarity === 'unique').length;
  const nextModuleId   = getNextModuleId(isAdult ?? true, completedModules);
  const nextModule = getModuleSequence(isAdult).find((module) => module.id === nextModuleId);
  const nextModuleScreen = nextModule?.screen ?? null;
  const nextModuleTitle  = nextModule ? t(nextModule.titleKey) : null;

  return (
    <motion.div data-testid="screen-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <HeatBar />

      {/* Collection showcase */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate('hall-of-cards')}
        className="w-full rounded-2xl p-4 mb-3 text-left"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <IconBox style={{ background: colors.accentGradient }}>
            <GalleryHorizontal size={18} className="text-white" />
          </IconBox>
          <div>
            <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>
              {ownedCards.length === 1
                ? t('homeV3.mastery.collectionOne')
                : t('homeV3.mastery.collectionPlural', { count: String(ownedCards.length) })}
            </span>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {rareCount > 0
                ? `${rareCount === 1 ? t('homeV3.mastery.rareOne') : t('homeV3.mastery.rarePlural', { count: String(rareCount) })} · `
                : ''}
              {uniqueCount > 0
                ? (uniqueCount === 1 ? t('homeV3.mastery.uniqueOne') : t('homeV3.mastery.uniquePlural', { count: String(uniqueCount) }))
                : t('homeV3.mastery.viewCollection')}
            </p>
          </div>
        </div>
      </motion.button>

      {/* Duo CTA (adultes) */}
      {isAdult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('duo-space')}
          className="w-full rounded-2xl p-4 mb-3 flex items-center gap-3 text-left"
          style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(219,39,119,0.06))',
            border: '1px solid rgba(236,72,153,0.25)',
          }}
        >
          <IconBox style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <Users size={18} className="text-white" />
          </IconBox>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm block" style={{ color: colors.textPrimary }}>
              {t('homeV3.mastery.duoTitle')}
            </span>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {t('homeV3.mastery.duoDesc')}
            </p>
          </div>
          <ArrowRight size={18} style={{ color: '#ec4899', flexShrink: 0 }} />
        </motion.button>
      )}

      {/* Prochain module s'il en reste */}
      {nextModuleScreen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate(nextModuleScreen)}
          className="w-full rounded-2xl p-3.5 mb-3 flex items-center gap-3 text-left"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <IconBox size="sm" style={{ background: colors.bgSecondary }}>
            <Sparkles size={16} style={{ color: colors.accent }} />
          </IconBox>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
              style={{ color: colors.accent }}>{t('homeV3.mastery.goFurther')}</p>
            <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
              {nextModuleTitle}
            </span>
          </div>
          <ArrowRight size={16} style={{ color: colors.textMuted, flexShrink: 0 }} />
        </motion.button>
      )}

      {isAdult && (
        <div className="mt-2 space-y-3">
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.4} />
          <HeatGatedExplicitMode delay={0.45} />
        </div>
      )}

      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </motion.div>
  );
}

// ── Export principal ─────────────────────────────────────────────────────────

export function HomeScreen({ isAdult, userName, onNavigate }: HomeScreenProps) {
  const { completedModules } = useModuleProgressStore();
  const level = getProgressLevel(completedModules);

  if (level === 3) return <MasteryHome isAdult={isAdult} userName={userName} onNavigate={onNavigate} />;
  if (level === 2) return <LearningHome isAdult={isAdult} userName={userName} onNavigate={onNavigate} />;
  return <DiscoveryHome isAdult={isAdult} userName={userName} onNavigate={onNavigate} />;
}
