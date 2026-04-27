'use client';

import { Suspense } from 'react';
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
  LearnScreen,
  HelpScreen,
  PornoVsRealiteScreen,
  LoiConsentementScreen,
  QuizConsentementScreen,
  AccompagnementMineurScreen,
  ResourcesMinorScreen,
  GamesHubScreen,
  DiceGameScreen,
  GooseGameScreen,
  CardGameScreen,
  HallOfCardsScreen,
  ModuleDeBaseScreen,
  ThemeSelectScreen,
  PremiumScreen,
  ApprendreScreen,
  MoiScreen,
} from '../../routes';
import type { Theme } from '../../types/theme';
import type { ThemeMode } from '../../types/theme';
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
  goBack: () => void;
  selectTheme: (mode: ThemeMode) => void;
  handleAgeSelect: (adult: boolean) => void;
  handleAuth: (name: string) => void;
  updateComfortLevel: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  updateSafeword: (word: string) => void;
  activatePremium: () => void;
};

export function RouteRenderer({
  currentScreen,
  isAdult,
  hasOnboarded,
  userName,
  personalProfile,
  isPremium,
  theme,
  navigateTo,
  goBack,
  selectTheme,
  handleAgeSelect,
  handleAuth,
  updateComfortLevel,
  updateSafeword,
  activatePremium,
}: RouteRendererProps) {
  const pageTransition =
    theme.effects.pageTransition === 'fade'
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: 'easeInOut' } }
      : theme.effects.pageTransition === 'drift'
        ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
        : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;
      case 'age-check':
        return (
          <AgeCheckScreen
            onSelectMinor={() => { handleAgeSelect(false); selectTheme('youth'); navigateTo('home'); }}
            onSelectAdult={() => { handleAgeSelect(true); navigateTo('auth'); }}
          />
        );
      case 'auth':
        return <AuthScreen onAuth={(name) => { handleAuth(name); navigateTo('home'); }} />;
      case 'home':
        if (!hasOnboarded) {
          return <ModuleDeBaseScreen isAdult={isAdult} onNavigate={navigateTo} />;
        }
        return <HomeScreen isAdult={isAdult} userName={userName} onNavigate={navigateTo} />;
      case 'settings':
        return <SettingsScreen isPremium={isPremium} isAdult={isAdult ?? false} onNavigate={navigateTo} />;
      case 'personal-space':
        return (
          <PersonalSpaceScreen
            profile={personalProfile}
            onUpdateLevel={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onSave={() => goBack()}
          />
        );
      case 'duo-space':
        return (
          <DuoSpaceScreen
            personalProfile={personalProfile}
            onUpdateComfort={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onBack={() => goBack()}
            onComplete={() => navigateTo('hall-of-cards')}
          />
        );
      case 'learn':
      case 'scenarios-minor':
      case 'feelings':
        return <LearnScreen />;
      case 'help':
        return <HelpScreen />;
      case 'resources-minor':
        return <ResourcesMinorScreen onNavigate={navigateTo} />;
      case 'porno-vs-realite':
        return <PornoVsRealiteScreen onBack={() => goBack()} onComplete={() => navigateTo('hall-of-cards')} />;
      case 'loi-consentement':
        return <LoiConsentementScreen onComplete={() => navigateTo('hall-of-cards')} />;
      case 'quiz-consentement':
        return <QuizConsentementScreen onComplete={() => navigateTo('hall-of-cards')} />;
      case 'accompagnement-mineur':
        return <AccompagnementMineurScreen onNavigate={navigateTo} onComplete={() => navigateTo('hall-of-cards')} />;
      case 'jeux':
        return <GamesHubScreen onNavigate={navigateTo} isPremium={isPremium} isAdult={isAdult ?? false} onGoPremium={() => navigateTo('premium')} />;
      case 'jeu-des':
        return <DiceGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;
      case 'jeu-oie':
        return <GooseGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;
      case 'jeu-cartes':
        return <CardGameScreen isPremium={isPremium} isAdult={isAdult ?? false} onNavigate={(s) => navigateTo(s as Screen)} />;
      case 'hall-of-cards':
        return <HallOfCardsScreen isPremium={isPremium} isAdult={isAdult ?? false} onNavigate={navigateTo} />;
      case 'theme-select':
        return <ThemeSelectScreen onSelectTheme={(mode) => { selectTheme(mode); navigateTo('home'); }} isPremium={isPremium} onGoPremium={() => navigateTo('premium')} />;
      case 'premium':
        return <PremiumScreen onActivate={() => { activatePremium(); navigateTo('theme-select'); }} onBack={() => goBack()} />;
      case 'apprendre':
        return <ApprendreScreen isAdult={isAdult} onNavigate={navigateTo} />;
      case 'moi':
        return <MoiScreen isAdult={isAdult} onNavigate={navigateTo} />;
      case 'module-de-base':
        return <ModuleDeBaseScreen isAdult={isAdult} onNavigate={navigateTo} />;
      default:
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={currentScreen} {...pageTransition}>
        <Suspense fallback={<ScreenLoader />}>
          <ErrorBoundary label={currentScreen}>
            {renderScreen()}
          </ErrorBoundary>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
