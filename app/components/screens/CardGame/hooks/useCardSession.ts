import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cardData, DICE_CATEGORIES, CardData } from '../../../../data';

export type CardStep = 'pick' | 'playing' | 'end';
export type DeckId = 1 | 2 | 3 | 4 | 5 | 6 | 'random';
export type SessionMode = 'seance' | 'libre';

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

interface CardSession {
  step: CardStep;
  selectedDeck: DeckId;
  isSolo: boolean;
  sessionMode: SessionMode;
  seanceSize: 5 | 10;
  currentCard: CardData | null;
  isRevealed: boolean;
  isAnimating: boolean;
  cardCount: number;
  sessionDecks: number[];
  favorites: string[];
  available: CardData[];
  cat: typeof DICE_CATEGORIES[number] | null;
  isFavCard: boolean;
  isSeanceDone: boolean;
  setSelectedDeck: (id: DeckId) => void;
  setIsSolo: (v: boolean) => void;
  setSessionMode: (mode: SessionMode) => void;
  setSeanceSize: (n: 5 | 10) => void;
  startPlaying: () => void;
  drawNewCard: () => void;
  toggleFavorite: (id: string) => void;
  reset: () => void;
  goToEnd: () => void;
}

export function useCardSession(isAdult: boolean): CardSession {
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

  const available = useMemo(() => cardData.filter((c) => {
    if (c.ageGate === 'all') return true;
    return c.ageGate === 'adult' && isAdult;
  }), [isAdult]);

  const pickCard = useCallback((count: number, drawn: string[], mode: SessionMode): CardData => {
    const excluded = new Set(drawn);
    let pool = available.filter((c) =>
      (selectedDeck === 'random' || c.deck === selectedDeck) && !excluded.has(c.id)
    );
    if (mode === 'seance' && selectedDeck === 'random' && pool.length > 0) {
      const progress = count / Math.max(seanceSize - 1, 1);
      const byDepth = progress < 0.35
        ? pool.filter((c) => DECK_DEPTH[c.deck] <= 2)
        : progress > 0.65
          ? pool.filter((c) => DECK_DEPTH[c.deck] >= 2)
          : pool;
      if (byDepth.length > 0) pool = byDepth;
    }
    if (pool.length === 0) pool = available.filter((c) => selectedDeck === 'random' || c.deck === selectedDeck);
    if (pool.length === 0) pool = available;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [available, selectedDeck, seanceSize]);

  const startPlaying = useCallback(() => {
    const card = pickCard(0, [], sessionMode);
    setCurrentCard(card);
    setCardCount(1);
    setDrawnIds([card.id]);
    setSessionDecks([card.deck]);
    setIsRevealed(false);
    setStep('playing');
    const timer = setTimeout(() => setIsRevealed(true), 350);
    animTimers.current.push(timer);
  }, [pickCard, sessionMode]);

  const drawNewCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsRevealed(false);
    const t1 = setTimeout(() => {
      setDrawnIds((prev) => {
        const newCard = pickCard(cardCount, prev, sessionMode);
        setCurrentCard(newCard);
        setDrawnIds([...prev, newCard.id]);
        setCardCount((c) => c + 1);
        setSessionDecks((d) => d.includes(newCard.deck) ? d : [...d, newCard.deck]);
        setIsRevealed(true);
        return prev;
      });
      const t2 = setTimeout(() => setIsAnimating(false), 550);
      animTimers.current.push(t2);
    }, 480);
    animTimers.current.push(t1);
  }, [isAnimating, pickCard, cardCount, sessionMode]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavs(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setIsAnimating(false);
    setIsRevealed(false);
    setCurrentCard(null);
    setCardCount(0);
    setDrawnIds([]);
    setSessionDecks([]);
    setStep('pick');
  }, []);

  const cat = currentCard ? DICE_CATEGORIES[currentCard.deck] : null;
  const isFavCard = currentCard ? favorites.includes(currentCard.id) : false;
  const isSeanceDone = sessionMode === 'seance' && cardCount >= seanceSize;

  const goToEnd = useCallback(() => setStep('end'), []);

  return {
    step, selectedDeck, isSolo, sessionMode, seanceSize,
    currentCard, isRevealed, isAnimating, cardCount, sessionDecks, favorites,
    available, cat, isFavCard, isSeanceDone,
    setSelectedDeck, setIsSolo, setSessionMode, setSeanceSize,
    startPlaying, drawNewCard, toggleFavorite, reset, goToEnd,
  };
}
