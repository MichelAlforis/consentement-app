'use client';

import { lazy, Suspense, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header, Toast } from './components/ui';
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
const HomeMinorScreen = lazy(() => import('./components/screens/HomeMinorScreen').then(m => ({ default: m.HomeMinorScreen })));
const HomeAdultScreen = lazy(() => import('./components/screens/HomeAdultScreen').then(m => ({ default: m.HomeAdultScreen })));
const PersonalSpaceScreen = lazy(() => import('./components/screens/PersonalSpaceScreen').then(m => ({ default: m.PersonalSpaceScreen })));
const DuoSpaceScreen = lazy(() => import('./components/screens/DuoSpace').then(m => ({ default: m.DuoSpaceScreen })));
const LearnScreen = lazy(() => import('./components/screens/LearnScreen').then(m => ({ default: m.LearnScreen })));
const HelpScreen = lazy(() => import('./components/screens/HelpScreen').then(m => ({ default: m.HelpScreen })));
const PornoVsRealiteScreen = lazy(() => import('./components/screens/PornoVsRealiteScreen').then(m => ({ default: m.PornoVsRealiteScreen })));
const LoiConsentementScreen = lazy(() => import('./components/screens/LoiConsentementScreen').then(m => ({ default: m.LoiConsentementScreen })));
const QuizConsentementScreen = lazy(() => import('./components/screens/QuizConsentementScreen').then(m => ({ default: m.QuizConsentementScreen })));
const AccompagnementMineurScreen = lazy(() => import('./components/screens/AccompagnementMineurScreen').then(m => ({ default: m.AccompagnementMineurScreen })));
const GamesHubScreen = lazy(() => import('./components/screens/GamesHubScreen').then(m => ({ default: m.GamesHubScreen })));
const DiceGameScreen = lazy(() => import('./components/screens/DiceGame').then(m => ({ default: m.DiceGameScreen })));
const GooseGameScreen = lazy(() => import('./components/screens/GooseGameScreen').then(m => ({ default: m.GooseGameScreen })));
const CardGameScreen = lazy(() => import('./components/screens/CardGame').then(m => ({ default: m.CardGameScreen })));
const ThemeSelectScreen = lazy(() => import('./components/screens/ThemeSelectScreen').then(m => ({ default: m.ThemeSelectScreen })));
const PremiumScreen = lazy(() => import('./components/screens/PremiumScreen').then(m => ({ default: m.PremiumScreen })));

// ─── Loading fallback ────────────────────────────────────────────────────────

function ScreenLoader() {
  return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
}

// ─── Android back button hook ────────────────────────────────────────────────

function useAndroidBackButton() {
  const { goBack } = useNavigationStore();
  const { isAdult } = useAuthStore();
  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const goBackRef = useRef(goBack);
  const isAdultRef = useRef(isAdult);

  useEffect(() => { goBackRef.current = goBack; }, [goBack]);
  useEffect(() => { isAdultRef.current = isAdult; }, [isAdult]);

  useEffect(() => {
    if (!isCapacitor()) return;
    let cleanup: (() => void) | undefined;
    const noBack = ['welcome', 'age-check', 'home-minor', 'home-adult'];
    import('@capacitor/app').then(({ App }) => {
      App.addListener('backButton', () => {
        if (!noBack.includes(currentScreen)) {
          goBackRef.current(isAdultRef.current);
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

      case 'home-minor':
        return <HomeMinorScreen onNavigate={navigateTo} />;

      case 'home-adult':
        return <HomeAdultScreen userName={useAuthStore.getState().userName} onNavigate={navigateTo} />;

      case 'personal-space':
        return (
          <PersonalSpaceScreen
            profile={personalProfile}
            onUpdateLevel={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onSave={() => goBack(isAdult)}
          />
        );

      case 'duo-space':
        return (
          <DuoSpaceScreen
            personalProfile={personalProfile}
            onUpdateComfort={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onBack={() => goBack(isAdult)}
          />
        );

      case 'learn':
      case 'scenarios-minor':
      case 'feelings':
        return <LearnScreen />;

      case 'help':
        return <HelpScreen />;

      case 'porno-vs-realite':
        return <PornoVsRealiteScreen onBack={() => goBack(isAdult)} />;

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

      case 'theme-select':
        return (
          <ThemeSelectScreen
            onSelectTheme={(mode) => { selectTheme(mode); navigateTo(isAdult ? 'home-adult' : 'home-minor'); }}
            isPremium={isPremium}
            onGoPremium={() => navigateTo('premium')}
          />
        );

      case 'premium':
        return (
          <PremiumScreen
            onActivate={() => { activatePremium(); navigateTo('theme-select'); }}
            onBack={() => goBack(isAdult)}
          />
        );

      default:
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
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
            onBack={() => goBack(isAdult)}
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

      {theme.effects.grain && <GrainOverlay />}
      <Toast />

      {process.env.NODE_ENV === 'development' && (
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
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppShell />
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
