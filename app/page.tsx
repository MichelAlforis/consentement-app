'use client';

import { lazy, Suspense, useEffect, useRef } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header, Toast, AdBanner } from './components/ui';
import { Screen } from './types';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { GrainOverlay } from './components/ui/ThemeEffects';
import { useTheme } from './context/ThemeContext';
import { useTranslation } from './i18n';
import { isCapacitor } from './lib/platform';
import {
  useNavigationStore,
  useAuthStore,
  useSettingsStore,
  useProfileStore,
  usePremiumStore,
  useDuoStore,
  selectShowHeader,
  selectCanGoBack,
  resetAllData,
} from './stores';

// ─── Lazy screen imports (code splitting automatique) ────────────────────────

const WelcomeScreen = lazy(() => import('./components/screens/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const AgeCheckScreen = lazy(() => import('./components/screens/AgeCheckScreen').then(m => ({ default: m.AgeCheckScreen })));
const AuthScreen = lazy(() => import('./components/screens/AuthScreen').then(m => ({ default: m.AuthScreen })));
const HomeScreen = lazy(() => import('./components/screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const SettingsScreen = lazy(() => import('./components/screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const PersonalSpaceScreen = lazy(() => import('./components/screens/PersonalSpaceScreen').then(m => ({ default: m.PersonalSpaceScreen })));
const DuoSpaceScreen = lazy(() => import('./components/screens/DuoSpace').then(m => ({ default: m.DuoSpaceScreen })));
const LearnScreen = lazy(() => import('./components/screens/LearnScreen').then(m => ({ default: m.LearnScreen })));
const HelpScreen = lazy(() => import('./components/screens/HelpScreen').then(m => ({ default: m.HelpScreen })));
const PornoVsRealiteScreen = lazy(() => import('./components/screens/PornoVsRealiteScreen').then(m => ({ default: m.PornoVsRealiteScreen })));
const LoiConsentementScreen = lazy(() => import('./components/screens/LoiConsentementScreen').then(m => ({ default: m.LoiConsentementScreen })));
const QuizConsentementScreen = lazy(() => import('./components/screens/QuizConsentementScreen').then(m => ({ default: m.QuizConsentementScreen })));
const AccompagnementMineurScreen = lazy(() => import('./components/screens/AccompagnementMineurScreen').then(m => ({ default: m.AccompagnementMineurScreen })));
const ResourcesMinorScreen = lazy(() => import('./components/screens/ResourcesMinorScreen').then(m => ({ default: m.ResourcesMinorScreen })));
const GamesHubScreen = lazy(() => import('./components/screens/GamesHubScreen').then(m => ({ default: m.GamesHubScreen })));
const DiceGameScreen = lazy(() => import('./components/screens/DiceGame').then(m => ({ default: m.DiceGameScreen })));
const GooseGameScreen = lazy(() => import('./components/screens/GooseGameScreen').then(m => ({ default: m.GooseGameScreen })));
const CardGameScreen = lazy(() => import('./components/screens/CardGame').then(m => ({ default: m.CardGameScreen })));
const HallOfCardsScreen = lazy(() => import('./components/screens/HallOfCardsScreen').then(m => ({ default: m.HallOfCardsScreen })));
const ThemeSelectScreen = lazy(() => import('./components/screens/ThemeSelectScreen').then(m => ({ default: m.ThemeSelectScreen })));
const PremiumScreen = lazy(() => import('./components/screens/PremiumScreen').then(m => ({ default: m.PremiumScreen })));

// Screens affichant une bannière publicitaire (freemium uniquement)
const AD_SCREENS: Screen[] = [
  'learn', 'scenarios-minor', 'feelings',
  'resources-minor', 'porno-vs-realite', 'loi-consentement', 'quiz-consentement', 'accompagnement-mineur',
  'jeux',
];

// ─── Loading fallback ────────────────────────────────────────────────────────

function ScreenLoader() {
  const { colors } = useTheme();
  return (
    <div className="min-h-dvh p-5 pt-8 space-y-4" style={{ background: colors.bgPrimary }}>
      <div className="skeleton h-5 w-2/5 rounded-2xl" />
      <div className="skeleton h-4 w-3/5 rounded-xl" />
      <div className="skeleton h-28 rounded-3xl mt-4" />
      <div className="skeleton h-28 rounded-3xl" />
      <div className="skeleton h-28 rounded-3xl" />
    </div>
  );
}

// ─── Android back button hook ────────────────────────────────────────────────

function useAndroidBackButton() {
  const { goBack } = useNavigationStore();
  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const goBackRef = useRef(goBack);

  useEffect(() => { goBackRef.current = goBack; }, [goBack]);

  useEffect(() => {
    if (!isCapacitor()) return;
    let cleanup: (() => void) | undefined;
    const noBack = ['welcome', 'age-check', 'home'];
    import('@capacitor/app').then(({ App }) => {
      App.addListener('backButton', () => {
        if (!noBack.includes(currentScreen)) {
          goBackRef.current();
        }
      }).then((handle) => { cleanup = () => handle.remove(); });
    });
    return () => cleanup?.();
  }, [currentScreen]);
}

// ─── App shell ───────────────────────────────────────────────────────────────

function AppShell() {
  const theme = useTheme();
  const { t } = useTranslation();

  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const { navigateTo, goBack } = useNavigationStore();
  const { isAdult, handleAgeSelect, handleAuth } = useAuthStore();
  const { themeMode, selectTheme } = useSettingsStore();
  const { personalProfile } = useProfileStore();
  const { updateComfortLevel, updateSafeword } = useProfileStore();
  const { isPremium, activatePremium, deactivatePremium } = usePremiumStore();

  useAndroidBackButton();

  // Hard block : redirige les mineurs hors des écrans réservés aux adultes
  const ADULT_ONLY: Screen[] = ['personal-space', 'duo-space'];
  useEffect(() => {
    if (isAdult === false && ADULT_ONLY.includes(currentScreen)) {
      navigateTo('home');
    }
  }, [currentScreen, isAdult]); // eslint-disable-line react-hooks/exhaustive-deps

  const showHeader = selectShowHeader(currentScreen);
  const canGoBack = selectCanGoBack(currentScreen);

  if (!themeMode) {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <ThemeSelectScreen
          onSelectTheme={selectTheme}
          isPremium={isPremium}
          onGoPremium={() => { selectTheme('warm'); navigateTo('premium'); }}
        />
      </Suspense>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;

      case 'age-check':
        return (
          <AgeCheckScreen
            onSelectMinor={() => handleAgeSelect(false, selectTheme)}
            onSelectAdult={() => handleAgeSelect(true, selectTheme)}
          />
        );

      case 'auth':
        return <AuthScreen onAuth={handleAuth} />;

      case 'home':
        return (
          <HomeScreen
            isAdult={isAdult}
            userName={useAuthStore.getState().userName}
            onNavigate={navigateTo}
          />
        );

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
        return <PornoVsRealiteScreen onBack={() => goBack()} />;

      case 'loi-consentement':
        return <LoiConsentementScreen />;

      case 'quiz-consentement':
        return <QuizConsentementScreen />;

      case 'accompagnement-mineur':
        return <AccompagnementMineurScreen onNavigate={navigateTo} />;

      case 'jeux':
        return (
          <GamesHubScreen
            onNavigate={navigateTo}
            isPremium={isPremium}
            isAdult={isAdult ?? false}
            onGoPremium={() => navigateTo('premium')}
          />
        );

      case 'jeu-des':
        return <DiceGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'jeu-oie':
        return <GooseGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'jeu-cartes':
        return <CardGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'hall-of-cards':
        return <HallOfCardsScreen isPremium={isPremium} isAdult={isAdult ?? false} onNavigate={navigateTo} />;

      case 'theme-select':
        return (
          <ThemeSelectScreen
            onSelectTheme={(mode) => { selectTheme(mode); navigateTo('home'); }}
            isPremium={isPremium}
            onGoPremium={() => navigateTo('premium')}
          />
        );

      case 'premium':
        return (
          <PremiumScreen
            onActivate={() => { activatePremium(); navigateTo('theme-select'); }}
            onBack={() => goBack()}
          />
        );

      default:
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'settings': return t('headers.settings');
      case 'resources-minor': return t('headers.resourcesMinor');
      case 'personal-space': return t('headers.personalSpace');
      case 'duo-space': return t('headers.duoSpace');
      case 'learn':
      case 'scenarios-minor':
      case 'feelings': return t('headers.learn');
      case 'help': return t('headers.help');
      case 'porno-vs-realite': return t('headers.pornoVsRealite');
      case 'loi-consentement': return t('headers.loi');
      case 'quiz-consentement': return t('headers.quiz');
      case 'accompagnement-mineur': return t('headers.accompagnement');
      case 'jeux': return t('headers.games');
      case 'jeu-des': return t('headers.jeuDes');
      case 'jeu-oie': return t('headers.jeuOie');
      case 'jeu-cartes': return t('headers.jeuCartes');
      case 'hall-of-cards': return t('headers.hallOfCards');
      default: return isAdult ? t('headers.defaultAdult') : t('headers.defaultMinor');
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentScreen) {
      case 'personal-space': return t('headers.personalSubtitle');
      case 'duo-space': return t('headers.duoSubtitle');
      default: return undefined;
    }
  };

  const pageTransition =
    theme.effects.pageTransition === 'fade'
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: 'easeInOut' } }
      : theme.effects.pageTransition === 'drift'
        ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
        : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: theme.colors.bgGradient }}>
      <AnimatePresence>
        {showHeader && (
          <Header
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            showBack={canGoBack}
            onBack={() => goBack()}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={currentScreen} {...pageTransition}>
            <Suspense fallback={<ScreenLoader />}>
              <ErrorBoundary label={currentScreen}>
                {renderScreen()}
              </ErrorBoundary>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {!isPremium && AD_SCREENS.includes(currentScreen) && (
        <AdBanner onGoPremium={() => navigateTo('premium')} />
      )}

      {theme.effects.grain && <GrainOverlay />}
      <Toast />

      {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') && (
        <DevBar
          isPremium={isPremium}
          navigateTo={navigateTo}
          handleAgeSelect={(adult) => handleAgeSelect(adult, selectTheme)}
          handleAuth={handleAuth}
          activatePremium={activatePremium}
          deactivatePremium={deactivatePremium}
          theme={theme}
        />
      )}
    </div>
  );
}

// ─── Dev toolbar ─────────────────────────────────────────────────────────────

function DevBar({ isPremium, navigateTo, handleAgeSelect, handleAuth, activatePremium, deactivatePremium, theme }: {
  isPremium: boolean;
  navigateTo: (screen: import('./types').Screen) => void;
  handleAgeSelect: (adult: boolean) => void;
  handleAuth: (name: string) => void;
  activatePremium: () => void;
  deactivatePremium: () => void;
  theme: import('./types/theme').Theme;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-3 safe-area-bottom"
      style={{ background: theme.colors.bgCard, borderTop: `1px solid ${theme.colors.divider}` }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <button onClick={() => navigateTo('welcome')} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">{t('devBar.home')}</button>
        <button onClick={() => handleAgeSelect(false)} className="px-3 py-1.5 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">{t('devBar.modeMinor')}</button>
        <button onClick={() => { handleAgeSelect(true); handleAuth('Demo'); }} className="px-3 py-1.5 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">{t('devBar.modeAdult')}</button>
        <button
          onClick={() => isPremium ? deactivatePremium() : navigateTo('premium')}
          className={`px-3 py-1.5 text-xs rounded-full transition-colors ${isPremium ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        >
          {isPremium ? t('devBar.premiumOn') : t('devBar.premium')}
        </button>
        <button onClick={resetAllData} className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">{t('devBar.reset')}</button>
      </div>
      <p className="text-center text-xs" style={{ color: theme.colors.textMuted }}>{t('devBar.demo')}</p>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ConsentementApp() {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
  }

  return (
    <ErrorBoundary label="root">
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppShell />
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
