'use client';

import { motion } from 'framer-motion';
import { Dices, CreditCard, ScrollText, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface GamesHubScreenProps {
  onNavigate: (screen: Screen) => void;
  isPremium: boolean;
  isAdult: boolean;
  onGoPremium: () => void;
}

// ─── Carte gratuite — sobre, fonctionnelle, sans fioriture ───────────────────

function FreeCard({
  icon,
  title,
  desc,
  delay,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
  onClick: () => void;
}) {
  const { colors } = useTheme();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-2xl p-4 text-left flex items-center gap-3"
      style={{ background: colors.bgCard, border: `1.5px solid ${colors.border}` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: colors.bgSecondary }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-md font-bold" style={{ background: '#dcfce7', color: '#15803d' }}>
            GRATUIT
          </span>
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textMuted }}>{desc}</p>
      </div>
      <ChevronRight size={16} style={{ color: colors.textMuted, flexShrink: 0 }} />
    </motion.button>
  );
}

// ─── Carte premium — gradient riche, CTA unlock proéminent ──────────────────

function PremiumCard({
  icon,
  title,
  desc,
  tag,
  locked,
  delay,
  onClick,
  gradient,
  glow,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  locked: boolean;
  delay: number;
  onClick: () => void;
  gradient: string;
  glow: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={locked ? undefined : { scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-3xl p-5 text-left"
      style={{
        background: gradient,
        boxShadow: locked ? 'none' : `0 8px 28px ${glow}55`,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-base">{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/20 text-white">
              {tag}
            </span>
          </div>
          <p className="text-sm text-white/80 leading-snug">{desc}</p>
        </div>
      </div>

      {/* Overlay unlock — invitation, pas barrière */}
      {locked && (
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.68))' }}
        >
          <div
            className="px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }}
          >
            <Sparkles size={14} />
            Débloquer · 4,99€/mois
          </div>
        </div>
      )}
    </motion.button>
  );
}

// ─── GamesHubScreen ──────────────────────────────────────────────────────────

export function GamesHubScreen({ onNavigate, isPremium, isAdult, onGoPremium }: GamesHubScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-10">

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-xl font-bold mb-0.5" style={{ color: colors.textPrimary }}>{t('games.title')}</h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{t('games.subtitle')}</p>
      </motion.div>

      {/* Gratuit */}
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
        Inclus · accès libre
      </p>
      <div className="mb-7">
        <FreeCard
          icon={<Dices size={22} style={{ color: colors.textSecondary }} />}
          title={t('games.dice.title')}
          desc={isAdult ? t('games.dice.descAdult') : t('games.dice.descMinor')}
          delay={0.1}
          onClick={() => onNavigate('jeu-des')}
        />
      </div>

      {/* Premium */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.textMuted }}>
          Premium
        </p>
        {!isPremium && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onGoPremium}
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
          >
            Voir l'offre →
          </motion.button>
        )}
      </div>

      <div className="space-y-3">
        <PremiumCard
          icon={<Layers size={26} className="text-white" />}
          title={t('games.goose.title')}
          desc={t('games.goose.desc')}
          tag="Premium"
          locked={!isPremium}
          delay={0.2}
          gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
          glow="#7c3aed"
          onClick={() => isPremium ? onNavigate('jeu-oie') : onGoPremium()}
        />
        <PremiumCard
          icon={<CreditCard size={26} className="text-white" />}
          title={t('games.cards.title')}
          desc={isAdult ? t('games.cards.descAdult') : t('games.cards.descMinor')}
          tag="Premium"
          locked={!isPremium}
          delay={0.3}
          gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
          glow="#a855f7"
          onClick={() => isPremium ? onNavigate('jeu-cartes') : onGoPremium()}
        />
        <PremiumCard
          icon={<ScrollText size={26} className="text-white" />}
          title={t('games.scenarios.title')}
          desc={t('games.scenarios.desc')}
          tag="Bientôt"
          locked={!isPremium}
          delay={0.4}
          gradient="linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)"
          glow="#0ea5e9"
          onClick={() => !isPremium ? onGoPremium() : undefined}
        />
      </div>
    </motion.div>
  );
}
