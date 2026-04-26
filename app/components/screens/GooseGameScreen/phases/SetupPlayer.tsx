'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAWN_ICONS } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import { useTranslation } from '../../../../i18n';

interface SetupPlayerProps {
  playerIndex: 0 | 1;
  otherPawn: string | undefined;
  onConfirm: (name: string, pawn: string) => void;
}

export function SetupPlayer({ playerIndex, otherPawn, onConfirm }: SetupPlayerProps) {
  const { t } = useTranslation();
  const [name, setName]   = useState('');
  const [pawn, setPawn] = useState<string | null>(null);
  const available = PAWN_ICONS.filter(p => p !== otherPawn);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={playerIndex}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="p-6 flex flex-col gap-6"
        style={{ minHeight: '100%' }}
      >
        <div className="text-center mt-4">
          <div className="mb-2 flex justify-center">
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: 'white',
          }}>
            {playerIndex + 1}
          </div>
        </div>
          <h2 className="text-xl font-bold text-white">{t('gooseGame.setup.title', { n: playerIndex + 1 })}</h2>
          <p className="text-white/60 text-sm mt-1">{t('gooseGame.setup.sub')}</p>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">{t('gooseGame.setup.nameLabel')}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={playerIndex === 0 ? t('gooseGame.setup.placeholder1') : t('gooseGame.setup.placeholder2')}
            maxLength={20}
            className="w-full px-4 py-3 rounded-2xl text-gray-900 font-medium text-base outline-none"
            style={{ background: 'rgba(255,255,255,0.95)' }}
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-3">{t('gooseGame.setup.pawnLabel')}</label>
          <div className="flex justify-center gap-3 flex-wrap">
            {available.map(p => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.88 }}
                onClick={() => setPawn(p)}
                style={{
                  width: 56, height: 56, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: pawn === p ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)',
                  border: pawn === p ? '2.5px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
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
          style={{
            background: name.trim() && pawn ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
            borderRadius: 18, padding: '14px', fontWeight: 700, fontSize: 16,
            color: name.trim() && pawn ? '#1e293b' : 'rgba(255,255,255,0.4)',
            marginTop: 'auto', transition: 'all 0.2s ease',
          }}
        >
          {playerIndex === 0 ? t('gooseGame.setup.next') : t('gooseGame.setup.start')}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
