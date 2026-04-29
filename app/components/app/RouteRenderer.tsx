'use client';

import { Suspense, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import type { Screen } from '../../types';
import { ScreenLoader } from './ScreenLoader';
import {
  WelcomeScreen,
  AgeCheckScreen,
  AuthScreen,
  HomeScreen,
  SettingsScreen,
  PersonalSpaceScreen,
  DuoSpaceScreen,
  HelpScreen,
  PornoVsRealiteScreen,
  LoiConsentementScreen,
  QuizConsentementScreen,
  AccompagnementMineurScreen,
  AccompagnementAdulteScreen,
  AnnuaireSexologuesScreen,
  ResourcesMinorScreen,
  GamesHubScreen,
  DiceGameScreen,
  GooseGameScreen,
  CardGameScreen,
  HallOfCardsScreen,
  ModuleDeBaseScreen,
  OnboardingWizard,
  ThemeSelectScreen,
  PremiumScreen,
  ApprendreScreen,
  MoiScreen,
  LanguageScreen,
  PersonalIntroScreen,
} from '../../routes';
import type { Theme, ThemeMode } from '../../types/theme';
import type { PersonalProfile } from '../../types';


type RouteRendererProps = {
  currentScreen: Screen;
  isAdult: boolean | null;
  hasOnboarded: boolean;
  userName: string;
  personalProfile: PersonalProfile;
  isPremium: boolean;
  theme: Theme;
  navigateTo: (screen: Screen) => void;
  replaceWith: (screen: Screen) => void;
  goBack: () => void;
  selectTheme: (mode: ThemeMode) => void;
  handleAgeSelect: (adult: boolean) => void;
  handleAuth: (name: string) => void;
  updateComfortLevel: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  updateSafeword: (word: string) => void;
  activatePremium: () => void;
};

type ShellCtx = Omit<RouteRendererProps, 'currentScreen' | 'theme'>;

// Record<Screen, ...> enforces exhaustiveness: adding a new Screen without a render entry is a compile error.
const SCREEN_RENDERS: Record<Screen, (ctx: ShellCtx) => ReactNode> = {
  onboarding: (ctx) => (
    <OnboardingWizard
      isAdult={ctx.isAdult}
      isPremium={ctx.isPremium}
      onSetAge={ctx.handleAgeSelect}
      onSelectTheme={ctx.selectTheme}
      onAuth={ctx.handleAuth}
      onNavigate={ctx.navigateTo}
    />
  ),

  language: (ctx) =>
    <LanguageScreen onContinue={() => ctx.navigateTo('welcome')} />,

  welcome: (ctx) =>
    <WelcomeScreen onStart={() => ctx.navigateTo('age-check')} />,

  'age-check': (ctx) => (
    <AgeCheckScreen
      onSelectMinor={() => { ctx.handleAgeSelect(false); ctx.selectTheme('youth'); ctx.navigateTo('theme-select'); }}
      onSelectAdult={() => { ctx.handleAgeSelect(true); ctx.navigateTo('theme-select'); }}
    />
  ),

  'theme-select': (ctx) => (
    <ThemeSelectScreen
      isAdult={ctx.isAdult}
      onSelectTheme={(mode) => {
        ctx.selectTheme(mode);
        if (!ctx.hasOnboarded) {
          ctx.navigateTo(ctx.isAdult === true ? 'auth' : 'onboarding-slides');
        } else {
          ctx.goBack();
        }
      }}
      isPremium={ctx.isPremium}
      onGoPremium={() => ctx.navigateTo('premium')}
    />
  ),

  auth: (ctx) =>
    <AuthScreen onAuth={(name) => {
      ctx.handleAuth(name);
      ctx.navigateTo(!ctx.hasOnboarded ? 'personal-intro' : 'home');
    }} />,

  'personal-intro': (ctx) =>
    <PersonalIntroScreen onContinue={() => ctx.navigateTo('onboarding-slides')} />,

  'onboarding-slides': (ctx) =>
    <ModuleDeBaseScreen isAdult={ctx.isAdult} onNavigate={ctx.navigateTo} />,

  home: (ctx) =>
    <HomeScreen isAdult={ctx.isAdult} userName={ctx.userName} onNavigate={ctx.navigateTo} />,

  settings: (ctx) =>
    <SettingsScreen isPremium={ctx.isPremium} isAdult={ctx.isAdult ?? false} onNavigate={ctx.navigateTo} />,

  'personal-space': (ctx) => (
    <PersonalSpaceScreen
      profile={ctx.personalProfile}
      onUpdateLevel={ctx.updateComfortLevel}
      onUpdateSafeword={ctx.updateSafeword}
      onSave={() => ctx.goBack()}
    />
  ),

  'duo-space': (ctx) => (
    <DuoSpaceScreen
      personalProfile={ctx.personalProfile}
      onUpdateComfort={ctx.updateComfortLevel}
      onUpdateSafeword={ctx.updateSafeword}
      onBack={() => ctx.goBack()}
      onComplete={() => ctx.navigateTo('hall-of-cards')}
    />
  ),

  // Legacy routes — AppShell redirects to screenMeta.legacy.replacement before first render.
  learn: () => null,
  'scenarios-minor': () => null,
  feelings: () => null,

  help: () => <HelpScreen />,

  'resources-minor': (ctx) =>
    <ResourcesMinorScreen onNavigate={ctx.navigateTo} />,

  'porno-vs-realite': (ctx) =>
    <PornoVsRealiteScreen onBack={() => ctx.goBack()} onComplete={() => ctx.navigateTo('hall-of-cards')} />,

  'loi-consentement': (ctx) =>
    <LoiConsentementScreen onComplete={() => ctx.navigateTo('hall-of-cards')} />,

  'quiz-consentement': (ctx) =>
    <QuizConsentementScreen onComplete={() => ctx.navigateTo('hall-of-cards')} />,

  'accompagnement-mineur': (ctx) => (
    <AccompagnementMineurScreen onNavigate={ctx.navigateTo} onComplete={() => ctx.navigateTo('hall-of-cards')} />
  ),

  'accompagnement-adulte': (ctx) =>
    <AccompagnementAdulteScreen onBack={() => ctx.goBack()} onGoAnnuaire={() => ctx.navigateTo('annuaire-sexologues')} />,

  'annuaire-sexologues': (ctx) =>
    <AnnuaireSexologuesScreen onBack={() => ctx.goBack()} />,

  jeux: (ctx) => (
    <GamesHubScreen
      onNavigate={ctx.navigateTo}
      isPremium={ctx.isPremium}
      isAdult={ctx.isAdult ?? false}
      onGoPremium={() => ctx.navigateTo('premium')}
    />
  ),

  'jeu-des': (ctx) =>
    <DiceGameScreen isPremium={ctx.isPremium} isAdult={ctx.isAdult ?? false} />,

  'jeu-oie': (ctx) =>
    <GooseGameScreen isPremium={ctx.isPremium} isAdult={ctx.isAdult ?? false} />,

  'jeu-cartes': (ctx) => (
    <CardGameScreen
      isPremium={ctx.isPremium}
      isAdult={ctx.isAdult ?? false}
      onNavigate={ctx.navigateTo}
    />
  ),

  'hall-of-cards': (ctx) => (
    <HallOfCardsScreen isPremium={ctx.isPremium} isAdult={ctx.isAdult ?? false} onNavigate={ctx.navigateTo} />
  ),

  apprendre: (ctx) =>
    <ApprendreScreen isAdult={ctx.isAdult} onNavigate={ctx.navigateTo} />,

  moi: (ctx) =>
    <MoiScreen isAdult={ctx.isAdult} onNavigate={ctx.navigateTo} />,

  'module-de-base': (ctx) =>
    <ModuleDeBaseScreen isAdult={ctx.isAdult} onNavigate={ctx.navigateTo} />,

  premium: (ctx) => (
    <PremiumScreen
      onActivate={() => { ctx.activatePremium(); ctx.replaceWith('theme-select'); }}
      onBack={() => ctx.goBack()}
    />
  ),
};

export function RouteRenderer({ currentScreen, theme, ...ctx }: RouteRendererProps) {
  const pageTransition =
    theme.effects.pageTransition === 'fade'
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: 'easeInOut' } }
      : theme.effects.pageTransition === 'drift'
        ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
        : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={currentScreen} {...pageTransition} className="flex-1 flex flex-col min-h-0">
        <Suspense fallback={<ScreenLoader />}>
          <ErrorBoundary label={currentScreen}>
            {SCREEN_RENDERS[currentScreen](ctx)}
          </ErrorBoundary>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
