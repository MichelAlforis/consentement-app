'use client';
import { motion } from 'framer-motion';
import { Player } from '../types';

interface EndScreenProps {
  player1: Player;
  player2: Player;
  accordsCount: number;
  onReplay: () => void;
}

const END_MESSAGES = [
  { threshold: 0, text: "Première partie ensemble. Le consentement s'explore.", icon: '🌱' },
  { threshold: 2, text: "Quelques accords — une belle soirée de découverte mutuelle.", icon: '🌊' },
  { threshold: 4, text: "Bonne complicité. Vous vous comprenez bien.", icon: '✨' },
  { threshold: Infinity, text: "Excellente complicité — rare et précieux.", icon: '💜' },
];

function getEndMessage(count: number) {
  return END_MESSAGES.findLast(m => count > m.threshold) ?? END_MESSAGES[0];
}

export function EndScreen({ player1, player2, accordsCount, onReplay }: EndScreenProps) {
  const msg = getEndMessage(accordsCount);

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
        <h2 className="text-2xl font-black mb-1">Vous êtes arrivés !</h2>
        <p className="text-white/55 text-sm">Ensemble, jusqu'au bout.</p>
      </motion.div>

      {/* Pions */}
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
        {/* Compteur accords */}
        <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
          <span className="text-3xl">🤝</span>
          <div className="text-left">
            <div className="text-2xl font-black text-blue-300">{accordsCount}</div>
            <div className="text-xs text-blue-200/75">
              {accordsCount === 0 ? "accord — aucun n'est exigé" :
               accordsCount === 1 ? 'accord réussi' : 'accords réussis'}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-2xl mt-0.5">{msg.icon}</span>
          <p className="text-white/80 text-sm leading-relaxed text-left">{msg.text}</p>
        </div>

        {/* Zones parcourues */}
        <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>🌱 Découverte</span>
          <span className="text-white/20 text-xs">→</span>
          <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>🌊 Intimité</span>
          <span className="text-white/20 text-xs">→</span>
          <span className="text-xs font-semibold" style={{ color: '#c084fc' }}>✨ Connexion</span>
        </div>
      </motion.div>

      <p className="text-white/30 text-xs max-w-[260px] leading-relaxed">
        Dire non librement, c'est ce qui rend le oui réel.
      </p>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReplay}
        className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-base"
        style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
      >
        Rejouer
      </motion.button>
    </motion.div>
  );
}
