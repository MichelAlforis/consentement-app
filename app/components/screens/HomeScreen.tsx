'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Gamepad2, HeartHandshake, User, Users, BookOpen, Settings, Lock, Heart, GalleryHorizontal, ChevronRight } from 'lucide-react';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';
import { MenuCard } from '../ui';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useUnlockStore } from '../../stores';
import { collectorCards } from '../../data/cards-collector';

interface HomeScreenProps {
  isAdult: boolean | null;
  userName: string;
  onNavigate: (screen: Screen) => void;
}


function HomeFooter({ privacyText, onSettings }: { privacyText: string; onSettings: () => void }) {
  const { colors } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="flex items-center justify-between mt-6 px-1"
    >
      <div className="flex items-center gap-2">
        <Lock size={12} style={{ color: colors.textMuted }} />
        <p className="text-xs" style={{ color: colors.textMuted }}>{privacyText}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSettings}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{ background: colors.bgSecondary }}
      >
        <Settings size={13} style={{ color: colors.textMuted }} />
        <span className="text-xs" style={{ color: colors.textMuted }}>Paramètres</span>
      </motion.button>
    </motion.div>
  );
}

function MinorHome({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
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

      <div className="space-y-3">
        <MenuCard
          icon={<BookOpen size={26} className="text-white" />}
          title={t('homeMinor.cards.learn.title')}
          description={t('homeMinor.cards.learn.desc')}
          onClick={() => onNavigate('resources-minor')}
          variant="accent"
          delay={1}
        />
        <MenuCard
          icon={<HeartHandshake size={26} className="text-white" />}
          title={t('homeMinor.cards.guide.title')}
          description={t('homeMinor.cards.guide.desc')}
          onClick={() => onNavigate('accompagnement-mineur')}
          variant="secondary"
          delay={2}
        />
        <MenuCard
          icon={<HelpCircle size={26} className="text-white" />}
          title={t('homeMinor.cards.help.title')}
          description={t('homeMinor.cards.help.desc')}
          onClick={() => onNavigate('help')}
          variant="amber"
          delay={3}
        />
        <MenuCard
          icon={<Gamepad2 size={26} style={{ color: colors.accent }} />}
          title={t('homeMinor.cards.games.title')}
          description={t('homeMinor.cards.games.desc')}
          onClick={() => onNavigate('jeux')}
          delay={4}
        />
      </div>

      <HomeFooter privacyText={t('homeMinor.privacy')} onSettings={() => onNavigate('settings')} />
    </motion.div>
  );
}

function AdultHome({ userName, onNavigate }: { userName: string; onNavigate: (screen: Screen) => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const ownedCount = ownedCards.length;
  const totalCards = collectorCards.filter((c) => c.deck === 'A').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 mb-6 flex items-start gap-3"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: colors.accentGradient }}>
          <Heart size={18} className="text-white" fill="white" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {t('homeAdult.greeting', { name: userName })}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('homeAdult.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        <MenuCard icon={<User size={26} className="text-white" />} title={t('homeAdult.menu.personal.title')} description={t('homeAdult.menu.personal.desc')} onClick={() => onNavigate('personal-space')} variant="accent" delay={1} />
        <MenuCard icon={<Users size={26} className="text-white" />} title={t('homeAdult.menu.duo.title')} description={t('homeAdult.menu.duo.desc')} onClick={() => onNavigate('duo-space')} variant="secondary" delay={2} />
        <MenuCard icon={<Gamepad2 size={26} className="text-white" />} title={t('homeAdult.menu.games.title')} description={t('homeAdult.menu.games.desc')} onClick={() => onNavigate('jeux')} variant="amber" delay={3} />
        <MenuCard icon={<BookOpen size={26} style={{ color: colors.accent }} />} title={t('homeAdult.menu.resources.title')} description={t('homeAdult.menu.resources.desc')} onClick={() => onNavigate('learn')} delay={4} />
      </div>

      {/* Hall of Cards — accès rapide */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate('hall-of-cards')}
        className="w-full mt-3 rounded-2xl p-3.5 flex items-center gap-3 text-left"
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
          <p className="text-xs leading-snug" style={{ color: colors.textMuted }}>
            {ownedCount === 0
              ? t('homeAdult.collection.empty')
              : t('homeAdult.collection.count', { owned: String(ownedCount), total: String(totalCards) })}
          </p>
        </div>
        <ChevronRight size={16} style={{ color: colors.textMuted, flexShrink: 0 }} />
      </motion.button>

      <div className="mt-4">
        <ExplicitModeToggle delay={0.45} />
      </div>

      <HomeFooter privacyText={t('homeAdult.privacy')} onSettings={() => onNavigate('settings')} />
    </motion.div>
  );
}

export function HomeScreen({ isAdult, userName, onNavigate }: HomeScreenProps) {
  if (isAdult) {
    return <AdultHome userName={userName} onNavigate={onNavigate} />;
  }
  return <MinorHome onNavigate={onNavigate} />;
}
