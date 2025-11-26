'use client';

import { useState, useCallback, useEffect } from 'react';
import { Screen, PersonalProfile, PartnerProfile, CommonGround } from '../types';
import { ThemeMode, themes, Theme } from '../types/theme';
import { comfortCategories, initialPersonalProfile } from '../data';

// Clés localStorage
const STORAGE_KEYS = {
  theme: 'consentement_theme',
  isAdult: 'consentement_isAdult',
  userName: 'consentement_userName',
  profile: 'consentement_profile',
} as const;

// Helper pour lire depuis localStorage
function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper pour écrire dans localStorage
function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export function useAppState() {
  // États globaux avec persistance
  const [themeMode, setThemeMode] = useState<ThemeMode | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userName, setUserName] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydratation depuis localStorage au montage
  useEffect(() => {
    const storedTheme = getStoredValue<ThemeMode | null>(STORAGE_KEYS.theme, null);
    const storedIsAdult = getStoredValue<boolean | null>(STORAGE_KEYS.isAdult, null);
    const storedUserName = getStoredValue<string>(STORAGE_KEYS.userName, '');
    const storedProfile = getStoredValue<PersonalProfile>(STORAGE_KEYS.profile, initialPersonalProfile);

    if (storedTheme) setThemeMode(storedTheme);
    if (storedIsAdult !== null) {
      setIsAdult(storedIsAdult);
      setIsAuthenticated(storedIsAdult && storedUserName !== '');
      if (storedIsAdult && storedUserName) {
        setCurrentScreen('home-adult');
      } else if (storedIsAdult === false) {
        setCurrentScreen('home-minor');
      }
    }
    if (storedUserName) setUserName(storedUserName);
    if (storedProfile) setPersonalProfile(storedProfile);

    setIsHydrated(true);
  }, []);

  // Theme
  const theme: Theme | null = themeMode ? themes[themeMode] : null;

  const selectTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    setStoredValue(STORAGE_KEYS.theme, mode);
  }, []);

  // États Espace Perso
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>(initialPersonalProfile);

  // États Espace Duo
  const [duoConnected, setDuoConnected] = useState(false);
  const [duoCode, setDuoCode] = useState('');
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Navigation
  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const goBack = useCallback(() => {
    if (isAdult) {
      setCurrentScreen('home-adult');
    } else {
      setCurrentScreen('home-minor');
    }
  }, [isAdult]);

  // Auth
  const handleAgeSelect = useCallback((adult: boolean) => {
    setIsAdult(adult);
    setStoredValue(STORAGE_KEYS.isAdult, adult);
    if (adult) {
      setCurrentScreen('auth');
    } else {
      setCurrentScreen('home-minor');
    }
  }, []);

  const handleAuth = useCallback((name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    setStoredValue(STORAGE_KEYS.userName, name);
    setCurrentScreen('home-adult');
  }, []);

  // Profile
  const updateComfortLevel = useCallback((
    category: 'tenderness' | 'intensity' | 'trust',
    itemId: string,
    value: number
  ) => {
    setPersonalProfile(prev => {
      const newProfile = {
        ...prev,
        [category]: { ...prev[category], [itemId]: value }
      };
      setStoredValue(STORAGE_KEYS.profile, newProfile);
      return newProfile;
    });
  }, []);

  const updateSafeword = useCallback((safeword: string) => {
    setPersonalProfile(prev => {
      const newProfile = { ...prev, safeword };
      setStoredValue(STORAGE_KEYS.profile, newProfile);
      return newProfile;
    });
  }, []);

  // Duo - Générateur de profil partenaire réaliste
  const generatePartnerProfile = useCallback((): PartnerProfile => {
    const profile: PartnerProfile = { tenderness: {}, intensity: {}, trust: {} };

    // Créer un profil réaliste basé sur des patterns cohérents
    // Le partenaire a un "style" de base qui influence toutes ses réponses
    const baseComfort = Math.random() > 0.5 ? 3 : 2; // Plutôt à l'aise ou curieux
    const variance = () => Math.floor(Math.random() * 2) - 1; // -1, 0, ou 1

    (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach(cat => {
      // Chaque catégorie a un modificateur propre
      const categoryMod = cat === 'tenderness' ? 1 : cat === 'intensity' ? 0 : -1;

      comfortCategories[cat].items.forEach(item => {
        // Certains items sont généralement plus acceptés
        let itemMod = 0;
        if (['kisses', 'cuddles', 'holding', 'words'].includes(item.id)) itemMod = 1;
        if (['filming', 'power', 'restraint'].includes(item.id)) itemMod = -1;

        const value = Math.max(0, Math.min(4, baseComfort + categoryMod + itemMod + variance()));
        profile[cat][item.id] = value;
      });
    });
    return profile;
  }, []);

  const connectDuo = useCallback((code: string) => {
    if (code.length === 6) {
      setDuoConnected(true);
      setPartnerProfile(generatePartnerProfile());
    }
  }, [generatePartnerProfile]);

  const updateDuoCode = useCallback((code: string) => {
    setDuoCode(code.replace(/\D/g, ''));
  }, []);

  // Common ground calculation
  const getCommonGround = useCallback((): CommonGround | null => {
    if (!partnerProfile) return null;

    const common: CommonGround = { tenderness: {}, intensity: {}, trust: {} };

    (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach(cat => {
      comfortCategories[cat].items.forEach(item => {
        const myLevel = personalProfile[cat][item.id] || 0;
        const partnerLevel = partnerProfile[cat][item.id] || 0;
        common[cat][item.id] = {
          level: Math.min(myLevel, partnerLevel),
          compatible: myLevel >= 2 && partnerLevel >= 2
        };
      });
    });

    return common;
  }, [personalProfile, partnerProfile]);

  // Screen helpers
  const showHeader = !['welcome', 'age-check', 'auth'].includes(currentScreen);
  const canGoBack = !['welcome', 'age-check', 'home-minor', 'home-adult'].includes(currentScreen);

  // Reset toutes les données
  const resetAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setThemeMode(null);
    setIsAuthenticated(false);
    setIsAdult(null);
    setCurrentScreen('welcome');
    setUserName('');
    setPersonalProfile(initialPersonalProfile);
    setDuoConnected(false);
    setDuoCode('');
    setPartnerProfile(null);
    setShowComparison(false);
  }, []);

  return {
    // State
    themeMode,
    theme,
    isAuthenticated,
    isAdult,
    currentScreen,
    userName,
    personalProfile,
    duoConnected,
    duoCode,
    partnerProfile,
    showComparison,
    isHydrated,

    // Screen helpers
    showHeader,
    canGoBack,

    // Actions
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
  };
}

export type AppStateReturn = ReturnType<typeof useAppState>;
