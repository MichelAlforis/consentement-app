'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, User, Users, RotateCcw, ChevronRight, Check, X, Eye, EyeOff } from 'lucide-react';
import { diePractices, DICE_CATEGORIES } from '../../data';
import { Button } from '../ui';
import { useDiceEngine } from '../../game-engine/dice/useDiceEngine';
import { DiceRenderer } from '../../game-engine/dice/DiceRenderer';
import type { DiceConfig, DiceItem } from '../../game-engine/dice/types';

type GameMode = 'pick' | 'rolling' | 'practice' | 'duo-p1' | 'duo-hidden' | 'duo-p2' | 'duo-reveal';
type DuoAnswer = 'yes' | 'no' | null;

// DiceFace ids 1–6 correspondent aux numéros de face (FACE_ROTATIONS de Dice3D)
const DICE_CONFIG: DiceConfig = {
  faces: ([1, 2, 3, 4, 5, 6] as const).map(n => ({
    id: n,
    label: DICE_CATEGORIES[n].name,
    emoji: DICE_CATEGORIES[n].emoji,
    gradient: DICE_CATEGORIES[n].gradient,
    border: DICE_CATEGORIES[n].border,
    color: DICE_CATEGORIES[n].border,
  })),
};

interface DiceGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function DiceGameScreen({ isPremium, isAdult }: DiceGameScreenProps) {
  const [mode, setMode] = useState<GameMode>('pick');
  const [isSolo, setIsSolo] = useState(true);
  const [p1Answer, setP1Answer] = useState<DuoAnswer>(null);
  const [p2Answer, setP2Answer] = useState<DuoAnswer>(null);
  const [rollCount, setRollCount] = useState(0);

  const available = useMemo(() => diePractices.filter(p => {
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult') return isAdult;
    if (p.ageGate === 'premium') return isAdult && isPremium;
    return false;
  }), [isAdult, isPremium]);

  const diceItems = useMemo<DiceItem[]>(
    () => available.map(p => ({ id: p.id, faceId: p.face, text: p.text })),
    [available],
  );

  const { currentFace, currentItem, isRolling, roll, onRollComplete } = useDiceEngine(DICE_CONFIG, diceItems);

  const currentCat = currentItem ? DICE_CATEGORIES[currentItem.faceId] : null;

  const pickRoll = (solo: boolean) => {
    setIsSolo(solo);
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setRollCount(c => c + 1);
    roll();
  };

  const reroll = () => {
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setRollCount(c => c + 1);
    roll();
  };

  const handleRollComplete = () => {
    onRollComplete();
    setMode('practice');
  };

  const reset = () => {
    setMode('pick');
    setP1Answer(null);
    setP2Answer(null);
  };

  const bothYes = p1Answer === 'yes' && p2Answer === 'yes';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10 min-h-[75vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <Dices size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Le Dé du Consentement</h2>
          <p className="text-sm text-gray-500">{available.length} activités disponibles</p>
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
              <DiceRenderer config={DICE_CONFIG} currentFace={null} isRolling={false} renderer="webgl" />
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-4">Comment tu veux jouer ?</p>
            <div className="space-y-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => pickRoll(true)}
                className="w-full p-5 rounded-3xl text-left bg-white border-2 border-amber-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <User size={22} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Solo</p>
                    <p className="text-xs text-gray-500 mt-0.5">Explorer, réfléchir, se poser des questions — sans pression</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => pickRoll(false)}
                className="w-full p-5 rounded-3xl text-left bg-white border-2 border-orange-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Users size={22} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">À deux</p>
                    <p className="text-xs text-gray-500 mt-0.5">Chacun vote séparément — le résultat s'affiche seulement si vous êtes d'accord tous les deux</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Catégories en vitrine */}
            <div className="mt-auto">
              <p className="text-xs text-gray-400 text-center mb-3">6 catégories au hasard</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DICE_CATEGORIES).map(([face, c]) => (
                  <div key={face} className="rounded-2xl p-2.5 text-center" style={{ background: c.gradient }}>
                    <div className="text-lg">{c.emoji}</div>
                    <div className="text-xs font-bold text-white mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{c.name}</div>
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
            {/* Zone dé + titre catégorie */}
            <div className="flex flex-col items-center mb-6 mt-2">
              <DiceRenderer
                config={DICE_CONFIG}
                currentFace={currentFace}
                isRolling={isRolling}
                onRollComplete={handleRollComplete}
                renderer="webgl"
              />

              <AnimatePresence>
                {mode === 'rolling' && (
                  <motion.p
                    key="rolling-label"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-4 text-sm text-gray-400"
                  >
                    Le destin décide…
                  </motion.p>
                )}
                {mode === 'practice' && currentCat && (
                  <motion.div
                    key="category-title"
                    initial={{ opacity: 0, y: -40, rotate: -6, scale: 1.2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
                    className="mt-5 px-5 py-2 rounded-2xl flex items-center gap-2"
                    style={{ background: currentCat.gradient, boxShadow: `0 4px 20px ${currentCat.border}80` }}
                  >
                    <span className="text-2xl">{currentCat.emoji}</span>
                    <span className="text-white font-black text-xl tracking-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                      {currentCat.name}
                    </span>
                    <span className="text-white/60 text-xs font-semibold ml-1">#{rollCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Carte activité */}
            <AnimatePresence>
              {mode === 'practice' && currentItem && currentCat && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <div
                    className="rounded-3xl p-6 mb-5 text-center"
                    style={{
                      background: `${currentCat.gradient.replace('linear-gradient(135deg, ', '').split(',')[0]}18`,
                      border: `1.5px solid ${currentCat.border}`,
                    }}
                  >
                    <p className="text-lg font-bold text-gray-800 leading-snug">{currentItem.text}</p>
                  </div>

                  {isSolo ? (
                    <div className="space-y-3 mt-auto">
                      <Button onClick={reroll} fullWidth>
                        <Dices size={18} />
                        Nouveau tirage
                      </Button>
                      <Button onClick={reset} variant="secondary" fullWidth>
                        <RotateCcw size={16} />
                        Changer de mode
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <p className="text-sm text-center text-gray-500 mb-3">Vous avez lu ? Passez au vote.</p>
                      <Button onClick={() => setMode('duo-p1')} fullWidth>
                        <Users size={18} />
                        Commencer le vote
                        <ChevronRight size={18} />
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
              <p className="font-semibold text-gray-800">Personne 1 — réponds seul·e</p>
            </div>

            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: currentCat.gradient }}>
              <span className="text-3xl">{currentCat.emoji}</span>
              <p className="font-black text-white text-lg mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>{currentCat.name}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 mb-4 text-center">
              <p className="text-sm text-gray-700 font-medium leading-snug">{currentItem.text}</p>
            </div>

            <p className="text-base font-bold text-gray-800 text-center mb-2">Tu es partant·e ?</p>
            <p className="text-xs text-gray-400 text-center mb-6">
              L'autre ne verra pas ta réponse avant d'avoir voté à son tour.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP1Answer('no'); setMode('duo-hidden'); }}
                className="p-4 rounded-2xl border-2 border-red-200 bg-red-50 flex flex-col items-center gap-2"
              >
                <X size={24} className="text-red-500" />
                <span className="font-bold text-red-600 text-sm">Non</span>
                <span className="text-xs text-red-400">Pas cette fois</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP1Answer('yes'); setMode('duo-hidden'); }}
                className="p-4 rounded-2xl border-2 border-green-200 bg-green-50 flex flex-col items-center gap-2"
              >
                <Check size={24} className="text-green-500" />
                <span className="font-bold text-green-600 text-sm">Oui</span>
                <span className="text-xs text-green-400">Je suis ok</span>
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
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6"
            >
              <EyeOff size={36} className="text-gray-400" />
            </motion.div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Réponse enregistrée</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-8">
              Passe le téléphone à <strong>Personne 2</strong> sans lui montrer l'écran.
            </p>
            <Button onClick={() => setMode('duo-p2')}>
              <Eye size={18} />
              Personne 2 est prête
              <ChevronRight size={18} />
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
              <p className="font-semibold text-gray-800">Personne 2 — réponds seul·e</p>
            </div>

            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: currentCat.gradient }}>
              <span className="text-3xl">{currentCat.emoji}</span>
              <p className="font-black text-white text-lg mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>{currentCat.name}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 mb-4 text-center">
              <p className="text-sm text-gray-700 font-medium leading-snug">{currentItem.text}</p>
            </div>

            <p className="text-base font-bold text-gray-800 text-center mb-2">Tu es partant·e ?</p>
            <p className="text-xs text-gray-400 text-center mb-6">
              Réponds honnêtement. Le résultat commun s'affiche après.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP2Answer('no'); setMode('duo-reveal'); }}
                className="p-4 rounded-2xl border-2 border-red-200 bg-red-50 flex flex-col items-center gap-2"
              >
                <X size={24} className="text-red-500" />
                <span className="font-bold text-red-600 text-sm">Non</span>
                <span className="text-xs text-red-400">Pas cette fois</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setP2Answer('yes'); setMode('duo-reveal'); }}
                className="p-4 rounded-2xl border-2 border-green-200 bg-green-50 flex flex-col items-center gap-2"
              >
                <Check size={24} className="text-green-500" />
                <span className="font-bold text-green-600 text-sm">Oui</span>
                <span className="text-xs text-green-400">Je suis ok</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* RÉVÉLATION */}
        {mode === 'duo-reveal' && currentCat && (
          <motion.div key="duo-reveal"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="text-6xl mb-4"
            >
              {bothYes ? '🎉' : '🤝'}
            </motion.div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {bothYes ? 'Go ! Vous êtes tous les deux partant·e·s !' : 'Pas cette fois'}
            </h3>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-2">
              {bothYes
                ? `Super — lancez-vous pour « ${currentCat.name} » !`
                : "L'un·e de vous n'est pas à l'aise avec ça — et c'est parfaitement normal."}
            </p>

            {!bothYes && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mt-2 mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-100 max-w-xs"
              >
                <p className="text-xs text-blue-700">
                  On ne sait pas qui a dit non — et c'est voulu. Personne n'a à se justifier.
                </p>
              </motion.div>
            )}

            <div className="space-y-3 w-full max-w-xs mt-6">
              <Button onClick={reroll} fullWidth>
                <Dices size={18} />
                Nouveau tirage
              </Button>
              <Button onClick={reset} variant="secondary" fullWidth>
                <RotateCcw size={16} />
                Changer de mode
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
