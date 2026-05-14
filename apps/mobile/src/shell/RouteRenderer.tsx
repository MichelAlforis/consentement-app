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

const HomeScreen = lazy(() => import('../components/screens/HomeScreen').then((module) => ({ default: module.HomeScreen })));
const ApprendreScreen = lazy(() => import('../components/screens/ApprendreScreen').then((module) => ({ default: module.ApprendreScreen })));
const MoiScreen = lazy(() => import('../components/screens/MoiScreen').then((module) => ({ default: module.MoiScreen })));
const SettingsScreen = lazy(() => import('../components/screens/SettingsScreen').then((module) => ({ default: module.SettingsScreen })));
const OnboardingWizard = lazy(() => import('../components/screens/OnboardingWizard').then((module) => ({ default: module.OnboardingWizard })));
const AgeCheckScreen = lazy(() => import('../components/screens/AgeCheckScreen').then((module) => ({ default: module.AgeCheckScreen })));
const AuthScreen = lazy(() => import('../components/screens/AuthScreen').then((module) => ({ default: module.AuthScreen })));
const ThemeSelectScreen = lazy(() => import('../components/screens/ThemeSelectScreen').then((module) => ({ default: module.ThemeSelectScreen })));
const LanguageScreen = lazy(() => import('../components/screens/LanguageScreen').then((module) => ({ default: module.LanguageScreen })));

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
    case 'module-de-base':
    case 'premium':
    case 'pratiques-base':
    case 'lexique-consent':
    case 'scenarios-quotidiens':
    case 'alcool-consent':
    case 'bdsm-consent':
    case 'sexting':
    case 'pression-manip':
    case 'rupture-harcele':
    case 'content-non-consenti':
    case 'pratiques-explicit':
    case 'zones-grises':
    case 'lgbtq-consent':
    case 'pratiques-avancees':
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
