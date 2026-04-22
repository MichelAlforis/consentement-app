'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const TOAST_DURATION = 2800;

export function Toast() {
  const { toasts } = useToast();
  const { colors } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 80px), 96px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: 'calc(100% - 32px)',
        maxWidth: 340,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map(toast => {
          const barColor =
            toast.type === 'success' ? colors.success :
            toast.type === 'error' ? colors.error :
            colors.accent;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={{
                background: colors.bgCard,
                border: `1px solid ${barColor}40`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                width: '100%',
              }}
            >
              <div
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 16,
                  paddingRight: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {toast.type === 'success' && (
                  <CheckCircle size={18} style={{ color: colors.success, flexShrink: 0 }} />
                )}
                {toast.type === 'error' && (
                  <XCircle size={18} style={{ color: colors.error, flexShrink: 0 }} />
                )}
                {toast.type === 'default' && (
                  <Info size={18} style={{ color: colors.accent, flexShrink: 0 }} />
                )}
                <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 500 }}>
                  {toast.message}
                </span>
              </div>

              {/* Timer bar */}
              <div
                style={{
                  height: 2,
                  background: `${barColor}20`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: barColor,
                    transformOrigin: 'left',
                    animation: `toast-timer ${TOAST_DURATION}ms linear forwards`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
