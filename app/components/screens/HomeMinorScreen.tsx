'use client';

import { motion } from 'framer-motion';
import { Film, Scale, HelpCircle, Gamepad2, HeartHandshake, Lock, ChevronRight } from 'lucide-react';
import { Screen } from '../../types';
import { useTranslation } from '../../i18n';

interface HomeMinorScreenProps {
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
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate(screen)}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/80 shadow-sm text-left"
      style={{ border: `1.5px solid ${accent}22` }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
          {tag && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${tagColor}20`, color: tagColor }}>
              {tag}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-snug">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </motion.button>
  );
}

export function HomeMinorScreen({ onNavigate }: HomeMinorScreenProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 mb-3">
          <span className="text-xs font-medium text-blue-600">{t('homeMinor.badge')}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('homeMinor.title')}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          {t('homeMinor.subtitle')}
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
      >
        {t('homeMinor.section1')}
      </motion.p>

      <div className="space-y-2.5 mb-6">
        <ModuleCard
          icon={<Film size={22} className="text-violet-500" />}
          title={t('homeMinor.modules.porno.title')}
          desc={t('homeMinor.modules.porno.desc')}
          tag={t('homeMinor.modules.porno.tag')}
          tagColor="#8b5cf6"
          screen="porno-vs-realite"
          delay={0.25}
          accent="#8b5cf6"
          onNavigate={onNavigate}
        />
        <ModuleCard
          icon={<Gamepad2 size={22} className="text-blue-500" />}
          title={t('homeMinor.modules.quiz.title')}
          desc={t('homeMinor.modules.quiz.desc')}
          tag={t('homeMinor.modules.quiz.tag')}
          tagColor="#3b82f6"
          screen="quiz-consentement"
          delay={0.3}
          accent="#3b82f6"
          onNavigate={onNavigate}
        />
        <ModuleCard
          icon={<span className="text-xl">🎲</span>}
          title={t('homeMinor.modules.dice.title')}
          desc={t('homeMinor.modules.dice.desc')}
          tag={t('homeMinor.modules.dice.tag')}
          tagColor="#f59e0b"
          screen="jeux"
          delay={0.35}
          accent="#f59e0b"
          onNavigate={onNavigate}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
      >
        {t('homeMinor.section2')}
      </motion.p>

      <div className="space-y-2.5 mb-6">
        <ModuleCard
          icon={<Scale size={22} className="text-amber-500" />}
          title={t('homeMinor.modules.loi.title')}
          desc={t('homeMinor.modules.loi.desc')}
          tag={t('homeMinor.modules.loi.tag')}
          tagColor="#f59e0b"
          screen="loi-consentement"
          delay={0.4}
          accent="#f59e0b"
          onNavigate={onNavigate}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
      >
        {t('homeMinor.section3')}
      </motion.p>

      <div className="space-y-2.5 mb-6">
        <ModuleCard
          icon={<HeartHandshake size={22} className="text-rose-500" />}
          title={t('homeMinor.modules.guide.title')}
          desc={t('homeMinor.modules.guide.desc')}
          screen="accompagnement-mineur"
          delay={0.5}
          accent="#f43f5e"
          onNavigate={onNavigate}
        />
        <ModuleCard
          icon={<HelpCircle size={22} className="text-emerald-500" />}
          title={t('homeMinor.modules.help.title')}
          desc={t('homeMinor.modules.help.desc')}
          screen="help"
          delay={0.55}
          accent="#10b981"
          onNavigate={onNavigate}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-2 mt-2"
      >
        <Lock size={12} className="text-gray-300" />
        <p className="text-xs text-gray-400">{t('homeMinor.privacy')}</p>
      </motion.div>
    </motion.div>
  );
}
