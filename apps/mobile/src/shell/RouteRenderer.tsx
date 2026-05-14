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
const HelpScreen = lazy(() => import('../components/screens/HelpScreen').then((m) => ({ default: m.HelpScreen })));
const PornoVsRealiteScreen = lazy(() => import('../components/screens/PornoVsRealiteScreen').then((m) => ({ default: m.PornoVsRealiteScreen })));
const LoiConsentementScreen = lazy(() => import('../components/screens/LoiConsentementScreen').then((m) => ({ default: m.LoiConsentementScreen })));
const ResourcesMinorScreen = lazy(() => import('../components/screens/ResourcesMinorScreen').then((m) => ({ default: m.ResourcesMinorScreen })));
const AccompagnementMineurScreen = lazy(() => import('../components/screens/AccompagnementMineurScreen').then((m) => ({ default: m.AccompagnementMineurScreen })));
const AccompagnementAdulteScreen = lazy(() => import('../components/screens/AccompagnementAdulteScreen').then((m) => ({ default: m.AccompagnementAdulteScreen })));
const AnnuaireSexologuesScreen = lazy(() => import('../components/screens/AnnuaireSexologuesScreen').then((m) => ({ default: m.AnnuaireSexologuesScreen })));
const PremiumScreen = lazy(() => import('../components/screens/PremiumScreen').then((m) => ({ default: m.PremiumScreen })));
const QuizHubScreen = lazy(() => import('../components/screens/QuizHub').then((m) => ({ default: m.QuizHubScreen })));
const QuizConsentementScreen = lazy(() => import('../components/screens/QuizConsentement').then((m) => ({ default: m.QuizConsentementScreen })));
const HallOfCardsScreen = lazy(() => import('../components/screens/HallOfCards').then((m) => ({ default: m.HallOfCardsScreen })));
const PersonalSpaceScreen = lazy(() => import('../components/screens/PersonalSpace').then((m) => ({ default: m.PersonalSpaceScreen })));
const DuoSpaceScreen = lazy(() => import('../components/screens/DuoSpace').then((m) => ({ default: m.DuoSpaceScreen })));
const DiceGameScreen = lazy(() => import('../components/screens/DiceGame').then((m) => ({ default: m.DiceGameScreen })));
const JeuxScreen = lazy(() => import('../components/screens/JeuxScreen').then((m) => ({ default: m.JeuxScreen })));

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

    case 'personal-space':
      return <PersonalSpaceScreen />;
    case 'duo-space':
      return <DuoSpaceScreen />;
    case 'jeu-des':
      return <DiceGameScreen isPremium={isPremium} isAdult={isAdult === true} onNavigate={navigateTo} />;
    case 'welcome':
    case 'personal-intro':
    case 'jeux':
      return <JeuxScreen onNavigate={navigateTo} />;
    case 'learn':
    case 'scenarios-minor':
    case 'feelings':
    case 'jeu-oie':
    case 'jeu-cartes':
      return <PlaceholderScreen screen={screen} />;
    case 'hall-of-cards':
      return <HallOfCardsScreen />;
    case 'help':
      return <HelpScreen />;
    case 'resources-minor':
      return <ResourcesMinorScreen />;
    case 'porno-vs-realite':
      return <PornoVsRealiteScreen />;
    case 'loi-consentement':
      return <LoiConsentementScreen />;
    case 'quiz-hub':
      return <QuizHubScreen />;
    case 'quiz-consentement':
      return <QuizConsentementScreen />;
    case 'accompagnement-mineur':
      return <AccompagnementMineurScreen />;
    case 'accompagnement-adulte':
      return <AccompagnementAdulteScreen />;
    case 'annuaire-sexologues':
      return <AnnuaireSexologuesScreen />;
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
      return <PremiumScreen />;
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
