'use client';

/**
 * AdBanner — placeholder web pour les emplacements publicitaires.
 *
 * Migration vers AdMob natif (Capacitor) :
 *   1. npm install @capacitor-community/admob
 *   2. Remplacer le rendu JSX ci-dessous par :
 *        import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
 *        AdMob.showBanner({ adId: 'ca-app-pub-xxx', adSize: BannerAdSize.BANNER, position: BannerAdPosition.BOTTOM_CENTER });
 *   3. Le composant React peut devenir un simple spacer (height: 50px) pour réserver la place.
 */

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface AdBannerProps {
  onGoPremium: () => void;
}

export function AdBanner({ onGoPremium }: AdBannerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mx-0 overflow-hidden"
      style={{ borderTop: `1px solid ${colors.divider}` }}
    >
      {/* Étiquette pub */}
      <div
        className="flex items-center justify-between px-4 py-1"
        style={{ background: colors.bgSecondary }}
      >
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: colors.textMuted }}>
          {t('ad.label')}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onGoPremium}
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${colors.accent}20`, color: colors.accent }}
        >
          <Zap size={9} />
          {t('ad.removeCta')}
        </motion.button>
      </div>

      {/* Espace banner 50 px (taille standard AdMob BANNER) */}
      <div
        className="h-[50px] flex items-center justify-center"
        style={{ background: colors.bgCard }}
      >
        {/* Remplacer ce bloc par le rendu AdMob natif */}
        <p className="text-xs italic" style={{ color: colors.textMuted }}>
          {t('ad.placeholder')}
        </p>
      </div>
    </motion.div>
  );
}
