'use client';
import { motion } from 'framer-motion';
import { Trophy, Handshake, Leaf, Waves, Sparkles, Heart } from 'lucide-react';
import { Player } from '../types';
import { DynamicIcon } from '../../../../utils/iconFromName';
import { useTranslation } from '../../../../i18n';
import { GameEndCinematic } from '../../../../game-engine/shared/GameEndCinematic';

interface EndScreenProps {
  player1: Player;
  player2: Player;
  accordsCount: number;
  onReplay: () => void;
}

export function EndScreen({ player1, player2, accordsCount, onReplay }: EndScreenProps) {
  const { t } = useTranslation();
  const cinematicIntensity = accordsCount >= 4 ? 'high' : accordsCount >= 2 ? 'medium' : 'low' as const;

  const endMessages = [
    { threshold: 0,        text: t('gooseGame.end.msg0'), icon: <Leaf size={20} /> },
    { threshold: 2,        text: t('gooseGame.end.msg1'), icon: <Waves size={20} /> },
    { threshold: 4,        text: t('gooseGame.end.msg2'), icon: <Sparkles size={20} /> },
    { threshold: Infinity, text: t('gooseGame.end.msg3'), icon: <Heart size={20} /> },
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
      className="flex-1 relative text-white bg-[linear-gradient(180deg,#1a0838_0%,#060512_100%)]"
    >
      <GameEndCinematic primaryColor="#c084fc" secondaryColor="#60a5fa" intensity={cinematicIntensity} />
      <div className="relative z-10 p-6 flex flex-col items-center gap-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="pt-4"
        >
          <div className="mb-3 text-white/90"><Trophy size={44} /></div>
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
            <div className="flex justify-center"><DynamicIcon name={player1.pawn} size={40} color="white" /></div>
            <div className="text-sm font-bold text-white/75 mt-1">{player1.name}</div>
          </div>
          <div className="text-white/25 text-xl">×</div>
          <div className="text-center">
            <div className="flex justify-center"><DynamicIcon name={player2.pawn} size={40} color="white" /></div>
            <div className="text-sm font-bold text-white/75 mt-1">{player2.name}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="w-full max-w-[300px] flex flex-col gap-3"
        >
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4 bg-blue-400/15 border border-blue-400/30">
            <Handshake size={28} className="text-blue-300 shrink-0" />
            <div className="text-left">
              <div className="text-2xl font-black text-blue-300">{accordsCount}</div>
              <div className="text-xs text-blue-200/75">{accordLabel}</div>
            </div>
          </div>

          <div className="rounded-2xl px-5 py-4 flex items-start gap-3 bg-white/[0.07] border border-white/10">
            <span className="mt-0.5 text-white/70 shrink-0">{msg.icon}</span>
            <p className="text-white/80 text-sm leading-relaxed text-left">{msg.text}</p>
          </div>

          <div className="rounded-2xl px-4 py-3 flex items-center justify-between bg-white/[0.04]">
            <span className="text-xs font-semibold text-green-400">{t('gooseGame.end.zone1')}</span>
            <span className="text-white/20 text-xs">→</span>
            <span className="text-xs font-semibold text-blue-400">{t('gooseGame.end.zone2')}</span>
            <span className="text-white/20 text-xs">→</span>
            <span className="text-xs font-semibold text-purple-400">{t('gooseGame.end.zone3')}</span>
          </div>
        </motion.div>

        <p className="text-white/30 text-xs max-w-[260px] leading-relaxed">
          {t('gooseGame.end.quote')}
        </p>

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReplay}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-base bg-white/95 text-[#1e293b]"
        >
          {t('gooseGame.end.replay')}
        </motion.button>
      </div>
    </motion.div>
  );
}
