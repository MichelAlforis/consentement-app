# Rendu des cartes — État actuel (2026-04-23, màj 2026-04-23)

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

### Tilt — React Spring physique (Niveau 2 ✅)

- `useSpring({ rotX: 0, rotY: 0, config: { tension: 400, friction: 30 } })` via `@react-spring/web`
- Handlers `pointermove` / `pointerleave` bruts (pas de rAF) → `tiltApi.start({ rotX, rotY })`
- `animated.div` avec `to([rotX, rotY], (rx, ry) => \`rotateX(${rx}deg) rotateY(${ry}deg)\`)` dans la chaîne `preserve-3d`
- **±6°**, suivi temps réel sans délai perceptible (vs ease Framer Motion Niveau 1)
- Retour à plat naturel via decay spring sur `pointerleave`
- `useNormalizedPointer(cardRef)` conservé pour piloter le foil (Framer MotionValues) — les deux libs coexistent sans conflit
- `tiltApi.set({ rotX: 0, rotY: 0 })` dans le reset on new card

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
| Tilt React Spring ±6° | ✅ Niveau 2 — tension:400/friction:30 |
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
