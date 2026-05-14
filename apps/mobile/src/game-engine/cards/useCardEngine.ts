import { useState, useCallback, useEffect, useRef } from 'react';
import { usePersist } from '../shared/usePersist';
import type { CardEngineConfig, CardConfig, Card } from './types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface CardEngineState {
  availableDecks: CardConfig[];
  selectedDeckId: string | null;
  selectDeck: (id: string) => void;
  currentCard: Card | null;
  drawCard: () => void;
  remaining: number;
  history: Card[];
  favorites: Card[];
  toggleFavorite: (card: Card) => void;
  reset: () => void;
}

export function useCardEngine(
  config: CardEngineConfig,
  cards: Card[],
  filter?: (card: Card) => boolean,
): CardEngineState {
  const {
    decks,
    shuffleOnDeal = true,
    allowFavorites = false,
    favoritesStorageKey,
    historySize = 50,
  } = config;

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(
    decks.length === 1 ? decks[0].id : null,
  );
  const [pile, setPile] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<Card[]>([]);
  const [favorites, setFavorites] = useState<Card[]>([]);

  const favPersist = usePersist<string[]>(favoritesStorageKey ?? '__card_favs__');
  const persistEnabled = allowFavorites && !!favoritesStorageKey;

  const initialized = useRef(false);
  useEffect(() => {
    if (!persistEnabled || initialized.current) return;
    initialized.current = true;
    const ids = favPersist.load() ?? [];
    const restored = cards.filter(c => ids.includes(c.id));
    if (restored.length > 0) setFavorites(restored);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildPile = useCallback((deckId: string): Card[] => {
    const pool = cards.filter(c => {
      if (c.deckId !== deckId) return false;
      return filter ? filter(c) : true;
    });
    return shuffleOnDeal ? shuffle(pool) : pool;
  }, [cards, filter, shuffleOnDeal]);

  const selectDeck = useCallback((id: string) => {
    setSelectedDeckId(id);
    setCurrentCard(null);
    setHistory([]);
    setPile(buildPile(id));
  }, [buildPile]);

  useEffect(() => {
    if (selectedDeckId) setPile(buildPile(selectedDeckId));
  }, [selectedDeckId, buildPile]);

  const drawCard = useCallback(() => {
    setPile(prev => {
      if (prev.length === 0) return prev;
      const [next, ...rest] = prev;
      setCurrentCard(next);
      setHistory(h => [next, ...h].slice(0, historySize));
      return rest;
    });
  }, [historySize]);

  const toggleFavorite = useCallback((card: Card) => {
    if (!allowFavorites) return;
    setFavorites(prev => {
      const exists = prev.some(f => f.id === card.id);
      const next = exists ? prev.filter(f => f.id !== card.id) : [...prev, card];
      if (persistEnabled) favPersist.save(next.map(f => f.id));
      return next;
    });
  }, [allowFavorites, persistEnabled, favPersist]);

  const reset = useCallback(() => {
    setCurrentCard(null);
    setHistory([]);
    if (selectedDeckId) setPile(buildPile(selectedDeckId));
  }, [selectedDeckId, buildPile]);

  return {
    availableDecks: decks,
    selectedDeckId,
    selectDeck,
    currentCard,
    drawCard,
    remaining: pile.length,
    history,
    favorites,
    toggleFavorite,
    reset,
  };
}
