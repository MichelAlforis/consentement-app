# Conventions — @ouiclair/core

Référentiel de conventions pour `packages/core`. Toute extraction depuis
`app/` root V3 ou toute création dans le package doit respecter ces règles.
Voir [section Audit automatique](#audit-automatique) pour les outils de vérification.

---

## Structure cible de packages/core/src/

```
packages/core/src/
├── index.ts              — barrel public (re-exporte tout)
├── types/
│   └── index.ts          — UNIQUEMENT types/interfaces TypeScript
├── constants/
│   ├── index.ts
│   ├── motion.ts         — durées, easings, stagger Framer/Moti
│   └── tokens.ts         — RADIUS, SPACE, TYPE
├── data/
│   ├── index.ts          — données brutes partagées (quizQuestions, diePractices…)
│   ├── modules.ts        — registry des modules éducatifs (MODULES, getModuleReward…)
│   └── *.ts              — données métier par domaine (cards-collector, goose-game…)
│                           ⚠️ données et types UNIQUEMENT — aucune logique (voir R4)
├── utils/
│   ├── index.ts
│   └── *.ts              — fonctions pures (computeXxx, isXxx, heatXxx, sampleXxx)
├── stores/
│   ├── index.ts
│   ├── storageKeys.ts    — clés de persistance Zustand (source de vérité unique)
│   └── *Store.ts         — un fichier = un store Zustand (useXxxStore)
├── storage/
│   ├── index.ts
│   └── IStorage.ts       — interface injectable (impl web = localStorage, mobile = MMKV)
├── realtime/
│   └── IRealtimeAdapter.ts — interface injectable UNIQUEMENT
│                             impl web → app/lib/realtime/browserEventSource.ts
│                             impl mobile → apps/mobile/src/realtime/nativeEventSource.ts
├── lib/
│   ├── pb.ts             — client PocketBase (singleton injectable via env)
│   ├── logger.ts         — logger singleton (transports injectables)
│   ├── logger.types.ts   — types du logger
│   ├── routes.ts         — table de métadonnées de routes (requiresAdult, showAd)
│   ├── appVariant.ts     — détection variant main/adult
│   ├── moduleIds.ts      — helpers IDs de modules
│   ├── computePreferenceMatches.ts
│   └── sync/             — fonctions de synchronisation PocketBase
└── hooks/                — hooks isomorphiques React (web + RN, jamais DOM, voir R9)
    └── index.ts
```

---

## R1 — Aucun fichier .ts/.tsx à la racine de src/ sauf index.ts

Tout nouveau fichier doit être placé dans un sous-dossier sémantique.

**Mauvais :**
```
packages/core/src/modules.ts     ← FAIL
packages/core/src/routes.ts      ← FAIL
```

**Correct :**
```
packages/core/src/data/modules.ts
packages/core/src/lib/routes.ts
```

---

## R2 — Aucun accès direct aux APIs browser

Interdit dans tout fichier de `packages/core/src/` :
- `localStorage`, `sessionStorage`
- `window`, `document`
- `navigator`, `location`

Toujours passer par `IStorage` (via `createCoreStorage()` dans un store
Zustand) ou recevoir l'implémentation en paramètre de fonction.

**Mauvais :**
```ts
localStorage.setItem('key', value);       // FAIL
if (typeof window === 'undefined') ...    // WARN — à éviter
```

**Correct :**
```ts
// Dans un store :
const useMyStore = create(persist(..., { storage: createCoreStorage() }));
// Dans une fonction pure :
export function saveData(storage: IStorage, data: unknown) { ... }
```

Conséquence directe : `"lib"` dans `packages/core/tsconfig.json` doit rester
`["ES2022"]` uniquement. Toute erreur TypeScript sur `window`/`localStorage`
indique une violation de R2, pas un manque de lib. Voir R6.

---

## R3 — Aucun type métier redéfini localement

Tous les types et interfaces partagés sont définis **une seule fois** dans
`packages/core/src/types/index.ts`. Jamais de re-déclaration locale.

**Mauvais :**
```ts
// Dans data/cards-collector.ts
export type Rarity = 'common' | 'rare' | 'unique';   // FAIL — existe déjà dans types/
```

**Correct :**
```ts
// Dans data/cards-collector.ts
import type { Rarity } from '../types';
```

Périmètre de `types/index.ts` : `Rarity`, `OwnedCard`, `IconName`,
`PositionKey`, `Screen`, `Language`, `AgeGroup`, `ComfortCategories`,
`HelpResource`, `ConsentPrinciple`, `PersonalProfile`, `PartnerProfile`,
`CommonGround`, `DuoStep`, `DuoSession`, `AppState`, `MenuItem`.

---

## R4 — data/ contient des données uniquement — tests co-localisés pour utils/ et stores/

**Règle structurelle :** Les fichiers `data/*.ts` contiennent exclusivement
des données brutes et des types locaux. Aucune fonction avec logique métier.

```ts
// data/goose-game.ts — CORRECT
export const GOOSE_BOARD: Cell[] = [...];
export const GOOSE_QUESTIONS: Question[] = [...];

// data/goose-game.ts — FAIL — logique métier dans data/
export function loadSavedGame(storage: IStorage) { ... }   // → utils/ ou stores/
export function saveGame(state: GameState) { ... }          // → utils/ ou stores/
```

Conséquence : `data/` n'a pas de tests obligatoires parce qu'il n'y a rien
à tester — des tableaux de données ne se testent pas, ils se valident par les
types TypeScript.

**Tests co-localisés** pour `utils/` et `stores/` :

```
utils/heatLevel.ts           → utils/heatLevel.test.ts
utils/computeGainedCards.ts  → utils/computeGainedCards.test.ts
stores/unlockStore.ts        → stores/unlockStore.test.ts
```

---

## R5 — Aucun import interdit

Interdit dans `packages/core/src/` :
- `next/*` (next/navigation, next/image, next/router…)
- `react-dom`
- `expo-*`
- `react-native*` (y compris `react-native-sse` — les impls concrètes vont
  dans les apps, pas dans core)
- Remontée vers `app/` root V3 : `../../app/...` ou `../../../app/...`
- Alias `@/` du root V3

Autorisé : `react` (hooks et types), `zustand`, `zustand/middleware`,
`pocketbase`, imports relatifs internes.

**Rappel architectural :** `realtime/IRealtimeAdapter.ts` définit l'interface.
Les implémentations concrètes sont injectées par les apps consommatrices :
- Web V3 : `app/lib/realtime/browserEventSource.ts` (EventSource)
- Mobile : `apps/mobile/src/realtime/nativeEventSource.ts` (react-native-sse)

Importer `react-native-sse` dans core casserait l'import depuis Next.js.

---

## R6 — tsconfig packages/core : pas de "DOM"

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2022", "WebWorker"]   // "WebWorker" OK (WebCrypto) — jamais "DOM"
  }
}
```

`"WebWorker"` est autorisé car il fournit les types de l'API WebCrypto (`CryptoKey`,
`SubtleCrypto`) disponibles sur toutes les cibles (browser, Node 18+, Hermes/RN),
sans exposer `window`, `localStorage`, `document` ni `navigator` complet.

> **Signal voulu — ne pas "corriger" :**
> Si tu rencontres `Cannot find name 'localStorage'` ou `Cannot find name 'window'`
> en compilant `packages/core`, c'est un signal intentionnel.
> Ne corrige **pas** en ajoutant `"DOM"` à `lib`.
> La vraie correction est de retirer le code browser du fichier concerné (R2).

---

## R7 — Chaque sous-dossier a un index.ts avec re-exports explicites

S'applique à `packages/core/src/` **ET** `apps/mobile/src/`.

Pas de `export * from './*'` générique. Chaque index.ts liste explicitement
ce qu'il expose.

```ts
// Correct
export { computeHeatPoints, getHeatLevel } from './heatLevel';
export type { HeatLevel, HeatInput } from './heatLevel';

// Interdit
export * from './heatLevel';   // trop permissif, cache les conflits de noms
```

L'export `*` permissif est la cause directe des doublons silencieux détectés
en audit (ex : `Rarity` re-déclarée dans `data/` malgré son existence dans
`types/`). Aucune exception.

**Règle supplémentaire pour les barrels mobiles** (`apps/mobile/src/components/ui/index.ts`,
`apps/mobile/src/i18n/index.ts`, etc.) :
- Ne jamais supprimer un export existant lors d'un lint pass — les re-exports
  `export { Foo } from './Foo'` ne sont PAS des variables "unused" (R7 protect).
- Ne jamais convertir en glob `export * from` même si ESLint ne signale rien.
- Ne jamais retirer le commentaire de garde `// BARREL` en tête de fichier.
- En cas de commentaire `/* eslint-disable */` jugé "inutile" : le laisser ou
  le remplacer par la ligne de garde — ne pas supprimer.

---

## R8 — Aucune dépendance circulaire entre sous-dossiers

Hiérarchie d'imports autorisée (chaque niveau importe uniquement des niveaux
inférieurs) :

```
Niveau 0 — feuilles : types/  constants/  storage/  realtime/
Niveau 1             : lib/  data/
Niveau 2             : utils/
Niveau 3             : stores/
Niveau 4             : hooks/
```

**Interdit :**
```ts
// types/ qui importe depuis data/ ou utils/ → FAIL
// data/ qui importe depuis utils/ ou stores/ → FAIL
// utils/ qui importe depuis stores/ ou hooks/ → FAIL
// stores/ qui importe depuis hooks/ → FAIL
```

Détection automatique : `pnpm --filter @ouiclair/core madge:circular`
(intégré dans le script d'audit, voir section Audit automatique).

---

## R9 — hooks/ — Hooks isomorphiques uniquement

Un hook dans `packages/core/src/hooks/` doit fonctionner identiquement en
React web (Next.js) et React Native (Expo), sans branche conditionnelle de
plateforme.

**Autorisé :**
```ts
export function useHeatLevel() { return useHeatStore(s => s.level); }
export function useOwnedCards() { return useUnlockStore(s => s.ownedCards); }
export function useDebounce<T>(value: T, delay: number): T { ... }
```

**Interdit :**
```ts
// Hooks RN-only → apps/mobile/src/hooks/
import { useWindowDimensions } from 'react-native';   // FAIL
import { useSafeAreaInsets } from 'react-native-safe-area-context';  // FAIL

// Hooks DOM-only → app/hooks/
import { useRouter } from 'next/navigation';  // FAIL
document.addEventListener(...)               // FAIL
```

Critère de validation : un hook de `hooks/` doit pouvoir être importé depuis
`app/` (Next.js) **et** `apps/mobile/` (Expo) sans modification ni warning.

---

## R10 — Statut app/ root V3 — feature freeze total

`app/` continue de fonctionner sur ses propres fichiers locaux jusqu'à la
suppression lors de la sortie prod mobile. La dualité est **intentionnelle**.

**Règle absolue :** Aucun agent ne modifie `app/` pour le faire pointer vers
`@ouiclair/core`. Le build V3 doit rester stable en permanence (vérifié par
pre-push hook).

---

## Conventions de nommage

| Catégorie | Convention | Exemple |
|---|---|---|
| Hooks | `useXxx` | `useHeatLevel`, `useAuthStore` |
| Stores | `useXxxStore` | `useUnlockStore`, `useSettingsStore` |
| Écrans (apps/mobile) | `XxxScreen` | `HomeScreen`, `CardGameScreen` |
| Fonctions pures | camelCase descriptif | `computeGainedCards`, `getHeatLevel` |
| Constantes | UPPER_SNAKE_CASE | `HEAT_THRESHOLDS`, `MODULE_POINTS` |
| Types/Interfaces | PascalCase | `OwnedCard`, `HeatInput` |
| Fichiers data | kebab-case | `cards-collector.ts`, `goose-game.ts` |

---

## Audit automatique

```bash
pnpm --filter @ouiclair/core lint:conventions
```

Vérifie mécaniquement :

| Règle | Vérification |
|---|---|
| R1 | grep `.ts` à la racine de `src/` (hors `index.ts`) |
| R2 | grep `localStorage\|sessionStorage\|window\|document\|navigator` |
| R5 | grep imports interdits (`next/`, `react-dom`, `expo-`, `react-native`) |
| R6 | lecture de `tsconfig.json` → vérification que `lib` = `["ES2022"]` |
| R8 | `madge --circular packages/core/src/` |

R3, R4, R7, R9 nécessitent un audit IA manuel via le prompt
`docs/AUDIT_PROMPT.md` à chaque fin de lot de phase.

**Pre-commit hook (husky) :** bloque le commit si `lint:conventions` échoue.

---

## Checklist d'acceptation pour un nouveau fichier

Avant de créer ou migrer un fichier dans `packages/core/src/` :

- [ ] Placé dans le bon sous-dossier (R1)
- [ ] Pas d'accès à localStorage / window / document (R2)
- [ ] Aucun type redéfini localement (R3)
- [ ] data/ = données pures uniquement, logique → utils/ ou stores/ (R4)
- [ ] Fichier de test co-localisé si utils/ ou stores/ (R4)
- [ ] Aucun import next/* / react-dom / expo-* / react-native* / ../../app (R5)
- [ ] tsconfig lib = ES2022 non cassé (R6)
- [ ] index.ts du dossier mis à jour avec exports explicites (R7)
- [ ] Pas de dépendance vers un niveau supérieur dans la hiérarchie (R8)
- [ ] Si hooks/ : isomorphique web + RN sans branche plateforme (R9)
