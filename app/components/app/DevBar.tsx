'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n';
import { resetAllData } from '../../stores';
import type { Screen } from '../../types';
import type { Theme } from '../../types/theme';

type DevBarProps = {
  isPremium: boolean;
  navigateTo: (screen: Screen) => void;
  handleAgeSelect: (adult: boolean) => void;
  handleAuth: (name: string) => void;
  deactivatePremium: () => void;
  theme: Theme;
};

export function DevBar({
  isPremium,
  navigateTo,
  handleAgeSelect,
  handleAuth,
  deactivatePremium,
  theme,
}: DevBarProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-3 safe-area-bottom"
      style={{ background: theme.colors.bgCard, borderTop: `1px solid ${theme.colors.divider}` }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <button onClick={() => navigateTo('welcome')} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">{t('devBar.home')}</button>
        <button onClick={() => handleAgeSelect(false)} className="px-3 py-1.5 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">{t('devBar.modeMinor')}</button>
        <button onClick={() => { handleAgeSelect(true); handleAuth('Demo'); }} className="px-3 py-1.5 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">{t('devBar.modeAdult')}</button>
        <button
          onClick={() => isPremium ? deactivatePremium() : navigateTo('premium')}
          className={`px-3 py-1.5 text-xs rounded-full transition-colors ${isPremium ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        >
          {isPremium ? t('devBar.premiumOn') : t('devBar.premium')}
        </button>
        <button onClick={resetAllData} className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">{t('devBar.reset')}</button>
      </div>
      <p className="text-center text-xs" style={{ color: theme.colors.textMuted }}>{t('devBar.demo')}</p>
    </motion.div>
  );
}
