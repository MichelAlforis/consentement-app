'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppState, AppStateReturn } from './hooks/useAppState';
import { Header } from './components/ui';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './i18n';
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

function AppInner(props: AppStateReturn) {
  const { t } = useTranslation();
  const {
    themeMode,
    theme,
    isAdult,
    currentScreen,
    userName,
    personalProfile,
    showComparison,
    showHeader,
    canGoBack,
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
  } = props;

  if (!themeMode || !theme) {
    return (
      <ThemeSelectScreen
        onSelectTheme={selectTheme}
        isPremium={isPremium}
        onGoPremium={() => { selectTheme('warm'); navigateTo('premium'); }}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => navigateTo('age-check')} />;

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
            onBack={goBack}
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
      case 'feelings':
        return t('headers.learn');
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

  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-dvh flex flex-col"
        style={{ background: theme.colors.bgGradient }}
      >
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

        {theme.effects.grain && <GrainOverlay />}

        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 safe-area-bottom"
            style={{
              background: theme.colors.bgCard,
              borderTop: `1px solid ${theme.colors.divider}`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={() => navigateTo('welcome')}
                className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {t('devBar.home')}
              </button>
              <button
                onClick={() => handleAgeSelect(false)}
                className="px-3 py-1.5 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                {t('devBar.modeMinor')}
              </button>
              <button
                onClick={() => { handleAgeSelect(true); handleAuth('Demo'); }}
                className="px-3 py-1.5 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              >
                {t('devBar.modeAdult')}
              </button>
              <button
                onClick={() => isPremium ? deactivatePremium() : navigateTo('premium')}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  isPremium
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {isPremium ? t('devBar.premiumOn') : t('devBar.premium')}
              </button>
              <button
                onClick={resetAllData}
                className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                {t('devBar.reset')}
              </button>
            </div>
            <p className="text-center text-xs" style={{ color: theme.colors.textMuted }}>
              {t('devBar.demo')}
            </p>
          </motion.div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default function ConsentementApp() {
  const appState = useAppState();
  const { language, changeLanguage, isHydrated } = appState;

  if (!isHydrated) {
    return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
  }

  return (
    <LanguageProvider language={language} changeLanguage={changeLanguage}>
      <AppInner {...appState} />
    </LanguageProvider>
  );
}
