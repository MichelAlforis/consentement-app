'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound, User } from 'lucide-react';
import { Button, Card } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../stores';

interface AuthScreenProps {
  onAuth: (name: string) => void;
}

const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;
type PronounKey = typeof PRONOUNS[number];

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { setPronouns } = useAuthStore();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedPronoun, setSelectedPronoun] = useState<PronounKey | null>(null);

  const handleContinue = () => {
    if (name.trim()) {
      setPronouns(selectedPronoun);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-xl shadow-violet-300/50"
        >
          <User size={40} className="text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {t('auth.title')}
        </h2>
        <p style={{ color: colors.textMuted }}>
          {t('auth.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 space-y-3"
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
                borderColor: hasError ? colors.error : isFocused ? colors.accent : colors.border,
                color: colors.textPrimary,
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            />
          </motion.div>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={11} style={{ color: colors.textMuted }} />
            <p className="text-xs" style={{ color: hasError ? colors.error : colors.textMuted }}>
              {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
            </p>
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <p className="text-sm font-medium mb-3" style={{ color: colors.textSecondary }}>
            {t('auth.pronounsLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRONOUNS.map((p) => {
              const active = selectedPronoun === p;
              return (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPronoun(active ? null : p)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: active ? colors.accent : colors.bgSecondary,
                    color: active ? '#fff' : colors.textMuted,
                    border: `1px solid ${active ? colors.accent : colors.divider}`,
                  }}
                >
                  {t(`auth.pronounOptions.${p}`)}
                </motion.button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button onClick={handleContinue} fullWidth size="lg">
          <KeyRound size={20} />
          {t('auth.btnContinue')}
        </Button>
      </motion.div>
    </motion.div>
  );
}
