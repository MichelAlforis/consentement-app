'use client';

import { motion } from 'framer-motion';
import { Heart, Lock, GalleryHorizontal, ChevronRight, BookOpen, ArrowRight, Star, Sparkles, Users } from 'lucide-react';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useUnlockStore, useModuleProgressStore } from '../../stores';
import { getProgressLevel } from '../../lib/progressLevel';
import { collectorCards } from '../../data/cards-collector';

interface HomeScreenProps {
  isAdult: boolean | null;
  userName: string;
  onNavigate: (screen: Screen) => void;
}

// ── Module sequence (for next-module suggestion) ─────────────────────────────

const ADULT_SEQUENCE = ['porno-vs-realite', 'quiz-consentement', 'loi-consentement', 'duo-flow'];
const MINOR_SEQUENCE = ['porno-vs-realite', 'quiz-consentement', 'loi-consentement', 'accompagnement-mineur'];

const MODULE_SCREEN: Record<string, Screen> = {
  'porno-vs-realite':      'porno-vs-realite',
  'quiz-consentement':     'quiz-consentement',
  'loi-consentement':      'loi-consentement',
  'duo-flow':              'duo-space',
  'accompagnement-mineur': 'accompagnement-mineur',
};

function getNextModuleId(isAdult: boolean, completedModules: string[]): string | null {
  const seq = isAdult ? ADULT_SEQUENCE : MINOR_SEQUENCE;
  return seq.find((m) => !completedModules.includes(m)) ?? null;
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
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: colors.accentGradient }}>
        <Heart size={18} className="text-white" fill="white" />
      </div>
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
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: colors.bgSecondary }}>
        <GalleryHorizontal size={18} style={{ color: colors.accent }} />
      </div>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}

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
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <BookOpen size={24} className="text-white" />
        </div>
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: colors.bgSecondary }}>
          <Lock size={18} style={{ color: colors.textMuted }} />
        </div>
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
        <div className="mt-4">
          <ExplicitModeToggle delay={0.4} />
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
  const sequence = isAdult ? ADULT_SEQUENCE : MINOR_SEQUENCE;
  const progress = sequence.filter((m) => completedModules.includes(m)).length;
  const nextModuleId = getNextModuleId(isAdult ?? true, completedModules);
  const nextModuleScreen = nextModuleId ? MODULE_SCREEN[nextModuleId] ?? null : null;
  const nextModuleTitle = nextModuleId ? t(`homeV3.modules.${nextModuleId}`) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}

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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: colors.accentGradient }}>
            <Star size={18} className="text-white" />
          </div>
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
        <div className="mt-4">
          <ExplicitModeToggle delay={0.4} />
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
  const nextModuleScreen = nextModuleId ? MODULE_SCREEN[nextModuleId] ?? null : null;
  const nextModuleTitle  = nextModuleId ? t(`homeV3.modules.${nextModuleId}`) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}

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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: colors.accentGradient }}>
            <GalleryHorizontal size={18} className="text-white" />
          </div>
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <Users size={18} className="text-white" />
          </div>
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: colors.bgSecondary }}>
            <Sparkles size={16} style={{ color: colors.accent }} />
          </div>
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
        <div className="mt-2">
          <ExplicitModeToggle delay={0.42} />
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
