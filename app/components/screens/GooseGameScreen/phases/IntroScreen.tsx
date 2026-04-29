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
      className="flex flex-col items-center p-6 gap-6 min-h-full"
      style={{ color: 'white', background: 'linear-gradient(160deg, #0f172a 0%, #1e1040 60%, #2d1b69 100%)', minHeight: '100%' }}
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

      <div
        className="w-full max-w-[300px] rounded-2xl p-4 flex flex-col gap-2.5"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {cells.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: item.bg + '28', borderRadius: 8,
            }}>
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
          className="w-full max-w-[300px] py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)' }}
        >
          <RotateCcw size={15} />
          {t('gooseGame.intro.resume')}
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { clearSavedGame(); onNew(); }}
        className="w-full max-w-[300px] py-4 rounded-2xl font-bold text-base"
        style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
      >
        {savedGame ? t('gooseGame.intro.new') : t('gooseGame.intro.start')}
      </motion.button>
    </motion.div>
  );
}
