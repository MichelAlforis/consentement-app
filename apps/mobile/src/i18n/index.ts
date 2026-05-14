// TODO Phase 4 — brancher les fichiers JSON de traduction depuis V3
// Stub : retourne la clé + substitue {{var}} si params fourni

export function useTranslation() {
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!params) return key;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
      key,
    );
  };
  return { t, locale: 'fr' };
}
