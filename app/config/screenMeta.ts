import type { Screen } from '../types';
import type { TabId } from '../stores/navigationStore';

export type TabIconId = 'home' | 'learn' | 'play' | 'me';

export interface ScreenMeta {
  tab?: {
    id: TabId;
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
  // ── Tab roots ──────────────────────────────────────────────────────────────
  home:      { tab: { id: 'home',     icon: 'home',  labelKey: 'tabs.home',  order: 10 } },
  apprendre: { tab: { id: 'apprendre', icon: 'learn', labelKey: 'tabs.learn', order: 20 } },
  jeux:      { tab: { id: 'jeux',     icon: 'play',  labelKey: 'tabs.play',  order: 30 } },
  moi:       { tab: { id: 'moi',      icon: 'me',    labelKey: 'tabs.me',    order: 40 } },

  // ── Sub-screens (no special meta needed) ──────────────────────────────────
  settings: {},
  'personal-space': {},
  'duo-space': {},
  help: {},
  'resources-minor': {},
  'porno-vs-realite': {},
  'loi-consentement': {},
  'quiz-consentement': {},
  'accompagnement-mineur': {},
  'accompagnement-adulte': {},
  'annuaire-sexologues': {},
  'jeu-des': {},
  'jeu-oie': {},
  'jeu-cartes': {},
  'hall-of-cards': {},
  'module-de-base': {},
  premium: {},
  'theme-select': {},

  // ── Fullscreen / onboarding (managed by fullscreenStack) ──────────────────
  onboarding: {},
  language: {},
  welcome: {},
  'age-check': {},
  auth: {},
  'personal-intro': {},

  // ── Legacy routes ──────────────────────────────────────────────────────────
  learn: {
    legacy: { replacement: 'apprendre', reason: 'Ancien écran éducatif conservé pour les navigations persistées.' },
  },
  'scenarios-minor': {
    legacy: { replacement: 'apprendre', reason: 'Ancienne entrée mineur désormais couverte par le hub Apprendre.' },
  },
  feelings: {
    legacy: { replacement: 'apprendre', reason: 'Ancienne entrée ressentis désormais couverte par le hub Apprendre.' },
  },
};

export const tabScreens = Object.entries(screenMeta)
  .filter((entry): entry is [Screen, ScreenMeta & { tab: NonNullable<ScreenMeta['tab']> }] => Boolean(entry[1].tab))
  .sort((a, b) => a[1].tab.order - b[1].tab.order)
  .map(([screen, meta]) => ({ screen: screen as Screen, ...meta.tab }));

export function isTabRootScreen(screen: Screen): boolean {
  return Boolean(screenMeta[screen]?.tab);
}
