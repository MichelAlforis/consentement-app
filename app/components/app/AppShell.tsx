'use client';

import { Suspense, useEffect, useRef } from 'react';
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
  const { navigateTo, replaceWith, goBack } = useNavigationStore();
  const { isAdult, userName, setAgeGroup, authenticate } = useAuthStore();
  const onboardingStatus = useModuleProgressStore((s) => s.onboardingStatus);
  const hasOnboarded = onboardingStatus !== 'not_started';
  const { themeMode, selectTheme } = useSettingsStore();
  const { personalProfile, updateComfortLevel, updateSafeword } = useProfileStore();
  const { isPremium, activatePremium, deactivatePremium } = usePremiumStore();

  useAndroidBackButton();
  useAppDiagnostics(currentScreen);

  useEffect(() => {
    if (currentScreen !== 'welcome') return;
    if (isAdultApp) {
      replaceWith(userName ? 'home' : 'auth');
      return;
    }
    if ((isAdult && userName) || isAdult === false) {
      replaceWith('home');
    }
  }, [currentScreen, isAdult, replaceWith, userName]);

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

  if (!themeMode) {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <RouteRenderer
          currentScreen="theme-select"
          isAdult={isAdult}
          hasOnboarded={hasOnboarded}
          userName={userName}
          personalProfile={personalProfile}
          isPremium={isPremium}
          theme={theme}
          navigateTo={navigateTo}
          goBack={goBack}
          selectTheme={selectTheme}
          handleAgeSelect={setAgeGroup}
          handleAuth={authenticate}
          updateComfortLevel={updateComfortLevel}
          updateSafeword={updateSafeword}
          activatePremium={activatePremium}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: theme.colors.bgGradient }}>
      <HeaderController isAdult={isAdult} theme={theme} />

      <div className="flex-1 overflow-y-auto">
        <RouteRenderer
          currentScreen={currentScreen}
          isAdult={isAdult}
          hasOnboarded={hasOnboarded}
          userName={userName}
          personalProfile={personalProfile}
          isPremium={isPremium}
          theme={theme}
          navigateTo={navigateTo}
          goBack={goBack}
          selectTheme={selectTheme}
          handleAgeSelect={setAgeGroup}
          handleAuth={authenticate}
          updateComfortLevel={updateComfortLevel}
          updateSafeword={updateSafeword}
          activatePremium={activatePremium}
        />
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
    </div>
  );
}
