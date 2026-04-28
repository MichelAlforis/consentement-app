# CollectorCardCanvas — Documentation technique

> Composant R3F de la carte collector — flip 3D, textures Midjourney, logo watermark.  
> Sandbox de test : `/card-collector-test`  
> Tests de régression visuelle : `e2e/visual-regression.spec.ts` — **6/6 passed** (2026-04-28)

---

## Exports publics

| Export | Usage |
|---|---|
| `CollectorCardCanvas` | Widget standalone avec son propre `<Canvas>` — CardGame, hall-of-cards |
| `CardMesh` | Mesh 3D pur, utilisable dans **toute scène R3F** — GooseGame, DiceGame, futurs jeux |
| `RarityLights` | Lumières de rareté, positionnables dans la scène hôte |
| `CardMeshProps` | Interface TypeScript de `CardMesh` |

### Usage dans une scène R3F existante

```tsx
import { CardMesh, RarityLights } from '../cards/CollectorCardCanvas';

// Dans le JSX R3F (GooseGame, DiceGame...) :
<group position={[x, y, z]} scale={0.5}>
  <Suspense fallback={null}>
    <CardMesh card={card} isFlipped={isFlipped} enableBloom={false} />
  </Suspense>
  <RarityLights rarity={card.rarity} />
</group>
```

**`enableBloom`** (défaut `true`) : passer `false` dans les scènes sans `<Selection>` context — les glow rings restent visibles sans post-processing bloom.

---

## Architecture

```
CollectorCardCanvas          ← export public, gère mounted + frameloop
  └─ CanvasBoundary          ← error boundary React : crash Canvas → CSS fallback
       └─ <Canvas R3F>
            ├─ <color> #0a0810
            └─ CardScene
                 ├─ lights (ambientLight, pointLights, RarityLights)
                 ├─ <Selection>            ← contexte SelectiveBloom
                 ├─ <Suspense fallback=null>
                 │    ├─ CardMesh         ← useLoader PNGs + textures Canvas
                 │    └─ ContactShadows
                 └─ PostFXBoundary        ← isole EffectComposer
                      └─ <EffectComposer>
                           ├─ SelectiveBloom
                           └─ Vignette
```

### Deux error boundaries

| Boundary | Portée | Comportement si crash |
|---|---|---|
| `CanvasBoundary` | Tout le `<Canvas>` | Affiche `CSSCardFallback` (flip CSS, gradient) |
| `PostFXBoundary` | `<EffectComposer>` seul | Retire le bloom, cartes restent visibles |

---

## Textures

### Back (dos de carte)

```ts
const backPng = useLoader(THREE.TextureLoader, '/cards/card-back.png');
const backTex = useMemo(
  () => makeBackTexture(512, backPng.image as HTMLImageElement),
  [backPng],
);
```

`makeBackTexture(size, refImage?)` :
- **Avec PNG** : draw Midjourney → vignette → symbole logo → border
- **Sans PNG** (fallback) : gradient `#010007→#0c0920→#3b1f85` + diamond grid + halos + shimmer + symbole + border

### Face (recto de carte)

```ts
const [refCommon, refRare, refUnique] = useLoader(THREE.TextureLoader, [
  '/cards/deck-a-face.png',
  '/cards/deck-b-face.png',
  '/cards/unique-foil.png',
]);
const faceTex = useMemo(
  () => makeFaceTexture(card, 512, refTex.image as HTMLImageElement),
  [card, refTex],
);
```

`makeFaceTexture(card, size, refImage?)` :
- Gradient rareté → PNG Midjourney à 50% → watermark symbole (opacity 0.07) → grain → specular → vignette → effets rareté → icône → texte → badge rareté → border

**Typographie (canvas 512px, affiché à `cardSize` px) :**

| Paramètre | Valeur canvas | Rendu à 140px | Rendu à 160px |
|---|---|---|---|
| Font size | `size * 0.108` = 55 px | ~15 px | ~17 px |
| Line height | `size * 0.148` = 76 px | ~21 px | ~23 px |
| Shadow blur | `size * 0.028` = 14 px | — | — |
| Shadow (fond clair) | `rgba(0,0,0,0.70)` | — | — |
| Shadow (fond sombre) | `rgba(0,0,0,0.92)` | — | — |

> Police visuelle = `canvas_font × (cardSize / 512)`. Minimum lisible sur mobile = 13 px → taille carte minimum = 140 px.

**Taille minimale de carte : 140 px** — en dessous le texte descend sous 13 px.

### Règle colorSpace

**Obligatoire** sur chaque `CanvasTexture` :
```ts
tex.colorSpace = THREE.SRGBColorSpace;
```
`TextureLoader` l'applique automatiquement. `CanvasTexture` reste en `NoColorSpace` par défaut → couleurs ternes sans ce fix.

---

## Fichiers PNG source

| Fichier | Usage | Taille |
|---|---|---|
| `/public/cards/card-back.png` | Dos — texture Midjourney quilted violet | ~2,4 Mo |
| `/public/cards/deck-a-face.png` | Face common — texture Midjourney | ~1 Mo |
| `/public/cards/deck-b-face.png` | Face rare — texture Midjourney | ~970 Ko |
| `/public/cards/unique-foil.png` | Face unique — texture foil iridescente | ~976 Ko |

---

## Symbole / Logo watermark

`BACK_SYMBOL_PATH` — path SVG 7 Ko codé en dur dans le composant (évite un fetch réseau).

- **Dos** : gradient `#ddd6fe → #a78bfa → #6d28d9`, opacity `0.72`, fill `evenodd`
- **Face** : blanc `rgba(255,255,255,1)`, opacity `0.07` (très subtil)
- Centré et mis à l'échelle selon `size` via `Math.min(size/336, h/1044) * 0.85`

---

## Animations

| Animation | Durée | Description |
|---|---|---|
| Reveal | 0.4 s | Entrée depuis `y = -3` → `y = 0` (easeOutCubic) |
| Flip | 0.52–0.70 s selon rareté | `flipRef.rotation.y` (easeOutSnap) + wobble Z + arc Y |
| Bounce atterrissage | 0.28 s | Squash-stretch sur `styleRef.scale` |
| Idle unique | continu | `scale` pulsation sin |
| Idle rare | continu | `position.y` flottement sin |
| Particles unique | continu | 12 points en orbite, rotation + opacité sin |
| Glow rare | continu | Opacity ring sin via `glowMat2Ref` |
| Glow unique | continu | HSL shift arc-en-ciel 25°/s via `uniqueGlowRef` |

**`frameloop`** : démarre à `'always'`, passe à `'demand'` après flip (common/rare) pour économiser le GPU. Repasse à `'always'` si `isFlipped` ou `autoFlip` change.

### LightOverlay — effets 2D superposés

Composant CSS/Framer Motion positionné en `position: absolute; inset: 0; z-index: 2; pointer-events: none` au-dessus du Canvas.

**Deux couches :**
1. **Radial gyroscope** — `<div ref>` mis à jour via rAF sans re-render React. Gradient elliptique centré sur la position de tilt `(gamma, beta)` → `(x%, y%)`.
2. **Shimmer sweep** — `motion.div` diagonal `x: '-110%' → '110%'`, `repeat: 2` (s'arrête après 2 passages).

**Conditions de désactivation :**
- `size < 140` → gyroscope désactivé (gradient invisible, coût GPU pour rien)
- `prefers-reduced-motion: reduce` → shimmer ET gyroscope désactivés (a11y + mal des transports)

**Gradients par rareté :**
| Rareté | Gyro | Shimmer |
|---|---|---|
| unique | HSL hue shift avec l'angle de tilt — arc-en-ciel holographique | triple bande colorée (or/violet/cyan) |
| rare | Radial violet `rgba(192,132,252,0.40)` | Bande violette simple |
| common | Radial blanc `rgba(255,255,255,0.28)` | Bande blanche subtile |

**iOS 13+ permission :**
```tsx
// requestPermission() doit être dans un geste utilisateur
document.addEventListener('click', onGesture, { capture: true, once: true });
document.addEventListener('touchstart', onGesture, { capture: true, once: true, passive: true });
```
Le listener se déclenche au premier tap et s'auto-supprime. Sur Android : registration automatique, pas de permission.

### Haptiques par rareté

`triggerFlip` appelle `vibrate()` deux fois :
- Début de flip : `vibrate('light')` — toujours
- Fin de flip face-up : `vibrate('heavy')` unique · `vibrate('medium')` rare · `vibrate('light')` common

`useHaptics` accepte `'light' | 'medium' | 'heavy'` → `ImpactStyle.Light/Medium/Heavy` sur Capacitor, `navigator.vibrate(20/60/150ms)` en fallback.

---

## Géométrie

`makeRoundedCardGeometry(w, h, r)` crée une `THREE.ShapeGeometry` avec coins arrondis.

**Fix UV obligatoire** (Three.js ≥ 0.163) :
```ts
// Three.js utilise x/y brut comme UV — remapper vers [0..1]
for (let i = 0; i < pos.count; i++) {
  uv.setXY(i, (pos.getX(i) + hw) / w, (pos.getY(i) + hh) / h);
}
```
Sans ce fix les textures ne s'affichent pas correctement.

---

## Matériaux

**`MeshBasicMaterial` exclusivement** — aucune dépendance à la lumière ou à l'environnement.

- Texture affichée exactement telle quelle (pas de gamma PBR)
- Zéro hotspot mobile
- Compatible WebGL 1 et WebGL 2

> **Ne pas passer à `MeshStandardMaterial`** sans tester les performances sur iOS (Capacitor).

---

## Compatibilité Safari / iOS

### Problèmes connus et fixes

**`<Environment preset="studio">` supprimé** (2026-04-26)  
Ce composant de `@react-three/drei` chargeait un fichier HDR depuis un CDN externe. Il suspendait toute la `<Suspense>` boundary — sur Safari (strict privacy ou CDN lent), la Suspense ne se résolvait jamais → cartes invisibles indéfiniment. `MeshBasicMaterial` n'utilise pas l'environnement HDR, sa suppression est sans impact visuel.

**`PostFXBoundary`** autour de `<EffectComposer>`  
Si `SelectiveBloom` ou `Vignette` crash (WebGL 2 extensions manquantes sur iOS 13-14), le boundary retire silencieusement le post-processing. Les cartes restent visibles sans bloom.

**Canvas props mobile-friendly** :
```tsx
gl={{ antialias: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false }}
```

### Niveaux de dégradation

```
iOS 15+ WebGL 2 OK    → Rendu complet (textures + flip + bloom + vignette)
iOS 15+ PostFX fail   → PostFXBoundary retire bloom, cartes visibles
iOS 13-14 WebGL 1     → CanvasBoundary → CSS fallback (gradient + flip CSS)
No WebGL du tout      → CanvasBoundary → CSS fallback
```

---

## Usage dans Next.js App Router

**Import obligatoirement en `dynamic({ ssr: false })`** :

```tsx
import dynamic from 'next/dynamic';

const CollectorCardCanvas = dynamic(
  () => import('../game-engine/cards/CollectorCardCanvas')
    .then(m => ({ default: m.CollectorCardCanvas })),
  { ssr: false },
);
```

Three.js/R3F utilise `document`, `window`, `WebGLRenderingContext` — incompatibles SSR.

---

## Props

```ts
interface CollectorCardCanvasProps {
  card: GainedCard;        // { id, text, rarity, gradient, border, iconName }
  isFlipped: boolean;      // true = face visible
  size?: number;           // largeur px (défaut 160, hauteur = size * 1.5)
  onFlipComplete?: () => void;
}
```

> **`autoFlip` supprimé** — le flip est piloté par l'état parent (`isFlipped`), pas par le composant lui-même. Le parent gère les timers et peut toggler l'état au tap.

---

## CSS Fallback

`CSSCardFallback` — affiché si Canvas crash ou pendant les 60ms de montage :
- Flip CSS 3D via `rotateY` + `perspective`
- Dos : gradient `#1e1b2e → #2d2640`
- Face : `card.gradient` + `card.border` + icône `DynamicIcon` + texte tronqué à 50 chars
- Badge rareté rare/unique
- `fontSize: Math.round(size * 0.08)` — scale avec la taille de carte (11px@140, 13px@160) au lieu de 9px fixe

---

---

## CardUnlockReveal — UX fin de séance

Composant interne à `CardGame/index.tsx` — affiché dans l'écran `end` après une séance complète.

### Comportement

```
t=0ms        → fin de séance, gainedCards calculées
t=300ms      → carte 0 apparaît (scale 0.72→1, opacity 0→1) + whileTap scale(0.94)
t=300+800ms  → carte 0 se retourne (dos→face)
t=1400ms     → hint apparaît (300 + 800 + 300 = juste après le 1er flip)
t=850ms      → carte 1 apparaît (stagger +550ms)
t=850+800ms  → carte 1 se retourne
```

Tap sur une carte : `vibrate('light')` + toggle `isFlipped` (retourner dans les deux sens).

### Taille dynamique

| Nombre de cartes | `size` | Hauteur | Layout |
|---|---|---|---|
| 1 | 160 px | 240 px | centré |
| 2 | 150 px | 225 px | centré, gap-4 |
| 3+ | 140 px | 210 px | **scroll horizontal snap** |

**Règle mobile :** ne jamais afficher 3 cartes côte à côte à taille fixe. À 3+ cartes, le conteneur est `overflow-x-auto snap-x snap-mandatory` — 2 cartes visibles + bord du 3e pour signifier le scroll. `scrollbarWidth: none` pour masquer la scrollbar native.

**Taille minimale = 140 px** — en dessous, le texte canvas descend sous 13 px (illisible).

### Écran end complet

```
Sparkles icon (entrée spring)
"Belle séance !" + stats
Badges paquets explorés
─── CardUnlockReveal (si gainedCards > 0) ───
  label "N CARTE(S) DÉBLOQUÉE(S)"
  cartes côte à côte, stagger, auto-flip
  hint tap-to-retourner (apparaît en dernier)
─────────────────────────────────────────────
Insight box (texte contextuel selon themes)
[Nouvelle séance]        ← primary CTA
[Continuer en mode libre] ← secondary
[Voir ma collection →]   ← tertiary, visible si gainedCards > 0
```

### i18n

Clé ajoutée dans `cardGame` (fr/en/es) : `viewCollection`.

## Icônes disponibles

Dessinées en Canvas 2D via `drawIconNodes` (pipeline identique à `Board.tsx`) :

`MessageCircle`, `Heart`, `Star`, `Crown`, `Sparkles`, `Flame`, `Zap`, `Eye`, `Lock`, `Gift`, `Music`, `Wind`, `Handshake`
