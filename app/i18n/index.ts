import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types';

// ─── Locale loader ────────────────────────────────────────────────────────────
// Actuellement : imports TS (locales/*/index.ts)
// Migration JSON : remplacer par import fr from './locales/fr.json' etc.
//                 puis exécuter : node scripts/migrate-locales.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { fr } from './locales/fr';
import { en } from './locales/en';
import { es } from './locales/es';
import type { Translations } from './locales/fr';
import { logger } from '../lib/logger';
import { getNestedValue, interpolate } from './translationUtils';

export const translations: Record<Language, Translations> = {
  fr: fr as unknown as Translations,
  en: en as unknown as Translations,
  es: es as unknown as Translations,
};

const reportedMissingKeys = new Set<string>();

export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = translations[language] ?? translations.fr;
  const fallback = translations.fr;
  const value =
    getNestedValue(dict as unknown as Record<string, unknown>, key) ??
    getNestedValue(fallback as unknown as Record<string, unknown>, key);

  if (value === undefined) {
    const reportKey = `${language}:${key}`;
    if (!reportedMissingKeys.has(reportKey)) {
      reportedMissingKeys.add(reportKey);
      logger.warn('Missing translation key', undefined, { extra: { language, key } });
    }
    return key;
  }
  if (typeof value === 'string') return params ? interpolate(value, params) : value;
  return key;
}

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: string, params?: Record<string, string | number>): string {
    return getTranslation(language, key, params);
  }

  return { t, language };
}
