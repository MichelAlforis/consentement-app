'use client';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { useTranslation } from '../../../../i18n';

interface EndScreenProps {
  player1: Player;
  player2: Player;
  accordsCount: number;
  onReplay: () => void;
}

export function EndScreen({ player1, player2, accordsCount, onReplay }: EndScreenProps) {
  const { t } = useTranslation();

  const endMessages = [
    { threshold: 0,        text: t('gooseGame.end.msg0'), icon: '🌱' },
    { threshold: 2,        text: t('gooseGame.end.msg1'), icon: '🌊' },
    { threshold: 4,        text: t('gooseGame.end.msg2'), icon: '✨' },
    { threshold: Infinity, text: t('gooseGame.end.msg3'), icon: '💜' },
  ];

  const msg = endMessages.findLast(m => accordsCount > m.threshold) ?? endMessages[0];

  const accordLabel = accordsCount === 0
    ? t('gooseGame.end.accord0')
    : accordsCount === 1
    ? t('gooseGame.end.accord1')
    : t('gooseGame.end.accordMany');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 flex flex-col items-center gap-5 text-center"
      style={{ color: 'white', minHeight: '100%', background: 'linear-gradient(180deg, #1a0838 0%, #060512 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="pt-4"
      >
        <div className="text-5xl mb-3">🏁</div>
        <h2 className="text-2xl font-black mb-1">{t('gooseGame.end.title')}</h2>
        <p className="text-white/55 text-sm">{t('gooseGame.end.sub')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
        className="flex items-center gap-5"
      >
        <div className="text-center">
          <div className="text-4xl">{player1.emoji}</div>
          <div className="text-sm font-bold text-white/75 mt-1">{player1.name}</div>
        </div>
        <div className="text-white/25 text-xl">×</div>
        <div className="text-center">
          <div className="text-4xl">{player2.emoji}</div>
          <div className="text-sm font-bold text-white/75 mt-1">{player2.name}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="w-full max-w-[300px] flex flex-col gap-3"
      >
        <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
          <span className="text-3xl">🤝</span>
          <div className="text-left">
            <div className="text-2xl font-black text-blue-300">{accordsCount}</div>
            <div className="text-xs text-blue-200/75">{accordLabel}</div>
          </div>
        </div>

        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-2xl mt-0.5">{msg.icon}</span>
          <p className="text-white/80 text-sm leading-relaxed text-left">{msg.text}</p>
        </div>

        <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>{t('gooseGame.end.zone1')}</span>
          <span className="text-white/20 text-xs">→</span>
          <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>{t('gooseGame.end.zone2')}</span>
          <span className="text-white/20 text-xs">→</span>
          <span className="text-xs font-semibold" style={{ color: '#c084fc' }}>{t('gooseGame.end.zone3')}</span>
        </div>
      </motion.div>

      <p className="text-white/30 text-xs max-w-[260px] leading-relaxed">
        {t('gooseGame.end.quote')}
      </p>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReplay}
        className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-base"
        style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
      >
        {t('gooseGame.end.replay')}
      </motion.button>
    </motion.div>
  );
}
