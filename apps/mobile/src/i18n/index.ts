// TODO Phase 4 — brancher les fichiers JSON de traduction depuis V3
// Pour l'instant retourne la clé telle quelle pour permettre le portage des composants

export function useTranslation() {
  return {
    t: (key: string) => key,
    locale: 'fr',
  };
}
