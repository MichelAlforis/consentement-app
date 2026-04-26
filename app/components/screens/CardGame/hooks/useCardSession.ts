import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { CollectorCard, CardTheme, collectorCards, THEME_CATEGORIES, ThemeCategory } from '../../../../data/cards-collector';
import { useUnlockStore } from '../../../../stores/unlockStore';
import { useSettingsStore } from '../../../../stores/settingsStore';

export type CardStep = 'pick' | 'playing' | 'end';
export type ThemeId = CardTheme | 'random';
export type SessionMode = 'seance' | 'libre';

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
  selectedTheme: ThemeId;
  isSolo: boolean;
  sessionMode: SessionMode;
  seanceSize: 5 | 10;
  currentCard: CollectorCard | null;
  isRevealed: boolean;
  isAnimating: boolean;
  cardCount: number;
  sessionThemes: CardTheme[];
  favorites: string[];
  available: CollectorCard[];
  cat: ThemeCategory | null;
  isFavCard: boolean;
  isSeanceDone: boolean;
  setSelectedTheme: (id: ThemeId) => void;
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
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('random');
  const [isSolo, setIsSolo] = useState(true);
  const [sessionMode, setSessionMode] = useState<SessionMode>('seance');
  const [seanceSize, setSeanceSize] = useState<5 | 10>(5);
  const [currentCard, setCurrentCard] = useState<CollectorCard | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [drawnIds, setDrawnIds] = useState<string[]>([]);
  const [sessionThemes, setSessionThemes] = useState<CardTheme[]>([]);
  const [favorites, setFavorites] = useState<string[]>(loadFavs);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const explicitMode = useSettingsStore((s) => s.explicitMode);
  const ownedCards = useUnlockStore((s) => s.ownedCards);

  const clearTimers = () => { animTimers.current.forEach(clearTimeout); animTimers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const available = useMemo(() => {
    const ownedIds = new Set(ownedCards.map((c) => c.id));
    return collectorCards.filter((c) => {
      if (!ownedIds.has(c.id)) return false;
      if (c.deck === 'A') return true;
      if (c.deck === 'B') return isAdult;
      if (c.deck === 'M') return isAdult && explicitMode;
      return false;
    });
  }, [ownedCards, isAdult, explicitMode]);

  const pickCard = useCallback((count: number, drawn: string[], mode: SessionMode): CollectorCard => {
    const excluded = new Set(drawn);
    let pool = available.filter((c) =>
      (selectedTheme === 'random' || c.theme === selectedTheme) && !excluded.has(c.id)
    );
    if (mode === 'seance' && selectedTheme === 'random' && pool.length > 0) {
      const progress = count / Math.max(seanceSize - 1, 1);
      const byDepth = progress < 0.35
        ? pool.filter((c) => c.depth <= 2)
        : progress > 0.65
          ? pool.filter((c) => c.depth >= 2)
          : pool;
      if (byDepth.length > 0) pool = byDepth;
    }
    if (pool.length === 0) pool = available.filter((c) => selectedTheme === 'random' || c.theme === selectedTheme);
    if (pool.length === 0) pool = available;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [available, selectedTheme, seanceSize]);

  const startPlaying = useCallback(() => {
    const card = pickCard(0, [], sessionMode);
    setCurrentCard(card);
    setCardCount(1);
    setDrawnIds([card.id]);
    setSessionThemes([card.theme]);
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
        setCardCount((c) => c + 1);
        setSessionThemes((d) => d.includes(newCard.theme) ? d : [...d, newCard.theme]);
        setIsRevealed(true);
        setIsAnimating(false);
        return [...prev, newCard.id];
      });
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
    setSessionThemes([]);
    setStep('pick');
  }, []);

  const cat = currentCard ? THEME_CATEGORIES[currentCard.theme] : null;
  const isFavCard = currentCard ? favorites.includes(currentCard.id) : false;
  const isSeanceDone = sessionMode === 'seance' && cardCount >= seanceSize;

  const goToEnd = useCallback(() => setStep('end'), []);

  return {
    step, selectedTheme, isSolo, sessionMode, seanceSize,
    currentCard, isRevealed, isAnimating, cardCount, sessionThemes, favorites,
    available, cat, isFavCard, isSeanceDone,
    setSelectedTheme, setIsSolo, setSessionMode, setSeanceSize,
    startPlaying, drawNewCard, toggleFavorite, reset, goToEnd,
  };
}
