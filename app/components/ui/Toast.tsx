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
    <div className="fixed left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-[340px] pointer-events-none bottom-[max(calc(env(safe-area-inset-bottom,0px)+80px),96px)]">
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
              className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-[12px] pointer-events-auto w-full"
              style={{
                background: colors.bgCard,
                border: `1px solid ${barColor}40`,
              }}
            >
              <div className="px-4 py-3 flex items-center gap-2.5">
                {toast.type === 'success' && (
                  <CheckCircle size={18} className="shrink-0" style={{ color: colors.success }} />
                )}
                {toast.type === 'error' && (
                  <XCircle size={18} className="shrink-0" style={{ color: colors.error }} />
                )}
                {toast.type === 'default' && (
                  <Info size={18} className="shrink-0" style={{ color: colors.accent }} />
                )}
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {toast.message}
                </span>
              </div>

              {/* Timer bar */}
              <div className="h-0.5 relative overflow-hidden" style={{ background: `${barColor}20` }}>
                <div
                  className="absolute inset-0 origin-left"
                  style={{
                    background: barColor,
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
