import type { AgeGroup, Screen } from '../types';

export type GameMenuSection = 'free' | 'premium' | 'collection';
export type GameAvailability = 'available' | 'premium' | 'coming-soon';
export type GameIconId = 'dice' | 'goose' | 'cards' | 'scenarios' | 'collection';

export interface GameMenuItem {
  id: string;
  section: GameMenuSection;
  order: number;
  screen?: Screen;
  icon: GameIconId;
  titleKey: string;
  descKey: string | Record<AgeGroup, string>;
  availability: GameAvailability;
  audience: AgeGroup | 'all';
}

export const gameMenuItems = [
  {
    id: 'dice',
    section: 'free',
    order: 10,
    screen: 'jeu-des',
    icon: 'dice',
    titleKey: 'games.dice.title',
    descKey: {
      adult: 'games.dice.descAdult',
      minor: 'games.dice.descMinor',
    },
    availability: 'available',
    audience: 'all',
  },
  {
    id: 'goose',
    section: 'premium',
    order: 20,
    screen: 'jeu-oie',
    icon: 'goose',
    titleKey: 'games.goose.title',
    descKey: 'games.goose.desc',
    availability: 'premium',
    audience: 'all',
  },
  {
    id: 'cards',
    section: 'premium',
    order: 30,
    screen: 'jeu-cartes',
    icon: 'cards',
    titleKey: 'games.cards.title',
    descKey: {
      adult: 'games.cards.descAdult',
      minor: 'games.cards.descMinor',
    },
    availability: 'premium',
    audience: 'all',
  },
  {
    id: 'scenarios',
    section: 'free',
    order: 40,
    screen: 'scenario-game',
    icon: 'scenarios',
    titleKey: 'games.scenarios.title',
    descKey: 'games.scenarios.desc',
    availability: 'available',
    audience: 'adult',
  },
  {
    id: 'collection',
    section: 'collection',
    order: 50,
    screen: 'hall-of-cards',
    icon: 'collection',
    titleKey: 'hallOfCards.title',
    descKey: 'games.playToUnlock',
    availability: 'available',
    audience: 'all',
  },
] satisfies GameMenuItem[];

export function getVisibleGameMenuItems(isAdult: boolean, section: GameMenuSection): GameMenuItem[] {
  const ageGroup: AgeGroup = isAdult ? 'adult' : 'minor';

  return gameMenuItems
    .filter((item) => item.section === section)
    .filter((item) => item.audience === 'all' || item.audience === ageGroup)
    .sort((a, b) => a.order - b.order);
}

export function getGameDescriptionKey(item: GameMenuItem, isAdult: boolean): string {
  if (typeof item.descKey === 'string') return item.descKey;
  return item.descKey[isAdult ? 'adult' : 'minor'];
}
