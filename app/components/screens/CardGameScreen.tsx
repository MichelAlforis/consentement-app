'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, RotateCcw, Shuffle, ChevronRight, Sparkles, Heart, Trophy } from 'lucide-react';
import { cardData, DICE_CATEGORIES, CardData } from '../../data';

type CardStep = 'pick' | 'playing' | 'end';
type DeckId = 1 | 2 | 3 | 4 | 5 | 6 | 'random';
type SessionMode = 'seance' | 'libre';

// Depth 1 = icebreaker, 2 = medium, 3 = emotional/intimate
const DECK_DEPTH: Record<number, 1 | 2 | 3> = { 1: 1, 4: 1, 2: 2, 3: 2, 5: 3, 6: 3 };

const FAV_KEY = 'consentement_card_favorites';
function loadFavs(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'); } catch { return []; }
}
function saveFavs(ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

interface CardGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function CardGameScreen({ isAdult }: CardGameScreenProps) {
  const [step, setStep] = useState<CardStep>('pick');
  const [selectedDeck, setSelectedDeck] = useState<DeckId>('random');
  const [isSolo, setIsSolo] = useState(true);
  const [sessionMode, setSessionMode] = useState<SessionMode>('seance');
  const [seanceSize, setSeanceSize] = useState<5 | 10>(5);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [drawnIds, setDrawnIds] = useState<string[]>([]);
  const [sessionDecks, setSessionDecks] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<string[]>(loadFavs);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { animTimers.current.forEach(clearTimeout); animTimers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const available = useMemo(() => cardData.filter(c => {
    if (c.ageGate === 'all') return true;
    return c.ageGate === 'adult' && isAdult;
  }), [isAdult]);

  // Picks next card with full session anti-repeat + depth progression
  const pickCard = useCallback((count: number, drawn: string[], mode: SessionMode): CardData => {
    const excluded = new Set(drawn);
    let pool = available.filter(c =>
      (selectedDeck === 'random' || c.deck === selectedDeck) && !excluded.has(c.id)
    );

    // Depth progression: random séance starts light, ends deep
    if (mode === 'seance' && selectedDeck === 'random' && pool.length > 0) {
      const progress = count / Math.max(seanceSize - 1, 1);
      const byDepth = progress < 0.35
        ? pool.filter(c => DECK_DEPTH[c.deck] <= 2)   // light early
        : progress > 0.65
        ? pool.filter(c => DECK_DEPTH[c.deck] >= 2)   // deep late
        : pool;
      if (byDepth.length > 0) pool = byDepth;
    }

    // Fallback: reset exclusion if pool exhausted
    if (pool.length === 0) {
      pool = available.filter(c => selectedDeck === 'random' || c.deck === selectedDeck);
    }
    if (pool.length === 0) pool = available;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [available, selectedDeck, seanceSize]);

  const startPlaying = () => {
    const card = pickCard(0, [], sessionMode);
    setCurrentCard(card);
    setCardCount(1);
    setDrawnIds([card.id]);
    setSessionDecks([card.deck]);
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
      setDrawnIds(prev => {
        const newDrawn = prev;
        const newCard = pickCard(cardCount, newDrawn, sessionMode);
        setCurrentCard(newCard);
        setDrawnIds([...newDrawn, newCard.id]);
        setCardCount(c => c + 1);
        setSessionDecks(d => d.includes(newCard.deck) ? d : [...d, newCard.deck]);
        setIsRevealed(true);
        return newDrawn;
      });
      const t2 = setTimeout(() => setIsAnimating(false), 550);
      animTimers.current.push(t2);
    }, 480);
    animTimers.current.push(t1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveFavs(next);
      return next;
    });
  };

  const reset = () => {
    clearTimers();
    setIsAnimating(false);
    setIsRevealed(false);
    setCurrentCard(null);
    setCardCount(0);
    setDrawnIds([]);
    setSessionDecks([]);
    setStep('pick');
  };

  const cat = currentCard ? DICE_CATEGORIES[currentCard.deck] : null;
  const isFavCard = currentCard ? favorites.includes(currentCard.id) : false;
  const isSeanceDone = sessionMode === 'seance' && cardCount >= seanceSize;

  const endInsight = sessionDecks.some(d => [5, 6].includes(d))
    ? "Vous avez osé aller dans les sujets profonds. C'est ça, la vraie conversation."
    : sessionDecks.some(d => [2, 3].includes(d))
    ? "Bonne séance. Les paquets Vérité et Douceur vous attendent pour aller encore plus loin."
    : "Belle entrée en matière — essayez le mode aléatoire pour explorer toutes les nuances.";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
      <AnimatePresence mode="wait">

        {/* ── PICK ─────────────────────────────────────────── */}
        {step === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="flex flex-col px-5 pt-5 pb-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Cartes à tirer</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {available.length} cartes
                  {favorites.length > 0 && (
                    <span className="ml-2 text-rose-400">· ❤️ {favorites.length} favori{favorites.length > 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <Sparkles size={11} className="text-white" />
                <span className="text-xs font-bold text-white tracking-widest">PREMIUM</span>
              </div>
            </div>

            {/* Réglages compacts */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Réglages</p>
            <div className="bg-gray-50 rounded-2xl p-3 mb-6 space-y-2.5">

              {/* Solo / Duo */}
              <div className="grid grid-cols-2 gap-2">
                {([
                  [true, <User size={14} key="u" />, 'Solo'],
                  [false, <Users size={14} key="us" />, 'À deux'],
                ] as [boolean, React.ReactNode, string][]).map(([solo, icon, label]) => {
                  const active = isSolo === solo;
                  return (
                    <motion.button key={label} whileTap={{ scale: 0.96 }}
                      onClick={() => setIsSolo(solo)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all"
                      style={active
                        ? { borderColor: '#8b5cf6', background: '#f5f3ff', color: '#7c3aed' }
                        : { borderColor: 'transparent', background: '#fff', color: '#9ca3af' }}
                    >
                      {icon}{label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Séance / Libre */}
              <div className="flex bg-white rounded-xl border border-gray-200 p-0.5 gap-0.5">
                {([['seance', '✦ Séance'], ['libre', '∞ Libre']] as const).map(([mode, label]) => (
                  <button key={mode} onClick={() => setSessionMode(mode)}
                    className="flex-1 py-2 rounded-[10px] text-xs font-bold transition-all"
                    style={sessionMode === mode
                      ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }
                      : { color: '#9ca3af' }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Séance size */}
              {sessionMode === 'seance' && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-2">
                  {([5, 10] as const).map(n => (
                    <button key={n} onClick={() => setSeanceSize(n)}
                      className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                      style={seanceSize === n
                        ? { borderColor: '#8b5cf6', background: '#f5f3ff', color: '#7c3aed' }
                        : { borderColor: '#e5e7eb', color: '#9ca3af' }}
                    >
                      {n} cartes
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Deck picker */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Paquet</p>

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDeck('random')}
              className="w-full mb-3 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all"
              style={selectedDeck === 'random'
                ? { borderColor: '#8b5cf6', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                : { borderColor: '#f3f4f6', background: '#fafafa' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #ec4899 70%, #f59e0b 100%)' }}>
                <Shuffle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${selectedDeck === 'random' ? 'text-violet-700' : 'text-gray-700'}`}>Aléatoire</p>
                <p className="text-xs text-gray-400 mt-0.5">{available.length} cartes · tous les paquets</p>
              </div>
              {selectedDeck === 'random' && (
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
            </motion.button>

            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {([1, 2, 3, 4, 5, 6] as const).map(d => {
                const c = DICE_CATEGORIES[d];
                const isSelected = selectedDeck === d;
                const count = available.filter(card => card.deck === d).length;
                return (
                  <motion.button key={d}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
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
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
                      backgroundSize: '12px 12px',
                    }} />
                    <span className="absolute top-2 left-2.5 text-xs text-white/40 font-black leading-none">{c.emoji}</span>
                    <span className="absolute bottom-10 right-2.5 text-xs text-white/40 font-black leading-none" style={{ transform: 'rotate(180deg)' }}>{c.emoji}</span>
                    <span className="text-2xl relative z-10 mb-0.5">{c.emoji}</span>
                    <p className="text-white font-black text-xs text-center leading-tight relative z-10 px-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{c.name}</p>
                    <p className="text-white/55 text-xs relative z-10">{count}</p>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={startPlaying}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 6px 24px #8b5cf655' }}
            >
              {sessionMode === 'seance' ? `Commencer · ${seanceSize} cartes` : 'Tirer une carte'}
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* ── PLAYING ──────────────────────────────────────── */}
        {step === 'playing' && currentCard && cat && (
          <motion.div key="playing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col px-5 pt-5 pb-8"
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm" style={{ background: cat.gradient }}>
                <span className="text-sm leading-none">{cat.emoji}</span>
                <span className="text-white font-bold text-xs tracking-wide" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>{cat.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {sessionMode === 'seance' ? `${cardCount} / ${seanceSize}` : `#${cardCount}`}
              </span>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                {isSolo ? <><User size={12} /><span>Solo</span></> : <><Users size={12} /><span>À deux</span></>}
              </div>
            </div>

            {/* Progress dots — séance only */}
            {sessionMode === 'seance' && (
              <div className="flex items-center gap-1.5 justify-center mb-5">
                {Array.from({ length: seanceSize }).map((_, i) => (
                  <motion.div key={i}
                    animate={{ scale: i === cardCount - 1 ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      width: i < cardCount ? 8 : 6,
                      height: i < cardCount ? 8 : 6,
                      borderRadius: 999,
                      background: i < cardCount ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb',
                      transition: 'width 0.3s, height 0.3s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Card 3D flip */}
            <div className="flex items-center justify-center mb-4" style={{ perspective: '1400px' }}>
              <motion.div
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformStyle: 'preserve-3d', width: '100%', maxWidth: 290, aspectRatio: '2 / 3', position: 'relative' }}
              >
                {/* Dos */}
                <div className="absolute inset-0 rounded-[28px] flex flex-col items-center justify-center gap-3 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    background: cat.gradient,
                    boxShadow: `0 24px 64px ${cat.border}55, 0 6px 20px rgba(0,0,0,0.15)`,
                  }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 2px, transparent 2px)',
                    backgroundSize: '20px 20px',
                  }} />
                  <span className="absolute top-5 left-5 text-xl text-white/35 font-black">{cat.emoji}</span>
                  <span className="absolute bottom-5 right-5 text-xl text-white/35 font-black" style={{ transform: 'rotate(180deg)' }}>{cat.emoji}</span>
                  <p className="text-white font-black text-2xl tracking-tight relative z-10" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>{cat.name}</p>
                  <span className="text-7xl relative z-10">{cat.emoji}</span>
                  <p className="text-white/45 text-xs font-semibold tracking-[0.2em] uppercase relative z-10">Cartes à tirer</p>
                </div>

                {/* Face */}
                <div className="absolute inset-0 rounded-[28px] flex flex-col overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: '#ffffff',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)',
                    border: '1.5px solid #f0f0f0',
                  }}>
                  <div className="h-2.5 w-full shrink-0" style={{ background: cat.gradient }} />
                  <div className="flex-1 flex flex-col items-center justify-center px-7 py-5 gap-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0" style={{ background: cat.gradient }}>
                      <span className="text-xl">{cat.emoji}</span>
                    </div>
                    <p className="text-gray-800 font-semibold text-[15px] leading-relaxed text-center">
                      {currentCard.text}
                    </p>
                  </div>
                  <div className="h-1.5 w-full shrink-0" style={{ background: cat.gradient }} />
                  {/* Adult badge */}
                  {currentCard.ageGate === 'adult' && (
                    <span className="absolute bottom-3 right-4 text-[10px] font-black text-gray-300 select-none">✦</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Hint + Favorite button */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div key="hint"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-3 mb-6 px-1"
                >
                  <p className="text-xs text-gray-400 flex-1">
                    {isSolo ? "Prends le temps qu'il faut." : "Lisez ensemble. Sans timer."}
                  </p>
                  <motion.button
                    whileTap={{ scale: 1.35 }}
                    onClick={() => toggleFavorite(currentCard.id)}
                    className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all"
                    style={isFavCard
                      ? { borderColor: '#fecdd3', background: '#fff1f2' }
                      : { borderColor: '#f3f4f6', background: '#fff' }}
                  >
                    <Heart size={18} className={isFavCard ? 'text-rose-400 fill-rose-400' : 'text-gray-300'} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={isSeanceDone ? () => setStep('end') : drawNewCard}
                disabled={isAnimating}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{
                  background: isSeanceDone
                    ? 'linear-gradient(135deg, #059669, #10b981)'
                    : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  boxShadow: isSeanceDone ? '0 6px 24px #10b98140' : '0 6px 24px #8b5cf640',
                  opacity: isAnimating ? 0.55 : 1,
                  transition: 'background 0.4s, box-shadow 0.4s, opacity 0.2s',
                }}
              >
                {isSeanceDone
                  ? <><Trophy size={18} />Terminer la séance</>
                  : <><Shuffle size={18} />Nouvelle carte</>}
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
                className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 flex items-center justify-center gap-2">
                <RotateCcw size={14} />
                Changer de paquet
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── END ──────────────────────────────────────────── */}
        {step === 'end' && (
          <motion.div key="end"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center px-6 pt-8 pb-10 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
              className="text-6xl mb-5"
            >
              ✨
            </motion.div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">Belle séance !</h3>
            <p className="text-sm text-gray-400 mb-7 leading-relaxed">
              {seanceSize} cartes · {sessionDecks.length} paquet{sessionDecks.length > 1 ? 's' : ''} exploré{sessionDecks.length > 1 ? 's' : ''}
              {favorites.length > 0 && ` · ❤️ ${favorites.length} favori${favorites.length > 1 ? 's' : ''}`}
            </p>

            {/* Paquets explorés */}
            {sessionDecks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="w-full mb-6"
              >
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Paquets explorés</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {sessionDecks.map(d => {
                    const c = DICE_CATEGORIES[d];
                    return (
                      <div key={d} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ background: c.gradient }}>
                        <span>{c.emoji}</span>
                        <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{c.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Insight */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full p-4 rounded-2xl bg-violet-50 border border-violet-100 mb-7"
            >
              <p className="text-sm text-violet-700 leading-relaxed">{endInsight}</p>
            </motion.div>

            <div className="w-full space-y-2.5">
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 6px 24px #8b5cf640' }}
              >
                <Sparkles size={18} />
                Nouvelle séance
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSessionMode('libre'); setStep('playing'); }}
                className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 flex items-center justify-center gap-2"
              >
                <Shuffle size={14} />
                Continuer en mode libre
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
