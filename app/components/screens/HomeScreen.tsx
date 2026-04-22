'use client';

import { motion } from 'framer-motion';
import { Film, Scale, HelpCircle, Gamepad2, HeartHandshake, User, Users, BookOpen, Settings, Lock, ChevronRight, Heart } from 'lucide-react';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';
import { MenuCard } from '../ui';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface HomeScreenProps {
  isAdult: boolean | null;
  userName: string;
  onNavigate: (screen: Screen) => void;
}

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
  tagColor?: string;
  screen: Screen;
  delay: number;
  accent: string;
  onNavigate: (screen: Screen) => void;
}

function ModuleCard({ icon, title, desc, tag, tagColor, screen, delay, accent, onNavigate }: ModuleCardProps) {
  const { colors } = useTheme();
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate(screen)}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
      style={{ background: colors.bgCard, border: `1.5px solid ${accent}22` }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{title}</span>
          {tag && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${tagColor}20`, color: tagColor }}>
              {tag}
            </span>
          )}
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textMuted }}>{desc}</p>
      </div>
      <ChevronRight size={16} style={{ color: colors.textMuted }} className="shrink-0" />
    </motion.button>
  );
}

function SectionLabel({ label, delay }: { label: string; delay: number }) {
  const { colors } = useTheme();
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: colors.textMuted }}
    >
      {label}
    </motion.p>
  );
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-8">
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

      <SectionLabel label={t('homeMinor.section1')} delay={0.2} />
      <div className="space-y-2.5 mb-6">
        <ModuleCard icon={<Film size={22} className="text-violet-500" />} title={t('homeMinor.modules.porno.title')} desc={t('homeMinor.modules.porno.desc')} tag={t('homeMinor.modules.porno.tag')} tagColor="#8b5cf6" screen="porno-vs-realite" delay={0.25} accent="#8b5cf6" onNavigate={onNavigate} />
        <ModuleCard icon={<Gamepad2 size={22} className="text-blue-500" />} title={t('homeMinor.modules.quiz.title')} desc={t('homeMinor.modules.quiz.desc')} tag={t('homeMinor.modules.quiz.tag')} tagColor="#3b82f6" screen="quiz-consentement" delay={0.3} accent="#3b82f6" onNavigate={onNavigate} />
        <ModuleCard icon={<span className="text-xl">🎲</span>} title={t('homeMinor.modules.dice.title')} desc={t('homeMinor.modules.dice.desc')} tag={t('homeMinor.modules.dice.tag')} tagColor="#f59e0b" screen="jeux" delay={0.35} accent="#f59e0b" onNavigate={onNavigate} />
      </div>

      <SectionLabel label={t('homeMinor.section2')} delay={0.35} />
      <div className="space-y-2.5 mb-6">
        <ModuleCard icon={<Scale size={22} className="text-amber-500" />} title={t('homeMinor.modules.loi.title')} desc={t('homeMinor.modules.loi.desc')} tag={t('homeMinor.modules.loi.tag')} tagColor="#f59e0b" screen="loi-consentement" delay={0.4} accent="#f59e0b" onNavigate={onNavigate} />
      </div>

      <SectionLabel label={t('homeMinor.section3')} delay={0.45} />
      <div className="space-y-2.5">
        <ModuleCard icon={<HeartHandshake size={22} className="text-rose-500" />} title={t('homeMinor.modules.guide.title')} desc={t('homeMinor.modules.guide.desc')} screen="accompagnement-mineur" delay={0.5} accent="#f43f5e" onNavigate={onNavigate} />
        <ModuleCard icon={<HelpCircle size={22} className="text-emerald-500" />} title={t('homeMinor.modules.help.title')} desc={t('homeMinor.modules.help.desc')} screen="help" delay={0.55} accent="#10b981" onNavigate={onNavigate} />
      </div>

      <HomeFooter privacyText={t('homeMinor.privacy')} onSettings={() => onNavigate('settings')} />
    </motion.div>
  );
}

function AdultHome({ userName, onNavigate }: { userName: string; onNavigate: (screen: Screen) => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
