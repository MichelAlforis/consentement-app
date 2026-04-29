'use client';
import { motion } from 'framer-motion';
import { RotateCcw, Dices, Pause, Star, Handshake, Heart } from 'lucide-react';
import { SavedGooseGame } from '../../../../data/goose-game';
import { clearSavedGame } from '../../../../data/goose-game';
import { useTranslation } from '../../../../i18n';

interface IntroScreenProps {
  savedGame: SavedGooseGame | null;
  onNew: () => void;
  onResume: () => void;
}

export function IntroScreen({ savedGame, onNew, onResume }: IntroScreenProps) {
  const { t } = useTranslation();

  const cells = [
    { Icon: Pause,     bg: '#f87171', label: t('gooseGame.intro.cellPause'),      desc: t('gooseGame.intro.cellPauseDesc') },
    { Icon: Star,      bg: '#fbbf24', label: t('gooseGame.intro.cellChance'),     desc: t('gooseGame.intro.cellChanceDesc') },
    { Icon: Handshake, bg: '#60a5fa', label: t('gooseGame.intro.cellAccord'),     desc: t('gooseGame.intro.cellAccordDesc') },
    { Icon: Heart,     bg: '#c084fc', label: t('gooseGame.intro.cellComplicite'), desc: t('gooseGame.intro.cellCompliciteDesc') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center p-6 gap-6 text-white bg-[linear-gradient(160deg,#0f172a_0%,#1e1040_60%,#2d1b69_100%)]"
    >
      <div className="text-center mt-4">
        <Dices size={60} className="mb-3 mx-auto" />
        <h1 className="text-2xl font-black mb-2">{t('gooseGame.intro.title')}</h1>
        <p className="text-white/65 text-sm leading-relaxed max-w-[280px] mx-auto">
          {t('gooseGame.intro.sub1')}
        </p>
        <p className="text-white/90 text-sm font-semibold mt-2 max-w-[280px] mx-auto">
          {t('gooseGame.intro.goal')}
        </p>
      </div>

      <div className="w-full max-w-[300px] rounded-2xl p-4 flex flex-col gap-2.5 bg-white/[0.07] border border-white/10">
        {cells.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
              style={{ background: item.bg + '28' }}
            >
              <item.Icon size={16} color={item.bg} />
            </span>
            <span className="text-white font-semibold text-sm">{item.label}</span>
            <span className="text-white/45 text-xs">{item.desc}</span>
          </div>
        ))}
      </div>

      {savedGame && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onResume}
          className="w-full max-w-[300px] py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-white/[0.12] text-white border-[1.5px] border-white/25"
        >
          <RotateCcw size={15} />
          {t('gooseGame.intro.resume')}
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { clearSavedGame(); onNew(); }}
        className="w-full max-w-[300px] py-4 rounded-2xl font-bold text-base bg-white/95 text-[#1e293b]"
      >
        {savedGame ? t('gooseGame.intro.new') : t('gooseGame.intro.start')}
      </motion.button>
    </motion.div>
  );
}
