import { useLanguage } from '../context/LanguageContext';
import { fr } from './locales/fr';
import { en } from './locales/en';
import { es } from './locales/es';
import type { Translations } from './locales/fr';
import type { Language } from '../types';

const translations: Record<Language, Translations> = {
  fr: fr as unknown as Translations,
  en: en as unknown as Translations,
  es: es as unknown as Translations,
};

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current !== null && current !== undefined && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(str: string, params: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

export function useTranslation() {
  const { language } = useLanguage();
  const dict = translations[language] ?? translations.fr;
  const fallback = translations.fr;

  function t(key: string, params?: Record<string, string | number>): string {
    const value = getNestedValue(dict as unknown as Record<string, unknown>, key)
      ?? getNestedValue(fallback as unknown as Record<string, unknown>, key);

    if (value === undefined) return key;
    if (typeof value === 'string') return params ? interpolate(value, params) : value;
    return key;
  }

  return { t, language };
}
