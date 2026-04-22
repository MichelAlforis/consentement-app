'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextValue {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  changeLanguage: () => {},
});

export function LanguageProvider({
  language,
  changeLanguage,
  children,
}: LanguageContextValue & { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
