# Rendu des cartes — État actuel → 2026

**Fichiers clés :**
- `app/game-engine/cards/CardRenderer.tsx` — rendu configurable (moteur générique)
- `app/game-engine/cards/useCardEngine.ts` — logique de pioche, favoris, historique
- `app/components/screens/CardGameScreen.tsx` — écran de jeu existant (ne pas modifier)

---

## État actuel

### Ce qui tourne

**Structure de la carte**
```
conteneur drag (motion.div, drag="x")
  └── perspective wrapper (600px)
        └── flip container (preserve-3d, rotateY animé)
              ├── Dos (backfaceVisibility: hidden)
              │     gradient backGradient + emoji + label + hints
              └── Face (backfaceVisibility: hidden, rotateY(180deg))
                    gradient + emoji + texte + indicateur de profondeur (3 dots)
```

**DeckStack — pile fantôme**
- 2 à 3 `<div>` absolus derrière la carte active
- Chaque couche : `translateY(depth × 5px)` + `scale(1 - depth × 0.03)` + opacité décroissante
- Nombre de couches limité à `Math.min(remaining, 3)` — la pile se vide visuellement

**Swipe horizontal**
- `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic: 0.2`
- Seuil de déclenchement : `|offset.x| > 90` ou `|velocity.x| > 350`
- Animation de sortie : `translateX(±500px)` + `rotate(±18deg)` + `opacity: 0` en 280ms
- Snap spring si seuil non atteint : `stiffness: 300, damping: 25`
- `dragOpacity` + `dragRotate` via `useTransform` — feedback visuel pendant le drag

**Flip dos→face**
- Déclenché au tap si `!isRevealed`
- `rotateY: 0 → 180`, durée 520ms, ease `[0.22, 0.61, 0.36, 1]`
- Reset automatique via `useEffect([card?.id])` quand une nouvelle carte est tirée

**iOS Safari fix**
- `WebkitBackfaceVisibility: 'hidden'` sur chaque face en plus du standard — évite le bug où les deux faces sont visibles simultanément

### Limitations actuelles

| Problème | Impact |
|----------|--------|
| Le dos et la face ont le même éclairage plat | Pas de relief — c'est un rectangle sur un écran |
| Le flip est unidirectionnel (toujours rotateY) | Pas de dimension physique — une vraie carte peut tourner dans n'importe quel axe |
| Pas de réponse à la position du doigt/capteur | La carte ne "suit" pas la lumière |
| La pile ne s'anime pas quand on pioche | Le retrait d'une carte de la pile est invisible |
| Le fond de la face (gradient) est identique à la catégorie | La face et le dos peuvent se confondre visuellement |

---

## Vers 2026

### Niveau 1 — Tilt parallax + foil holographique (zéro nouvelle dép, 2–3 jours)

C'est le changement avec le ROI le plus élevé. Une carte **collector** en 2026.

**Parallax tilt**

La carte s'incline en 3D selon la position du doigt (touch) ou de la souris (desktop).

```tsx
// Tracking de position normalisée (-1 → +1) sur la surface de la carte
const { x, y } = useNormalizedPointer(cardRef); // custom hook

// Transformations appliquées à la carte
const rotateX = useTransform(y, [-1, 1], [12, -12]); // deg
const rotateY = useTransform(x, [-1, 1], [-12, 12]);
const translateZ = useTransform(
  [x, y],
  ([xv, yv]) => Math.sqrt(xv * xv + yv * yv) * 8 // 0 → 8px de profondeur
);

// Highlight spéculaire qui suit le doigt
const specularX = useTransform(x, [-1, 1], [0, 100]); // %
const specularY = useTransform(y, [-1, 1], [0, 100]);
```

Le résultat : la carte réagit à la main comme un objet physique. On "sent" le relief.

**Foil holographique**

Le foil est une couche en `position: absolute, inset: 0, mix-blend-mode: color-dodge` qui affiche un gradient arc-en-ciel dont l'angle et la position dépendent de la position du doigt.

```tsx
// Gradient qui tourne avec le tilt
const hue = useTransform(x, [-1, 1], [0, 360]);
const foilGradient = useTransform(
  [x, y, hue],
  ([xv, yv, hueV]) =>
    `radial-gradient(
      ellipse at ${(xv + 1) * 50}% ${(yv + 1) * 50}%,
      hsl(${hueV}, 100%, 70%) 0%,
      hsl(${hueV + 60}, 100%, 60%) 25%,
      hsl(${hueV + 120}, 100%, 65%) 50%,
      transparent 70%
    )`
);
```

Opacité du foil :
- Dos : 0 (le dos est opaque, pas de foil)
- Face révélée : 0.28 pour une carte normale, 0.45 pour une carte `depth: 3`
- Le foil peut être désactivé si `theme.id === 'youth'` (trop adulte pour les mineurs)

**Animation de pioche**

Quand `onDraw()` est appelé (swipe), la carte du dessous de la pile doit "remonter" :
```
Carte active → sortie (swipe)
Couche -1 → scale(1 - 0.03) → scale(1) + translateY(5px → 0px)  // spring
Couche -2 → scale(1 - 0.06) → scale(1 - 0.03)
```

---

### Niveau 2 — Carte physique avec React Spring (dépendance légère)

`@react-spring/web` est plus adapté que Framer Motion pour des animations basées sur la vélocité continue (suivi de doigt).

**Ce que ça change**
- Le tilt suit le doigt en temps réel sans délai perceptible (spring à `tension: 400, friction: 30`)
- Le retour à plat quand le doigt quitte la carte est naturel (spring decay)
- La rotation du drag est un vrai spring physique, pas une ease function

**Compatibilité** : `@react-spring/web` peut coexister avec Framer Motion — pas besoin de migrer l'existant.

---

### Niveau 3 — Canvas WebGL pour les effets de surface (avancé)

Pour les cartes premium (depth 3, adultes), un canvas Three.js superposé à la carte DOM :
- Texture de linen/coton procédurale (bruit fractal GLSL)
- Reflet spéculaire directionnel (PointLight virtuel suivi par le doigt)
- Effet "ink on paper" sur le texte (displacement map légère)

Réservé aux cartes Vérité et Douceur pour marquer visuellement leur caractère profond.

---

### Tableau récap

| Feature | Maintenant | Niveau 1 | Niveau 2 | Niveau 3 |
|---------|-----------|---------|---------|---------|
| Flip dos→face | ✅ | ✅ | ✅ | ✅ |
| Pile fantôme | ✅ | ✅ amélioration animation | ✅ | ✅ |
| Swipe pour piocher | ✅ | ✅ | ✅ spring | ✅ |
| Tilt parallax | ❌ | ✅ | ✅ physique | ✅ |
| Foil holographique | ❌ | ✅ CSS | ✅ CSS | ✅ WebGL |
| Matière de surface | ❌ | ❌ | ❌ | ✅ WebGL |
| iOS Safari stable | ✅ | ✅ | ✅ | ✅ |

---

## Notes d'implémentation

**Où ajouter le tilt**

Le tilt doit être sur le conteneur `CardRenderer`, pas dans le flip container. Le flip (`rotateY`) s'applique sur l'enfant — les deux transforms s'appliquent en cascade via `perspective`.

```
conteneur tilt (rotateX, rotateY selon pointer)
  └── flip container (rotateY 0/180)
        ├── Dos
        └── Face + foil layer
```

**Performance**

- Utiliser `will-change: transform` sur le conteneur tilt
- Throttle l'event `pointermove` à 60fps via `requestAnimationFrame`
- Le foil gradient doit être en `useTransform` (pas `useState`) pour éviter les re-renders

**Désactivation conditionnelle**

```tsx
const { reducedMotion } = useReducedMotion(); // @react-spring ou media query
// Si reducedMotion : tilt désactivé, flip remplacé par fade
```
