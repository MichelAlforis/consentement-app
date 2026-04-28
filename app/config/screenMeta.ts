import type { Screen } from '../types';

export type TabIconId = 'home' | 'learn' | 'play' | 'me';

export interface ScreenMeta {
  isRoot?: boolean;
  header?: 'shown' | 'hidden';
  tab?: {
    icon: TabIconId;
    labelKey: string;
    order: number;
  };
  legacy?: {
    replacement: Screen;
    reason: string;
  };
}

export const screenMeta: Record<Screen, ScreenMeta> = {
  welcome: { isRoot: true, header: 'hidden' },
  'age-check': { isRoot: true, header: 'hidden' },
  auth: { header: 'hidden' },
  home: {
    isRoot: true,
    header: 'hidden',
    tab: { icon: 'home', labelKey: 'tabs.home', order: 10 },
  },
  settings: {},
  'personal-space': {},
  'duo-space': {},
  learn: {
    legacy: {
      replacement: 'apprendre',
      reason: 'Ancien écran éducatif conservé pour les navigations persistées.',
    },
  },
  help: {},
  'scenarios-minor': {
    legacy: {
      replacement: 'apprendre',
      reason: 'Ancienne entrée mineur désormais couverte par le hub Apprendre.',
    },
  },
  feelings: {
    legacy: {
      replacement: 'apprendre',
      reason: 'Ancienne entrée ressentis désormais couverte par le hub Apprendre.',
    },
  },
  'resources-minor': {},
  'porno-vs-realite': {},
  'loi-consentement': {},
  'quiz-consentement': {},
  'accompagnement-mineur': {},
  jeux: {
    isRoot: true,
    tab: { icon: 'play', labelKey: 'tabs.play', order: 30 },
  },
  'jeu-des': {},
  'jeu-oie': {},
  'jeu-cartes': {},
  'hall-of-cards': {},
  apprendre: {
    isRoot: true,
    header: 'hidden',
    tab: { icon: 'learn', labelKey: 'tabs.learn', order: 20 },
  },
  moi: {
    isRoot: true,
    header: 'hidden',
    tab: { icon: 'me', labelKey: 'tabs.me', order: 40 },
  },
  'module-de-base': {},
  'accompagnement-adulte': {},
  'annuaire-sexologues': {},
  // Onboarding wizard
  onboarding: { header: 'hidden' },
  language: { header: 'hidden' },
  'onboarding-slides': { header: 'hidden' },
  'personal-intro': { header: 'hidden' },
  // Premium
  premium: {},
  'theme-select': {},
};

export const tabScreens = Object.entries(screenMeta)
  .filter((entry): entry is [Screen, ScreenMeta & { tab: NonNullable<ScreenMeta['tab']> }] => Boolean(entry[1].tab))
  .sort((a, b) => a[1].tab.order - b[1].tab.order)
  .map(([screen, meta]) => ({ screen, ...meta.tab }));

export function isRootScreen(screen: Screen): boolean {
  return Boolean(screenMeta[screen].isRoot);
}

export function isTabRootScreen(screen: Screen): boolean {
  return Boolean(screenMeta[screen].tab);
}

export function shouldScreenShowHeader(screen: Screen): boolean {
  return screenMeta[screen].header !== 'hidden';
}
