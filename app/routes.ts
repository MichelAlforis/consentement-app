import { lazy } from 'react';
import type { Screen } from './types';

export interface RouteConfig<Component = unknown> {
  component: Component;
  titleKey?: string;
  subtitleKey?: string;
  requiresAdult?: boolean;
  showAd: boolean;
}

export const WelcomeScreen = lazy(() => import('./components/screens/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
export const AgeCheckScreen = lazy(() => import('./components/screens/AgeCheckScreen').then(m => ({ default: m.AgeCheckScreen })));
export const AuthScreen = lazy(() => import('./components/screens/AuthScreen').then(m => ({ default: m.AuthScreen })));
export const HomeScreen = lazy(() => import('./components/screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
export const SettingsScreen = lazy(() => import('./components/screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
export const PersonalSpaceScreen = lazy(() => import('./components/screens/PersonalSpaceScreen').then(m => ({ default: m.PersonalSpaceScreen })));
export const DuoSpaceScreen = lazy(() => import('./components/screens/DuoSpace').then(m => ({ default: m.DuoSpaceScreen })));
export const LearnScreen = lazy(() => import('./components/screens/LearnScreen').then(m => ({ default: m.LearnScreen })));
export const HelpScreen = lazy(() => import('./components/screens/HelpScreen').then(m => ({ default: m.HelpScreen })));
export const PornoVsRealiteScreen = lazy(() => import('./components/screens/PornoVsRealiteScreen').then(m => ({ default: m.PornoVsRealiteScreen })));
export const LoiConsentementScreen = lazy(() => import('./components/screens/LoiConsentementScreen').then(m => ({ default: m.LoiConsentementScreen })));
export const QuizConsentementScreen = lazy(() => import('./components/screens/QuizConsentementScreen').then(m => ({ default: m.QuizConsentementScreen })));
export const QuizHubScreen = lazy(() => import('./components/screens/QuizHubScreen').then(m => ({ default: m.QuizHubScreen })));
export const AccompagnementMineurScreen = lazy(() => import('./components/screens/AccompagnementMineurScreen').then(m => ({ default: m.AccompagnementMineurScreen })));
export const AccompagnementAdulteScreen = lazy(() => import('./components/screens/AccompagnementAdulteScreen').then(m => ({ default: m.AccompagnementAdulteScreen })));
export const AnnuaireSexologuesScreen = lazy(() => import('./components/screens/AnnuaireSexologuesScreen').then(m => ({ default: m.AnnuaireSexologuesScreen })));
export const ResourcesMinorScreen = lazy(() => import('./components/screens/ResourcesMinorScreen').then(m => ({ default: m.ResourcesMinorScreen })));
export const GamesHubScreen = lazy(() => import('./components/screens/GamesHubScreen').then(m => ({ default: m.GamesHubScreen })));
export const DiceGameScreen = lazy(() => import('./components/screens/DiceGame').then(m => ({ default: m.DiceGameScreen })));
export const GooseGameScreen = lazy(() => import('./components/screens/GooseGameScreen').then(m => ({ default: m.GooseGameScreen })));
export const CardGameScreen = lazy(() => import('./components/screens/CardGame').then(m => ({ default: m.CardGameScreen })));
export const HallOfCardsScreen = lazy(() => import('./components/screens/HallOfCardsScreen').then(m => ({ default: m.HallOfCardsScreen })));
export const ModuleDeBaseScreen = lazy(() => import('./components/screens/ModuleDeBaseScreen').then(m => ({ default: m.ModuleDeBaseScreen })));
export const FichePratiqueScreen = lazy(() => import('./components/screens/FichePratiqueScreen').then(m => ({ default: m.FichePratiqueScreen })));
export const LexiqueScreen = lazy(() => import('./components/screens/LexiqueScreen').then(m => ({ default: m.LexiqueScreen })));
export const ScenarioScreen = lazy(() => import('./components/screens/ScenarioScreen').then(m => ({ default: m.ScenarioScreen })));
export const OnboardingWizard = lazy(() => import('./components/screens/OnboardingWizard').then(m => ({ default: m.OnboardingWizard })));
export const ThemeSelectScreen = lazy(() => import('./components/screens/ThemeSelectScreen').then(m => ({ default: m.ThemeSelectScreen })));
export const PremiumScreen = lazy(() => import('./components/screens/PremiumScreen').then(m => ({ default: m.PremiumScreen })));
export const ApprendreScreen = lazy(() => import('./components/screens/ApprendreScreen').then(m => ({ default: m.ApprendreScreen })));
export const MoiScreen = lazy(() => import('./components/screens/MoiScreen').then(m => ({ default: m.MoiScreen })));
export const LanguageScreen = lazy(() => import('./components/screens/LanguageScreen').then(m => ({ default: m.LanguageScreen })));
export const PersonalIntroScreen = lazy(() => import('./components/screens/PersonalIntroScreen').then(m => ({ default: m.PersonalIntroScreen })));

const baseRoute = (
  component: unknown,
  options: Partial<Omit<RouteConfig, 'component'>> = {}
) => ({
  component,
  showAd: false,
  ...options,
});

export const ROUTES = {
  welcome: baseRoute(WelcomeScreen),
  'age-check': baseRoute(AgeCheckScreen),
  auth: baseRoute(AuthScreen),
  home: baseRoute(HomeScreen),
  settings: baseRoute(SettingsScreen, { titleKey: 'headers.settings' }),
  'personal-space': baseRoute(PersonalSpaceScreen, {
    titleKey: 'headers.personalSpace',
    subtitleKey: 'headers.personalSubtitle',
    requiresAdult: true,
  }),
  'duo-space': baseRoute(DuoSpaceScreen, {
    titleKey: 'headers.duoSpace',
    subtitleKey: 'headers.duoSubtitle',
    requiresAdult: true,
  }),
  learn: baseRoute(LearnScreen, { titleKey: 'headers.learn', showAd: true }),
  help: baseRoute(HelpScreen, { titleKey: 'headers.help' }),
  'scenarios-minor': baseRoute(LearnScreen, { titleKey: 'headers.learn', showAd: true }),
  feelings: baseRoute(LearnScreen, { titleKey: 'headers.learn', showAd: true }),
  'resources-minor': baseRoute(ResourcesMinorScreen, { titleKey: 'headers.resourcesMinor', showAd: true }),
  'porno-vs-realite': baseRoute(PornoVsRealiteScreen, { titleKey: 'headers.pornoVsRealite', showAd: true }),
  'loi-consentement': baseRoute(LoiConsentementScreen, { titleKey: 'headers.loi', showAd: true }),
  'quiz-consentement': baseRoute(QuizConsentementScreen, { titleKey: 'headers.quiz', showAd: true }),
  'quiz-hub': baseRoute(QuizHubScreen, { titleKey: 'quizMl.ui.hubTitle', requiresAdult: true, showAd: true }),
  'accompagnement-mineur': baseRoute(AccompagnementMineurScreen, { titleKey: 'headers.accompagnement', showAd: true }),
  'accompagnement-adulte': baseRoute(AccompagnementAdulteScreen, { titleKey: 'headers.accompagnementAdulte', requiresAdult: true, showAd: true }),
  'annuaire-sexologues': baseRoute(AnnuaireSexologuesScreen, { titleKey: 'headers.annuaireSexologues', requiresAdult: true }),
  jeux: baseRoute(GamesHubScreen, { titleKey: 'headers.games' }),
  'jeu-des': baseRoute(DiceGameScreen, { titleKey: 'headers.jeuDes' }),
  'jeu-oie': baseRoute(GooseGameScreen, { titleKey: 'headers.jeuOie' }),
  'jeu-cartes': baseRoute(CardGameScreen, { titleKey: 'headers.jeuCartes' }),
  'hall-of-cards': baseRoute(HallOfCardsScreen, { titleKey: 'headers.hallOfCards' }),
  apprendre: baseRoute(ApprendreScreen, { titleKey: 'tabs.learn' }),
  moi: baseRoute(MoiScreen, { titleKey: 'tabs.me' }),
  'module-de-base': baseRoute(ModuleDeBaseScreen),
  'pratiques-base': baseRoute(FichePratiqueScreen, { titleKey: 'apprendre.pratiquesBase.title', requiresAdult: true, showAd: true }),
  'lexique-consent': baseRoute(LexiqueScreen, { titleKey: 'apprendre.lexique.title', showAd: true }),
  'scenarios-quotidiens': baseRoute(ScenarioScreen, { titleKey: 'apprendre.scenariosQuotidiens.title', showAd: true }),
  language: baseRoute(LanguageScreen),
  onboarding: baseRoute(OnboardingWizard),
  'personal-intro': baseRoute(PersonalIntroScreen),
  premium: baseRoute(PremiumScreen),
  'theme-select': baseRoute(ThemeSelectScreen),
} satisfies Record<Screen, RouteConfig>;

export function getRoute(screen: Screen): RouteConfig {
  return ROUTES[screen];
}

export function shouldShowAd(screen: Screen): boolean {
  return getRoute(screen).showAd;
}
