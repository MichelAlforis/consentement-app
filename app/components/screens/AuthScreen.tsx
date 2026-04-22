'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Check, KeyRound, Landmark, Flag } from 'lucide-react';
import { Button, Card } from '../ui';
import { useTranslation } from '../../i18n';

interface AuthScreenProps {
  onAuth: (name: string) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleConnect = () => {
    if (showNameInput && name.trim()) {
      onAuth(name.trim());
    } else {
      setShowNameInput(true);
    }
  };

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

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('auth.title')}
        </h2>
        <p className="text-gray-500">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.nameLabel')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.namePlaceholder')}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:border-blue-400 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && onAuth(name.trim())}
            />
            <p className="text-xs text-gray-400 mt-2">
              {t('auth.namePrivacy')}
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
          disabled={showNameInput && !name.trim()}
          className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !shadow-blue-300/40"
        >
          <KeyRound size={20} />
          {showNameInput ? t('auth.btnContinue') : t('auth.btnConnect')}
        </Button>

        <p className="text-center text-xs text-gray-400 mt-3">
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
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-gray-600" />
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
                className="flex items-center gap-3 text-sm text-gray-600"
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
