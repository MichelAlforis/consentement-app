'use client';

import { motion } from 'framer-motion';
import { User, Users, HelpCircle, Settings, Crown, ChevronRight, Heart, HandHeart, BookUser, Lock } from 'lucide-react';
import { AppLogo, HeatThermometer } from '../ui';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore, usePremiumStore } from '../../stores';
import { useTranslation } from '../../i18n';
import { useHeat } from '../../context/HeatContext';
import { usePreferenceTopics } from '../../lib/useAvailableTopics';
import { usePreferencesStore } from '../../stores/preferencesStore';
import type { PreferenceAnswer, TopicDefinition } from '../../data/topicRegistry';

const PREF_ANSWERS: { value: PreferenceAnswer; emoji: string; tKey: string }[] = [
  { value: 'curious',         emoji: '🤔', tKey: 'moi.prefAnswer_curious' },
  { value: 'comfortable',     emoji: '😊', tKey: 'moi.prefAnswer_comfortable' },
  { value: 'want-to-explore', emoji: '✨', tKey: 'moi.prefAnswer_want_to_explore' },
  { value: 'not-for-me',      emoji: '🙅', tKey: 'moi.prefAnswer_not_for_me' },
  { value: 'no-comment',      emoji: '🔒', tKey: 'moi.prefAnswer_no_comment' },
];

const TOPIC_LABEL_KEYS: Record<string, string> = {
  'topic-fellation':             'moi.prefTopic_fellation',
  'topic-cunnilingus':           'moi.prefTopic_cunnilingus',
  'topic-masturbation-mutuelle': 'moi.prefTopic_masturbation_mutuelle',
  'topic-penetration':           'moi.prefTopic_penetration',
  'topic-sodomie':               'moi.prefTopic_sodomie',
};

function TopicAnswerCard({ topic, index }: { topic: TopicDefinition; index: number }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentAnswer = usePreferencesStore((s) => s.answers[topic.id]);
  const answerFn = usePreferencesStore((s) => s.answer);
  const labelKey = TOPIC_LABEL_KEYS[topic.id] ?? topic.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl p-4"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
        {t(labelKey as Parameters<typeof t>[0])}
      </p>
      <div className="flex flex-wrap gap-2">
        {PREF_ANSWERS.map(({ value, emoji, tKey }) => {
          const isSelected = currentAnswer === value;
          return (
            <button
              key={value}
              onClick={() => answerFn(topic.id, value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: isSelected ? `${colors.accent}22` : colors.bgSecondary,
                border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                color: isSelected ? colors.accent : colors.textSecondary,
              }}
            >
              <span>{emoji}</span>
              <span>{t(tKey as Parameters<typeof t>[0])}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function PreferenceSection() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const availableTopics = usePreferenceTopics();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
          {t('moi.prefSection_title')}
        </p>
        <Lock size={12} style={{ color: colors.textMuted }} />
      </div>

      {availableTopics.length === 0 ? (
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <p className="text-xs" style={{ color: colors.textMuted }}>
            {t('moi.prefSection_empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableTopics.map((topic, i) => (
            <TopicAnswerCard key={topic.id} topic={topic} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface MoiScreenProps {
  isAdult: boolean | null;
  onNavigate: (screen: Screen) => void;
}

function ProfileCard({
  icon,
  title,
  desc,
  iconBg,
  onClick,
  index,
  accentBorder,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  iconBg?: string;
  onClick: () => void;
  index: number;
  accentBorder?: string;
}) {
  const { colors } = useTheme();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
      style={{
        background: accentBorder ? `rgba(${accentBorder}, 0.06)` : colors.bgCard,
        border: `1px solid ${accentBorder ? `rgba(${accentBorder}, 0.25)` : colors.border}`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg ?? colors.bgSecondary }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm block" style={{ color: colors.textPrimary }}>
          {title}
        </span>
        <p className="text-xs" style={{ color: colors.textSecondary }}>{desc}</p>
      </div>
      <ChevronRight size={16} style={{ color: colors.textMuted }} />
    </motion.button>
  );
}

export function MoiScreen({ isAdult, onNavigate }: MoiScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const userName = useAuthStore((s) => s.userName);
  const { isPremium } = usePremiumStore();
  const { points, level: heatLevel, breakdown, profileDetails } = useHeat();
  const { comfortFilled, safewordSet, pronounsSet } = profileDetails;

  let cardIndex = 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Brand card */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-4 mb-6 flex items-center gap-4"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <AppLogo className="w-14 h-14" variant="theme" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <User size={15} style={{ color: colors.accent }} />
            <h1 className="text-base font-bold truncate" style={{ color: colors.textPrimary }}>
              {userName || t('moi.defaultName')}
            </h1>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-1">
              <Crown size={11} style={{ color: colors.unique }} />
              <span className="text-xs font-medium" style={{ color: colors.unique }}>{t('games.premium')}</span>
            </div>
          ) : (
            <span className="text-xs" style={{ color: colors.textMuted }}>Consentement</span>
          )}
        </div>
      </motion.div>

      {/* Baromètre du Hot */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 mb-6 flex items-center gap-4"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <HeatThermometer points={points} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: colors.textPrimary }}>
            {t('moi.heatTitle')}
          </p>
          <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
            {t('moi.heatDesc', { pts: String(points), level: String(heatLevel) })}
          </p>
          {/* Breakdown des sources de points */}
          {points > 0 && (
            <div className="flex gap-3 mt-2 flex-wrap">
              {([
                ['moi.heatBreak_modules',     breakdown.modules,     '📚'],
                ['moi.heatBreak_cards',        breakdown.cards,       '🃏'],
                ['moi.heatBreak_sessions',     breakdown.sessions,    '🎲'],
                ['moi.heatBreak_profile',      breakdown.profile,     '👤'],
                ['moi.heatBreak_lexique',      breakdown.lexique,     '📖'],
                ['moi.heatBreak_preferences',  breakdown.preferences, '💬'],
              ] as const).filter(([, n]) => n > 0).map(([key, n, emoji]) => (
                <span key={key} className="flex items-center gap-1 text-[10px]" style={{ color: colors.textMuted }}>
                  <span>{emoji}</span>
                  <span>{t(key)}</span>
                  <span className="font-bold" style={{ color: colors.textSecondary }}>
                    {t('moi.heatBreak_pts', { n: String(n) })}
                  </span>
                </span>
              ))}
            </div>
          )}
          {/* Nudges profil — bonuses non encore réclamés */}
          {(!safewordSet || !pronounsSet || comfortFilled < 3) && isAdult && (
            <div className="flex flex-wrap gap-1 mt-2">
              {!safewordSet && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#f9731615', color: '#f97316', border: '1px solid #f9731630' }}
                >
                  {t('moi.heatNudge_safeword')}
                  <span style={{ opacity: 0.8 }}>{t('moi.heatNudge_pts', { n: '3' })}</span>
                </span>
              )}
              {!pronounsSet && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#f9731615', color: '#f97316', border: '1px solid #f9731630' }}
                >
                  {t('moi.heatNudge_pronouns')}
                  <span style={{ opacity: 0.8 }}>{t('moi.heatNudge_pts', { n: '2' })}</span>
                </span>
              )}
              {comfortFilled < 3 && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#f9731615', color: '#f97316', border: '1px solid #f9731630' }}
                >
                  {t('moi.heatNudge_comfort', { n: String(comfortFilled) })}
                  <span style={{ opacity: 0.8 }}>{t('moi.heatNudge_pts', { n: String(3 - comfortFilled) })}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Section préférences — adultes uniquement */}
      {isAdult && <PreferenceSection />}

      <div className="space-y-3">
        {/* Adult-only: personal space + duo */}
        {isAdult && (
          <>
            <ProfileCard
              icon={<Heart size={20} className="text-white" />}
              title={t('headers.personalSpace')}
              desc={t('moi.personalSpaceDesc')}
              iconBg={colors.premiumGradient}
              onClick={() => onNavigate('personal-space')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<Users size={20} className="text-white" />}
              title={t('headers.duoSpace')}
              desc={t('moi.duoSpaceDesc')}
              iconBg={colors.secondaryGradient}
              onClick={() => onNavigate('duo-space')}
              index={++cardIndex}
            />
          </>
        )}

        {/* Adult-only: support + annuaire */}
        {isAdult && (
          <>
            <ProfileCard
              icon={<HandHeart size={20} className="text-white" />}
              title={t('headers.accompagnementAdulte')}
              desc={t('moi.accompagnementAdulteDesc')}
              iconBg="linear-gradient(135deg, #ec4899, #db2777)"
              onClick={() => onNavigate('accompagnement-adulte')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<BookUser size={20} className="text-white" />}
              title={t('headers.annuaireSexologues')}
              desc={t('moi.annuaireDesc')}
              iconBg={colors.accentGradient}
              onClick={() => onNavigate('annuaire-sexologues')}
              index={++cardIndex}
            />
          </>
        )}

        {/* Minor-only: help */}
        {!isAdult && (
          <ProfileCard
            icon={<HelpCircle size={20} className="text-white" />}
            title={t('settings.help.title')}
            desc={t('moi.helpDesc')}
            iconBg={`linear-gradient(135deg, ${colors.unique}, ${colors.warning})`}
            onClick={() => onNavigate('help')}
            index={++cardIndex}
          />
        )}

        {/* Settings — always visible */}
        <ProfileCard
          icon={<Settings size={20} style={{ color: colors.textMuted }} />}
          title={t('headers.settings')}
          desc={t('moi.settingsDesc')}
          onClick={() => onNavigate('settings')}
          index={++cardIndex}
        />

        {/* Premium upsell */}
        {!isPremium && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ++cardIndex * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('premium')}
            className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
            style={{
              background: colors.uniqueBg,
              border: `1px solid ${colors.unique}4d`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${colors.unique}, ${colors.warning})` }}
            >
              <Crown size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm block" style={{ color: colors.unique }}>
                {t('settings.premium.title')}
              </span>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {t('moi.premiumDesc')}
              </p>
            </div>
            <ChevronRight size={16} style={{ color: colors.unique }} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
