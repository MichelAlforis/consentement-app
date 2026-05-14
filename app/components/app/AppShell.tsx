'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import type { GainedCard } from '../../lib/computeGainedCards';
import { collectorCards } from '../../data/cards-collector';
import { useUnlockStore } from '../../stores/unlockStore';
import { FlipRevealOverlay } from '../ui/FlipRevealOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { TabBar } from '../ui/TabBar';
import { Toast } from '../ui';
import { GrainOverlay } from '../ui/ThemeEffects';
import { useTheme } from '../../context/ThemeContext';
import { logger } from '../../lib/logger';
import { getPlatform, isCapacitor } from '../../lib/platform';
import { isAdultApp } from '../../lib/appVariant';
import { screenMeta } from '../../config/screenMeta';
import { safeScreenForAccess } from '../../lib/accessControl';
import {
  useAuthStore,
  useNavigationStore,
  useSettingsStore,
  useProfileStore,
  usePremiumStore,
  selectCurrentScreen,
  selectCanGoBack,
  selectShowTabBar,
  selectIsTabContext,
} from '../../stores';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useHeat } from '../../context/HeatContext';
import { usePalierUp } from '../../lib/usePalierUp';
import { HeatThermometer, PalierUpOverlay } from '../ui';
import { DURATION } from '../../constants/motion';
import { HeaderController } from './HeaderController';
import { RouteRenderer } from './RouteRenderer';
import { AdController } from './AdController';
import { DevBar } from './DevBar';
import { ScreenLoader } from './ScreenLoader';
import { SplashScreen } from './SplashScreen';

function useAndroidBackButton() {
  const { goBack } = useNavigationStore();
  const canGoBack = useNavigationStore(selectCanGoBack);
  const goBackRef = useRef(goBack);

  useEffect(() => { goBackRef.current = goBack; }, [goBack]);

  useEffect(() => {
    if (!isCapacitor()) return;
    let cleanup: (() => void) | undefined;
    import('@capacitor/app')
      .then(({ App }) => App.addListener('backButton', () => {
        if (canGoBack) goBackRef.current();
      }))
      .then((handle) => { cleanup = () => handle.remove(); })
      .catch((err) => logger.warn('Capacitor back button unavailable', err));
    return () => cleanup?.();
  }, [canGoBack]);
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
  const currentScreen = useNavigationStore(selectCurrentScreen);
  const activeTab = useNavigationStore((s) => s.activeTab);
  const showTabBar = useNavigationStore(selectShowTabBar);
  const isTabContext = useNavigationStore(selectIsTabContext);
  const { navigateTo, replaceWith, goBack, switchTab } = useNavigationStore();
  const { isAdult, isHydrated, userName, setAgeGroup, authenticate } = useAuthStore();
  const onboardingStatus = useModuleProgressStore((s) => s.onboardingStatus);
  const hasOnboarded = onboardingStatus !== 'not_started';
  const { themeMode, selectTheme } = useSettingsStore();
  const { personalProfile, updateComfortLevel, updateSafeword } = useProfileStore();
  const { isPremium, activatePremium, deactivatePremium } = usePremiumStore();

  useAndroidBackButton();
  useAppDiagnostics(currentScreen);

  // Sync explicit mode avec le niveau de chaleur — force OFF si palier < 2
  const { level: heatLevel, points: heatPoints } = useHeat();
  const syncExplicitWithHeat = useSettingsStore((s) => s.syncExplicitWithHeat);
  useEffect(() => { syncExplicitWithHeat(heatLevel); }, [heatLevel, syncExplicitWithHeat]);

  const { justUnlocked, clear } = usePalierUp(heatLevel);

  // Déblocage des cartes lexique au franchissement d'un palier heat
  const unlockCardsStore = useUnlockStore((s) => s.unlockCards);
  const [pendingHeatCards, setPendingHeatCards] = useState<GainedCard[]>([]);
  const prevHeatRef = useRef(heatLevel);
  useEffect(() => {
    if (heatLevel <= prevHeatRef.current) { prevHeatRef.current = heatLevel; return; }
    prevHeatRef.current = heatLevel;
    const owned = new Set(useUnlockStore.getState().ownedCards.map((c) => c.id));
    const toUnlock = collectorCards.filter(
      (c) => c.unlockedBy === `heat-${heatLevel}` && !owned.has(c.id),
    );
    if (!toUnlock.length) return;
    unlockCardsStore(toUnlock.map((c) => ({
      id: c.id, rarity: c.rarity,
      gainedOn: new Date().toISOString(),
      unlockedBy: `heat-${heatLevel}`,
    })));
    setPendingHeatCards(toUnlock.map((c) => ({
      id: c.id, text: c.text, theme: c.theme,
      rarity: c.rarity, gradient: c.visual.gradient,
      iconName: c.visual.iconName, border: c.visual.border,
    })));
  }, [heatLevel, unlockCardsStore]);

  // Minimum splash duration — prevents sub-100ms flash on fast devices
  const [minDone, setMinDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Returning-user redirect: store is not persisted, so app always starts on 'onboarding'.
  // If the user has already onboarded, skip the wizard and go directly to the tab layout.
  useEffect(() => {
    if (isTabContext) return; // already in tab context
    if (!hasOnboarded) return;

    if (isAdultApp) {
      if (userName) replaceWith('home');
      return;
    }
    if (themeMode && (userName || isAdult === false)) {
      replaceWith('home');
    }
  }, [isTabContext, isAdult, themeMode, userName, hasOnboarded, replaceWith]);

  // If a returning user somehow lands in tab context without completing onboarding, send back.
  useEffect(() => {
    if (!isTabContext) return;
    if (!hasOnboarded) replaceWith('onboarding');
  }, [isTabContext, hasOnboarded, replaceWith]);

  // Legacy route redirect + adult-only guard
  useEffect(() => {
    const legacyReplacement = screenMeta[currentScreen]?.legacy?.replacement;
    if (legacyReplacement) {
      replaceWith(legacyReplacement);
      return;
    }
    const safeScreen = safeScreenForAccess(currentScreen, { isAdult });
    if (safeScreen !== currentScreen) {
      replaceWith(safeScreen);
    }
  }, [currentScreen, isAdult, replaceWith]);

  const showSplash = !isHydrated || !minDone;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <AnimatePresence>
        {justUnlocked && (
          <PalierUpOverlay key={`palier-${justUnlocked}`} level={justUnlocked} onDismiss={clear} />
        )}
        {!justUnlocked && pendingHeatCards.length > 0 && (
          <FlipRevealOverlay
            key="heat-lexique-reveal"
            cards={pendingHeatCards}
            onDone={() => setPendingHeatCards([])}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-dvh flex flex-col" style={{ background: theme.colors.bgGradient }}>
          <HeaderController isAdult={isAdult} theme={theme} />

          <div className="flex-1 flex overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
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

            {/* Sidebar thermomètre — visible sur tous les onglets sauf Settings */}
            <AnimatePresence>
              {showTabBar && currentScreen !== 'settings' && (
                <motion.div
                  key="heat-sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: DURATION.normal }}
                  className="flex-shrink-0 py-3"
                  style={{ borderLeft: `1px solid ${theme.colors.border}` }}
                >
                  <HeatThermometer points={heatPoints} sidebar />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {showTabBar && (
            <TabBar activeTab={activeTab} onSwitchTab={switchTab} />
          )}

          <AdController />
          {theme.effects.grain && <GrainOverlay />}
          <Toast />

          {process.env.NODE_ENV === 'development' && (
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
      )}
    </>
  );
}
