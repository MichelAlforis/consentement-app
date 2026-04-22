'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Language } from '../types';
import { useSettingsStore } from '../stores/settingsStore';

interface LanguageContextValue {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  changeLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language, changeLanguage } = useSettingsStore();
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
