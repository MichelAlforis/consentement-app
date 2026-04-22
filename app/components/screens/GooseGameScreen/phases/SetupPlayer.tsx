'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAWN_EMOJIS } from '../../../../data/goose-game';

interface SetupPlayerProps {
  playerIndex: 0 | 1;
  otherEmoji: string | undefined;
  onConfirm: (name: string, emoji: string) => void;
}

export function SetupPlayer({ playerIndex, otherEmoji, onConfirm }: SetupPlayerProps) {
  const [name, setName]   = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const available = PAWN_EMOJIS.filter(e => e !== otherEmoji);

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
          <div className="text-4xl mb-2">{playerIndex === 0 ? '1️⃣' : '2️⃣'}</div>
          <h2 className="text-xl font-bold text-white">Joueur {playerIndex + 1}</h2>
          <p className="text-white/60 text-sm mt-1">Prénom et pion</p>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">Prénom</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={playerIndex === 0 ? 'Ex. Léa' : 'Ex. Marc'}
            maxLength={20}
            className="w-full px-4 py-3 rounded-2xl text-gray-900 font-medium text-base outline-none"
            style={{ background: 'rgba(255,255,255,0.95)' }}
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-3">Ton pion</label>
          <div className="flex justify-center gap-3 flex-wrap">
            {available.map(e => (
              <motion.button
                key={e}
                whileTap={{ scale: 0.88 }}
                onClick={() => setEmoji(e)}
                style={{
                  width: 56, height: 56, borderRadius: 16, fontSize: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: emoji === e ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)',
                  border: emoji === e ? '2.5px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {e}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { if (name.trim() && emoji) onConfirm(name.trim(), emoji); }}
          style={{
            background: name.trim() && emoji ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
            borderRadius: 18, padding: '14px', fontWeight: 700, fontSize: 16,
            color: name.trim() && emoji ? '#1e293b' : 'rgba(255,255,255,0.4)',
            marginTop: 'auto', transition: 'all 0.2s ease',
          }}
        >
          {playerIndex === 0 ? 'Suivant →' : '🎲 Commencer'}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
