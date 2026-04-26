'use client';

import { motion } from 'framer-motion';
import { User, Users, HelpCircle, Settings, Crown, ChevronRight, Heart } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore, usePremiumStore } from '../../stores';

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
  const userName = useAuthStore((s) => s.userName);
  const { isPremium } = usePremiumStore();

  let cardIndex = 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <User size={20} style={{ color: colors.accent }} />
          <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {userName || 'Mon espace'}
          </h1>
        </div>
        {isPremium && (
          <div className="flex items-center gap-1.5">
            <Crown size={12} style={{ color: '#f59e0b' }} />
            <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>Premium</span>
          </div>
        )}
      </motion.div>

      <div className="space-y-3">
        {/* Adult-only: personal space + duo */}
        {isAdult && (
          <>
            <ProfileCard
              icon={<Heart size={20} className="text-white" />}
              title="Mon Espace"
              desc="Explorer mes zones de confort"
              iconBg="linear-gradient(135deg, #8b5cf6, #7c3aed)"
              onClick={() => onNavigate('personal-space')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<Users size={20} className="text-white" />}
              title="Notre Espace"
              desc="Dialoguer avec mon/ma partenaire"
              iconBg="linear-gradient(135deg, #ec4899, #db2777)"
              onClick={() => onNavigate('duo-space')}
              index={++cardIndex}
            />
          </>
        )}

        {/* Minor-only: help */}
        {!isAdult && (
          <ProfileCard
            icon={<HelpCircle size={20} className="text-white" />}
            title="Aide & Urgences"
            desc="Numéros gratuits, anonymes, disponibles 24h/24"
            iconBg="linear-gradient(135deg, #f59e0b, #d97706)"
            onClick={() => onNavigate('help')}
            index={++cardIndex}
          />
        )}

        {/* Settings — always visible */}
        <ProfileCard
          icon={<Settings size={20} style={{ color: colors.textMuted }} />}
          title="Paramètres"
          desc="Thème, langue, données personnelles"
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
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.06))',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <Crown size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm block" style={{ color: '#f59e0b' }}>
                Passer Premium
              </span>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Tous les jeux · contenus profonds · sans limite
              </p>
            </div>
            <ChevronRight size={16} style={{ color: '#f59e0b' }} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
