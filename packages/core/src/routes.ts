import type { Screen } from './types';

export interface RouteConfig {
  requiresAdult?: boolean;
  showAd: boolean;
}

const ADULT_SCREENS = new Set<Screen>([
  'personal-space',
  'duo-space',
  'quiz-hub',
  'accompagnement-adulte',
  'annuaire-sexologues',
  'pratiques-base',
  'alcool-consent',
  'bdsm-consent',
  'pression-manip',
  'rupture-harcele',
  'content-non-consenti',
  'pratiques-explicit',
  'zones-grises',
  'pratiques-avancees',
  'scenario-game',
]);

const AD_SCREENS = new Set<Screen>([
  'learn',
  'scenarios-minor',
  'feelings',
  'resources-minor',
  'porno-vs-realite',
  'loi-consentement',
  'quiz-consentement',
  'quiz-hub',
  'accompagnement-mineur',
  'accompagnement-adulte',
  'jeux',
  'pratiques-base',
  'lexique-consent',
  'scenarios-quotidiens',
  'alcool-consent',
  'bdsm-consent',
  'sexting',
  'pression-manip',
  'rupture-harcele',
  'content-non-consenti',
  'pratiques-explicit',
  'zones-grises',
  'lgbtq-consent',
  'pratiques-avancees',
]);

const SCREENS = [
  'welcome',
  'age-check',
  'auth',
  'home',
  'settings',
  'personal-space',
  'duo-space',
  'learn',
  'help',
  'scenarios-minor',
  'feelings',
  'resources-minor',
  'porno-vs-realite',
  'loi-consentement',
  'quiz-consentement',
  'quiz-hub',
  'accompagnement-mineur',
  'accompagnement-adulte',
  'annuaire-sexologues',
  'jeux',
  'jeu-des',
  'jeu-oie',
  'jeu-cartes',
  'hall-of-cards',
  'apprendre',
  'moi',
  'module-de-base',
  'onboarding',
  'language',
  'personal-intro',
  'premium',
  'theme-select',
  'pratiques-base',
  'lexique-consent',
  'scenarios-quotidiens',
  'alcool-consent',
  'bdsm-consent',
  'sexting',
  'pression-manip',
  'rupture-harcele',
  'content-non-consenti',
  'pratiques-explicit',
  'zones-grises',
  'lgbtq-consent',
  'pratiques-avancees',
  'scenario-game',
] as const satisfies readonly Screen[];

export const ROUTES = Object.fromEntries(
  SCREENS.map((screen) => [
    screen,
    {
      requiresAdult: ADULT_SCREENS.has(screen),
      showAd: AD_SCREENS.has(screen),
    },
  ])
) as Record<Screen, RouteConfig>;

export function getRoute(screen: Screen): RouteConfig {
  return ROUTES[screen];
}

export function shouldShowAd(screen: Screen): boolean {
  return AD_SCREENS.has(screen);
}
