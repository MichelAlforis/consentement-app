'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../ui';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { DynamicIcon } from '../../utils/iconFromName';
import type { LoiItem } from '../../data/ruptureHarcele';
import type { ModuleId } from '../../modules';

interface LoiModuleScreenProps {
  items: LoiItem[];
  namespace: string;
  moduleId: ModuleId;
  onComplete?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tx = (t: (k: any) => string, key: string) => t(key);

export function LoiModuleScreen({ items, namespace, moduleId, onComplete }: LoiModuleScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [current, setCurrent] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const readAll = () => {
    complete(moduleId);
    setDone(true);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-5 text-center"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-4"
        >
          <Scale size={64} color="#f59e0b" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {t('loiScreen.doneTitle')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: colors.textMuted }}>{t('loiScreen.doneSub')}</p>
        {onComplete && (
          <Button onClick={onComplete}><Sparkles size={16} />{t('loiScreen.seeCard')}</Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <Scale size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{tx(t, `${namespace}.title`)}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{tx(t, `${namespace}.subtitle`)}</p>
        </div>
      </div>

      {/* Alert box */}
      <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle size={15} className="text-amber-600 shrink-0" />
          <span className="text-sm font-bold text-amber-800">{tx(t, `${namespace}.alert.title`)}</span>
        </div>
        <p className="text-sm leading-relaxed text-amber-900"
          dangerouslySetInnerHTML={{ __html: tx(t, `${namespace}.alert.text`) }}
        />
      </div>

      {/* Points de loi */}
      <div className="space-y-2.5 mb-5">
        {items.map((item, i) => {
          const isOpen = current === i;
          return (
            <motion.div key={item.id} layout className="rounded-2xl border overflow-hidden"
              style={{ borderColor: item.important ? '#f59e0b50' : colors.border,
                background: item.important ? '#fffbeb' : colors.bgCard }}
            >
              <button
                onClick={() => setCurrent(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.important ? 'bg-amber-100' : 'bg-gray-100'}`}>
                  <DynamicIcon name={item.iconName} size={16}
                    color={item.important ? '#d97706' : colors.textMuted} />
                </div>
                <span className="flex-1 text-sm font-semibold leading-snug"
                  style={{ color: item.important ? '#92400e' : colors.textPrimary }}>
                  {tx(t, `${namespace}.${i}.titre`)}
                </span>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight size={16} color={colors.textMuted} />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-relaxed"
                        style={{ color: item.important ? '#78350f' : colors.textSecondary }}
                        dangerouslySetInnerHTML={{ __html: tx(t, `${namespace}.${i}.contenu`) }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Sources */}
      <p className="text-xs mb-1" style={{ color: colors.textMuted }}>{tx(t, `${namespace}.source1`)}</p>
      <p className="text-xs mb-6" style={{ color: colors.textMuted }}>{tx(t, `${namespace}.source2`)}</p>

      <Button onClick={readAll} fullWidth>
        {t('loiScreen.markRead')}<Sparkles size={16} />
      </Button>
    </motion.div>
  );
}
