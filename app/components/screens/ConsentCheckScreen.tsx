'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, Phone, BookOpen, HeartHandshake } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface ConsentCheckScreenProps {
  onNavigate: (screen: Screen) => void;
}

type Panel = 'yes' | 'doubt' | 'questions' | null;

// ─── Checklist panel ──────────────────────────────────────────────────────────

function YesPanel() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const items = [
    t('consentCheck.yes.item1'),
    t('consentCheck.yes.item2'),
    t('consentCheck.yes.item3'),
    t('consentCheck.yes.item4'),
    t('consentCheck.yes.item5'),
  ];
  const [checked, setChecked] = useState<boolean[]>(Array(5).fill(false));
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-2">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className="w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-colors"
          style={{
            background: checked[i] ? '#f0fdf4' : colors.bgSecondary,
            border: `1px solid ${checked[i] ? '#86efac' : colors.border}`,
          }}
        >
          {checked[i]
            ? <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
            : <Circle size={18} className="shrink-0 mt-0.5" style={{ color: colors.textMuted }} />
          }
          <span className="text-sm leading-snug" style={{ color: checked[i] ? '#166534' : colors.textSecondary }}>
            {item}
          </span>
        </button>
      ))}

      <AnimatePresence>
        {allChecked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-4 rounded-2xl text-center"
            style={{ background: '#f0fdf4', border: '1px solid #86efac' }}
          >
            <p className="text-sm font-semibold text-green-700">
              {t('consentCheck.yes.allChecked')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Doubt panel ──────────────────────────────────────────────────────────────

function DoubtPanel() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tips = [
    t('consentCheck.doubt.tip1'),
    t('consentCheck.doubt.tip2'),
    t('consentCheck.doubt.tip3'),
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-4">
      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
        {t('consentCheck.doubt.text')}
      </p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          {t('consentCheck.doubt.tipsTitle')}
        </p>
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="px-3 py-2.5 rounded-xl text-sm italic"
              style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
            >
              {tip}
            </div>
          ))}
        </div>
      </div>

      <a
        href="tel:0800059595"
        className="flex items-center gap-3 p-4 rounded-2xl"
        style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
      >
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <Phone size={16} className="text-red-500" />
        </div>
        <p className="text-xs text-red-700 leading-snug">{t('consentCheck.doubt.resource')}</p>
      </a>
    </motion.div>
  );
}

// ─── ConsentCheckScreen ───────────────────────────────────────────────────────

export function ConsentCheckScreen({ onNavigate }: ConsentCheckScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState<Panel>(null);

  const toggle = (panel: Panel) => setOpen((prev) => (prev === panel ? null : panel));

  const panels: {
    id: Panel;
    label: string;
    desc: string;
    accent: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }[] = [
    {
      id: 'yes',
      label: t('consentCheck.yes.label'),
      desc: t('consentCheck.yes.desc'),
      accent: '#16a34a',
      bg: '#f0fdf4',
      border: '#86efac',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      content: <YesPanel />,
    },
    {
      id: 'doubt',
      label: t('consentCheck.doubt.label'),
      desc: t('consentCheck.doubt.desc'),
      accent: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      icon: <HeartHandshake size={20} className="text-amber-600" />,
      content: <DoubtPanel />,
    },
    {
      id: 'questions',
      label: t('consentCheck.questions.label'),
      desc: t('consentCheck.questions.desc'),
      accent: '#7c3aed',
      bg: '#f5f3ff',
      border: '#c4b5fd',
      icon: <BookOpen size={20} className="text-violet-600" />,
      content: null,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          {t('consentCheck.title')}
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {t('consentCheck.subtitle')}
        </p>
      </motion.div>

      <div className="space-y-3">
        {panels.map(({ id, label, desc, bg, border, accent, icon, content }, i) => {
          const isOpen = open === id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: isOpen ? bg : colors.bgCard, border: `1.5px solid ${isOpen ? border : colors.border}` }}
            >
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => id === 'questions' ? onNavigate('learn') : toggle(id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: isOpen ? `${accent}18` : colors.bgSecondary }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: colors.textPrimary }}>
                    {label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{desc}</p>
                </div>
                {id !== 'questions' && (
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} style={{ color: colors.textMuted }} />
                  </motion.div>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">{content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
