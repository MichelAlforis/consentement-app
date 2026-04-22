# Rendu des cartes — État actuel (2026-04-22)

**Fichiers clés :**
- `app/components/screens/CardGame/PlayingCard.tsx` — composant carte avec tilt, foil, swipe, DeckStack
- `app/components/screens/CardGame/hooks/useNormalizedPointer.ts` — tracking pointeur normalisé
- `app/components/screens/CardGame/hooks/useCardSession.ts` — logique de session (pioche, favoris, séance)
- `app/components/screens/CardGame/index.tsx` — écran de jeu (pick / playing / end)

> **Note :** `app/game-engine/cards/CardRenderer.tsx` et `useCardEngine.ts` existent mais sont des composants génériques non utilisés par le jeu de cartes actuel.

---

## État actuel (Niveau 1 ✅)

### Structure du composant `PlayingCard`

```
div.sizing (maxWidth: 290, aspectRatio: 2/3, position: relative)
  ├── DeckStack (motion.div × 2, position: absolute, z-index: -1/-2)
  └── motion.div.drag (drag="x", x, rotate: dragRotate, opacity: dragOpacity)
        └── div.perspective (perspective: 1200px — isolé des transforms 2D du drag)
              └── motion.div.tilt (rotateX, rotateY ±12° depuis pointeur, preserve-3d)
                    └── motion.div.flip (rotateY 0→180, preserve-3d)
                          ├── div.dos (backfaceVisibility: hidden)
                          └── div.face (rotateY(180deg), backfaceVisibility: hidden)
                                └── motion.div.foil (mix-blend-mode: color-dodge)
```

**Décision clé :** `perspective` est sur un wrapper à l'intérieur du drag wrapper — ainsi le translate/rotate du swipe reste en 2D plat, sans distorsion perspective pendant l'exit.

### DeckStack — pile fantôme

- 2 couches `motion.div` absolues derrière la carte active (`Math.min(remaining, 2)`)
- Au repos : couche i → `translateY(depth × 5px)`, `scale(1 - depth × 0.03)`, `opacity: 1 - depth × 0.2`
- Pendant `isAnimating` (draw en cours) : couches montent à mi-hauteur (`y: depth × 2.5px`, `scale(1 - depth × 0.015)`) via spring `stiffness: 280, damping: 22`
- `deckRemaining` calculé dans `index.tsx` : `seanceSize - cardCount` (mode séance) ou `3` fixe (mode libre)

### Swipe horizontal pour piocher

- `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic: 0.2`
- Seuil : `|offset.x| > 90` ou `|velocity.x| > 350`
- Exit : `translateX(±500px)` + `rotate(±18deg)` + `opacity: 0` en 280ms (`ease: 'easeIn'`)
- Snap si seuil non atteint : spring `stiffness: 300, damping: 25`
- `dragRotate` + `dragOpacity` via `useTransform` — feedback pendant le drag sans re-render
- Garde `isExiting` local pour bloquer un double swipe pendant l'animation de sortie

### Flip dos→face

- `rotateY: 0 → 180`, durée 520ms, ease `[0.22, 0.61, 0.36, 1]`
- Auto-reveal géré par `useCardSession` (350ms après `startPlaying`, immédiat après `drawNewCard`)
- Reset via `useEffect([card.id])` : `dragX.set(0)` + `controls.set({ rotate: 0, opacity: 1 })`
- `WebkitBackfaceVisibility: 'hidden'` sur chaque face (fix iOS Safari)

### Tilt parallax

- `useNormalizedPointer(cardRef)` : écoute `pointermove` sur la carte, retourne deux `MotionValue<number>` (-1 → +1)
- Throttlé via `requestAnimationFrame` (annulé/relancé à chaque move)
- Reset à 0 sur `pointerleave` (retour à plat naturel)
- Transforms appliquées sur le tilt wrapper (enfant du drag wrapper, parent du flip) :

```tsx
const tiltRotateX = useTransform(tiltY, [-1, 1], [12, -12]); // deg
const tiltRotateY = useTransform(tiltX, [-1, 1], [-12, 12]);
```

- `will-change: transform` sur le tilt wrapper

### Foil holographique

- Couche `motion.div` en `position: absolute, inset: 0` à l'intérieur de la face
- `mix-blend-mode: color-dodge`
- Gradient réactif au pointeur (zéro re-render, 100% `useTransform`) :

```tsx
const hue = useTransform(tiltX, [-1, 1], [0, 360]);
const foilBg = useTransform(
  [tiltX, tiltY, hue],
  ([xv, yv, h]) =>
    `radial-gradient(ellipse at ${(xv + 1) * 50}% ${(yv + 1) * 50}%,
      hsl(${h}, 100%, 70%) 0%,
      hsl(${h + 60}, 100%, 60%) 25%,
      hsl(${h + 120}, 100%, 65%) 50%,
      transparent 70%)`,
);
```

- Opacité cible par profondeur (`DECK_DEPTH: { 1:1, 4:1, 2:2, 3:2, 5:3, 6:3 }`) :
  - Depth 1 (Osez, Défi) : 0 — pas de foil
  - Depth 2 (Parlez, Et si…) : 0.28
  - Depth 3 (Vérité, Douceur) : 0.45
- Transition `animate={{ opacity }}` 0.4s à la révélation
- Désactivé si `theme.id === 'youth'`

---

## Tableau des features

| Feature | État |
|---------|------|
| Flip dos→face | ✅ rotateY 520ms |
| Pile fantôme (DeckStack) | ✅ 2 couches, animées au draw |
| Swipe pour piocher | ✅ seuil 90px / 350px/s |
| Tilt parallax ±12° | ✅ useNormalizedPointer |
| Foil holographique CSS | ✅ color-dodge, depth-aware |
| iOS Safari stable | ✅ WebkitBackfaceVisibility |
| translateZ (profondeur pointer) | ❌ Niveau 1 non implémenté |
| Spring physique (suivi doigt) | ❌ Niveau 2 — @react-spring/web |
| Matière de surface WebGL | ❌ Niveau 3 — Three.js |

---

## Vers le Niveau 2

### Niveau 2 — Carte physique avec React Spring

`@react-spring/web` pour un suivi de doigt sans délai perceptible.

**Ce que ça ajoute**
- Tilt suit le doigt en temps réel (spring `tension: 400, friction: 30` vs ease Framer)
- Retour à plat naturel par decay quand le doigt quitte la carte
- Drag rotation en spring physique plutôt qu'ease function

**Compatibilité** : `@react-spring/web` coexiste avec Framer Motion — pas besoin de migrer le swipe/flip.

---

### Niveau 3 — Canvas WebGL pour les effets de surface

Pour les cartes Vérité et Douceur (depth 3), canvas Three.js superposé à la carte DOM :
- Texture linen/coton procédurale (bruit fractal GLSL)
- Reflet spéculaire directionnel (PointLight virtuel suivi par le doigt)
- Effet "ink on paper" sur le texte (displacement map légère)
