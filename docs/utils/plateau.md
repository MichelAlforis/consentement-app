# Rendu du plateau — État actuel → 2026

**Fichiers clés :**
- `app/game-engine/board/BoardRenderer.tsx` — rendu configurable (moteur générique)
- `app/game-engine/board/useBoardEngine.ts` — logique de déplacement, activités
- `app/components/screens/GooseGameScreen/components/Board.tsx` — implémentation Jeu de l'Oie (ne pas modifier)

---

## État actuel

### Ce qui tourne

**Grille 2D**
- Layout calculé dynamiquement : `buildLayout(totalSquares, columns, snake)` → tableau 2D d'indices
- Serpentin : lignes impaires inversées
- Cellules en `aspectRatio: '1 / 1'` + `minHeight: 44px` — s'adaptent à la largeur du conteneur
- `maxWidth: columns × 85px` — limite la taille sur grands écrans

**Cellules**
- Fond : `gradient` de `SquareConfig` ou `rgba(255,255,255,0.06)` si absent
- Bordure : blanche `0.95` si case active, blanche `0.10` sinon
- Emoji type en `fontSize: 18`
- Animation active : scale pulse `[1, 1.07, 1]` en boucle Infinity / scale flash `[1, 1.2, 1]` + glow blanc pendant l'animation de déplacement

**Pions**
- `AnimatePresence` + `layoutId` sur chaque pion → animation spring d'entrée/sortie sur chaque case
- Entrée : `scale: 0.4, opacity: 0` → `scale: 1, opacity: 1` (spring stiffness 400, damping 22)
- N pions sur la même case s'affichent côte à côte

**Flèches de direction**
- Optionnelles (`layout.snake === true`)
- `→` ou `←` selon la parité de la ligne, aligné à droite/gauche

**Légende**
- `BoardLegend` exporté séparément, passé via prop `legend?: LegendEntry[]`
- Chaque entrée : carré coloré (10px, borderRadius 3) + emoji + label

### Limitations actuelles

| Problème | Impact |
|----------|--------|
| Vue de dessus, projection orthographique | Pas de profondeur — c'est une feuille de papier |
| Cases toutes de la même forme (rectangles) | Pas de distinction visuelle forte entre les types |
| Le chemin parcouru n'est pas tracé | On ne voit pas d'où on vient |
| Les pions sont des emojis dans un carré arrondi | Peu de présence physique |
| Le déplacement du pion est une mise à jour de position | Pas d'animation de "vol" entre cases (le pion n'existe pas entre les cases) |
| La grille ne communique pas l'intensité croissante | Toutes les zones ont le même visuel |

---

## Vers 2026

### Niveau 1 — Vue isométrique CSS (zéro nouvelle dép, 3–5 jours)

La projection isométrique transforme une grille plate en monde 2.5D. Chaque case "se soulève" du plan — on passe d'un tableur à un jeu de plateau physique.

**Transformation CSS globale**

```tsx
// Appliquée au conteneur de la grille
const ISO_TRANSFORM = `
  rotateX(45deg)
  rotateZ(45deg)
  scale(0.72)
`;

// Les cellules gardent leur forme — la projection iso est portée par le parent
<div style={{ transform: ISO_TRANSFORM, transformOrigin: 'center center' }}>
  {/* grille normale */}
</div>
```

**Faces latérales des cases**

Pour créer l'illusion de volume sur chaque case, deux pseudo-éléments (ou `<div>`) simulent les faces gauche et basse :

```tsx
// Face gauche (ombre)
<div style={{
  position: 'absolute',
  left: 0, bottom: -depth,
  width: '100%', height: depth,
  background: 'rgba(0,0,0,0.35)',
  transform: 'rotateX(-90deg)',
  transformOrigin: 'bottom center',
}} />

// Face droite (lumière)
<div style={{
  position: 'absolute',
  right: -depth, top: 0,
  width: depth, height: '100%',
  background: 'rgba(255,255,255,0.12)',
  transform: 'rotateY(90deg)',
  transformOrigin: 'right center',
}} />
```

**Cases spéciales surélevées**

Les cases Accord, Complicité et Arrivée ont une `depth` plus grande → elles ressortent du plan, attirant l'œil naturellement.

```ts
const SQUARE_DEPTH: Record<SquareKind, number> = {
  normal:  8,
  start:  12,
  end:    16,
  special: 14,
};
```

**Pions**

En vue iso, les pions doivent être "anti-transformés" pour rester lisibles :

```tsx
<motion.span style={{
  display: 'inline-block',
  transform: `rotateZ(-45deg) rotateX(-45deg) scale(1.4)`,
  fontSize: 18,
}}>
  {pion.emoji}
</motion.span>
```

---

### Niveau 2 — Chemin lumineux + animation de déplacement (1–2 jours)

**Trail de progression**

Un SVG superposé à la grille trace le chemin parcouru par chaque joueur. Les cases visitées ont un gradient de couleur qui s'estompe vers le présent.

```tsx
// SVG overlay — même dimensions que la grille
// Polyline calculée depuis les positions visitées (history)
<svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
  <polyline
    points={visitedSquares.map(idx => `${centerX(idx)},${centerY(idx)}`).join(' ')}
    stroke={`url(#trail-gradient)`}
    strokeWidth={3}
    fill="none"
    strokeLinecap="round"
    strokeDasharray="4 8"
    opacity={0.45}
  />
  <defs>
    <linearGradient id="trail-gradient">
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor={player.color} />
    </linearGradient>
  </defs>
</svg>
```

**Animation de déplacement "arc"**

Plutôt qu'un simple changement de position, le pion décrit un arc entre les cases — comme un vrai pion qui saute.

```tsx
// Pour chaque case franchie (hop)
await controls.start({
  x: [fromX, midX, toX],   // position interpolée
  y: [fromY, midY - 24, toY], // arc : monte au milieu du saut
  scale: [1, 1.3, 1],
  transition: { duration: 0.18, ease: 'easeInOut' },
});
vibrate(30);
```

---

### Niveau 3 — React Three Fiber isométrique (avancé)

Même approche que le dé — un canvas WebGL pour le plateau.

**Ce que R3F apporte**

| Feature | CSS iso | R3F |
|---------|---------|-----|
| Lumière sur les cases | Simulée (gradient) | Réelle (ambiant + directionnel) |
| Ombre des pions | Absente | ContactShadows |
| Cases avec matière | Gradient CSS | MeshStandardMaterial |
| Hover 3D | Scale CSS | Elevation + glow dynamique |
| Brouillard de distance | Impossible | `<fog attach="fog" />` |

**Matière des cases**

```tsx
// Case normale
<MeshStandardMaterial color={squareColor} roughness={0.6} metalness={0.1} />

// Case Accord (spéciale)
<MeshStandardMaterial
  color="#60a5fa"
  roughness={0.2}
  metalness={0.4}
  emissive="#1a3a6a"
  emissiveIntensity={0.3}
/>
```

**Pions 3D**

Remplacer l'emoji par une sphère coloriée ou un token rond avec le prénom gravé :
```tsx
<mesh position={[x, y, 0.6]}>
  <sphereGeometry args={[0.28, 32, 32]} />
  <MeshPhysicalMaterial
    color={player.color}
    clearcoat={1}
    clearcoatRoughness={0}
    metalness={0.1}
  />
</mesh>
```

---

### Tableau récap

| Feature | Maintenant | Niveau 1 | Niveau 2 | Niveau 3 |
|---------|-----------|---------|---------|---------|
| Grille serpentin | ✅ | ✅ | ✅ | ✅ |
| Vue isométrique | ❌ | ✅ CSS | ✅ | ✅ WebGL |
| Cases avec volume | ❌ | ✅ pseudo-3D | ✅ | ✅ vrai 3D |
| Cases surélevées selon type | ❌ | ✅ | ✅ | ✅ |
| Trail de progression | ❌ | ❌ | ✅ SVG | ✅ |
| Arc de déplacement pion | ❌ | ❌ | ✅ | ✅ physique |
| Matière + lumière | ❌ | simulée | simulée | ✅ PBR |
| Pions 3D | ❌ | emoji iso | emoji iso | ✅ mesh |
| Légende | ✅ | ✅ | ✅ | ✅ |

---

## Notes d'implémentation

**Ordre des transformations CSS iso**

L'ordre `rotateX` → `rotateZ` est critique. L'inverser donne un résultat différent. Toujours tester avec un conteneur carré parfait au début.

**Clipping en vue iso**

La projection iso peut faire "sortir" le plateau du viewport. Prévoir `overflow: hidden` sur le parent avec un padding compensatoire, ou ajuster le `scale()` dynamiquement (`useContainerSize` hook).

**Accessibilité**

En vue iso, les lecteurs d'écran ne voient pas la disposition visuelle. Maintenir un tableau HTML caché (`aria-hidden="false"`, visuellement `hidden`) avec les positions des joueurs pour Screen Reader.

**Désactivation sur petits écrans**

Sous 360px de largeur, la vue iso peut être trop comprimée. Fallback sur la vue 2D actuelle via `useMediaQuery('(max-width: 360px)')`.
