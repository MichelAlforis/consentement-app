export type TranslationDict = Record<string, unknown>;

export function getNestedValue(obj: TranslationDict, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current !== null && current !== undefined && typeof current === 'object') {
      return (current as TranslationDict)[key];
    }
    return undefined;
  }, obj);
}

export function interpolate(str: string, params: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

export function flattenTranslationKeys(obj: TranslationDict, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') return [path];
    if (value && typeof value === 'object') return flattenTranslationKeys(value as TranslationDict, path);
    return [];
  });
}

export function missingTranslationKeys(reference: TranslationDict, candidate: TranslationDict): string[] {
  return flattenTranslationKeys(reference).filter((key) => typeof getNestedValue(candidate, key) !== 'string');
}
