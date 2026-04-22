'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Check, KeyRound, Landmark, Flag } from 'lucide-react';
import { Button, Card } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

interface AuthScreenProps {
  onAuth: (name: string) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleConnect = () => {
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }
    if (name.trim()) {
      onAuth(name.trim());
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 2500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (hasError) setHasError(false);
  };

  const borderColor = hasError
    ? colors.error
    : isFocused
      ? colors.accent
      : colors.border;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-xl shadow-blue-300/50"
        >
          <Flag size={48} className="text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {t('auth.title')}
        </h2>
        <p style={{ color: colors.textMuted }}>
          {t('auth.subtitle')}
        </p>
      </motion.div>

      {showNameInput && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          className="mb-4"
        >
          <Card variant="default" padding="lg">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              {t('auth.nameLabel')}
            </label>
            <motion.div
              animate={hasError ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder={t('auth.namePlaceholder')}
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-colors"
                style={{
                  background: colors.bgSecondary,
                  borderColor,
                  color: colors.textPrimary,
                  transition: 'border-color 0.2s ease',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />
            </motion.div>
            <p className="text-xs mt-2" style={{ color: hasError ? colors.error : colors.textMuted }}>
              {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
            </p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleConnect}
          fullWidth
          size="lg"
          className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !shadow-blue-300/40"
        >
          <KeyRound size={20} />
          {showNameInput ? t('auth.btnContinue') : t('auth.btnConnect')}
        </Button>

        <p className="text-center text-xs mt-3" style={{ color: colors.textMuted }}>
          {t('auth.demoNote')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card variant="default" padding="lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textSecondary }}>
            <Lock size={18} style={{ color: colors.textMuted }} />
            {t('auth.why.title')}
          </h4>

          <ul className="space-y-3">
            {[
              t('auth.why.reason1'),
              t('auth.why.reason2'),
              t('auth.why.reason3'),
            ].map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
                style={{ color: colors.textSecondary }}
              >
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Check size={14} />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pt-8 flex justify-center gap-3"
      >
        <span className="px-3 py-1.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium flex items-center gap-1.5">
          <Shield size={14} />
          {t('auth.badges.encrypted')}
        </span>
        <span className="px-3 py-1.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium flex items-center gap-1.5">
          <Flag size={14} />
          {t('auth.badges.rgpd')}
        </span>
        <span className="px-3 py-1.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium flex items-center gap-1.5">
          <Landmark size={14} />
          {t('auth.badges.official')}
        </span>
      </motion.div>
    </motion.div>
  );
}
