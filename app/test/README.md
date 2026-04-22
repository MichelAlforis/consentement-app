# Stratégie de tests — Consentement App

## Infrastructure (en place)

| Outil | Usage | Config |
|---|---|---|
| Vitest | Unit tests (hooks, stores, utils) | `vitest.config.ts` |
| @testing-library/react | Tests composants React | `app/test/setup.ts` |
| Playwright | E2E — flows critiques | `playwright.config.ts` |

## Priorité d'implémentation

### 1. Stores Zustand (priorité haute)
- `useAuthStore` — handleAgeSelect, handleAuth, hydration
- `useDuoStore` — getCommonGround, generatePartnerProfile
- `useSettingsStore` — selectTheme, changeLanguage

### 2. Game engines (priorité haute)
- `useDiceEngine` — roll, onRollComplete, anti-repeat
- `useCardSession` — pickCard, depth progression, favorites

### 3. Utils (priorité moyenne)
- `calculateCommonGround` (DuoSpace/utils.ts)
- `generatePartnerProfile` (duoStore.ts)
- Interpolation i18n (i18n/index.ts)

### 4. Composants UI (priorité basse)
- `ErrorBoundary` — render avec erreur
- `ComfortSlider` — onChange, valeurs limites
- `Button` — variantes, disabled state

### 5. E2E flows (après lancement beta)
- Onboarding complet (welcome → auth → home)
- Flow duo (connexion → pacte → révélation)
- Jeu de dés solo + duo
- Jeu de cartes — séance 5 cartes

## Commandes

```bash
# Unit tests
npm run test           # vitest watch
npm run test:coverage  # rapport couverture

# E2E
npx playwright test
npx playwright test --ui  # mode interactif
```
