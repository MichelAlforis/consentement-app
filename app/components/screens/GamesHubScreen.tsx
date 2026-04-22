'use client';

import { motion } from 'framer-motion';
import { Dices, CreditCard, ScrollText, Lock, Gamepad2, Layers } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface GamesHubScreenProps {
  onNavigate: (screen: Screen) => void;
  isPremium: boolean;
  isAdult: boolean;
  onGoPremium: () => void;
}

interface GameCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  locked?: boolean;
  delay: number;
  onClick: () => void;
  gradient: string;
  lockLabel: string;
}

function GameCard({ icon, title, desc, tag, tagColor, locked, delay, onClick, gradient, lockLabel }: GameCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: locked ? 1 : 1.02, y: locked ? 0 : -3 }}
      whileTap={{ scale: locked ? 1 : 0.97 }}
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-3xl p-5 text-left shadow-md"
      style={{ background: gradient, opacity: locked ? 0.75 : 1 }}
    >
      {locked && (
        <div className="absolute inset-0 rounded-3xl bg-black/25 flex items-center justify-center z-10">
          <div className="bg-white/90 rounded-2xl px-4 py-2 flex items-center gap-2 shadow">
            <Lock size={14} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">{lockLabel}</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-base">{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: tagColor, color: '#fff' }}>
              {tag}
            </span>
          </div>
          <p className="text-sm text-white/80 leading-snug">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

export function GamesHubScreen({ onNavigate, isPremium, isAdult, onGoPremium }: GamesHubScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 mb-2"
      >
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <Gamepad2 size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('games.title')}</h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{t('games.subtitle')}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100"
      >
        <p
          className="text-sm text-amber-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('games.intro') }}
        />
      </motion.div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
        {t('games.free')}
      </p>

      <div className="space-y-3 mb-6">
        <GameCard
          icon={<Dices size={28} className="text-white" />}
          title={t('games.dice.title')}
          desc={isAdult ? t('games.dice.descAdult') : t('games.dice.descMinor')}
          tag={t('games.free')}
          tagColor="#16a34a"
          delay={0.2}
          gradient="linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
          lockLabel={t('games.locked')}
          onClick={() => onNavigate('jeu-des')}
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
        {t('games.premium')}
      </p>

      <div className="space-y-3">
        <GameCard
          icon={<Layers size={28} className="text-white" />}
          title={t('games.goose.title')}
          desc={t('games.goose.desc')}
          tag={t('games.premium')}
          tagColor="#7c3aed"
          locked={!isPremium}
          delay={0.3}
          gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
          lockLabel={t('games.locked')}
          onClick={() => isPremium ? onNavigate('jeu-oie') : onGoPremium()}
        />
        <GameCard
          icon={<CreditCard size={28} className="text-white" />}
          title={t('games.cards.title')}
          desc={isAdult ? t('games.cards.descAdult') : t('games.cards.descMinor')}
          tag={t('games.premium')}
          tagColor="#7c3aed"
          locked={!isPremium}
          delay={0.4}
          gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
          lockLabel={t('games.locked')}
          onClick={() => isPremium ? onNavigate('jeu-cartes') : onGoPremium()}
        />
        <GameCard
          icon={<ScrollText size={28} className="text-white" />}
          title={t('games.scenarios.title')}
          desc={t('games.scenarios.desc')}
          tag={t('games.comingSoon')}
          tagColor="#0369a1"
          locked={!isPremium}
          delay={0.5}
          gradient="linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)"
          lockLabel={t('games.locked')}
          onClick={() => !isPremium && onGoPremium()}
        />
      </div>
    </motion.div>
  );
}
