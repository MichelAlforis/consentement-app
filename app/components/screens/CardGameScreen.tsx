'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, RotateCcw, Shuffle, ChevronRight, Sparkles } from 'lucide-react';
import { cardData, DICE_CATEGORIES, CardData } from '../../data';

type CardStep = 'pick' | 'playing';
type DeckId = 1 | 2 | 3 | 4 | 5 | 6 | 'random';

interface CardGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function CardGameScreen({ isAdult }: CardGameScreenProps) {
  const [step, setStep] = useState<CardStep>('pick');
  const [selectedDeck, setSelectedDeck] = useState<DeckId>('random');
  const [isSolo, setIsSolo] = useState(true);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const available = useMemo(() => cardData.filter(c => {
    if (c.ageGate === 'all') return true;
    if (c.ageGate === 'adult') return isAdult;
    return false;
  }), [isAdult]);

  const pickCard = useCallback((exclude?: string): CardData => {
    const pool = available.filter(c =>
      (selectedDeck === 'random' || c.deck === selectedDeck) && c.id !== exclude
    );
    const src = pool.length > 0 ? pool : available;
    return src[Math.floor(Math.random() * src.length)];
  }, [available, selectedDeck]);

  const startPlaying = () => {
    const card = pickCard();
    setCurrentCard(card);
    setCardCount(1);
    setIsRevealed(false);
    setStep('playing');
    const t = setTimeout(() => setIsRevealed(true), 350);
    animTimers.current.push(t);
  };

  const drawNewCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsRevealed(false);
    const t1 = setTimeout(() => {
      const newCard = pickCard(currentCard?.id);
      setCurrentCard(newCard);
      setCardCount(c => c + 1);
      setIsRevealed(true);
      const t2 = setTimeout(() => setIsAnimating(false), 550);
      animTimers.current.push(t2);
    }, 480);
    animTimers.current.push(t1);
  };

  const reset = () => {
    clearTimers();
    setIsAnimating(false);
    setIsRevealed(false);
    setCurrentCard(null);
    setCardCount(0);
    setStep('pick');
  };

  const cat = currentCard ? DICE_CATEGORIES[currentCard.deck] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      <AnimatePresence mode="wait">

        {/* ── PICK ─────────────────────────────────────────── */}
        {step === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col px-5 pt-5 pb-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                  Cartes à tirer
                </h2>
                <p className="text-sm text-gray-400 mt-1">{available.length} cartes · 6 paquets</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <Sparkles size={11} className="text-white" />
                <span className="text-xs font-bold text-white tracking-widest">PREMIUM</span>
              </div>
            </div>

            {/* Mode */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mode de jeu</p>
            <div className="grid grid-cols-2 gap-2.5 mb-8">
              {[
                { solo: true, icon: <User size={22} />, label: 'Solo', sub: 'Réfléchis à ton rythme' },
                { solo: false, icon: <Users size={22} />, label: 'À deux', sub: "L'autre réagit librement" },
              ].map(({ solo, icon, label, sub }) => {
                const active = isSolo === solo;
                return (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsSolo(solo)}
                    className="relative p-4 rounded-2xl border-2 text-left overflow-hidden transition-all"
                    style={active ? {
                      borderColor: '#8b5cf6',
                      background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                    } : { borderColor: '#e5e7eb', background: '#fff' }}
                  >
                    {active && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                    <div className={active ? 'text-violet-500 mb-2' : 'text-gray-300 mb-2'}>{icon}</div>
                    <p className={`font-bold text-sm ${active ? 'text-violet-700' : 'text-gray-600'}`}>{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{sub}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Deck picker */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Choisir un paquet</p>

            {/* Random */}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDeck('random')}
              className="w-full mb-3 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all"
              style={selectedDeck === 'random' ? {
                borderColor: '#8b5cf6',
                background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              } : { borderColor: '#f3f4f6', background: '#fafafa' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #ec4899 70%, #f59e0b 100%)' }}>
                <Shuffle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${selectedDeck === 'random' ? 'text-violet-700' : 'text-gray-700'}`}>
                  Aléatoire
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{available.length} cartes · tous les paquets</p>
              </div>
              {selectedDeck === 'random' && (
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
            </motion.button>

            {/* 6 decks — card-back miniatures */}
            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {([1, 2, 3, 4, 5, 6] as const).map(d => {
                const c = DICE_CATEGORIES[d];
                const isSelected = selectedDeck === d;
                const count = available.filter(card => card.deck === d).length;
                return (
                  <motion.button
                    key={d}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDeck(d)}
                    className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-end pb-3 shadow-sm"
                    style={{
                      aspectRatio: '2 / 3',
                      background: c.gradient,
                      boxShadow: isSelected
                        ? `0 0 0 3px #8b5cf6, 0 8px 24px ${c.border}70`
                        : `0 2px 10px ${c.border}40`,
                    }}
                  >
                    {/* dot pattern */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
                      backgroundSize: '12px 12px',
                    }} />
                    {/* corner pips */}
                    <span className="absolute top-2 left-2.5 text-xs text-white/40 font-black leading-none">{c.emoji}</span>
                    <span className="absolute bottom-10 right-2.5 text-xs text-white/40 font-black leading-none" style={{ transform: 'rotate(180deg)' }}>{c.emoji}</span>

                    <span className="text-2xl relative z-10 mb-0.5">{c.emoji}</span>
                    <p className="text-white font-black text-xs text-center leading-tight relative z-10 px-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
                      {c.name}
                    </p>
                    <p className="text-white/55 text-xs relative z-10">{count}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={startPlaying}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                boxShadow: '0 6px 24px #8b5cf655',
              }}
            >
              Tirer une carte
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* ── PLAYING ──────────────────────────────────────── */}
        {step === 'playing' && currentCard && cat && (
          <motion.div key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col px-5 pt-5 pb-8"
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 mb-7">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm" style={{ background: cat.gradient }}>
                <span className="text-sm leading-none">{cat.emoji}</span>
                <span className="text-white font-bold text-xs tracking-wide" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
                  {cat.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400">#{cardCount}</span>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                {isSolo ? <><User size={12} /><span>Solo</span></> : <><Users size={12} /><span>À deux</span></>}
              </div>
            </div>

            {/* Card — portrait 2:3 */}
            <div className="flex items-center justify-center mb-7" style={{ perspective: '1400px' }}>
              <motion.div
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  transformStyle: 'preserve-3d',
                  width: '100%',
                  maxWidth: 290,
                  aspectRatio: '2 / 3',
                  position: 'relative',
                }}
              >
                {/* ── Dos de la carte ── */}
                <div
                  className="absolute inset-0 rounded-[28px] flex flex-col items-center justify-center gap-3 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: cat.gradient,
                    boxShadow: `0 24px 64px ${cat.border}55, 0 6px 20px rgba(0,0,0,0.15)`,
                  }}
                >
                  {/* dot grid */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 2px, transparent 2px)',
                    backgroundSize: '20px 20px',
                  }} />
                  {/* corner pips */}
                  <span className="absolute top-5 left-5 text-xl text-white/35 font-black">{cat.emoji}</span>
                  <span className="absolute bottom-5 right-5 text-xl text-white/35 font-black" style={{ transform: 'rotate(180deg)' }}>{cat.emoji}</span>

                  <p className="text-white font-black text-2xl tracking-tight relative z-10" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                    {cat.name}
                  </p>
                  <span className="text-7xl relative z-10">{cat.emoji}</span>
                  <p className="text-white/45 text-xs font-semibold tracking-[0.2em] uppercase relative z-10">
                    Cartes à tirer
                  </p>
                </div>

                {/* ── Face de la carte ── */}
                <div
                  className="absolute inset-0 rounded-[28px] flex flex-col overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: '#ffffff',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)',
                    border: '1.5px solid #f0f0f0',
                  }}
                >
                  {/* top band */}
                  <div className="h-2.5 w-full shrink-0" style={{ background: cat.gradient }} />

                  {/* card body */}
                  <div className="flex-1 flex flex-col items-center justify-center px-7 py-5 gap-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0" style={{ background: cat.gradient }}>
                      <span className="text-xl">{cat.emoji}</span>
                    </div>
                    <p className="text-gray-800 font-semibold text-[15px] leading-relaxed text-center">
                      {currentCard.text}
                    </p>
                  </div>

                  {/* bottom band */}
                  <div className="h-1.5 w-full shrink-0" style={{ background: cat.gradient }} />
                </div>
              </motion.div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {isRevealed && (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-xs text-center text-gray-400 mb-6 px-8"
                >
                  {isSolo
                    ? "Prends le temps qu'il faut — pas de pression."
                    : "Lisez ensemble. L'autre réagit librement, sans timer."}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={drawNewCard}
                disabled={isAnimating}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  boxShadow: '0 6px 24px #8b5cf640',
                  opacity: isAnimating ? 0.55 : 1,
                }}
              >
                <Shuffle size={18} />
                Nouvelle carte
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Changer de paquet
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
