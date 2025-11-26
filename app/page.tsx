'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/ui';
import {
  ThemeSelectScreen,
  WelcomeScreen,
  AgeCheckScreen,
  AuthScreen,
  HomeMinorScreen,
  HomeAdultScreen,
  PersonalSpaceScreen,
  DuoSpaceScreen,
  LearnScreen,
  HelpScreen,
} from './components/screens';

export default function ConsentementApp() {
  const {
    themeMode,
    theme,
    isAdult,
    currentScreen,
    userName,
    personalProfile,
    duoConnected,
    duoCode,
    showComparison,
    showHeader,
    canGoBack,
    isHydrated,
    selectTheme,
    navigateTo,
    goBack,
    handleAgeSelect,
    handleAuth,
    updateComfortLevel,
    updateSafeword,
    connectDuo,
    updateDuoCode,
    setShowComparison,
    getCommonGround,
    resetAllData,
  } = useAppState();

  // Si pas de thème sélectionné, afficher la sélection de thème
  if (!themeMode || !theme) {
    return <ThemeSelectScreen onSelectTheme={selectTheme} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={() => navigateTo('age-check')}
          />
        );

      case 'age-check':
        return (
          <AgeCheckScreen
            onSelectMinor={() => handleAgeSelect(false)}
            onSelectAdult={() => handleAgeSelect(true)}
          />
        );

      case 'auth':
        return <AuthScreen onAuth={handleAuth} />;

      case 'home-minor':
        return <HomeMinorScreen onNavigate={navigateTo} />;

      case 'home-adult':
        return <HomeAdultScreen userName={userName} onNavigate={navigateTo} />;

      case 'personal-space':
        return (
          <PersonalSpaceScreen
            profile={personalProfile}
            onUpdateLevel={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onSave={goBack}
          />
        );

      case 'duo-space':
        return (
          <DuoSpaceScreen
            personalProfile={personalProfile}
            onUpdateComfort={updateComfortLevel}
            onUpdateSafeword={updateSafeword}
            onBack={goBack}
          />
        );

      case 'learn':
      case 'scenarios-minor':
      case 'feelings':
        return <LearnScreen />;

      case 'help':
        return <HelpScreen />;

      default:
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'personal-space':
        return 'Mon Espace';
      case 'duo-space':
        return 'Notre Espace';
      case 'learn':
      case 'scenarios-minor':
      case 'feelings':
        return 'Comprendre';
      case 'help':
        return 'Aide';
      default:
        return isAdult ? 'Mon Espace' : 'Espace Éducatif';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentScreen) {
      case 'personal-space':
        return 'Profil de confort';
      case 'duo-space':
        return 'Dialogue à deux';
      default:
        return undefined;
    }
  };

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: theme.colors.bgGradient }}
    >
      {/* Header */}
      <AnimatePresence>
        {showHeader && (
          <Header
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            showBack={canGoBack}
            onBack={goBack}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 py-4 text-center text-xs safe-area-bottom"
        style={{
          color: theme.colors.textMuted,
          background: theme.colors.bgCard,
          borderTop: `1px solid ${theme.colors.divider}`,
        }}
      >
        {isAdult ? (
          <>
            🔒 Données chiffrées •{' '}
            <button
              onClick={resetAllData}
              className="underline cursor-pointer hover:opacity-70 transition-opacity"
            >
              Supprimer mes données
            </button>
          </>
        ) : (
          <>Démo éducative — Aucune donnée collectée</>
        )}
      </motion.div>
    </div>
  );
}
