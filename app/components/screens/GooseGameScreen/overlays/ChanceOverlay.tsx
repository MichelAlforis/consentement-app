'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Overlay } from '../components/Overlay';
import { useTranslation } from '../../../../i18n';

interface ChanceOverlayProps {
  activeName: string;
  onAdvance: () => void;
}

export function ChanceOverlay({ activeName, onAdvance }: ChanceOverlayProps) {
  const { t } = useTranslation();
  return (
    <Overlay key="chance" color="linear-gradient(160deg, #b45309, #d97706)">
      <div className="text-center py-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320 }}
          className="flex justify-center mb-3"
        >
          <Star size={56} fill="white" color="white" />
        </motion.div>
        <h3 className="text-white text-2xl font-black mb-2">{t('gooseGame.chance.title')}</h3>
        <p className="text-white/80 text-base mb-7">
          {t('gooseGame.chance.desc', { name: activeName })}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAdvance}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#78350f' }}
        >
          {t('gooseGame.chance.advance')}
        </motion.button>
      </div>
    </Overlay>
  );
}
