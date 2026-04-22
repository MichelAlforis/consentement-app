'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/ui';
import { ThemeProvider } from './context/ThemeContext';
import { GrainOverlay } from './components/ui/ThemeEffects';
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
  PornoVsRealiteScreen,
  LoiConsentementScreen,
  QuizConsentementScreen,
  AccompagnementMineurScreen,
  GamesHubScreen,
  DiceGameScreen,
  GooseGameScreen,
  CardGameScreen,
  PremiumScreen,
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
    isPremium,
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
    activatePremium,
    deactivatePremium,
  } = useAppState();

  if (!themeMode || !theme) {
    return <ThemeSelectScreen onSelectTheme={selectTheme} isPremium={isPremium} onGoPremium={() => { selectTheme('warm'); navigateTo('premium'); }} />;
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

      case 'porno-vs-realite':
        return <PornoVsRealiteScreen onBack={goBack} />;

      case 'loi-consentement':
        return <LoiConsentementScreen />;

      case 'quiz-consentement':
        return <QuizConsentementScreen />;

      case 'accompagnement-mineur':
        return <AccompagnementMineurScreen onNavigate={navigateTo} />;

      case 'jeux':
        return <GamesHubScreen onNavigate={navigateTo} isPremium={isPremium} isAdult={isAdult ?? false} onGoPremium={() => navigateTo('premium')} />;

      case 'jeu-des':
        return <DiceGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'jeu-oie':
        return <GooseGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'jeu-cartes':
        return <CardGameScreen isPremium={isPremium} isAdult={isAdult ?? false} />;

      case 'theme-select':
        return <ThemeSelectScreen
          onSelectTheme={(mode) => { selectTheme(mode); navigateTo(isAdult ? 'home-adult' : 'home-minor'); }}
          isPremium={isPremium}
          onGoPremium={() => navigateTo('premium')}
        />;

      case 'premium':
        return <PremiumScreen onActivate={() => { activatePremium(); navigateTo('theme-select'); }} onBack={goBack} />;

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
      case 'porno-vs-realite':
        return 'Porno vs. Réalité';
      case 'loi-consentement':
        return 'La Loi';
      case 'quiz-consentement':
        return 'Quiz';
      case 'accompagnement-mineur':
        return 'Je me pose des questions';
      case 'jeux':
        return 'Jeux';
      case 'jeu-des':
        return 'Le Dé du Consentement';
      case 'jeu-oie':
        return "Jeu de l'Oie";
      case 'jeu-cartes':
        return 'Cartes à tirer';
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
    <ThemeProvider theme={theme}>
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
            {...(theme.effects.pageTransition === 'fade'
              ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: 'easeInOut' } }
              : theme.effects.pageTransition === 'drift'
                ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
                : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
            )}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grain cinématographique — thème Nude */}
      {theme.effects.grain && <GrainOverlay />}

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
            onClick={() => isPremium ? deactivatePremium() : navigateTo('premium')}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              isPremium
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {isPremium ? '★ Premium ON' : 'Premium'}
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
    </ThemeProvider>
  );
}
