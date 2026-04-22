export interface CardConfig {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  backGradient: string;
  color: string;
}

export interface Card {
  id: string;
  deckId: string;
  text: string;
  tags?: string[];
  depth?: 1 | 2 | 3;
}

export interface CardEngineConfig {
  decks: CardConfig[];
  shuffleOnDeal?: boolean;
  allowFavorites?: boolean;
  favoritesStorageKey?: string;
  historySize?: number;
}
