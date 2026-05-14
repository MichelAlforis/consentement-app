import { describe, expect, it } from 'vitest';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { getTranslation, translations } from '.';
import { missingTranslationKeys } from './translationUtils';

const criticalNamespaces = [
  'tabs',
  'headers',
  'settings',
  'homeAdult',
  'homeMinor',
  'apprendre',
  'games',
  'quizMl',
] as const;

function pickCriticalNamespaces(dict: Record<string, unknown>) {
  return Object.fromEntries(criticalNamespaces.map((key) => [key, dict[key]]));
}

describe('i18n', () => {
  it('keeps supported language dictionaries wired', () => {
    expect(Object.keys(translations).sort()).toEqual(['en', 'es', 'fr']);
  });

  it('keeps critical English and Spanish UI namespaces aligned with French', () => {
    const reference = pickCriticalNamespaces(fr);
    expect(missingTranslationKeys(reference, en)).toEqual([]);
    expect(missingTranslationKeys(reference, es)).toEqual([]);
  });

  it('falls back to French before returning a raw key', () => {
    expect(getTranslation('en', 'tabs.home')).toBe(en.tabs.home);
    expect(getTranslation('en', 'missing.key')).toBe('missing.key');
  });
});
