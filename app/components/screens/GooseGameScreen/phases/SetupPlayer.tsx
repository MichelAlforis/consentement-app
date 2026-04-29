'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAWN_ICONS } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import type { IconName } from '../../../../utils/iconFromName';
import { useTranslation } from '../../../../i18n';

interface SetupPlayerProps {
  playerIndex: 0 | 1;
  otherPawn: IconName | undefined;
  onConfirm: (name: string, pawn: IconName) => void;
}

export function SetupPlayer({ playerIndex, otherPawn, onConfirm }: SetupPlayerProps) {
  const { t } = useTranslation();
  const [name, setName]   = useState('');
  const [pawn, setPawn] = useState<IconName | null>(null);
  const available = PAWN_ICONS.filter(p => p !== otherPawn);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={playerIndex}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="flex-1 p-6 flex flex-col gap-6"
      >
        <div className="text-center mt-4">
          <div className="mb-2 flex justify-center">
            <div className="w-11 h-11 rounded-full bg-white/[0.15] border-2 border-white/40 flex items-center justify-center text-xl font-extrabold text-white">
              {playerIndex + 1}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{t('gooseGame.setup.title', { n: playerIndex + 1 })}</h2>
          <p className="text-white/60 text-sm mt-1">{t('gooseGame.setup.sub')}</p>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">{t('gooseGame.setup.nameLabel')}</label>
          <div className="relative">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={playerIndex === 0 ? t('gooseGame.setup.placeholder1') : t('gooseGame.setup.placeholder2')}
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl text-gray-900 font-medium text-base outline-none bg-white/95"
            />
            {name.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                {name.length}/20
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-3">{t('gooseGame.setup.pawnLabel')}</label>
          <div className="flex justify-center gap-3 flex-wrap">
            {available.map(p => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.88 }}
                onClick={() => setPawn(p)}
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 ease-in"
                style={{
                  background: pawn === p ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)',
                  border: pawn === p ? '2.5px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                }}
              >
                <DynamicIcon name={p} size={26} color="white" />
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { if (name.trim() && pawn) onConfirm(name.trim(), pawn); }}
          className="rounded-[18px] p-[14px] font-bold text-base mt-auto transition-all duration-200 ease-in w-full"
          style={{
            background: name.trim() && pawn ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
            color: name.trim() && pawn ? '#1e293b' : 'rgba(255,255,255,0.4)',
          }}
        >
          {playerIndex === 0 ? t('gooseGame.setup.next') : t('gooseGame.setup.start')}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
