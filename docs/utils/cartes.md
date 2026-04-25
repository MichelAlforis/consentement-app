# Rendu des cartes — État actuel (2026-04-23, màj 2026-04-25)

**Fichiers clés :**
- `app/components/screens/CardGame/PlayingCard.tsx` — composant carte (tilt, foil, swipe, DeckStack, nudge)
- `app/components/screens/CardGame/hooks/useNormalizedPointer.ts` — tracking pointeur normalisé
- `app/components/screens/CardGame/hooks/useCardSession.ts` — logique de session (pioche, favoris, séance)
- `app/components/screens/CardGame/index.tsx` — écran de jeu (pick / playing / end)

> `app/game-engine/cards/CardRenderer.tsx` et `useCardEngine.ts` existent mais sont des composants génériques non utilisés par le jeu de cartes actuel.

---

## Architecture du composant `PlayingCard`

```
div.sizing (maxWidth: 290, aspectRatio: 2/3, position: relative, userSelect: none)
  ├── DeckStack (motion.div × 2, position: absolute, z-index: -1/-2)
  └── motion.div.drag (drag="x", cursor: grab, x, rotate: dragRotate, opacity: dragOpacity)
        └── div.perspective (perspective: 1200px — isolé du drag, swipe reste 2D plat)
              └── animated.div.tilt  ← React Spring (@react-spring/web)
                    (transform: rotateX/Y ±6°, preserve-3d, will-change)
                    └── motion.div.flip (rotateY 0→180, preserve-3d)
                          ├── div.dos (backfaceVisibility: hidden)
                          └── div.face (rotateY(180deg), backfaceVisibility: hidden)
                                └── motion.div.foil (mix-blend-mode: screen)
```

**Décision architecture :** `perspective` est à l'intérieur du drag wrapper — le translate/rotate du swipe reste en 2D plat sans distorsion perspective pendant l'exit.

---

## Ce qui tourne (Niveau 1 ✅ + polish ✅ + Niveau 2 ✅)

### DeckStack — pile fantôme

- 2 couches `motion.div` absolues (`Math.min(remaining, 2)`)
- Au repos : `translateY(depth × 5px)` + `scale(1 - depth × 0.03)` + `opacity: 1 - depth × 0.22`
- Pendant `isAnimating` : couches montent à mi-hauteur via spring `stiffness: 280, damping: 22`
- `deckRemaining` dans `index.tsx` : `seanceSize - cardCount` (séance) ou `3` fixe (libre)

### Swipe pour piocher

- `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic: 0.2`
- Seuil : `|offset.x| > 90` ou `|velocity.x| > 350`
- Exit : `translateX(±500px)` + `rotate(±15deg)` + `opacity: 0` en 280ms, puis `setHideAll(true)`
- `hideAll` masque toute la carte (opacity 0, pointerEvents none) entre l'exit et l'apparition de la suivante — élimine le flash résiduel
- Snap si seuil non atteint : spring `stiffness: 300, damping: 25`
- `dragRotate ±10°` + `dragOpacity 0.5→1→0.5` via `useTransform` sans re-render
- `isExiting` local bloque le double-swipe pendant l'animation de sortie
- `canDrag = !isExiting` — `isAnimating` retiré de `canDrag` : la nouvelle carte est swipeable dès son apparition
- `cursor: grab` / `cursor: grabbing` (desktop)

### Entrée de chaque carte

- Dans `index.tsx` : `AnimatePresence mode="wait"` + `motion.div key={card.id}` autour de `PlayingCard`
- `initial={{ opacity: 0, y: 22 }}` → `animate={{ opacity: 1, y: 0 }}` en 350ms, ease `[0.22, 0.61, 0.36, 1]`
- Reset interne (`setHideAll(false)`, `dragX.set(0)`, `controls.set(...)`, `tiltApi.set(0,0)`) via `useEffect([card.id])`
- Avec `key={card.id}`, `PlayingCard` remonte à chaque nouvelle carte → reset naturel par remontage

### Nudge swipe

- Déclenché à chaque nouvelle carte (le composant remonte via `key={card.id}`, `hasNudged` repart à `false`)
- Délai 950ms (laisse l'entrée se terminer + pause de lecture)
- `animate(dragX, [0, -20, 15, -8, 0], { duration: 0.9 })` — oscillation via la MotionValue directement
- Apprend le geste à l'utilisateur sans texte

### Flip dos→face

- `rotateY: 0 → 180`, durée 520ms, ease `[0.22, 0.61, 0.36, 1]`
- Auto-reveal géré par `useCardSession` (350ms après `startPlaying`, immédiat au moment où `drawNewCard` pose la carte à 480ms)
- `WebkitBackfaceVisibility: 'hidden'` + `WebkitTransformStyle: 'preserve-3d'` sur tous les éléments 3D

### Tilt — Framer Motion useSpring (Niveau 2 ✅)

- `useSpring(sourceMotionValue, { stiffness: 400, damping: 30 })` — Framer Motion natif, pas de lib externe
- `rawRotateX = useTransform(tiltY, [-1,1], [6,-6])` → `tiltRotateX = useSpring(rawRotateX, config)`
- `motion.div` standard dans la chaîne `preserve-3d` — `backfaceVisibility: hidden` intact
- **±6°**, suivi temps réel avec decay spring sur `pointerleave` (useNormalizedPointer reset à 0)
- `useNormalizedPointer` pilote aussi le foil (même hook, deux usages)

### Foil holographique

- **`mix-blend-mode: screen`** — fonctionne sur fond clair ET sombre
- Gradient pastel désaturé `hsl(h, 55%, 78%)` qui suit le pointeur via `useTransform`
- Opacité cible par profondeur :
  - Depth 1 (Osez, Défi) : 0
  - Depth 2 (Parlez, Et si…) : 0.12
  - Depth 3 (Vérité, Douceur) : 0.18
- Désactivé si `theme.id === 'youth'`

---

## Flow UX du step playing

```
1. Carte monte depuis y+22 (350ms)
2. [si première carte] nudge oscillation à t=950ms
3. Flip dos→face auto (350ms après startPlaying)
4. À la révélation, AnimatePresence fait apparaître les actions (delay 200ms) :
   ├── Hint (hintSolo / hintDuo) + bouton ❤️ favori
   ├── CTA "Nouvelle carte" / "Terminer la séance"
   └── "Changer de deck" (lien texte discret, pas de bouton)
5. Swipe ou bouton → exit (280ms) → hideAll → nouvelle carte arrive
```

**Moment de lecture garanti :** les actions sont masquées tant que `isRevealed = false`, ce qui encourage l'utilisateur à lire la carte avant d'agir.

---

## Contenu des faces

### DOS

```
gradient catégorie + dot pattern (rgba blanc 18%, grille 18px)
  emoji central (56px)
  nom de catégorie (13px, bold, uppercase, tracking 0.18em, opacity 70%)
```

### FACE

```
stripe gradient top (8px)
  pill catégorie  "🎭 Osez"  (gradient bg, 11px, bold, alignSelf: flex-start)
  texte de la carte           (15px, weight 500, left-aligned, lineHeight 1.65)
  depth dots                  (si depth > 1 : 3 points, remplis jusqu'à depth)
stripe gradient bottom (5px)
foil overlay (screen, opacity 0 → 0.12/0.18 à la révélation, transition 0.5s)
```

---

## Tableau des features

| Feature | État |
|---------|------|
| Flip dos→face | ✅ rotateY 520ms |
| Pile fantôme (DeckStack) | ✅ 2 couches animées |
| Swipe pour piocher | ✅ seuil 90px / 350px·s⁻¹ |
| Tilt Framer useSpring ±6° | ✅ Niveau 2 — stiffness:400/damping:30 |
| Foil holographique CSS | ✅ screen, depth-aware |
| Entrée animée (slide-up) | ✅ AnimatePresence key={card.id} |
| Nudge swipe | ✅ animate(dragX, keyframes) |
| Moment de lecture (actions masquées) | ✅ AnimatePresence isRevealed |
| iOS Safari stable | ✅ Webkit prefixes |
| Matière de surface WebGL | ❌ Niveau 3 — Three.js |

---

## Timing `drawNewCard` (useCardSession)

```
0ms   → isAnimating=true, isRevealed=false
        swipe exit animation joue dans PlayingCard (280ms)
        hideAll=true, onDraw() appelé

480ms → batch React : nouvelle carte, isRevealed=true, isAnimating=false
        AnimatePresence key change → ancien PlayingCard démonté → nouveau monté
        canDrag=true dès l'apparition (isAnimating retiré de canDrag)

480ms+350ms → nouvelle carte pleinement visible (entrance animation)
```

**Guard double-draw :** `if (isAnimating) return` dans `drawNewCard` — valide pendant les 480ms de transition.

---

## Niveau 3 — Canvas WebGL

Pour Vérité et Douceur (depth 3), canvas Three.js superposé :
- Texture linen/coton procédurale (GLSL)
- Reflet spéculaire directionnel (PointLight virtuel)
- Effet ink-on-paper sur le texte

---

## CollectorCardCanvas R3F (màj 2026-04-25)

**Fichier :** `app/game-engine/cards/CollectorCardCanvas.tsx`

Composant Three.js dédié au card collector. Distinct de `PlayingCard` (CSS gameplay) — ne pas mélanger les deux contextes.

### Contextes d'utilisation

| Contexte | Usage |
|---|---|
| `GameEndCinematic` | Flip reveal dos→face, 2–3 cartes en parallèle |
| Hall of Cards | Carte zoomée plein écran, `isFlipped=true` d'emblée |

### Props

```ts
interface CollectorCardCanvasProps {
  card: GainedCard;       // depuis CardGame/index.tsx
  isFlipped: boolean;     // false = dos, true = face
  size?: number;          // largeur px (défaut 160), hauteur = size × 1.5
  autoFlip?: boolean;     // flip auto après 800ms, indépendant de isFlipped
  onFlipComplete?: () => void;
}
```

### Architecture scène R3F

```
Canvas (dpr [1,1.5], powerPreference low-power, frameloop demand|always)
  camera position [0,0,2.2] fov 45
  color background #0a0810
  └── CardScene
        ├── Selection (contexte SelectiveBloom)
        ├── ambientLight 0.04
        ├── pointLight [3.5, 4, -1.0] intensity 0.16
        ├── pointLight [-3.0, 1, -0.5] intensity 0.06
        ├── RarityLights — rare: violet [0,0.5,-1.5] 0.32 / unique: or+rose
        ├── Environment preset="studio" environmentIntensity 0.12
        ├── ContactShadows position y=-0.80, opacity 0.45, blur 2.2
        ├── CardMesh
        │     └── outerRef <group>   ← wobble Z + arc Y + idle scale (unique)
        │           └── flipRef <group>   ← rotation Y 0→PI
        │                 └── styleRef <group>   ← squash/stretch
        │                       ├── backMesh  ShapeGeometry, MeshBasicMaterial, z +0.001
        │                       └── faceGroup (rotation Y PI)
        │                             ├── glowRing  ShapeGeometry 1.06×1.58 (rare/unique)
        │                             │             dans <Select enabled> → SelectiveBloom
        │                             └── faceMesh  ShapeGeometry, MeshBasicMaterial, z +0.001
        └── EffectComposer
              ├── SelectiveBloom intensity 1.20, threshold 0.30, smoothing 0.60
              └── Vignette offset 0.40, darkness 0.50
```

**Géométrie arrondie :** `makeRoundedCardGeometry(w, h, r)` crée un `THREE.ShapeGeometry` avec coins arrondis (r=0.086 pour la carte, r=0.092 pour le glow ring). Three.js ≥0.163 stocke les UV en coordonnées brutes — le générateur les renormalise manuellement `(x+hw)/w, (y+hh)/h` après création.

**Décision matériau :** `MeshBasicMaterial` — texture affichée exactement, aucune dépendance aux lumières, zéro hotspot. Les lumières de scène servent uniquement aux ombres de contact (`ContactShadows`) et à l'ambiance générale.

### Textures (CanvasTexture, 512×768px)

**Dos** (`makeBackTexture`)
- Fond `#1e1b2e → #2d2640` (gradient linéaire)
- Lignes diagonales `rgba(255,255,255,0.05)`, step 9% de size
- Grain (bands horizontales + sparse highlights, identique Board.tsx)
- Highlight spéculaire radial top-gauche, opacité 6%
- Shimmer diagonal `rgba(255,255,255,0→0.055→0.09→0)`
- Symbole "C" Path2D centré, gradient `#ddd6fe → #a78bfa → #6d28d9`, opacity 0.78
- Bordure gradient violet→rose→violet, lineWidth 2.5, rayon 22px

**Face** (`makeFaceTexture`)

Ordre de composition :
1. Gradient `card.gradient` (parsé via regex `#xxxxxx`)
2. Grain (bands + highlights)
3. Highlight spéculaire top-left, opacité 8%
4. Overlay COMMON : `rgba(20,30,60,0.08)` (légère désaturation bleutée)
5. Vignette radiale `rgba(0,0,0,0→0.42)`, rayon interne `h×0.22`
6. UNIQUE seulement :
   - Compression de luminance centre `rgba(0,0,0,0.28→0)`, rayon `h×0.52`
   - Highlight directionnel top-left→bottom-right `rgba(255,255,255,0.11→0.025)` + ombre `rgba(0,0,0,0.055)`
7. Icône `card.iconName` via `drawIconNodes` — Path2D Lucide, lineWidth `4.2/scale`, couleur `#f1f3f5`
8. Séparateur horizontal `rgba(255,255,255,0.15)`, sous la zone icône
9. Texte `card.text` — font `600 ~50px system-ui`, letterSpacing `size×0.012px`, strokeStyle `rgba(0,0,0,0.30)` lineWidth `size×0.0032`, fill `#f1f3f5`, shadowBlur `size×0.018`
10. Bordure `card.border` lineWidth 5, rayon 22px → Bloom la fait briller
11. Badge rareté (RARE / UNIQUE) en haut à droite
    - RARE : gradient violet `#7c3aed → #a855f7`, texte blanc
    - UNIQUE : fond `#2b1e0f`, filet `rgba(246,211,106,0.55)`, texte `#f6d36a`

**Icône Path2D** (`drawIconNodes`) — 13 icônes : MessageCircle, Heart, Star, Crown, Sparkles, Flame, Zap, Eye, Lock, Gift, Music, Wind, Handshake. Dessinée directement dans `makeFaceTexture` avec `inkColor = '#f1f3f5'` (même couleur que le texte). Cache `iconCache Map` pour `buildIconTexture` (usage futur, non utilisé par la face).

### Effets rareté

| Rareté | Glow ring | Lumière scène | Idle animation |
|---|---|---|---|
| `common` | — | — | — |
| `rare` | opacity 0.38 | violet `#7c3aed` [0,0.5,-1.5] int. 0.32 | — |
| `unique` | opacity 0.55 | or `#f59e0b` [-1.5,1,-1] + rose `#ec4899` [1.5,-1,-1] | `scale = 1 ± 0.006 × sin(t×1.2)` |

**SelectiveBloom :** seul le glow ring est dans `<Select enabled>` — le Bloom ne touche pas les textures de face/dos, garantissant la lisibilité du texte.

### Animation flip

- **Rotation Y** (`flipRef`) : `startRot → targetRot`, durée **0.62s**, `easeOutSnap` (easeOutBack c1=1.0, ~3.7% overshoot)
- **Wobble Z** (`outerRef`) : `sin(πt) × 0.06` — inclinaison ~3.4° dans le sens du flip
- **Arc Y** (`outerRef.position.y`) : `-sin(πt) × 0.18` — légère montée au pivot
- **Squash-stretch** (`styleRef`) post-flip, 0.28s : scaleY 1→0.96→1.02→1, scaleX inverse demi-amplitude
- **Idle UNIQUE** (`outerRef.scale`) : `sin(idleT × 1.2) × 0.006`, compteur `idleT ref` — actif hors flip/bounce
- `triggerFlip()` par changement `isFlipped` ou `autoFlip` (setTimeout 800ms)
- `onFlipComplete` à `t=1` (début squash)

### Gestion frameloop (perf mobile)

- `'always'` pendant flip + cartes `unique` (idle animation continue)
- `'demand'` au repos pour `common` et `rare`
- Transition : `isFlipped/autoFlip` change → `setFrameloop('always')` → flip → `onFlipComplete` → `setFrameloop('demand')`

### Fallback CSS (`CSSCardFallback`)

Déclenché si WebGL crash (`CanvasBoundary`) ou avant mount 60ms. Flip via `transform: rotateY` CSS, `perspective: 600px`. Utilise `DynamicIcon` pour l'icône.

### Pattern mount différé

`setTimeout 60ms` avant de monter le `Canvas`. Sur iOS, `AnimatePresence` swap synchroniquement — le container n'a pas ses dimensions au mount, ce qui provoque un Canvas 0×0.

### Contraintes

- Ne pas toucher `PlayingCard.tsx` — composant CSS gameplay, contexte différent
- `GainedCard` type défini dans `CardGame/index.tsx` — source unique
- Pas de store, pas de logique métier dans ce composant
- Ne pas repasser sur `MeshPhysicalMaterial` — cause des hotspots d'éclairage incontrôlables sur mobile
