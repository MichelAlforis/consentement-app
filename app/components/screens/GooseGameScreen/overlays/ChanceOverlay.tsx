'use client';
import { motion } from 'framer-motion';
import { Overlay } from '../components/Overlay';

interface ChanceOverlayProps {
  activeName: string;
  onAdvance: () => void;
}

export function ChanceOverlay({ activeName, onAdvance }: ChanceOverlayProps) {
  return (
    <Overlay key="chance" color="linear-gradient(160deg, #b45309, #d97706)">
      <div className="text-center py-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320 }}
          className="text-6xl mb-3"
        >
          ⭐
        </motion.div>
        <h3 className="text-white text-2xl font-black mb-2">Case Chance !</h3>
        <p className="text-white/80 text-base mb-7">
          {activeName} avance de <strong>2 cases</strong> supplémentaires !
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAdvance}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#78350f' }}
        >
          Avancer ✨
        </motion.button>
      </div>
    </Overlay>
  );
}
