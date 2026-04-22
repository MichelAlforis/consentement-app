'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, User, Users, RotateCcw, ChevronRight, Check, X, Eye, EyeOff } from 'lucide-react';
import { diePractices, DiePractice } from '../../data';
import { Button, Dice3D } from '../ui';

type GameMode = 'pick' | 'rolling' | 'practice' | 'duo-p1' | 'duo-hidden' | 'duo-p2' | 'duo-reveal';
type DuoAnswer = 'yes' | 'no' | null;

interface DiceGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function DiceGameScreen({ isPremium, isAdult }: DiceGameScreenProps) {
  const [mode, setMode] = useState<GameMode>('pick');
  const [isSolo, setIsSolo] = useState(true);
  const [targetFace, setTargetFace] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [practice, setPractice] = useState<DiePractice | null>(null);
  const [p1Answer, setP1Answer] = useState<DuoAnswer>(null);
  const [p2Answer, setP2Answer] = useState<DuoAnswer>(null);
  const [rollCount, setRollCount] = useState(0);

  const available = useMemo(() => diePractices.filter(p => {
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult') return isAdult;
    if (p.ageGate === 'premium') return isAdult && isPremium;
    return false;
  }), [isAdult, isPremium]);

  const roll = (solo: boolean) => {
    setIsSolo(solo);
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    const picked = available[Math.floor(Math.random() * available.length)];
    const face = Math.floor(Math.random() * 6) + 1;
    setPractice(picked);
    setTargetFace(face);
    setRollCount(c => c + 1);
    setIsRolling(true);
  };

  const reroll = () => {
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    const picked = available[Math.floor(Math.random() * available.length)];
    const face = Math.floor(Math.random() * 6) + 1;
    setPractice(picked);
    setTargetFace(face);
    setRollCount(c => c + 1);
    setIsRolling(true);
  };

  const handleRollComplete = () => {
    setIsRolling(false);
    setMode('practice');
  };

  const reset = () => {
    setMode('pick');
    setPractice(null);
    setP1Answer(null);
    setP2Answer(null);
  };

  const bothYes = p1Answer === 'yes' && p2Answer === 'yes';

  // Le dé 3D est rendu en permanence (garde son état/rotation)
  // On le cache/montre selon le mode
  const showDice = ['rolling', 'practice'].includes(mode);

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
          <p className="text-sm text-gray-500">{available.length} pratiques disponibles</p>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* PICK — Choix solo / duo */}
        {mode === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="flex-1 flex flex-col"
          >
            {/* Dé 3D statique en vitrine */}
            <div className="flex justify-center mb-8 mt-4">
              <Dice3D targetFace={1} isRolling={false} />
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-4">Comment tu veux jouer ?</p>
            <div className="space-y-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => roll(true)}
                className="w-full p-5 rounded-3xl text-left bg-white border-2 border-amber-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <User size={22} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Solo</p>
                    <p className="text-xs text-gray-500 mt-0.5">Explorer et apprendre ce que le consentement implique pour chaque pratique</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => roll(false)}
                className="w-full p-5 rounded-3xl text-left bg-white border-2 border-orange-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Users size={22} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">À deux</p>
                    <p className="text-xs text-gray-500 mt-0.5">Chacun répond séparément — le résultat s'affiche seulement si vous êtes d'accord tous les deux</p>
                  </div>
                </div>
              </motion.button>
            </div>

            <div className="mt-auto p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Le dé choisit la pratique au hasard parmi les {available.length} disponibles.
              </p>
            </div>
          </motion.div>
        )}

        {/* ROLLING + PRACTICE — Dé 3D animé puis résultat */}
        {(mode === 'rolling' || mode === 'practice') && practice && (
          <motion.div key="dice-view"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Zone dé */}
            <div className="flex flex-col items-center mb-6 mt-2">
              <Dice3D
                targetFace={targetFace}
                isRolling={isRolling}
                onRollComplete={handleRollComplete}
              />
              <AnimatePresence>
                {mode === 'rolling' && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-4 text-sm text-gray-400"
                  >
                    Le destin décide…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Fiche pratique — apparaît après le lancer */}
            <AnimatePresence>
              {mode === 'practice' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{practice.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Tirage #{rollCount}</p>
                      <p className="font-bold text-lg text-gray-800">{practice.name}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-4">
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-widest mb-2">C'est quoi ?</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{practice.description}</p>
                    </div>
                    <div className="p-4 bg-amber-50 border-t border-amber-100">
                      <h3 className="font-semibold text-amber-600 text-xs uppercase tracking-widest mb-2">Le consentement ici</h3>
                      <p className="text-sm text-amber-800 leading-relaxed">{practice.consentNote}</p>
                    </div>
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
                      <p className="text-sm text-center text-gray-500 mb-3">Vous avez lu la fiche ? Passez au vote.</p>
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

        {/* DUO P1 — vote caché */}
        {mode === 'duo-p1' && practice && (
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

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-6 text-center">
              <p className="text-base font-bold text-amber-800 mb-1">{practice.emoji} {practice.name}</p>
              <p className="text-sm text-amber-700">Es-tu consentant·e pour cette pratique ?</p>
            </div>

            <p className="text-xs text-gray-400 text-center mb-4">
              L'autre personne ne verra pas ta réponse avant d'avoir voté à son tour.
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
              Passe maintenant le téléphone à <strong>Personne 2</strong> sans lui montrer l'écran.
            </p>
            <Button onClick={() => setMode('duo-p2')}>
              <Eye size={18} />
              Personne 2 est prête
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {/* DUO P2 — vote caché */}
        {mode === 'duo-p2' && practice && (
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

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 mb-6 text-center">
              <p className="text-base font-bold text-orange-800 mb-1">{practice.emoji} {practice.name}</p>
              <p className="text-sm text-orange-700">Es-tu consentant·e pour cette pratique ?</p>
            </div>

            <p className="text-xs text-gray-400 text-center mb-4">
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
        {mode === 'duo-reveal' && practice && (
          <motion.div key="duo-reveal"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="text-6xl mb-4"
            >
              {bothYes ? '🎉' : '🤝'}
            </motion.div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {bothYes ? 'Vous êtes d\'accord !' : 'Pas cette fois'}
            </h3>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-2">
              {bothYes
                ? `Vous êtes tous les deux ok pour « ${practice.name} ». Prenez le temps d'en parler avant.`
                : 'L\'un·e de vous n\'est pas à l\'aise avec cette pratique — et c\'est parfaitement normal.'}
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
