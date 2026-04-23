# Stratégie de tests — Consentement App

> Dernière mise à jour : 2026-04-23
> Légende : ✅ Fait · 🔲 À faire

## Infrastructure (en place)

| Outil | Usage | Config |
|---|---|---|
| Vitest | Unit tests (hooks, stores, utils) | `vitest.config.ts` |
| @testing-library/react | Tests composants React | `app/test/setup.ts` |
| Playwright | E2E — flows critiques | `playwright.config.ts` |

**Setup global (`app/test/setup.ts`) :**
- Mock `@capacitor/platform` → `isCapacitor: false`
- Mock `next/navigation` → `useRouter`, `usePathname`

---

## Tests écrits (25 tests — 25/25 ✓)

### `useCardSession` — 14 tests ✅
**Fichier :** `app/components/screens/CardGame/hooks/useCardSession.test.ts`

| Test | Ce qui est vérifié |
|---|---|
| État initial | step=pick, currentCard=null, cardCount=0 |
| Filtrage mineur | seules les cartes `ageGate=all` disponibles |
| Filtrage adulte | cartes `ageGate=adult` incluses |
| Filtrage explicit | cartes `ageGate=explicit` exclues sans `explicitMode` |
| `startPlaying` | step=playing, carte posée, cardCount=1 |
| `startPlaying` reveal | isRevealed=false → true après 350ms (fake timers) |
| Guard `drawNewCard` | no-op si `isAnimating=true` |
| `drawNewCard` timing | isAnimating=false + cardCount=2 après 480ms |
| `toggleFavorite` ajout | carte dans favorites, isFavCard=true |
| `toggleFavorite` retrait | deuxième appel retire la carte |
| `toggleFavorite` localStorage | clé `consentement_card_favorites` mise à jour |
| `isSeanceDone` | false au démarrage |
| `reset` | step=pick, card=null, cardCount=0, isAnimating=false |
| `goToEnd` | step=end |

**Mocks :** `useSettingsStore` (explicitMode=false), `localStorage`

---

### `useGooseGame` — 11 tests ✅
**Fichier :** `app/components/screens/GooseGameScreen/hooks/useGooseGame.test.ts`

| Test | Ce qui est vérifié |
|---|---|
| Phase initiale | intro, p1=null, p2=null |
| `handleP1Confirm` | p1 défini, phase=setup-p2 |
| `handleP2Confirm` | p2 défini, phase=pacte |
| `startNewGame` | phase=playing, pos0=0, pos1=0, curPlayer=0 |
| `endTurn` | alterne curPlayer 0→1→0 |
| Dé joueur 0 | pos0 avance selon la valeur du dé |
| Dé joueur 1 | pos1 avance, pos0 inchangé |
| Cap case 23 | pion bloqué à l'arrivée (Math.min + 23) |
| `handleAccordResult(true)` | accordsCount++, tour suivant |
| `handleAccordResult(false)` | accordsCount inchangé |
| `resetToIntro` | phase=intro, savedGame=null |

**Mocks :** `useDice` (callback `onDiceLanded` capturé pour simulation), `usePawnAnimation` (animate appelle cb immédiatement), `useConfetti`, `useHaptics`, `useSettingsStore`, `loadSavedGame/saveGame/clearSavedGame`

---

## À faire — priorité suivante

### 1. Stores Zustand 🔲
- `useSettingsStore` — selectTheme, changeLanguage, toggleExplicitMode, persist/rehydrate
- `useAuthStore` — handleAgeSelect, handleAuth, hydration
- `useDuoStore` — getCommonGround, generatePartnerProfile

### 2. Utils 🔲
- `calculateCommonGround` (`app/components/duo/utils.ts`)
- Interpolation i18n (`app/i18n/index.ts`) — paramètres `{name}`, pluriel, tableaux

### 3. Composants UI 🔲
- `ComfortSlider` — onChange, valeurs 0–3, disabled
- `Button` — variantes, disabled state

### 4. E2E flows (après lancement beta) 🔲
- Onboarding complet (welcome → auth → home)
- Flow duo (connexion → pacte → révélation)
- Jeu de dés solo
- Jeu de cartes — séance 5 cartes

---

## Commandes

```bash
npm run test             # vitest watch
npm run test:coverage    # rapport couverture HTML (out: coverage/)
npx vitest run           # run once, pas de watch
npx playwright test      # E2E
npx playwright test --ui # E2E mode interactif
```
