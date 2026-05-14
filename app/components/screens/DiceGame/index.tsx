'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, User, Users, RotateCcw, ChevronRight, Check, X, Eye, EyeOff, PartyPopper, Handshake } from 'lucide-react';
import { DynamicIcon } from '../../../utils/iconFromName';
import { diePractices, DICE_CATEGORIES } from '../../../data';
import { Button } from '../../ui';
import { useDiceEngine } from '../../../game-engine/dice/useDiceEngine';
import { DiceRenderer } from '../../../game-engine/dice/DiceRenderer';
import type { DiceConfig, DiceItem } from '../../../game-engine/dice/types';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from '../../../i18n';
import { GameEndCinematic } from '../../../game-engine/shared/GameEndCinematic';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useUnlockStore } from '../../../stores';
import { sampleCardByFace } from '../../../lib/sampleCard';
import type { GainedCard } from '../../../lib/computeGainedCards';
import { CardFullscreenOverlay } from '../../ui/CardFullscreenOverlay';

type GameMode = 'pick' | 'rolling' | 'practice' | 'duo-p1' | 'duo-hidden' | 'duo-p2' | 'duo-reveal';
type DuoAnswer = 'yes' | 'no' | null;


const DICE_CONFIG: DiceConfig = {
  faces: ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
    id: n,
    label: DICE_CATEGORIES[n].name,
    iconName: DICE_CATEGORIES[n].iconName,
    gradient: DICE_CATEGORIES[n].gradient,
    border: DICE_CATEGORIES[n].border,
    color: DICE_CATEGORIES[n].border,
  })),
};

import type { Screen } from '../../../types';

interface DiceGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

export function DiceGameScreen({ isPremium, isAdult, onNavigate }: DiceGameScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const explicitMode = useSettingsStore((s) => s.explicitMode);
  const [mode, setMode] = useState<GameMode>('pick');
  const [isSolo, setIsSolo] = useState(true);
  const [p1Answer, setP1Answer] = useState<DuoAnswer>(null);
  const [p2Answer, setP2Answer] = useState<DuoAnswer>(null);
  const [rollCount, setRollCount] = useState(0);

  const available = useMemo(() => diePractices.filter((p) => {
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult') return isAdult;
    if (p.ageGate === 'explicit') return isAdult && explicitMode;
    if (p.ageGate === 'premium') return isAdult && isPremium;
    return false;
  }), [isAdult, isPremium, explicitMode]);

  const diceItems = useMemo<DiceItem[]>(
    () => available.map((p) => ({ id: p.id, faceId: p.face, text: p.text })),
    [available],
  );

  const { ownedCards, incrementSessionCount, drawFromPool } = useUnlockStore();
  const [previewCard, setPreviewCard] = useState<GainedCard | null>(null);
  const [showCardPreview, setShowCardPreview] = useState(false);

  const { currentFace, currentItem, isRolling, roll, onRollComplete } = useDiceEngine(DICE_CONFIG, diceItems);
  const currentCat = currentItem ? DICE_CATEGORIES[currentItem.faceId] : null;
  const currentCatName = currentItem ? t(`diceCategories.${currentItem.faceId}`) : '';
  const bothYes = p1Answer === 'yes' && p2Answer === 'yes';

  const samplePreviewCard = (faceId: number) => sampleCardByFace(faceId, ownedCards);

  const pickRoll = (solo: boolean) => {
    setIsSolo(solo);
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
    setRollCount((c) => c + 1);
    roll();
  };

  const reroll = () => {
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
    setRollCount((c) => c + 1);
    roll();
  };

  const reset = () => {
    setMode('pick');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
  };

  const handleQuit = () => {
    if (rollCount > 0) {
      incrementSessionCount();
      const drawn = drawFromPool();
      if (drawn) { onNavigate('hall-of-cards'); return; }
    }
    onNavigate('jeux');
  };

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <Dices size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('diceGame.title')}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{t('diceGame.available', { count: available.length })}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* PICK */}
        {mode === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex justify-center mb-8 mt-4">
              <DiceRenderer config={DICE_CONFIG} currentFace={null} isRolling={false} renderer="webgl" size={180} />
            </div>

            <p className="text-sm font-semibold mb-4" style={{ color: colors.textSecondary }}>{t('diceGame.howToPlay')}</p>
            <div className="space-y-3 mb-8">
              {([
                [true, <User key="u" size={22} className="text-amber-500" />, t('diceGame.solo.title'), t('diceGame.solo.desc'), 'border-amber-200'],
                [false, <Users key="us" size={22} className="text-orange-500" />, t('diceGame.duo.title'), t('diceGame.duo.desc'), 'border-orange-200'],
              ] as [boolean, React.ReactNode, string, string, string][]).map(([solo, icon, title, desc, border]) => (
                <motion.button key={title}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => pickRoll(solo)}
                  className={`w-full p-5 rounded-3xl text-left border-2 ${border} shadow-sm`}
                  style={{ background: colors.bgCard }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">{icon}</div>
                    <div>
                      <p className="font-bold" style={{ color: colors.textPrimary }}>{title}</p>
                      <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-auto">
              <p className="text-xs text-center mb-3" style={{ color: colors.textMuted }}>{t('diceGame.categories')}</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DICE_CATEGORIES).map(([face, c]) => (
                  <div key={face} className="rounded-2xl p-2.5 text-center" style={{ background: c.gradient }}>
                    <div className="flex justify-center"><DynamicIcon name={c.iconName} size={20} color="rgba(255,255,255,0.9)" /></div>
                    <div className="text-xs font-bold text-white mt-0.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
                      {t(`diceCategories.${face}`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ROLLING + PRACTICE */}
        {(mode === 'rolling' || mode === 'practice') && (
          <motion.div key="dice-view"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex flex-col items-center mb-6 mt-2">
              <DiceRenderer
                config={DICE_CONFIG}
                currentFace={currentFace}
                isRolling={isRolling}
                onRollComplete={() => {
                  onRollComplete();
                  setMode('practice');
                  const card = samplePreviewCard(currentItem?.faceId ?? 0);
                  setPreviewCard(card);
                }}
                renderer="webgl"
                size={240}
              />

              <AnimatePresence>
                {mode === 'rolling' && (
                  <motion.p key="rolling-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-4 text-sm" style={{ color: colors.textMuted }}>{t('diceGame.rolling')}</motion.p>
                )}
                {mode === 'practice' && currentCat && (
                  <motion.div key="category-title"
                    initial={{ opacity: 0, y: -40, rotate: -6, scale: 1.2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
                    className="mt-5 px-5 py-2 rounded-2xl flex items-center gap-2"
                    style={{ background: currentCat.gradient, boxShadow: `0 4px 20px ${currentCat.border}80` }}
                  >
                    <DynamicIcon name={currentCat.iconName} size={24} color="white" />
                    <span className="text-white font-black text-xl tracking-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.2)]">{currentCatName}</span>
                    <span className="text-white/60 text-xs font-semibold ml-1">#{rollCount}</span>
                  </motion.div>
                )}
                {mode === 'practice' && previewCard && (
                  <motion.button
                    key="card-label"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCardPreview(true)}
                    className="mt-3 px-4 py-2.5 rounded-2xl flex items-center gap-3"
                    style={{ background: previewCard.gradient, boxShadow: `0 4px 16px ${previewCard.border}60` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 bg-white/60"
                    />
                    <p className="text-xs font-semibold leading-snug line-clamp-1 flex-1 text-white/90">
                      {previewCard.text}
                    </p>
                    <ChevronRight size={14} className="shrink-0 text-white/70" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {mode === 'practice' && currentItem && currentCat && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="rounded-3xl p-6 mb-5 text-center"
                    style={{ background: `${currentCat.gradient.replace('linear-gradient(135deg, ', '').split(',')[0]}18`, border: `1.5px solid ${currentCat.border}` }}>
                    <p className="text-lg font-bold leading-snug" style={{ color: colors.textPrimary }}>{currentItem.text}</p>
                  </div>

                  {isSolo ? (
                    <div className="space-y-3 mt-auto">
                      <Button onClick={reroll} fullWidth><Dices size={18} />{t('diceGame.newRoll')}</Button>
                      <Button onClick={reset} variant="secondary" fullWidth><RotateCcw size={16} />{t('diceGame.changeMode')}</Button>
                      <Button onClick={handleQuit} variant="ghost" fullWidth>{t('diceGame.quit')}</Button>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <p className="text-sm text-center mb-3" style={{ color: colors.textMuted }}>{t('diceGame.readVote')}</p>
                      <Button onClick={() => setMode('duo-p1')} fullWidth>
                        <Users size={18} />{t('diceGame.startVote')}<ChevronRight size={18} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* DUO P1 */}
        {mode === 'duo-p1' && currentItem && currentCat && (
          <motion.div key="duo-p1"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <p className="font-semibold" style={{ color: colors.textPrimary }}>{t('diceGame.person1')}</p>
            </div>
            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: currentCat.gradient }}>
              <div className="flex justify-center mb-1"><DynamicIcon name={currentCat.iconName} size={32} color="rgba(255,255,255,0.9)" /></div>
              <p className="font-black text-white text-lg mt-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.2)]">{currentCatName}</p>
            </div>
            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: colors.bgSecondary }}>
              <p className="text-sm font-medium leading-snug" style={{ color: colors.textSecondary }}>{currentItem.text}</p>
            </div>
            <p className="text-base font-bold text-center mb-2" style={{ color: colors.textPrimary }}>{t('diceGame.areYouIn')}</p>
            <p className="text-xs text-center mb-6" style={{ color: colors.textMuted }}>{t('diceGame.hideNote')}</p>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP1Answer('no'); setMode('duo-hidden'); }}
                className="p-4 rounded-2xl border-2 border-red-200 bg-red-50 flex flex-col items-center gap-2">
                <X size={24} className="text-red-500" />
                <span className="font-bold text-red-600 text-sm">{t('diceGame.no')}</span>
                <span className="text-xs text-red-400">{t('diceGame.noNote')}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP1Answer('yes'); setMode('duo-hidden'); }}
                className="p-4 rounded-2xl border-2 border-green-200 bg-green-50 flex flex-col items-center gap-2">
                <Check size={24} className="text-green-500" />
                <span className="font-bold text-green-600 text-sm">{t('diceGame.yes')}</span>
                <span className="text-xs text-green-400">{t('diceGame.yesNote')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ÉCRAN RIDEAU */}
        {mode === 'duo-hidden' && (
          <motion.div key="duo-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: colors.bgSecondary }}>
              <EyeOff size={36} style={{ color: colors.textMuted }} />
            </motion.div>
            <h3 className="font-bold text-lg mb-2" style={{ color: colors.textPrimary }}>{t('diceGame.recorded')}</h3>
            <p className="text-sm max-w-xs mb-8" style={{ color: colors.textMuted }}
              dangerouslySetInnerHTML={{ __html: t('diceGame.passPhone') }} />
            <Button onClick={() => setMode('duo-p2')}>
              <Eye size={18} />{t('diceGame.person2Ready')}<ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {/* DUO P2 */}
        {mode === 'duo-p2' && currentItem && currentCat && (
          <motion.div key="duo-p2"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <p className="font-semibold" style={{ color: colors.textPrimary }}>{t('diceGame.person2')}</p>
            </div>
            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: currentCat.gradient }}>
              <div className="flex justify-center mb-1"><DynamicIcon name={currentCat.iconName} size={32} color="rgba(255,255,255,0.9)" /></div>
              <p className="font-black text-white text-lg mt-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.2)]">{currentCatName}</p>
            </div>
            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: colors.bgSecondary }}>
              <p className="text-sm font-medium leading-snug" style={{ color: colors.textSecondary }}>{currentItem.text}</p>
            </div>
            <p className="text-base font-bold text-center mb-2" style={{ color: colors.textPrimary }}>{t('diceGame.areYouIn')}</p>
            <p className="text-xs text-center mb-6" style={{ color: colors.textMuted }}>{t('diceGame.honestNote')}</p>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP2Answer('no'); setMode('duo-reveal'); }}
                className="p-4 rounded-2xl border-2 border-red-200 bg-red-50 flex flex-col items-center gap-2">
                <X size={24} className="text-red-500" />
                <span className="font-bold text-red-600 text-sm">{t('diceGame.no')}</span>
                <span className="text-xs text-red-400">{t('diceGame.noNote')}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP2Answer('yes'); setMode('duo-reveal'); }}
                className="p-4 rounded-2xl border-2 border-green-200 bg-green-50 flex flex-col items-center gap-2">
                <Check size={24} className="text-green-500" />
                <span className="font-bold text-green-600 text-sm">{t('diceGame.yes')}</span>
                <span className="text-xs text-green-400">{t('diceGame.yesNote')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* RÉVÉLATION */}
        {mode === 'duo-reveal' && currentCat && (
          <motion.div key="duo-reveal"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="relative flex-1"
          >
            <GameEndCinematic
              primaryColor={bothYes ? colors.success : colors.textMuted}
              secondaryColor={bothYes ? colors.accentLight : colors.textSecondary}
              intensity={bothYes ? 'high' : 'low'}
            />
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
            <motion.div
              initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="mb-4"
            >
              {bothYes
                ? <PartyPopper size={52} className="text-green-400" />
                : <Handshake size={52} className="text-slate-400" />
              }
            </motion.div>

            <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {bothYes ? t('diceGame.bothYes') : t('diceGame.notThisTime')}
            </h3>
            <p className="text-sm max-w-xs leading-relaxed mb-2" style={{ color: colors.textMuted }}>
              {bothYes ? t('diceGame.bothYesSub', { cat: currentCatName }) : t('diceGame.notThisTimeSub')}
            </p>

            {!bothYes && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mt-2 mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-100 max-w-xs">
                <p className="text-xs text-blue-700">{t('diceGame.anonymity')}</p>
              </motion.div>
            )}

            <div className="space-y-3 w-full max-w-xs mt-6">
              <Button onClick={reroll} fullWidth><Dices size={18} />{t('diceGame.newRoll')}</Button>
              <Button onClick={reset} variant="secondary" fullWidth><RotateCcw size={16} />{t('diceGame.changeMode')}</Button>
              <Button onClick={handleQuit} variant="ghost" fullWidth>{t('diceGame.quit')}</Button>
            </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>

    <AnimatePresence>
      {showCardPreview && previewCard && (
        <CardFullscreenOverlay
          card={previewCard}
          onClose={() => setShowCardPreview(false)}
        />
      )}
    </AnimatePresence>
    </>
  );
}
