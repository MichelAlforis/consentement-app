// BARREL — ne jamais transformer en export * glob (R7)
import { fr } from './locales/fr';
import { en } from './locales/en';

const LOCALES = { fr, en } as const;
type Locale = keyof typeof LOCALES;

function resolve(obj: unknown, path: string): string | undefined {
  return path.split('.').reduce(
    (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
    obj as unknown,
  ) as string | undefined;
}

export function useTranslation(locale: Locale = 'fr') {
  const translations = LOCALES[locale];
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = resolve(translations, key) ?? key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
      value,
    );
  };
  return { t, locale };
}
