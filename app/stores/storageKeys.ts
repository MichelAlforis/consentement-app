/** Clés localStorage de toutes les persistances Zustand — source de vérité unique */
export const STORAGE_KEYS = {
  AUTH:        'consentement-auth',
  SETTINGS:    'consentement-settings',
  PROFILE:     'consentement-profile',
  PREMIUM:     'consentement-premium',
  UNLOCKS:     'consentement-unlocks',
  MODULES:     'consentement-modules',
  LEXIQUE:     'consentement-lexique',
  RENDER_MODE: 'consentement-render-mode',
  DUO_RESULT:  'consentement-duo-result',
} as const;
