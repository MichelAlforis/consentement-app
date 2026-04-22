'use client';

import { motion } from 'framer-motion';
import { User, Users, BookOpen, Lock, Gamepad2, Heart } from 'lucide-react';
import { MenuCard } from '../ui';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HomeAdultScreenProps {
  userName: string;
  onNavigate: (screen: Screen) => void;
}

export function HomeAdultScreen({ userName, onNavigate }: HomeAdultScreenProps) {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 mb-6 flex items-start gap-3"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: colors.accentGradient }}
        >
          <Heart size={18} className="text-white" fill="white" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            Bonjour {userName}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Explore ton profil de confort ou connecte-toi avec ton/ta partenaire.
          </p>
        </div>
      </motion.div>

      {/* Main Actions */}
      <div className="space-y-3">
        <MenuCard
          icon={<User size={26} className="text-white" />}
          title="Mon Espace"
          description="Explorer mes zones de confort"
          onClick={() => onNavigate('personal-space')}
          variant="accent"
          delay={1}
        />

        <MenuCard
          icon={<Users size={26} className="text-white" />}
          title="Notre Espace"
          description="Dialoguer avec mon/ma partenaire"
          onClick={() => onNavigate('duo-space')}
          variant="secondary"
          delay={2}
        />

        <MenuCard
          icon={<Gamepad2 size={26} className="text-white" />}
          title="Jeux"
          description="Explorer le consentement en jouant"
          onClick={() => onNavigate('jeux')}
          variant="amber"
          delay={3}
        />

        <MenuCard
          icon={<BookOpen size={26} style={{ color: colors.accent }} />}
          title="Ressources"
          description="Guides et informations"
          onClick={() => onNavigate('learn')}
          delay={4}
        />
      </div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 rounded-2xl flex items-center justify-center gap-2"
        style={{ background: colors.bgSecondary, border: `1px solid ${colors.divider}` }}
      >
        <Lock size={14} style={{ color: colors.textMuted }} />
        <p className="text-xs" style={{ color: colors.textMuted }}>
          Tes données sont chiffrées et tu peux les supprimer à tout moment.
        </p>
      </motion.div>
    </motion.div>
  );
}
