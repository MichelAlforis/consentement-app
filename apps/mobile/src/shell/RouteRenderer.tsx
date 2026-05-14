// V4: routing string-based via useNavigationStore. 11 routes Phase 4 +
//     PlaceholderScreen fallback. Lazy-loading + Suspense.
import { Suspense, lazy } from 'react';
import { Text, View } from 'react-native';
import {
  selectCanGoBack,
  selectCurrentScreen,
  selectShowHeader,
  selectShowTabBar,
  useAuthStore,
  useNavigationStore,
  usePremiumStore,
  type Screen,
} from '@ouiclair/core';
import { ErrorBoundary } from '../components/ui';
import { useTheme } from '../theme/ThemeContext';
import { AppShell } from './AppShell';

const HomeScreen = lazy(() => import('../components/screens/Home').then((module) => ({ default: module.HomeScreen })));
const ApprendreScreen = lazy(() => import('../components/screens/Apprendre').then((module) => ({ default: module.ApprendreScreen })));
const MoiScreen = lazy(() => import('../components/screens/Moi').then((module) => ({ default: module.MoiScreen })));
const SettingsScreen = lazy(() => import('../components/screens/Settings').then((module) => ({ default: module.SettingsScreen })));
const OnboardingWizard = lazy(() => import('../components/screens/OnboardingWizard').then((module) => ({ default: module.OnboardingWizard })));
const AgeCheckScreen = lazy(() => import('../components/screens/AgeCheckScreen').then((module) => ({ default: module.AgeCheckScreen })));
const AuthScreen = lazy(() => import('../components/screens/AuthScreen').then((module) => ({ default: module.AuthScreen })));
const ThemeSelectScreen = lazy(() => import('../components/screens/ThemeSelectScreen').then((module) => ({ default: module.ThemeSelectScreen })));
const LanguageScreen = lazy(() => import('../components/screens/LanguageScreen').then((module) => ({ default: module.LanguageScreen })));
const ModuleDeBaseScreen = lazy(() => import('../components/screens/ModuleDeBase').then((m) => ({ default: m.ModuleDeBaseScreen })));
const PratiquesBaseScreen = lazy(() => import('../components/screens/PratiquesBase').then((m) => ({ default: m.PratiquesBaseScreen })));
const PratiquesAvanceesScreen = lazy(() => import('../components/screens/PratiquesAvancees').then((m) => ({ default: m.PratiquesAvanceesScreen })));
const PratiquesExplicitScreen = lazy(() => import('../components/screens/PratiquesExplicit').then((m) => ({ default: m.PratiquesExplicitScreen })));
const LexiqueConsentScreen = lazy(() => import('../components/screens/LexiqueConsent').then((m) => ({ default: m.LexiqueConsentScreen })));
const ScenariosQuotidiensScreen = lazy(() => import('../components/screens/ScenariosQuotidiens').then((m) => ({ default: m.ScenariosQuotidiensScreen })));
const BdsmConsentScreen = lazy(() => import('../components/screens/BdsmConsent').then((m) => ({ default: m.BdsmConsentScreen })));
const SextingScreen = lazy(() => import('../components/screens/Sexting').then((m) => ({ default: m.SextingScreen })));
const PressionManipScreen = lazy(() => import('../components/screens/PressionManip').then((m) => ({ default: m.PressionManipScreen })));
const RuptureHarceleScreen = lazy(() => import('../components/screens/RuptureHarcele').then((m) => ({ default: m.RuptureHarceleScreen })));
const ContentNonConsentiScreen = lazy(() => import('../components/screens/ContentNonConsenti').then((m) => ({ default: m.ContentNonConsentiScreen })));
const ZonesGrisesScreen = lazy(() => import('../components/screens/ZonesGrises').then((m) => ({ default: m.ZonesGrisesScreen })));
const LgbtqConsentScreen = lazy(() => import('../components/screens/LgbtqConsent').then((m) => ({ default: m.LgbtqConsentScreen })));
const AlcoolConsentScreen = lazy(() => import('../components/screens/AlcoolConsent').then((m) => ({ default: m.AlcoolConsentScreen })));

const TAB_SCREENS = new Set<Screen>(['home', 'apprendre', 'moi', 'jeux']);
const FULLSCREEN_ONBOARDING = new Set<Screen>(['welcome', 'onboarding', 'age-check', 'auth', 'theme-select', 'language']);

function Fallback() {
  return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}

function PlaceholderScreen({ screen }: { screen: Screen }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.bgPrimary }}>
      <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center' }}>
        TODO Phase suivante: {screen}
      </Text>
    </View>
  );
}

function RenderScreen({ screen }: { screen: Screen }) {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult = useAuthStore((s) => s.isAdult);
  const userName = useAuthStore((s) => s.userName);
  const isPremium = usePremiumStore((s) => s.isPremium);

  switch (screen) {
    case 'home':
      return <HomeScreen isAdult={isAdult} userName={userName} onNavigate={navigateTo} />;
    case 'apprendre':
      return <ApprendreScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'moi':
      return <MoiScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'settings':
      return <SettingsScreen isAdult={isAdult === true} isPremium={isPremium} onNavigate={navigateTo} />;
    case 'onboarding':
      return <OnboardingWizard />;
    case 'age-check':
      return <AgeCheckScreen />;
    case 'auth':
      return <AuthScreen />;
    case 'theme-select':
      return <ThemeSelectScreen />;
    case 'language':
      return <LanguageScreen />;

    case 'welcome':
    case 'personal-intro':
    case 'personal-space':
    case 'duo-space':
    case 'learn':
    case 'help':
    case 'scenarios-minor':
    case 'feelings':
    case 'resources-minor':
    case 'porno-vs-realite':
    case 'loi-consentement':
    case 'quiz-consentement':
    case 'quiz-hub':
    case 'accompagnement-mineur':
    case 'accompagnement-adulte':
    case 'annuaire-sexologues':
    case 'jeux':
    case 'jeu-des':
    case 'jeu-oie':
    case 'jeu-cartes':
    case 'hall-of-cards':
      return <PlaceholderScreen screen={screen} />;
    case 'module-de-base':
      return <ModuleDeBaseScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'pratiques-base':
      return <PratiquesBaseScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'pratiques-avancees':
      return <PratiquesAvanceesScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'pratiques-explicit':
      return <PratiquesExplicitScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'lexique-consent':
      return <LexiqueConsentScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'scenarios-quotidiens':
      return <ScenariosQuotidiensScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'bdsm-consent':
      return <BdsmConsentScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'sexting':
      return <SextingScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'pression-manip':
      return <PressionManipScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'rupture-harcele':
      return <RuptureHarceleScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'content-non-consenti':
      return <ContentNonConsentiScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'zones-grises':
      return <ZonesGrisesScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'lgbtq-consent':
      return <LgbtqConsentScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'alcool-consent':
      return <AlcoolConsentScreen isAdult={isAdult} onNavigate={navigateTo} />;
    case 'premium':
    case 'scenario-game':
      return <PlaceholderScreen screen={screen} />;
  }
}

function ScreenFrame({ screen }: { screen: Screen }) {
  return (
    <ErrorBoundary label={screen}>
      <RenderScreen screen={screen} />
    </ErrorBoundary>
  );
}

export function RouteRenderer() {
  const navigation = useNavigationStore();
  const screen = selectCurrentScreen(navigation);
  const showTabBar = selectShowTabBar(navigation);
  const showHeader = selectShowHeader(navigation);
  const canGoBack = selectCanGoBack(navigation);
  const isTabScreen = TAB_SCREENS.has(screen);
  const isOnboardingFullscreen = FULLSCREEN_ONBOARDING.has(screen);

  void showHeader;
  void canGoBack;

  const content = (
    <Suspense fallback={<Fallback />}>
      <ScreenFrame screen={screen} />
    </Suspense>
  );

  if (isTabScreen && showTabBar) {
    return <AppShell>{content}</AppShell>;
  }

  if (isOnboardingFullscreen) {
    return <View style={{ flex: 1 }}>{content}</View>;
  }

  return <View style={{ flex: 1 }}>{content}</View>;
}
