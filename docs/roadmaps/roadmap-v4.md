# V4 Roadmap — Migration Next.js + Capacitor → Expo React Native

## Contexte

**V4 = l'app Expo React Native.** Décision prise le 2026-05-14 : migrer l'app Consentement/OuiClair (37K LOC, 45 écrans, 3 Canvas R3F, 92 fichiers framer-motion) de Next.js + Capacitor vers Expo React Native. Cible exclusive iOS + Android. App pas encore en production — c'est le bon moment.

**Versions :**
- V1–V2 : prototypes early
- V3 : stack actuelle (Next.js + Capacitor + R3F) — **gelée Phase 0, archivée à la sortie V4**
- **V4 : Expo SDK 55 + RN 0.83 (stable, mai 2026)**
  - SDK 56 beta disponible (RN 0.85 + React 19.2) — attendre stable avant d'upgrader, chantier séparé

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

| Phase | Nom | Durée est. | En parallèle | Livrable clé |
|-------|-----|-----------|--------------|--------------|
| 0 | Monorepo étendu | 2–3 j | — | workspace prêt, Turborepo, TS refs |
| 1 | packages/core | 10–15 j | — | stores + utils portables, Vitest vert |
| 2 | POC R3F/native + shell Expo | 5–7 j | — | Dé 3D sur device → go/no-go |
| 3 | Composants UI | 12–18 j | — | ~20 composants RN validés |
| 4 | Onboarding + Nav principale | 10–12 j | — | 11 écrans navigables |
| 5 | Modules + Ressources | 15–20 j | **Phase 5b** | 24 écrans contenu |
| 5b | Features natives critiques | 8–10 j | **Phase 5** | secure-store + IAP + deep links |
| 6 | Collection + Social | 8–12 j | — | HallOfCards, DuoSpace |
| 7 | Jeux R3F | 20–30 j | — | DiceGame → CardGame → GooseGame |
| 8 | Polish + ATT + Sentry | 4–6 j | — | app prête stores |
| 9 | Tests + Publication | 8–12 j | — | EAS build, soumission |
| **Total** | | **102–145 j** | | **6–10 mois calendaires** (+30% buffer imprévus) |

---

## Phase 0 — Monorepo étendu
**Durée : 2–3 jours**

### Objectif
Étendre le monorepo existant pour accueillir `apps/mobile/` et `packages/core/` sans toucher à l'app root gelée.

### Tâches

1. **Geler V3** : créer un tag git `v3-freeze` sur le commit actuel.

2. **Ajouter les workspaces** dans `package.json` racine :
   ```json
   "workspaces": ["apps/vitrine", "apps/mobile", "packages/core", "packages/textures"]
   ```

3. **Setup Turborepo** :
   ```bash
   pnpm add -Dw turbo
   ```
   - `turbo.json` avec pipelines `build`, `test`, `dev`
   - Caching local activé

4. **TypeScript project references** :
   - `tsconfig.base.json` à la racine (shared compiler options)
   - Chaque package/app étend la base

5. **Créer les squelettes vides** :
   - `packages/core/package.json` + `src/index.ts`
   - `packages/textures/package.json` + `src/`
   - `apps/mobile/` → init Expo en Phase 2

6. **Vérifier** : `pnpm install` résout tout, `pnpm build:main` passe encore.

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

`packages/core` tourne en Node pur → **garder Vitest**. Les 28 tests existants sont en quasi-totalité sur de la logique pure (stores, utils) → portage quasi direct, pas de réécriture Jest. Seuls les tests avec `document.querySelectorAll` (OnboardingWizard.test.tsx) restent dans V3 root ou sont adaptés.

### Validation
- `pnpm test:unit` : tous les tests Vitest passent, imports depuis `@ouiclair/core`
- `pnpm dev` (V3 root) : app Next.js fonctionne toujours

### Fichiers clés
- `packages/core/src/stores/` (11 fichiers)
- `packages/core/src/utils/` (8 fichiers)
- `packages/core/src/storage/IStorage.ts`
- `packages/core/src/realtime/IRealtimeAdapter.ts`
- `packages/core/src/lib/pb.ts` + `sync/duoSync.ts`

---

## Phase 2 — POC R3F/native + shell Expo
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

## Phase 3 — Composants UI
**Durée : 12–18 jours**

### Objectif
Porter les ~20 composants de `app/components/ui/` vers React Native. Bibliothèque utilisée par tous les écrans.

### Composants par complexité

**Simples** (Moti, View/Text) :
Button, Toast, Header, TabBar, AppLogo, MenuCard, GameMenuCard, IconBox, ComfortSlider, ExplicitModeToggle

**Moyens** (BlurView, react-native-svg, Reanimated flip) :
Card, FlipRevealOverlay, PalierUpOverlay, HeatThermometer, QRCode (`react-native-qrcode-svg`), PositionSVG (447 lignes SVG → react-native-svg, paths portables tels quels)

**Complexes** (attente ou Reanimated direct) :
- `CollectorCardFace + CardBack` → attendre Phase 7
- `CardFullscreenOverlay` → Reanimated `useSharedValue + useDerivedValue + useAnimatedStyle` (tilt 3D)
- `ThemeEffects` → effets shimmer/grain adaptés RN

### Règles de portage
- `backdrop-blur-*` → `<BlurView intensity={X} tint="dark">` (expo-blur)
- `framer-motion` → Moti pour 95%, Reanimated direct pour CardFullscreenOverlay
- SVG inline → react-native-svg (mêmes balises, import différent)
- `mix-blend-overlay` → supprimé ou opacity fallback (pas de support RN)
- `window.matchMedia('prefers-color-scheme')` → `useColorScheme()` hook RN built-in (réagit aux changements, contrairement à `Appearance.getColorScheme()`)
- `iconFromName.tsx` : si utilisé dans core → créer `IIcon` abstraction. Si mobile-only → lucide-react-native direct.

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

## Phase 5 — Modules + Ressources ‖ Phase 5b — Features natives critiques
**Phases en parallèle — durée 15–20 jours**

### Phase 5 : 24 écrans de contenu

**Modules éducatifs (14)** : `module-de-base`, `pratiques-base`, `pratiques-avancees`, `pratiques-explicit`, `lexique-consent`, `scenarios-quotidiens`, `bdsm-consent`, `sexting`, `pression-manip`, `rupture-harcele`, `content-non-consenti`, `zones-grises`, `lgbtq-consent`, `alcool-consent`

Pattern : FichePratiqueScreen comme base, i18n via useTranslation(), ScrollView + composants Phase 3.

**Ressources/Info (10)** : `help`, `quiz-hub`, `quiz-consentement`, `porno-vs-realite`, `loi-consentement`, `accompagnement-mineur`, `accompagnement-adulte`, `annuaire-sexologues`, `resources-minor`, `premium`

**ScenarioGame (1)** : jeu textuel pur, port direct.

### Phase 5b : Blockers stores (en parallèle)

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

**DuoSpace** :
- PocketBase realtime via react-native-sse (IRealtimeAdapter, branché en Phase 1)
- `useDuoSession` hook : logique dans @ouiclair/core, hook React dans apps/mobile
- AccordFlow overlay avec CollectorCardCanvas

**PersonalSpace** : port direct, pas de R3F.

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

**packages/core** → Vitest (déjà en place, 28 tests portés Phase 1)

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

1. **Feature freeze V3** dès Phase 0. Tag git `v3-freeze` créé.
2. `packages/core` = seul endroit où la logique métier évolue. Jamais dupliquée.
3. Chaque phase se termine par un test sur device physique (pas simulateur).
4. Tout canvas 2D → `packages/textures/scripts/generate.ts` (compile-time). Jamais à runtime.
5. `renderModeStore` V3 n'est pas porté — remplacé par AdaptiveDpr + setting utilisateur.
6. **Un seul appId** pour V4. Gating interne pour le contenu explicit.
7. NativeWind v4 uniquement. Pas de v5 avant stabilisation post-launch.
8. Timeline réaliste : **6–10 mois calendaires** (98–145 jours-homme + 30% buffer imprévus pour solo dev à temps partagé).
