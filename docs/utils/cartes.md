# Rendu des cartes — État actuel (2026-04-23)

**Fichiers clés :**
- `app/components/screens/CardGame/PlayingCard.tsx` — composant carte (tilt, foil, swipe, DeckStack)
- `app/components/screens/CardGame/hooks/useNormalizedPointer.ts` — tracking pointeur normalisé
- `app/components/screens/CardGame/hooks/useCardSession.ts` — logique de session (pioche, favoris, séance)
- `app/components/screens/CardGame/index.tsx` — écran de jeu (pick / playing / end)

> `app/game-engine/cards/CardRenderer.tsx` et `useCardEngine.ts` existent mais sont des composants génériques non utilisés par le jeu de cartes actuel.

---

## Architecture du composant `PlayingCard`

```
div.sizing (maxWidth: 290, aspectRatio: 2/3, position: relative)
  ├── DeckStack (motion.div × 2, position: absolute, z-index: -1/-2)
  └── motion.div.drag (drag="x", x, rotate: dragRotate, opacity: dragOpacity)
        └── div.perspective (perspective: 1200px — isolé du drag, swipe reste 2D plat)
              └── motion.div.tilt (rotateX/Y ±6°, preserve-3d, will-change)
                    └── motion.div.flip (rotateY 0→180, preserve-3d)
                          ├── div.dos (backfaceVisibility: hidden)
                          └── div.face (rotateY(180deg), backfaceVisibility: hidden)
                                └── motion.div.foil (mix-blend-mode: screen)
```

**Décision architecture :** `perspective` est à l'intérieur du drag wrapper — le translate/rotate du swipe reste en 2D plat sans distorsion perspective pendant l'exit.

---

## Ce qui tourne (Niveau 1 ✅)

### DeckStack — pile fantôme

- 2 couches `motion.div` absolues (`Math.min(remaining, 2)`)
- Au repos : `translateY(depth × 5px)` + `scale(1 - depth × 0.03)` + `opacity: 1 - depth × 0.22`
- Pendant `isAnimating` : couches montent à mi-hauteur (`y × 0.5`, `scale × 0.5`) via spring `stiffness: 280, damping: 22`
- `deckRemaining` dans `index.tsx` : `seanceSize - cardCount` (séance) ou `3` fixe (libre)

### Swipe pour piocher

- `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic: 0.2`
- Seuil : `|offset.x| > 90` ou `|velocity.x| > 350`
- Exit : `translateX(±500px)` + `rotate(±15deg)` + `opacity: 0` en 280ms
- Snap si seuil non atteint : spring `stiffness: 300, damping: 25`
- `dragRotate ±10°` + `dragOpacity 0.5→1→0.5` via `useTransform` sans re-render
- `isExiting` local bloque le double-swipe pendant l'animation de sortie

### Flip dos→face

- `rotateY: 0 → 180`, durée 520ms, ease `[0.22, 0.61, 0.36, 1]`
- Auto-reveal géré par `useCardSession` (350ms après `startPlaying`, immédiat après `drawNewCard`)
- Reset via `useEffect([card.id])` : `dragX.set(0)` + `controls.set({ rotate: 0, opacity: 1 })`
- `WebkitBackfaceVisibility: 'hidden'` + `WebkitTransformStyle: 'preserve-3d'` sur tous les éléments 3D (fix iOS Safari)

### Tilt parallax

- `useNormalizedPointer(cardRef)` → deux `MotionValue<number>` (-1 → +1) depuis `pointermove`
- Throttlé via `requestAnimationFrame`, reset à 0 sur `pointerleave`
- **±6°** (naturel, comme une carte tenue en main — ±12° était trop agressif)

```tsx
const tiltRotateX = useTransform(tiltY, [-1, 1], [6, -6]);
const tiltRotateY = useTransform(tiltX, [-1, 1], [-6, 6]);
```

### Foil holographique

- **`mix-blend-mode: screen`** (et non `color-dodge`) — fonctionne sur fond clair ET sombre, pas de fond noir
- Gradient pastel désaturé qui suit le pointeur (zéro re-render via `useTransform`) :

```tsx
const hue = useTransform(tiltX, [-1, 1], [0, 360]);
const foilBg = useTransform(
  [tiltX, tiltY, hue],
  ([xv, yv, h]) =>
    `radial-gradient(ellipse at ${(xv+1)*50}% ${(yv+1)*50}%,
      hsl(${h}, 55%, 78%) 0%,
      hsl(${h+60}, 55%, 75%) 35%,
      hsl(${h+120}, 55%, 78%) 65%,
      transparent 80%)`,
);
```

- Opacité par profondeur (`DECK_DEPTH: { 1:1, 4:1, 2:2, 3:2, 5:3, 6:3 }`) :
  - Depth 1 (Osez, Défi) : 0 — pas de foil
  - Depth 2 (Parlez, Et si…) : **0.12**
  - Depth 3 (Vérité, Douceur) : **0.18**
- Transition `animate={{ opacity }}` 0.5s à la révélation
- Désactivé si `theme.id === 'youth'`

---

## Contenu des faces

### DOS (dos de carte)

```
gradient catégorie (couleur du deck)
  dot pattern (rgba blanc 18%, grille 18px)
  corner emoji top-left     (15px, opacity 25%)
  corner emoji bottom-right (15px, opacity 25%, rotate 180°)
  emoji central             (56px)
  nom de catégorie          (13px, bold, uppercase, tracking 0.18em, opacity 70%)
```

Pas de texte d'instruction — le geste de swipe est intuitif.

### FACE (face révélée)

```
stripe gradient top (8px)
  pill catégorie  "🎭 Osez"  (gradient bg, 11px, bold)
  texte de la carte           (15px, weight 500, left-aligned, lineHeight 1.65)
  depth dots                  (si depth > 1 : 3 points, remplis jusqu'à depth)
stripe gradient bottom (5px)
foil overlay (screen, opacity 0 → 0.12/0.18 à la révélation)
```

**Texte left-aligned** (pas centré) — meilleure lisibilité sur les phrases longues.

---

## Tableau des features

| Feature | État |
|---------|------|
| Flip dos→face | ✅ rotateY 520ms |
| Pile fantôme (DeckStack) | ✅ 2 couches animées |
| Swipe pour piocher | ✅ seuil 90px / 350px·s⁻¹ |
| Tilt parallax ±6° | ✅ useNormalizedPointer |
| Foil holographique CSS | ✅ screen, depth-aware |
| iOS Safari stable | ✅ Webkit prefixes |
| Spring physique (suivi doigt) | ❌ Niveau 2 — @react-spring/web |
| Matière de surface WebGL | ❌ Niveau 3 — Three.js |

---

## Niveau 2 — Carte physique avec React Spring

`@react-spring/web` pour un tilt sans délai perceptible.

- Spring `tension: 400, friction: 30` — tilt temps réel vs ease Framer
- Retour à plat naturel par decay sur `pointerleave`
- Coexiste avec Framer Motion — pas de migration du flip/swipe

## Niveau 3 — Canvas WebGL

Pour Vérité et Douceur (depth 3), canvas Three.js superposé :
- Texture linen/coton procédurale (GLSL)
- Reflet spéculaire directionnel (PointLight virtuel)
- Effet ink-on-paper sur le texte
