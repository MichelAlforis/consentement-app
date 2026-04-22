'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

const EXPLICIT_RED = '#ef4444';

function TogglePill({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="relative w-12 h-6 rounded-full shrink-0 transition-colors"
      style={{ background: active ? EXPLICIT_RED : '#6b728040' }}
      role="switch"
      aria-checked={active}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ x: active ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

interface ExplicitModeToggleProps {
  /** true = just the pill (for SettingsRow right slot); false = full card (for Home) */
  pillOnly?: boolean;
  delay?: number;
}

export function ExplicitModeToggle({ pillOnly = false, delay = 0 }: ExplicitModeToggleProps) {
  const { explicitMode, toggleExplicitMode } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleToggle = () => {
    if (!explicitMode) {
      setShowModal(true);
    } else {
      toggleExplicitMode();
    }
  };

  const confirm = () => {
    toggleExplicitMode();
    setShowModal(false);
  };

  return (
    <>
      {pillOnly ? (
        <TogglePill active={explicitMode} onClick={handleToggle} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: explicitMode ? `${EXPLICIT_RED}10` : colors.bgCard,
            border: `1.5px solid ${explicitMode ? EXPLICIT_RED : colors.border}`,
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: explicitMode ? `${EXPLICIT_RED}20` : `${EXPLICIT_RED}12` }}
          >
            <Flame size={20} style={{ color: EXPLICIT_RED }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
              {t('settings.explicit.title')}
            </p>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              {explicitMode ? t('settings.explicit.activeDesc') : t('settings.explicit.desc')}
            </p>
          </div>
          <TogglePill active={explicitMode} onClick={handleToggle} />
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${EXPLICIT_RED}18` }}
                >
                  <Flame size={24} style={{ color: EXPLICIT_RED }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base" style={{ color: colors.textPrimary }}>
                    {t('settings.explicit.modal.title')}
                  </h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-1 shrink-0"
                >
                  <X size={18} style={{ color: colors.textMuted }} />
                </motion.button>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                {t('settings.explicit.modal.body')}
              </p>

              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirm}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
                  style={{ background: EXPLICIT_RED }}
                >
                  {t('settings.explicit.modal.confirm')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm"
                  style={{ background: colors.bgSecondary, color: colors.textSecondary }}
                >
                  {t('settings.explicit.modal.cancel')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
