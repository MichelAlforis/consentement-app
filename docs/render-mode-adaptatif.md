# Render Mode Adaptatif — CSS ou R3F selon l'appareil

> **Décision architecturale** : l'app n'utilise jamais les deux renderers simultanément.
> Au démarrage, le mode est déterminé une seule fois et s'applique globalement.

---

## Pourquoi cette approche

### État actuel — cohabitations identifiées

Avant la mise en place du mode adaptatif, cinq incohérences de rendu ont été documentées :

| Écran | Problème |
|---|---|
| **GooseGame Board** | `BoardGridR3F` si WebGL détecté, `BoardGridCSS` sinon — résultat visuel différent selon l'appareil |
| **GooseGame Dice** | `BoardDice3D` → `makeNumericFaceTexture` (R3F) toujours actif, même quand le Board est en mode CSS |
| **GooseGame AccordFlow** | `CollectorCardCanvas` R3F (carte preview 120px) dans un écran potentiellement rendu en CSS |
| **DiceGame intro** | Charge un contexte WebGL pour une image statique du dé (preview non-interactif) |
| **HallOfCards** | Carousel CSS + fullscreen R3F — mixing volontaire mais visuellement inconsistant |

Ces incohérences se produisent parce que chaque composant décide localement de son renderer. Le mode adaptatif centralise cette décision.

---

### Le problème de la cohabitation

Pendant le développement, deux renderers coexistaient dans l'app :

- **R3F (WebGL)** : `CollectorCardCanvas`, `DiceCanvas`, `BoardGridR3F`, `BoardDice3D`, `GameEndCinematic`
- **CSS 3D** : `Cube6`, `CSSCardFallback`, `BoardGridCSS`, tilt Framer Motion

Cette cohabitation crée trois problèmes concrets :

1. **Limite des 16 contextes WebGL** — Safari iOS et Chromium Android ne permettent que 16 Canvas WebGL simultanés. Sur les écrans avec plusieurs cartes révélées + plateau + dé, on dépasse facilement cette limite, ce qui provoque des Canvas noirs silencieux.

2. **Fragmentation de la logique visuelle** — un bug de rendu peut venir du renderer CSS *ou* du renderer R3F. Difficile à diagnostiquer, impossible à tester de façon uniforme.

3. **Bundle inutilement lourd** — charger Three.js + @react-three/fiber (~180 ko gzippé) sur un appareil qui ne s'en servira jamais est un gaspillage direct de mémoire de démarrage.

### Le public cible

L'app vise 12–18 ans. Le parc réel en France 2024–2025 :

| Segment | Appareils typiques | Part estimée | GPU tier |
|---|---|---|---|
| Bas de gamme | Samsung A13/A14, Wiko, anciens iPhone SE 1 | ~35% | 0 |
| Milieu | Samsung A23/A33, iPhone SE 2020, Xiaomi Redmi | ~40% | 1 |
| Haut de gamme | iPhone 13/14, Samsung S21+ | ~20% | 2–3 |
| Très récent | iPhone 15/16, Samsung S24 | ~5% | 3 |

**Conséquence** : ~75% du parc est en tier 0–1. Forcer R3F sur ces appareils = chutes de framerate, surchauffe, drain batterie, et potentiellement des crashs WebGL.

---

## La solution — Mode adaptatif unique

Au démarrage de l'app (une seule fois, ~50 ms), `detect-gpu` évalue le GPU de l'appareil et attribue un tier de 0 à 3.

**Règle unique** :

```
tier 0 ou 1  →  renderMode = 'css'
tier 2 ou 3  →  renderMode = 'r3f'
```

Ce mode est stocké dans un store global. **Tous les composants lisent ce mode et n'utilisent qu'un seul renderer.** Aucune cohabitation, aucun fallback en cascade, pas de Canvas monté puis abandonné.

---

## Architecture

### Fichiers à créer

```
app/
├── stores/
│   └── renderModeStore.ts          ← store Zustand (ou Context simple)
├── providers/
│   └── RenderModeProvider.tsx      ← detect-gpu au mount, set store
└── hooks/
    └── useRenderMode.ts            ← hook de lecture du mode
```

### Fichiers à modifier (câblage)

```
app/
├── game-engine/
│   ├── dice/
│   │   └── DiceRenderer.tsx        ← brancher prop renderer={renderMode}
│   └── cards/
│       └── CollectorCardCanvas.tsx ← court-circuiter Canvas si mode css
├── components/screens/
│   └── GooseGameScreen/
│       └── components/
│           └── Board.tsx           ← remplacer useWebGLSupport() par useRenderMode()
└── game-engine/shared/
    └── GameEndCinematic.tsx        ← skip si mode css
```

### Arborescence d'initialisation

```
_layout.tsx (root)
└── RenderModeProvider              ← detect-gpu ici, une seule fois
    └── ... reste de l'app
        ├── DiceRenderer            ← lit renderMode, passe renderer= prop
        ├── CollectorCardCanvas     ← lit renderMode, skip Canvas si css
        ├── Board                   ← lit renderMode, branch R3F ou CSS
        └── GameEndCinematic        ← lit renderMode, skip si css
```

---

## Implémentation détaillée

### 1. `renderModeStore.ts`

```typescript
import { create } from 'zustand';

type RenderMode = 'css' | 'r3f' | 'pending';

interface RenderModeStore {
  mode: RenderMode;
  setMode: (mode: 'css' | 'r3f') => void;
}

export const useRenderModeStore = create<RenderModeStore>((set) => ({
  mode: 'pending',
  setMode: (mode) => set({ mode }),
}));
```

### 2. `RenderModeProvider.tsx`

```typescript
import { useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';
import { useRenderModeStore } from '@/stores/renderModeStore';

export function RenderModeProvider({ children }: { children: React.ReactNode }) {
  const setMode = useRenderModeStore((s) => s.setMode);

  useEffect(() => {
    getGPUTier().then((tier) => {
      // tier.tier : 0 (inconnu/blocklist), 1 (bas), 2 (moyen), 3 (haut)
      setMode(tier.tier >= 2 ? 'r3f' : 'css');
    });
  }, []);

  return <>{children}</>;
}
```

### 3. `useRenderMode.ts`

```typescript
import { useRenderModeStore } from '@/stores/renderModeStore';

export function useRenderMode(): 'css' | 'r3f' {
  const mode = useRenderModeStore((s) => s.mode);
  // Tant que la détection est en cours → CSS par défaut (safe)
  return mode === 'pending' ? 'css' : mode;
}
```

### 4. Câblage — `DiceRenderer.tsx`

```typescript
// Avant
<DiceRenderer renderer="webgl" ... />

// Après (dans le parent qui instancie DiceRenderer)
const renderMode = useRenderMode();
<DiceRenderer renderer={renderMode} ... />
```

La prop `renderer` existe déjà dans `DiceRenderer`. Aucune modification interne nécessaire.

### 5. Câblage — `CollectorCardCanvas.tsx`

```typescript
// En haut du composant
const renderMode = useRenderMode();

// Court-circuit avant tout montage Canvas
if (renderMode === 'css') {
  return <CSSCardFallback card={card} isFlipped={isFlipped} size={size} />;
}

// Suite normale avec Canvas R3F...
```

Ceci évite de monter puis démonter le Canvas — le composant R3F n'est jamais instancié en mode css.

### 6. Câblage — `Board.tsx`

```typescript
// Remplacer
const webgl = useWebGLSupport(); // hook local à supprimer

// Par
const renderMode = useRenderMode();

// Puis
if (renderMode === 'r3f') {
  return <BoardGridR3F {...props} />;
}
return <BoardGridCSS {...props} />;
```

`useWebGLSupport()` peut être supprimé — son rôle est désormais rempli par le store global.

### 7. Câblage — `GameEndCinematic.tsx`

```typescript
const renderMode = useRenderMode();

// La cinématique est une couche optionnelle — on la skip proprement
if (renderMode === 'css') return null;

// Suite normale...
```

---

## Comportement attendu par appareil

### Mode CSS (`tier 0–1`)

- Dé : `Cube6` CSS (6 faces, bounce, glow thème)
- Cartes : `CSSCardFallback` + shimmer + tilt gyro Framer Motion
- Plateau : `BoardGridCSS` isométrique
- Tilt fullscreen : gyro + pointer spring (déjà purement CSS/Framer)
- Cinématique fin : absente (fade simple)
- Contextes WebGL ouverts : **0**

### Mode R3F (`tier 2–3`)

- Dé : `DiceCanvas` R3F (PBR, clearcoat, ContactShadows)
- Cartes : `CollectorCardCanvas` R3F (Bloom, particles UniqueCard, glow rings)
- Plateau : `BoardGridR3F` 3D isométrique + `BoardDice3D`
- Tilt fullscreen : tilt gyro + pointer (identique, Framer Motion)
- Cinématique fin : `GameEndCinematic` R3F (Sparkles, MeshDistortMaterial)
- Contextes WebGL ouverts : **2 max simultanément** (plateau + dé)

---

## Ce que le mode adaptatif n'est PAS

- Ce n'est pas un fallback en cascade (monter R3F, échouer, charger CSS)
- Ce n'est pas une détection `useWebGLSupport()` par composant
- Ce n'est pas configurable par l'utilisateur (pas de toggle dans les settings)
- Ce n'est pas recalculé à chaque navigation — il est déterminé **une seule fois** au démarrage

---

## État d'implémentation

| Composant | Fallback CSS | Câblage mode adaptatif |
|---|---|---|
| `DiceRenderer` | ✅ existe (`Cube6`) | 🔲 à câbler |
| `CollectorCardCanvas` | ✅ existe (`CSSCardFallback`) | 🔲 court-circuit à ajouter |
| `Board` | ✅ existe (`BoardGridCSS`) | 🔲 remplacer `useWebGLSupport` |
| `BoardDice3D` | ✅ (non rendu si Board CSS) | 🔲 cohabitation active à corriger |
| `AccordFlow` (GooseGame) | ✅ (`CSSCardFallback`) | 🔲 cohabitation active à corriger |
| `DiceGame intro` (preview dé) | ✅ image statique CSS | 🔲 supprimer Canvas WebGL inutile |
| `HallOfCards` fullscreen | ✅ tilt Framer Motion | 🔲 retirer `CollectorCardCanvas` R3F |
| `GameEndCinematic` | ✅ (`return null`) | 🔲 à câbler |
| `RenderModeProvider` | — | 🔲 à créer |
| `renderModeStore` | — | 🔲 à créer |
| `useRenderMode` | — | 🔲 à créer |

---

## Dépendance npm

```bash
npm install detect-gpu
```

`detect-gpu` utilise un benchmark WebGL léger + une base de données de ~3000 GPU référencés. Il fonctionne dans Capacitor (WebView iOS/Android). Taille : ~15 ko gzippé.

---

## Effort d'implémentation estimé

| Tâche | Durée |
|---|---|
| `detect-gpu` + `RenderModeProvider` + store + hook | 2h |
| Câblage `DiceRenderer` | 30 min |
| Câblage `CollectorCardCanvas` | 1h |
| Câblage `Board` (supprimer `useWebGLSupport`) | 1h |
| Câblage `GameEndCinematic` | 30 min |
| Tests simulateur iOS + Android | 2h |
| **Total** | **~7h** |
