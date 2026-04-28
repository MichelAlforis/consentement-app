'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TabBar } from '../ui/TabBar';
import { Toast } from '../ui';
import { GrainOverlay } from '../ui/ThemeEffects';
import { useTheme } from '../../context/ThemeContext';
import { logger } from '../../lib/logger';
import { getPlatform, isCapacitor } from '../../lib/platform';
import { isAdultApp } from '../../lib/appVariant';
import { getRoute, shouldShowTabBar } from '../../routes';
import { isRootScreen, screenMeta } from '../../config/screenMeta';
import {
  useAuthStore,
  useNavigationStore,
  useSettingsStore,
  useProfileStore,
  usePremiumStore,
} from '../../stores';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { HeaderController } from './HeaderController';
import { RouteRenderer } from './RouteRenderer';
import { AdController } from './AdController';
import { DevBar } from './DevBar';
import { ScreenLoader } from './ScreenLoader';
import { SplashScreen } from './SplashScreen';

function useAndroidBackButton() {
  const { goBack } = useNavigationStore();
  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const goBackRef = useRef(goBack);

  useEffect(() => { goBackRef.current = goBack; }, [goBack]);

  useEffect(() => {
    if (!isCapacitor()) return;
    let cleanup: (() => void) | undefined;
    import('@capacitor/app')
      .then(({ App }) => App.addListener('backButton', () => {
        if (!isRootScreen(currentScreen)) goBackRef.current();
      }))
      .then((handle) => { cleanup = () => handle.remove(); })
      .catch((err) => logger.warn('Capacitor back button unavailable', err));
    return () => cleanup?.();
  }, [currentScreen]);
}

function useAppDiagnostics(currentScreen: string) {
  useEffect(() => {
    logger.setContext({ platform: getPlatform() });
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };
    const onError = (event: ErrorEvent) => {
      logger.error('Global JS error', event.error instanceof Error ? event.error : new Error(event.message));
    };
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    logger.setContext({ screen: currentScreen });
  }, [currentScreen]);
}

export function AppShell() {
  const theme = useTheme();
  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const history = useNavigationStore((s) => s.history);
  const { navigateTo, replaceWith, goBack } = useNavigationStore();
  const { isAdult, isHydrated, userName, setAgeGroup, authenticate } = useAuthStore();
  const onboardingStatus = useModuleProgressStore((s) => s.onboardingStatus);
  const hasOnboarded = onboardingStatus !== 'not_started';
  const { themeMode, selectTheme } = useSettingsStore();
  const { personalProfile, updateComfortLevel, updateSafeword } = useProfileStore();
  const { isPremium, activatePremium, deactivatePremium } = usePremiumStore();

  useAndroidBackButton();
  useAppDiagnostics(currentScreen);

  // Minimum splash duration — prevents sub-100ms flash on fast devices
  const [minDone, setMinDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Returning-user redirect: onboarding is the default starting screen (navigationStore not persisted).
  // history.length === 0 means we're at the initial launch, not navigated here from within the app.
  // hasOnboarded guard prevents a loop: guard redirects 'home'→'onboarding', this effect must not
  // then redirect back to 'home' for a user who hasn't completed onboarding.
  useEffect(() => {
    if (currentScreen !== 'onboarding' && currentScreen !== 'language') return;
    if (history.length > 0) return;
    if (!hasOnboarded) return;

    if (isAdultApp) {
      if (userName) replaceWith('home');
      return;
    }
    if (themeMode && (userName || isAdult === false)) {
      replaceWith('home');
    }
  }, [currentScreen, history.length, isAdult, themeMode, userName, hasOnboarded, replaceWith]);

  // If a returning user somehow lands on home without onboarding, redirect to wizard.
  useEffect(() => {
    if (currentScreen === 'home' && !hasOnboarded) {
      replaceWith('onboarding');
    }
  }, [currentScreen, hasOnboarded, replaceWith]);

  // Legacy routes + adult-only guard
  useEffect(() => {
    const legacyReplacement = screenMeta[currentScreen]?.legacy?.replacement;
    if (legacyReplacement) {
      replaceWith(legacyReplacement);
      return;
    }
    if (isAdult === false && getRoute(currentScreen).requiresAdult) {
      replaceWith('home');
    }
  }, [currentScreen, isAdult, replaceWith]);

  const showSplash = !isHydrated || !minDone;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && <div className="min-h-dvh flex flex-col" style={{ background: theme.colors.bgGradient }}>
      <HeaderController isAdult={isAdult} theme={theme} />

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<ScreenLoader />}>
          <RouteRenderer
            currentScreen={currentScreen}
            isAdult={isAdult}
            hasOnboarded={hasOnboarded}
            userName={userName}
            personalProfile={personalProfile}
            isPremium={isPremium}
            theme={theme}
            navigateTo={navigateTo}
            replaceWith={replaceWith}
            goBack={goBack}
            selectTheme={selectTheme}
            handleAgeSelect={setAgeGroup}
            handleAuth={authenticate}
            updateComfortLevel={updateComfortLevel}
            updateSafeword={updateSafeword}
            activatePremium={activatePremium}
          />
        </Suspense>
      </div>

      {shouldShowTabBar(currentScreen) && <TabBar currentScreen={currentScreen} onNavigate={navigateTo} />}
      <AdController />
      {theme.effects.grain && <GrainOverlay />}
      <Toast />

      {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') && (
        <DevBar
          isPremium={isPremium}
          navigateTo={navigateTo}
          handleAgeSelect={setAgeGroup}
          handleAuth={authenticate}
          deactivatePremium={deactivatePremium}
          theme={theme}
        />
      )}
    </div>}
    </>
  );
}
