'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { useTranslation } from '../../../../i18n';

const PACTE_ICONS = ['🤝', '🔒', '⏸️'];

interface PacteScreenProps {
  player1: Player;
  player2: Player;
  onStart: () => void;
}

export function PacteScreen({ player1, player2, onStart }: PacteScreenProps) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  const pacteLines = [
    t('gooseGame.pacte.line1'),
    t('gooseGame.pacte.line2'),
    t('gooseGame.pacte.line3'),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500 + pacteLines.length * 500 + 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 p-6 pt-8 min-h-[80vh]"
      style={{ color: 'white' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-5"
      >
        <div className="text-center">
          <div className="text-4xl">{player1.emoji}</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">{player1.name}</div>
        </div>
        <div className="text-white/25 text-2xl">×</div>
        <div className="text-center">
          <div className="text-4xl">{player2.emoji}</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">{player2.name}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-xl font-black mb-1">{t('gooseGame.pacte.title')}</h2>
        <p className="text-white/50 text-sm">{t('gooseGame.pacte.sub')}</p>
      </motion.div>

      <div className="w-full max-w-[300px] flex flex-col gap-3">
        {pacteLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.5, type: 'spring', stiffness: 200 }}
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.5, type: 'spring', stiffness: 350 }}
              style={{ fontSize: 18, flexShrink: 0 }}
            >
              {PACTE_ICONS[i]}
            </motion.span>
            <p className="text-white/85 text-sm leading-relaxed">{line}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        style={{
          background: ready ? 'rgba(255,255,255,0.95)' : 'transparent',
          color: '#1e293b',
          borderRadius: 18,
          padding: '16px 0',
          fontWeight: 800,
          fontSize: 16,
          width: '100%',
          maxWidth: 300,
          cursor: ready ? 'pointer' : 'default',
          transition: 'all 0.4s ease',
        }}
      >
        {t('gooseGame.pacte.acceptBtn')}
      </motion.button>
    </motion.div>
  );
}
