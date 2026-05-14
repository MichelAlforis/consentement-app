# V4 Roadmap — Migration Next.js + Capacitor → Expo React Native

## Contexte

**V4 = l'app Expo React Native.** Décision prise le 2026-05-14 : migrer l'app Consentement/OuiClair (37K LOC, 45 écrans, 3 Canvas R3F, 92 fichiers framer-motion) de Next.js + Capacitor vers Expo React Native. Cible exclusive iOS + Android. App pas encore en production — c'est le bon moment.

**Versions :**
- V1–V2 : prototypes early
- V3 : stack actuelle (Next.js + Capacitor + R3F) — **gelée Phase 0, archivée à la sortie V4**
- **V4 : Expo SDK 54 + RN 0.81.5** (latest stable au 2026-05-14 — SDK 55 non encore sorti)
  - SDK 55 + RN 0.83 à prévoir en upgrade séparé quand stable

**Deux entités distinctes dans le repo :**
- **V3 root** (`app/`, `ios/`, `android/`) : app applicative complète (45 écrans, jeux, R3F). Pas une vitrine. **Gelée dès Phase 0** — aucun utilisateur prod, pas besoin de la maintenir vivante.
- **apps/vitrine/** : site marketing pur (ouiclair.com, liens stores, landing). **Reste vivant indéfiniment**, indépendant de la migration.

**Budget à prévoir dès Phase 0 :**
- EAS Build : ~$19–99/mois selon tier (nécessaire dès Phase 2 pour les builds device)
- RevenueCat : gratuit jusqu'à $2.5k MRR, puis % du revenu

**Règle pendant toute la migration : feature freeze sur V3. Bug fixes critiques uniquement.**

---

## Architecture dossiers — état cible V4

### Arborescence complète du monorepo

```
ouiclair-monorepo/
│
├── apps/
│   ├── mobile/                        ← V4 — Expo SDK 55 (cible finale)
│   │   ├── app.json                   ← config Expo (appId, permissions, plugins)
│   │   ├── App.tsx                    ← entry point
│   │   ├── eas.json                   ← EAS Build profiles
│   │   ├── assets/                    ← icônes app, splash, fonts
│   │   └── src/
│   │       ├── app/                   ← AppProviders, AppShell, RouteRenderer
│   │       ├── components/
│   │       │   ├── ui/                ← ~20 composants RN (NativeWind + BlurView)
│   │       │   └── screens/           ← 45 écrans (feature folders conservés)
│   │       │       ├── GooseGameScreen/
│   │       │       ├── CardGame/
│   │       │       ├── DuoSpace/
│   │       │       └── *.tsx          ← écrans simples (un fichier chacun)
│   │       ├── game-engine/           ← R3F/native (structure miroir de V3)
│   │       │   ├── dice/              ← DiceCanvas.native.tsx, DiceRenderer
│   │       │   ├── cards/             ← CollectorCardCanvas.native.tsx
│   │       │   ├── board/             ← BoardGridR3F.native.tsx
│   │       │   └── shared/            ← GameEndCinematic, useHaptics, usePersist
│   │       ├── hooks/                 ← hooks RN (useColorScheme, useRenderMode, etc.)
│   │       ├── storage/               ← MMKV implémentation de IStorage
│   │       │   └── mmkvStorage.ts
│   │       ├── realtime/              ← react-native-sse impl de IRealtimeAdapter
│   │       │   └── nativeEventSource.ts
│   │       ├── i18n/                  ← useTranslation(), namespaces (port depuis V3)
│   │       └── theme/                 ← ThemeContext, effets premium (shimmer, grain)
│   │
│   └── vitrine/                       ← Next.js marketing ouiclair.com (inchangé)
│
├── packages/
│   ├── core/                          ← logique partagée V3 + V4
│   │   └── src/
│   │       ├── stores/                ← 11 stores Zustand (sans renderModeStore)
│   │       │   ├── authStore.ts
│   │       │   ├── navigationStore.ts
│   │       │   ├── moduleProgressStore.ts
│   │       │   └── … (8 autres)
│   │       ├── utils/                 ← logique pure (computeGainedCards, heatLevel…)
│   │       ├── lib/
│   │       │   ├── pb.ts              ← client PocketBase
│   │       │   └── sync/
│   │       │       └── duoSync.ts     ← realtime via IRealtimeAdapter
│   │       ├── storage/
│   │       │   └── IStorage.ts        ← interface injectable
│   │       ├── realtime/
│   │       │   └── IRealtimeAdapter.ts ← interface injectable
│   │       ├── types/                 ← types + interfaces partagés
│   │       └── constants/             ← motion.ts, tokens, storageKeys
│   │
│   └── textures/                      ← pré-génération PNG au build (remplace canvas 2D)
│       ├── scripts/
│       │   └── generate.ts            ← script Node (tourne une fois au build)
│       └── assets/
│           ├── dice/                  ← face-1.png … face-6.png
│           ├── grain/                 ← grain-128.png, grain-256.png
│           ├── icons/                 ← icônes board PNG (depuis iconPaths.ts)
│           └── positions/             ← pictogrammes positions (depuis positionCanvasDraw.ts)
│
├── package.json                       ← workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
│
│   ── (V3 — root, gelé Phase 0, archivé après sortie V4)
├── app/                               ← Next.js app V3
├── android/                           ← Capacitor Android
├── ios/                               ← Capacitor iOS
└── capacitor.config.ts
```

---

### Mapping V3 → V4 (où va chaque fichier)

| Fichier/dossier V3 (root) | Destination V4 | Note |
|---------------------------|----------------|------|
| `app/stores/*.ts` (11 stores) | `packages/core/src/stores/` | renderModeStore exclu |
| `app/stores/renderModeStore.ts` | `apps/mobile/src/hooks/useRenderMode.ts` | réimplémenté : AdaptiveDpr + PerformanceMonitor + setting utilisateur (pas detect-gpu) |
| `app/utils/computeGainedCards.ts` | `packages/core/src/utils/` | port direct |
| `app/utils/heatLevel.ts` | `packages/core/src/utils/` | port direct |
| `app/utils/accessControl.ts` | `packages/core/src/utils/` | port direct |
| `app/utils/grainTexture.ts` | `packages/textures/scripts/` | compile-time uniquement |
| `app/utils/positionCanvasDraw.ts` | `packages/textures/scripts/` | compile-time uniquement |
| `app/utils/iconPaths.ts` | `packages/textures/scripts/` | compile-time uniquement |
| `app/utils/iconFromName.tsx` | `apps/mobile/src/components/ui/` | lucide-react → lucide-react-native. Si utilisé dans core : créer abstraction `IIcon` |
| `app/lib/pb.ts` | `packages/core/src/lib/pb.ts` | port direct |
| `app/lib/sync/duoSync.ts` | `packages/core/src/lib/sync/` | EventSource → IRealtimeAdapter |
| `app/components/ui/*.tsx` (~20) | `apps/mobile/src/components/ui/` | RN + NativeWind |
| `app/components/screens/*.tsx` (45) | `apps/mobile/src/components/screens/` | RN primitives |
| `app/game-engine/dice/` | `apps/mobile/src/game-engine/dice/` | R3F/native |
| `app/game-engine/cards/` | `apps/mobile/src/game-engine/cards/` | R3F/native + expo-gl |
| `app/game-engine/board/` | `apps/mobile/src/game-engine/board/` | R3F/native + expo-gl |
| `app/game-engine/shared/` | `apps/mobile/src/game-engine/shared/` | useHaptics → expo-haptics |
| `app/hooks/` | `apps/mobile/src/hooks/` | adapté RN |
| `app/i18n/` | `apps/mobile/src/i18n/` | port direct (JSON translations) |
| `app/constants/` | `packages/core/src/constants/` | tokens, motion, storageKeys |
| `app/components/app/` | `apps/mobile/src/app/` | AppProviders, RouteRenderer |

---

## Vue d'ensemble des phases

| Phase | Nom | Durée est. | Statut | En parallèle | Livrable clé |
|-------|-----|-----------|--------|--------------|--------------|
| 0 | Monorepo étendu | 2–3 j | **✅ Fait** | — | workspace prêt, Turborepo, TS refs |
| 1 | packages/core | 10–15 j | **✅ Fait** — 11 stores, utils, 198 tests OK, tsc clean | — | stores + utils portables, Vitest vert |
| 2 | POC R3F/native + shell Expo | 5–7 j | **✅ Fait** (test device physique à faire) | — | Dé 3D sur device → go/no-go |
| 3 | Composants UI | 12–18 j | **✅ Fait** — 26 composants portés, 3 audits GO | — | ~26 composants RN validés |
| 4 | Onboarding + Nav principale | 10–12 j | **✅ Fait** — 11 écrans + AppShell + RouteRenderer | — | 11 écrans navigables |
| 5A | FichePratiqueScreen + 7 modules batch A | — | **✅ Fait** | — | composant base + 7 modules |
| 5B | 7 modules batch B | — | **✅ Fait** (commit fd47ea5, fixes 433f7be) | — | 7 modules |
| 5C | 10 écrans Ressources/Info | — | **✅ Fait** (commit 86402ec) | — | help, quiz, premium, annuaire… |
| 5D | Sprint contenu — données i18n réelles | 3–5 j | **✅ Fait** (commit 8bc5d72) | — | 14 modules FR + EN stubs, i18n réel |
| 5b | Features natives critiques | 8–10 j | 🔜 Prochaine (après Phase 6) | — | secure-store + IAP + deep links |
| 6A | HallOfCardsScreen | — | 🔄 En cours | 6B | carousel + gyroscope + tilt |
| 6B | DuoSpace + PersonalSpace | — | **✅ Fait** (commit 8bb909b) | 6A | realtime stub + profil comfort |
| 7 | Jeux R3F | 20–30 j | À faire | — | DiceGame → CardGame → GooseGame |
| 8 | Polish + ATT + Sentry | 4–6 j | À faire | — | app prête stores |
| 9 | Tests + Publication | 8–12 j | À faire | — | EAS build, soumission |
| **Total** | | **102–145 j** | | | **6–10 mois calendaires** (+30% buffer imprévus) |

---

## État d'avancement — 2026-05-14

### Phase 0 — ✅ Fait

- Monorepo racine `ouiclair-monorepo` en place : `pnpm` workspaces (`apps/*`, `packages/*`), `turbo.json`, `tsconfig.base.json`.
- `apps/vitrine/` reste séparée de la migration mobile.
- `packages/core/` et `packages/textures/` créés avec `package.json`, `tsconfig.json`.
- **Reste** : tag git `v3-freeze` + confirmer `pnpm build:main`.

### Phase 1 — ✅ Fait

- 11 stores Zustand avec `createCoreStorage()` dans `packages/core/src/stores/`.
- Utils purs, types, data, constants, `lib/pb`, `lib/sync/duoSync`, `lib/sync/profileSync`, `storage/IStorage`, `realtime/IRealtimeAdapter`.
- 15 fichiers de tests, **198 tests OK**, `pnpm tsc --noEmit` clean (core + racine).
- **Reste** : brancher V3 root sur `@ouiclair/core` (optionnel pendant migration) ; valider `react-native-sse` pour realtime PocketBase ; décider `completeGameSession.ts`.

### Phase 2 — ✅ Fait (test device physique à faire)

- `apps/mobile/` initialisé — Expo SDK 54 / RN 0.81.5 (New Architecture activée).
- `app.json` : `bundleIdentifier: fr.consentement.app`, plugins expo-secure-store + ATT.
- `App.tsx` : polyfill EventSource (react-native-sse default import), `initStorage(mmkvStorage)`.
- Shell : `AppProviders`, `RouteRenderer` (squelette), `ThemeContext` (port V3 sans DOM), `mmkvStorage.ts` (IStorage MMKV).
- `metro.config.js` : `watchFolders` monorepo + symlinks pnpm + `nodeModulesPaths`.
- `eas.json` : profils development / preview / production.
- `packages/textures/scripts/generate.ts` : 8 PNG au build (6 faces dé + grain-128 + grain-256).
- `DiceCanvas.native.tsx` : port R3F/native complet —
  - `useTexture(NUMERIC_FACE_URIS)` avec `Asset.fromModule(require(...)).uri` (TODO L55 résolu) ;
  - `THREE.DataTexture` 1×1 pour catégories (TODO PNG catégorie en Phase 7 CardGame) ;
  - `three-stdlib` `RoundedBoxGeometry` conservé (ajouté aux deps root + mobile) ;
  - `apps/mobile/src/r3f.d.ts` pour JSX intrinsics R3F (`group`, `mesh`, `pointLight`…).
- `pnpm tsc --noEmit` apps/mobile : **0 erreur** ✅
- Symlinks pnpm OK : `node_modules/@ouiclair/textures/assets/dice/` → PNG accessibles par Metro.
- `expo-dev-client ~6.0.21` ajouté (requis pour build de dev New Architecture).
- EAS project ID branché : `c76ebde9-e454-4b76-a8ec-79dc51f94ea4` (compte lordenargent).
- `ITSAppUsesNonExemptEncryption: false` + permission AD_ID Android ajoutés dans app.json.
- **Build de dev en cours** (EAS Free tier, ~10–30 min) : `builds/a7c3801b`
- **Reste — go/no-go device physique** (dès que le build est installé) :
  1. GL init sans crash (iOS + Android)
  2. Les 6 faces affichent les bons chiffres (Asset.fromModule URI résolu)
  3. Framerate ≥ 45fps lancé actif sur iPhone mid-range + Pixel 6

### Phase 3 — ✅ Fait (2026-05-14)

**26 composants portés** en 3 groupes (3 sessions agents) — tous audits GO.

**Agent 1 — Simples (10 composants)** : `AppLogo`, `Button`, `Header`, `IconBox`, `TabBar`, `Toast`, `ErrorBoundary`, `DailyQuestionCard`, `MenuCard`, `GameMenuCard`

**Agent 2 — Moyens/SVG (8 composants)** : `PositionSVG`, `Card`, `ComfortSlider`, `QRCode`, `HeatRoadmapSheet`, `LegalCredentialSheet`, `AdBanner`, `HeatThermometer`

**Agent 3 — Complexes/Reanimated (8 composants)** : `CardFullscreenOverlay`, `CollectorCardFace`, `ThemeEffects`, `FlipRevealOverlay`, `PalierUpOverlay`, `ExplicitModeToggle`, `CollectorCardFace` (CardBack intégré), `HeatRoadmapSheet`

**Livraisons techniques complémentaires :**
- `babel.config.js` créé — `react-native-reanimated/plugin` en dernier (requis Reanimated 4.1.x)
- `useTranslation()` étendu : `t(key, params?)` avec substitution `{{var}}` — résout 5 erreurs TS2554
- `apps/mobile/src/i18n/index.ts` stub étendu ; JSON de traduction à brancher en Phase 5
- `expo-linear-gradient ~15.0.8` ajouté (requis pour gradients dans MenuCard, GameMenuCard Phase 5b)
- `react-native-svg 15.12.1` résolu
- Barrel `src/components/ui/index.ts` : 26 exports nominatifs, 0 `export *`
- Divergences V3→V4 documentées en tête de fichier (TabBar props supprimées, onClick→onPress, PanResponder vs drag="y")

**⚠️ WARN non-bloquants — à traiter avant build iOS Phase 7 :**

| # | Warning | Impact | Phase cible |
|---|---------|--------|-------------|
| W1 | `expo-sensors` absent de `app.json/plugins` → `NSMotionUsageDescription` manquant → `DeviceMotion` silencieusement rejeté iOS 17+ | HallOfCards gyroscope muet sur iOS sans crash | **Phase 6** — ajouter le plugin avant HallOfCards |
| W2 | `PanResponder` dans Modal (`CardFullscreenOverlay`) → comportement drag-to-dismiss non validé sur Android | Possible non-fonctionnement du dismiss | **Phase 7** — test device Android obligatoire |
| W3 | `index.ts` réécrit par l'outil linter à deux reprises (suppression des exports ajoutés) | Risque de perte silencieuse d'exports lors des prochaines sessions | **Immédiat** — voir note ci-dessous |

> **Note W3 — Protection de `index.ts`** : Le linter (`lint-staged` + eslint autofix) a écrasé les exports des agents à deux reprises. Solution retenue : le fichier `apps/mobile/src/components/ui/index.ts` doit être maintenu manuellement et vérifié en début de chaque session agents. Ajouter une règle dans `.eslintignore` ou utiliser `/* eslint-disable */` ciblé si le problème persiste. À surveiller en Phase 4.

### Phase 4 — ✅ Fait (2026-05-14)

**11 écrans portés** en 2 agents + AppShell + RouteRenderer finalisé. Audit GO (commit `caa0e8d`).

**Agent 1 — Onboarding/Auth (5 écrans)** : `OnboardingWizard` (4 étapes), `AuthScreen`, `AgeCheckScreen`, `ThemeSelectScreen`, `LanguageScreen`

**Agent 2 — Navigation principale (6 écrans + shell)** : `HomeScreen` (3 niveaux progression), `ApprendreScreen`, `MoiScreen`, `SettingsScreen`, `AppShell` (TabBar + Toast overlay), `RouteRenderer` final

**Livraisons techniques :**
- `AppShell.tsx` : TabBar visible sur tab screens, Toast overlay positionné absolument
- `RouteRenderer.tsx` : switch complet sur tous les screens Phase 4 + lazy import Suspense
- `AppProviders.tsx` : `ToastProvider` ajouté
- `screens/index.ts` : 9 exports nominatifs avec commentaire de garde R7
- Divergences V3→V4 documentées en tête de chaque fichier
- `// TODO Phase 5: gate premium` tracé dans SettingsScreen

**Artefact nettoyé :** `apps/mobile/src/components/screens/Home/` (dossier non tracké créé par erreur par l'agent, supprimé — 0 import).

### Non démarré

- Phase 5 et suivantes.

## Phase 0 — Monorepo étendu
**Durée : 2–3 jours**

### Objectif
Étendre le monorepo existant pour accueillir `apps/mobile/` et `packages/core/` sans toucher à l'app root gelée.

### Tâches

1. **Geler V3** : créer un tag git `v3-freeze` sur le commit actuel. **À confirmer / faire.**

2. **Ajouter les workspaces** dans `package.json` racine : **fait via glob `apps/*`, `packages/*`.**
   ```json
   "workspaces": ["apps/*", "packages/*"]
   ```

3. **Setup Turborepo** : **fait.**
   ```bash
   pnpm add -Dw turbo
   ```
   - `turbo.json` avec pipelines `build`, `test`, `dev`
   - Caching local activé

4. **TypeScript project references** : **base en place.**
   - `tsconfig.base.json` à la racine (shared compiler options)
   - Chaque package/app étend la base

5. **Créer les squelettes** :
   - `packages/core/package.json` + `src/index.ts` : **fait**
   - `packages/textures/package.json` + `src/` : **fait**
   - `apps/mobile/` → **à faire en Phase 2**

6. **Vérifier** :
   - `pnpm tsc --noEmit` racine : **OK le 2026-05-14**
   - `pnpm install` et `pnpm build:main` : **à confirmer**

### Fichiers clés
- `package.json` (racine) — ajout workspaces
- `pnpm-workspace.yaml` (nouveau)
- `turbo.json` (nouveau)
- `tsconfig.base.json` (nouveau)
- `packages/core/package.json` (nouveau)

---

## Phase 1 — packages/core
**Durée : 10–15 jours**

### Objectif
Extraire tout ce qui est portable dans `@ouiclair/core`. L'app root (V3) doit continuer à fonctionner en important depuis le package. C'est le socle de toute la migration.

### Ce qui va dans core

**Stores (11/12)** :
- `authStore`, `navigationStore`, `profileStore`, `duoStore`, `unlockStore`
- `moduleProgressStore`, `settingsStore`, `preferencesStore`
- `premiumStore`, `revealStore`, `lexiqueStore`
- ⚠️ `renderModeStore` : **ne va pas dans core** — réimplémenté différemment en V4 (voir mapping)

**Utils purs** :
- `computeGainedCards.ts`, `computeModuleGain.ts`, `heatLevel.ts`, `heatGate.ts`
- `accessControl.ts`, `progressLevel.ts`, `sampleCard.ts`, `completeGameSession.ts`
- ⚠️ `grainTexture.ts`, `positionCanvasDraw.ts`, `iconPaths.ts` → **packages/textures**, pas core

**Types, constantes, client PocketBase** : tout ce qui est sans dépendance browser.

### Travail clé : abstraction IStorage

```ts
// packages/core/src/storage/IStorage.ts
export interface IStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

- V3 root : `createJSONStorage(() => localStorage)` (inchangé)
- V4 mobile : `createJSONStorage(() => mmkvStorage)` (MMKV)

### Travail clé : abstraction IRealtimeAdapter

`duoSync.ts` utilise `EventSource` pour PocketBase realtime.

```ts
// packages/core/src/realtime/IRealtimeAdapter.ts
export interface IRealtimeAdapter {
  subscribe(url: string, onMessage: (e: MessageEvent) => void): () => void;
}
```

- V3 root : EventSource natif browser
- V4 mobile : **`react-native-sse`** (TypeScript natif, maintenu — préférer à `react-native-event-source`)
  > À valider en Phase 1 : compatibilité PocketBase realtime protocol sur react-native-sse

### Stratégie tests dans core

`packages/core` tourne en Node pur → **garder Vitest**. Les tests de logique pure et de stores ont été portés directement depuis V3 vers `packages/core/src/`. Les tests avec hooks React/jsdom, UI, intégration backend et mocks PocketBase complexes restent dans V3 root ou seront adaptés plus tard côté mobile.

**État au 2026-05-14 :**
- `packages/core/vitest.config.ts` : `environment: 'node'`, include `src/**/*.{test,spec}.{ts,tsx}`, `passWithNoTests: true`.
- 15 fichiers de tests portés.
- 198 tests passent.
- `localStorage.clear()` supprimé des tests stores, car `createCoreStorage()` est no-op par défaut en Node.
- `pnpm tsc --noEmit` dans `packages/core` passe.

### Validation
- `cd packages/core && pnpm vitest run` : **OK le 2026-05-14**
- `cd packages/core && pnpm tsc --noEmit` : **OK le 2026-05-14**
- `cd <racine> && pnpm tsc --noEmit` : **OK le 2026-05-14**
- `pnpm dev` (V3 root) : **à confirmer manuellement**

### Fichiers clés
- `packages/core/src/stores/` (11 fichiers)
- `packages/core/src/utils/` (8 fichiers)
- `packages/core/src/storage/IStorage.ts`
- `packages/core/src/realtime/IRealtimeAdapter.ts`
- `packages/core/src/lib/pb.ts` + `sync/duoSync.ts`

---

## Phase 2 — POC R3F/native + shell Expo ✅
**Durée : 5–7 jours**

### Objectif
**Point de contrôle go/no-go** avant d'engager ~80 jours de migration. Valider R3F sur device réel.

### Critères go/no-go (les deux comptent)

| Critère | Seuil go | Seuil no-go |
|---------|----------|-------------|
| Framerate DiceCanvas sur iPhone mid-range | ≥ 45fps | < 30fps après optimisation |
| Temps de portage DiceCanvas | ≤ 2 jours | > 4 jours (signal de complexité sous-estimée) |
| expo-gl init sans crash | iOS + Android | Crash non résolu en 1 journée |

### Tâches

1. **Init Expo SDK 55** :
   ```bash
   npx create-expo-app@latest apps/mobile --template blank-typescript
   ```
   - `"newArchEnabled": true` dans app.json
   - expo-gl, `@react-three/fiber/native` installés

2. **Script pré-génération textures** (`packages/textures/scripts/generate.ts`) :
   - Port Node de `DiceCanvas.makeNumericFaceTexture()` → 6 PNG faces dé
   - Port Node de `grainTexture.ts` → grain-128.png, grain-256.png
   - Output → `packages/textures/assets/dice/`, `assets/grain/`

3. **Port DiceCanvas → expo-gl** :
   - `Canvas` de `@react-three/fiber` → `Canvas` de `@react-three/fiber/native`
   - `document.createElement('canvas')` + `getContext('2d')` → PNG pré-générés
   - `THREE.CanvasTexture` → `THREE.Texture` avec `require('./assets/face-1.png')`
   - Aucun postprocessing sur le dé → migration directe

4. **Test sur device physique** (pas simulateur) :
   - iPhone 12 ou équivalent + Android mid-range
   - Performance monitor Expo ou `useStats` de drei

5. **Shell minimal** si go :
   - `AppProviders` + `ThemeContext` (port depuis V3)
   - `RouteRenderer` squelette (affiche "TODO" par route)
   - MMKV storage branché sur `@ouiclair/core`
   - EAS account créé, profil `development` configuré

### Fichiers clés
- `apps/mobile/app.json`
- `apps/mobile/App.tsx`
- `apps/mobile/src/game-engine/dice/DiceCanvas.native.tsx`
- `packages/textures/scripts/generate.ts`
- `apps/mobile/eas.json`

---

## Phase 3 — Composants UI ✅
**Durée : 12–18 jours — Fait le 2026-05-14**

### Objectif
Porter les ~20 composants de `app/components/ui/` vers React Native. Bibliothèque utilisée par tous les écrans.

### Composants par complexité — état final

**Simples ✅** (Moti, View/Text) :
Button, Toast, Header, TabBar, AppLogo, MenuCard, GameMenuCard, IconBox, DailyQuestionCard, ErrorBoundary

**Moyens ✅** (BlurView, react-native-svg, Reanimated flip) :
Card, FlipRevealOverlay, PalierUpOverlay, HeatThermometer, QRCode, PositionSVG, ComfortSlider, AdBanner, HeatRoadmapSheet, LegalCredentialSheet

**Complexes ✅** (Reanimated direct) :
CardFullscreenOverlay, CollectorCardFace, ThemeEffects, ExplicitModeToggle
- `CollectorCardFace` portée en Phase 3 (pas Phase 7 comme prévu initialement) ← gain de temps
- `CardFullscreenOverlay` : Reanimated `useSharedValue + useDerivedValue + useAnimatedStyle` (tilt 3D)
  ⚠️ PanResponder modal → tester drag-to-dismiss Android en Phase 7
- `ThemeEffects` : shimmer animé (MotiView) + grain PNG statique (limitation : tiling CSS non reproductible RN, grain cover utilisé à la place — acceptable visuellement)

### Règles de portage appliquées
- `backdrop-blur-*` → `<BlurView intensity={X} tint="dark">` (expo-blur)
- `framer-motion` → Moti pour 95%, Reanimated direct pour CardFullscreenOverlay
- SVG inline → react-native-svg (mêmes balises, import différent)
- `mix-blend-overlay` → supprimé ou opacity fallback (pas de support RN)
- `window.matchMedia('prefers-color-scheme')` → `useColorScheme()` hook RN built-in
- Gradients CSS → couleurs solides pour l'instant. TODO Phase 5b : `expo-linear-gradient ~15.0.8`
- `onClick` → `onPress` (convention RN) — documenté en tête de fichier quand divergence d'API V3

### Fichiers clés
- `apps/mobile/src/components/ui/` — 26 composants + barrel `index.ts`
- `apps/mobile/babel.config.js` — `react-native-reanimated/plugin` en dernier
- `apps/mobile/src/i18n/index.ts` — stub `t(key, params?)` avec substitution `{{var}}`

---

## Phase 4 — Onboarding + Navigation principale
**Durée : 10–12 jours**

### Écrans (11)

**Onboarding/Auth (7)** : OnboardingWizard (4 étapes), AuthScreen, AgeCheckScreen, ThemeSelectScreen, LanguageScreen

**Navigation principale (4)** : HomeScreen (508 lignes), ApprendreScreen, MoiScreen, SettingsScreen

### Points d'attention
- `HomeScreen` : logique 3 niveaux de progression dans @ouiclair/core, JSX seul à réécrire
- `OnboardingWizard` : haptics + dots + auto-advance déjà dans le store → port mécanique
- Auth PocketBase branché sur authStore via @ouiclair/core

---

## Phase 5 — Modules + Ressources
**Découpée en 4 sous-phases suite à audit 2026-05-14**

### Phase 5A ✅ — FichePratiqueScreen + 7 modules batch A

`module-de-base`, `pratiques-base`, `pratiques-avancees`, `pratiques-explicit`, `lexique-consent`, `scenarios-quotidiens`, `bdsm-consent`

Composant `FichePratiqueScreen` générique créé avec gates premium, AnimatePresence entre fiches, 4 sections colorées.
Items = **stubs** (3 items placeholder par module) — les vraies données arrivent Phase 5D.

### Phase 5B ✅ — 7 modules batch B (commit fd47ea5)

`sexting`, `pression-manip`, `rupture-harcele`, `content-non-consenti`, `zones-grises`, `lgbtq-consent`, `alcool-consent`

Même pattern FichePratiqueScreen, items stubs.

### Phase 5C 🔄 En cours — 10 écrans Ressources/Info

`help`, `quiz-hub`, `quiz-consentement`, `porno-vs-realite`, `loi-consentement`, `accompagnement-mineur`, `accompagnement-adulte`, `annuaire-sexologues`, `resources-minor`, `premium`

Écrans hétérogènes (accordéon FAQ, quiz stateful, annuaire, pitch abonnement).

### Phase 5D ✅ — Sprint contenu (commit 8bc5d72)

14 fichiers FR créés avec contenu pédagogique réel (4–10 fiches par module).
14 fichiers EN : 2 traductions complètes (pratiquesAvancees, lgbtqConsent depuis V3), 12 stubs.
Mapping V3 → V4 appliqué : fiches (direct), vraiFaux, quiz, loi, scenarios, lexique.
`fiches-pratiques.ts` : stubs 3-items remplacés par vrais tableaux.
`apps/mobile/src/i18n/index.ts` : résolveur dot-notation réel, multi-locale fr/en.

**Reste :** 12 modules EN à traduire complètement — non-bloquant pour la soumission FR.

### Phase 5b — Features natives critiques (après 5C)

Ces features n'ont aucune dépendance sur Phase 5 — les faire maintenant évite qu'elles bloquent la soumission finale.

| Feature | Lib | Effort |
|---------|-----|--------|
| Auth token sécurisé | `expo-secure-store` remplace localStorage pbToken | 1 j |
| IAP | RevenueCat `react-native-purchases` | 3–4 j |
| Deep links | `expo-linking` + handler dans navigationStore | 1–2 j |
| Haptics natifs | `expo-haptics` remplace useHaptics actuel | 0.5 j |

> **Note IAP / dual-variant** : La stratégie V3 (deux appId `fr.consentement.app` + `fr.consentement.explicit`) est à risque avec Apple (duplicate functionality). Recommandation V4 : **un seul appId**, avec gating interne (age verification + explicit mode toggle activable après vérification 18+). C'est la pratique standard des apps similaires. À trancher avant la configuration RevenueCat.

---

## Phase 6 — Collection + Social
**Durée : 8–12 jours**

### Écrans

**HallOfCards** :
- Carousel + fullscreen → Reanimated gestures + FlatList horizontal
- CollectorCardCanvas → expo-gl avec Bloom + Vignette
- `mipmapBlur: true` → tester d'abord, toggle A/B visuel sur device avant de décider de passer à `false`
- Gyroscope → `expo-sensors` DeviceMotion remplace `window.addEventListener('deviceorientation')`

**DuoSpace** ✅ (commit 8bb909b) :
- EventSource polyfillé via react-native-sse dans App.tsx ✅
- useDuoStore branché (connectDuo, reset, duoConnected)
- Realtime PocketBase (createDuoSession/joinDuoSession) → TODO Phase 7
- AccordFlow overlay avec CollectorCardCanvas → TODO Phase 7
- ⚠️ **DIVERGENCE à corriger Phase 7** : `useDuoStore.updateDuoCode()` applique `.replace(/\D/g, '')` (strip non-digits) — incompatible avec les codes alphanumériques de `duoSync.generateCode()`. DuoSpace contourne via local state pour sessionCode. Aligner le store lors du sprint realtime Phase 7.

**PersonalSpace** ✅ (commit 8bb909b) : feature folder, useProfileStore branché, ComfortSlider + ExplicitModeToggle.

---

## Phase 7 — Jeux R3F
**Durée : 20–30 jours**

### Ordre (du plus simple au plus complexe)

**1. DiceGame** (3–5 j)
- DiceCanvas.native.tsx déjà fait Phase 2 → compléter DiceRenderer, useDiceEngine, GameEndCinematic, écran + overlays

**2. CardGame** (8–12 j)
- CollectorCardCanvas 1247 lignes, Bloom + Vignette
- Tilt → Reanimated (déjà fait Phase 3 pour CardFullscreenOverlay)
- Textures cartes → étendre packages/textures (grainTexture + drawPositionOnCanvas → PNG par rarité/type)
- `window.matchMedia` → `useColorScheme()` RN

**3. GooseGame** (10–15 j)
- BoardGridR3F ~500 lignes, le plus complexe (canvas 2D icon textures intensif)
- Icon textures → étendre packages/textures pour pré-générer PNG depuis iconPaths.ts
- `window.resize` / `window.orientationchange` → `useWindowDimensions()` RN
- ConfettiParticles (drei Sparkles) → compatible expo-gl
- Overlays (AccordFlow, ActivityOverlay, ChanceOverlay) + phases (Intro, Setup, Pacte, End)

### Point de contrôle Bloom
Avant CardGame : tester `mipmapBlur: true` vs `false` sur device. Si crash ou dégradation sévère :
```tsx
<Bloom intensity={0.55} luminanceThreshold={0.45} luminanceSmoothing={0.5} mipmapBlur={false} />
```
Légère perte de précision du Bloom. Ne pas se bloquer là-dessus.

### renderModeStore en V4
Pas de `detect-gpu`. Stratégie V4 :
- `<AdaptiveDpr pixelated>` de drei → adapte automatiquement le devicePixelRatio selon les fps
- `<PerformanceMonitor>` de drei → callback si fps chute, peut réduire la qualité
- Toggle "qualité graphique" dans SettingsScreen pour override utilisateur

---

## Phase 8 — Polish + ATT + Crash reporting
**Durée : 4–6 jours**

| Tâche | Lib | Effort |
|-------|-----|--------|
| ATT framework iOS (App Tracking Transparency) | `expo-tracking-transparency` | 1 j |
| Crash reporting | `@sentry/react-native` | 1 j |
| Safe areas audit final | `react-native-safe-area-context` | 1 j |
| Notifications push (si prévu) | `expo-notifications` | 2–3 j |

---

## Phase 9 — Tests + Publication
**Durée : 8–12 jours**

### Tests

**packages/core** → Vitest (déjà en place, 15 fichiers portés Phase 1, 198 tests OK au 2026-05-14)

**apps/mobile** → Jest + React Native Testing Library :
- Nouveaux tests pour les hooks RN-spécifiques (useRenderMode, mmkvStorage, nativeEventSource)
- Pas de portage exhaustif des tests UI — trop coûteux, coverage visuelle sur device suffit à ce stade

**Flows Maestro (3 critiques)** :
1. Onboarding complet → auth → HomeScreen
2. Module éducatif → gain carte → HallOfCards
3. DiceGame → résultat → session complète

### EAS Build

```json
// eas.json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview":     { "distribution": "internal" },
    "production":  { "autoIncrement": true }
  }
}
```

- Un seul appId (`fr.consentement.app`) — gating interne pour le contenu explicit
- Build iOS : Xcode Cloud ou local avec certificat distribution
- Build Android : keystore géré par EAS

### Publication

1. Screenshots : Simulator (iPhone 15 Pro + Pixel 8) → App Store Connect + Play Console
2. Metadata : réutiliser les textes existants de V3 + vitrine
3. TestFlight beta (iOS) + Google Play Internal Testing → beta testing
4. Contenu sensible : catégorie 17+ iOS, ContentRating IARC Play
5. Soumission production

---

## Stack lockée V4

| Besoin | Lib | Note |
|--------|-----|------|
| Framework | **Expo SDK 55, RN 0.83**, New Architecture | SDK 56 = chantier séparé post-launch |
| Styling | **NativeWind v4** + **Tailwind v3** | NE PAS installer NativeWind v5 (pre-release instable, API en mouvement) |
| Animations 90% | Moti | |
| Animations complexes | Reanimated direct | CardFullscreenOverlay tilt |
| Storage | MMKV `react-native-mmkv` | |
| Auth token | `expo-secure-store` | |
| 3D | `@react-three/fiber/native` + expo-gl | |
| PocketBase realtime | **`react-native-sse`** | Préférer à react-native-event-source (TS natif, mieux maintenu) |
| GPU adapt | AdaptiveDpr + PerformanceMonitor (drei) | Remplace detect-gpu |
| IAP | RevenueCat `react-native-purchases` | |
| Crash | `@sentry/react-native` | |
| Tests | **Vitest** (core) + **Jest + RNTL** (mobile) + Maestro | |
| Build | EAS Build | |
| Monorepo | pnpm workspaces + Turborepo | |

---

## Règles transverses

1. **Feature freeze V3** dès Phase 0. Tag git `v3-freeze` à créer (voir Reste Phase 0).
2. `packages/core` = seul endroit où la logique métier évolue. Jamais dupliquée.
3. Chaque phase se termine par un test sur device physique (pas simulateur).
4. Tout canvas 2D → `packages/textures/scripts/generate.ts` (compile-time). Jamais à runtime.
5. `renderModeStore` V3 n'est pas porté — remplacé par AdaptiveDpr + setting utilisateur.
6. **Un seul appId** pour V4. Gating interne pour le contenu explicit.
7. NativeWind v4 uniquement. Pas de v5 avant stabilisation post-launch.
8. Timeline réaliste : **6–10 mois calendaires** (98–145 jours-homme + 30% buffer imprévus pour solo dev à temps partagé).
