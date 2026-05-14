'use client';

import { motion } from 'framer-motion';
import { X, Scale } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface LegalCredentialSheetProps {
  onClose: () => void;
}

export function LegalCredentialSheet({ onClose }: LegalCredentialSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-10 bg-black/70 backdrop-blur-[10px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-sm rounded-3xl p-5"
        style={{ background: colors.bgCard, border: '1px solid rgba(139,92,246,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
            {t('welcome.legalSheet.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full"
            style={{ background: colors.bgSecondary }}
          >
            <X size={16} style={{ color: colors.textMuted }} />
          </button>
        </div>

        {/* Profil juriste */}
        <div className="flex items-center gap-4 mb-4 p-4 rounded-2xl" style={{ background: colors.bgSecondary }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <Scale size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: colors.textPrimary }}>
              {t('welcome.legalSheet.title')}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {t('welcome.legalSheet.role')}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: colors.textSecondary }}>
          {t('welcome.legalSheet.bio')}
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          {t('welcome.legalSheet.close')}
        </button>
      </motion.div>
    </motion.div>
  );
}
