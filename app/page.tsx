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

      {/* Footer - Navigation démo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-3 safe-area-bottom"
        style={{
          background: theme.colors.bgCard,
          borderTop: `1px solid ${theme.colors.divider}`,
        }}
      >
        {/* Navigation rapide démo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={() => navigateTo('welcome')}
            className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Accueil
          </button>
          <button
            onClick={() => handleAgeSelect(false)}
            className="px-3 py-1.5 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            Mode Ado
          </button>
          <button
            onClick={() => {
              handleAgeSelect(true);
              handleAuth('Demo');
            }}
            className="px-3 py-1.5 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            Mode Adulte
          </button>
          <button
            onClick={resetAllData}
            className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          >
            Reset
          </button>
        </div>
        <p className="text-center text-xs" style={{ color: theme.colors.textMuted }}>
          🎭 Mode démo — Navigation libre
        </p>
      </motion.div>
    </div>
  );
}
