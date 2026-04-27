# Pion — Modélisation & Mouvement → 2026

**Fichiers clés :**
- `app/components/screens/GooseGameScreen/components/Board.tsx` — rendu pion dans `PawnSvg`
- `app/components/screens/GooseGameScreen/hooks/usePawnAnimation.ts` — logique de déplacement
- `app/data/goose-game.ts` — `PAWN_ICONS`
- `app/components/screens/GooseGameScreen/phases/SetupPlayer.tsx` — choix du pion

---

## Niveau 1 — Livré ✅

### Modélisation

Un pion = un emoji dans un badge translucide, anti-transformé pour rester lisible en vue ISO.

```tsx
<motion.span
  layoutId="pawn-0"
  style={{
    fontSize: 14,
    background: 'rgba(255,255,255,0.22)',
    borderRadius: 6,
    padding: '1px 3px',
    transform: 'rotateZ(-45deg) rotateX(-45deg) scale(1.4)',
  }}
>
  {p0Pawn}
</motion.span>
```

- 6 icônes Lucide : `['Zap', 'Leaf', 'Wind', 'Moon', 'Star', 'Dice5']` (`PAWN_ICONS`) — le pion de J1 retiré du choix de J2
- Deux pions sur la même case : affichage côte à côte

### Mouvement

`layoutId` Framer Motion — spring stiffness 400 / damping 22. **Le pion téléporte** : il n'existe pas entre les cases.

- Une case toutes les 210 ms via `animatingPos` (surcharge temporaire de la position réelle)
- Haptique 30 ms par case (`useHaptics`)
- Glow blanc 380 ms sur la case d'arrivée avant l'overlay
- Position réelle mise à jour uniquement dans le callback `onDone`
- Anti-stale-closure : `gameRef` sans deps + `animTimerRef` annulable au démontage

---

## Niveau 2 — Token coloré + arc CSS

### Modélisation ✅ Livré

- Pion = SVG 75 px, forme pion classique : base ellipse + corps trapèze + tête sphère + icône Lucide
- Couleurs distinctes J1 / J2 via `PAWN_COLORS` dans `app/data/goose-game.ts`
- Identité visuelle : `Player.pawn` = nom d'icône Lucide (ex. `"Zap"`, `"Moon"`)

Structure SVG (couches) :
```svg
<!-- Ombre sol -->
<ellipse cx="30" cy="77" rx="16" ry="3.5" fill="rgba(0,0,0,0.28)" />

<!-- Base ellipse : couleur + bord sombre radial -->
<ellipse cx="30" cy="65" rx="19" ry="6.5" fill={color} />

<!-- Corps trapèze : couleur + shading cylindrique horizontal -->
<!-- Gradient : sombre-gauche → highlight → transparent → sombre-droite -->
<polygon points="11,65 19,30 41,30 49,65" fill={color} />
<polygon points="11,65 19,30 41,30 49,65" fill="url(#cylindrical-shading)" />

<!-- Tête : radialGradient highlight haut-gauche -->
<circle cx="30" cy="22" r="13" fill="url(#head-gradient)" />

<!-- Icône Lucide via foreignObject (remplace l'ancien <text>{emoji}) -->
<foreignObject x="17" y="9" width="26" height="26">
  <DynamicIcon name={pawn} size={14} color="rgba(255,255,255,0.92)" />
</foreignObject>
```

### Flottaison 2.5D — clé technique

Le pion flotte **au-dessus** du plateau grâce à `z: 50` sur le `motion.div` :

```tsx
<motion.div style={{ position: 'absolute', z: 50, willChange: 'transform' }}>
```

- Le div ISO parent a `transformStyle: 'preserve-3d'` → les enfants participent au contexte 3D
- `z: 50` = `translateZ(50px)` → soulève le pion de 50 px perpendiculairement à la surface du plateau
- La `perspective: 800px` projette correctement → pion plus face au viewer, moins écrasé par le `rotateX(58deg)`
- **Résultat** : le pion n'est plus aplati par l'ISO — il se redresse naturellement vers l'utilisateur, illusion 2.5D sans R3F, zéro coût perf

#### Deux pions sur la même case

Quand `hasP0 && hasP1`, les deux pions sont décalés latéralement de ±10 px :

```tsx
<div style={{ transform: hasP1 ? 'translateX(-10px)' : 'none', zIndex: 2 }}>
  <PawnToken /* J1 */ />
</div>
<div style={{ transform: hasP0 ? 'translateX(10px)' : 'none', zIndex: 1 }}>
  <PawnToken /* J2 */ />
</div>
```

- J1 décale à gauche (-10 px), J2 à droite (+10 px) → chevauchement visible mais les deux pions restent lisibles
- À 60 px de diamètre pour une case de 68 px, le décalage est perceptible — effet voulu pour signaler la cohabitation
- J1 passe au-dessus (zIndex 2), J2 en dessous (zIndex 1)

### Mouvement ✅ Livré

Un seul élément `<motion.div>` par pion, `position: absolute` à l'intérieur du div ISO-transformé. Il existe en continu — plus de remount.

```tsx
// Arc déclenché à chaque changement de squareIndex (= displayPos, mis à jour step by step)
controls.start({
  x: [from.x - half + xOffset, midX, to.x - half + xOffset],
  y: [from.y - half,           arcY,  to.y - half],          // arcY = min(from,to).y - 55
  transition: { duration: 0.19, ease: 'easeInOut' },
});
```

- Coordonnées calculées depuis `cellCenter(idx, cellW)` — mathématiquement depuis `BOARD_LAYOUT` (col × (cellW + gap), renderedRow × (CELL_H + gap))
- `cellW` mesuré via `ResizeObserver` sur le div grille → s'adapte à la largeur écran
- `willChange: 'transform'` sur le wrapper → compositing GPU, élimine les traînés
- Ombre portée : `<ellipse>` SVG statique en bas de la sphère (pas de `drop-shadow` CSS sur un élément animé)
- Arc hauteur : `Math.min(fromY, toY) - 55 px`
- Durée par case : 190 ms (dans la fenêtre 210 ms du timer `usePawnAnimation`)
- Deux pions même case : `xOffset ±10 px` passé à `PawnOverlay`

---

## Niveau 3 — Pion R3F + arc 3D ✅ Livré

### Modélisation

Pion classique en 4 meshes `MeshPhysicalMaterial` clearcoat dans la même scène R3F que le plateau :

```tsx
<group position={[x, CELL_H3, z]}>
  <mesh position={[0, 0.04, 0]}>  {/* Base disc */}
    <cylinderGeometry args={[0.22, 0.24, 0.08, 24]} />
  </mesh>
  <mesh position={[0, 0.28, 0]}>  {/* Body cone */}
    <cylinderGeometry args={[0.09, 0.20, 0.40, 16]} />
  </mesh>
  <mesh position={[0, 0.52, 0]}>  {/* Neck */}
    <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
  </mesh>
  <mesh position={[0, 0.70, 0]}>  {/* Head */}
    <sphereGeometry args={[0.155, 20, 20]} />
  </mesh>
</group>
```

- `MeshPhysicalMaterial` : `clearcoat: 1`, `roughness: 0.28`, `metalness: 0.08`
- Éclairage unifié avec les cases (même scène, mêmes lumières)
- `ContactShadows` double couche : ombres cases sur base acajou + ombre plateau sur sol virtuel
- Ombre disque sous chaque pion : `circleGeometry` avec `meshBasicMaterial` transparent

### Mouvement ✅ Livré

Arc natif via `useFrame` + lerp — pas de lib animation externe :

```tsx
useFrame((_, delta) => {
  progRef.current = Math.min(progRef.current + delta / 0.32, 1);
  const p = progRef.current;
  const ease = p < 0.5 ? 2*p*p : -1 + (4-2*p)*p;  // easeInOut
  g.position.x = lerp(from.x, to.x, ease);
  g.position.y = PAWN_REST_Y + Math.sin(Math.PI * p) * 1.0;  // arc 1.0 wu
  g.position.z = lerp(from.z, to.z, ease);
});
```

- Durée : 320ms/case (hops s'enchaînent en overlap → mouvement fluide)
- Arc : `sin(π * t)` sur Y → 1.0 world-unit de hauteur
- **Position contrôlée exclusivement via `useFrame`** — aucun prop `position` sur le `<group>`
  - Le prop React écrase `g.position` avant que `useEffect` lise `fromRef` → téléportation au lieu d'arc
  - Fix : position initiale posée une fois via `position.set()` au mount, puis `useFrame` seul
- `fromRef` = position courante du mesh au moment du déclenchement → enchaînement fluide mid-hop

#### Deux pions même case

Offset diagonal fixe par pion (jamais dynamique) :
```tsx
<Pawn3D squareIndex={displayPos0} color={p0Color} xOffset={-0.28} zOffset={0.28} />
<Pawn3D squareIndex={displayPos1} color={p1Color} xOffset={ 0.28} zOffset={-0.28} />
```

- Distance centre-à-centre = `√(0.56² + 0.56²)` = 0.79 wu > 0.66 (diamètre base) → pas d'overlap
- Offset fixe = pas de double animation (si conditionnel, xOffset et squareIndex changent simultanément → useEffect capture l'ancien offset → pion anime vers mauvaise cible)
- Visuellement : un pion devant-gauche, l'autre derrière-droite — comme deux pièces posées côte à côte

---

## Tableau récap

| Feature | Niveau 1 ✅ | Niveau 2 ✅ | Niveau 3 ✅ |
|---------|-----------|---------|---------|
| Forme | Emoji + badge | Pion SVG (trapèze + tête) | Pion R3F 4 meshes |
| Identité J1 / J2 | icône Lucide seule | couleur + icône Lucide | couleur (clearcoat) |
| Ombre portée | ❌ | ✅ ellipse SVG | ✅ ContactShadows + disc |
| Flottaison 2.5D | ❌ | ✅ `translateZ` CSS | ✅ Y natif Three.js |
| Éclairage unifié cases+pions | ❌ | ❌ | ✅ même scène |
| Déplacement | `layoutId` téléportation | ✅ Arc CSS 190ms | ✅ Arc `useFrame` 190ms |
| Pion entre les cases | ❌ | ✅ | ✅ |
| Rebond à l'atterrissage | ❌ | ❌ | ✅ squash-stretch 280ms |
| Haptique par case | ✅ 30ms | ✅ | ✅ |
| Glow case d'arrivée | ✅ 380ms | ✅ | ✅ emissive |

---

## Niveau 3 — Polish UX ✅ Livré

### Rebond atterrissage (squash-stretch)

`bounceProgRef` déclenché quand `progRef >= 1` (fin de hop) :
- 0→35% : scaleY 1.0 → 0.72 (écrasement)
- 35→70% : scaleY 0.72 → 1.12 (rebond)
- 70→100% : scaleY 1.12 → 1.0 (stabilisation)

Durée 280ms, géré dans `useFrame` (pas de lib externe).

### Ombre dynamique

`shadowMeshRef` (mesh) + `shadowMatRef` (material) — deux refs séparées.

Dans `useFrame` :
- `shadowMeshRef.position.y = CELL_H3 + 0.005 - g.position.y` → maintient l'ombre sur le plateau indépendamment du mouvement du groupe
- `opacity = 0.22 × (1 - hauteur/ARC_H × 0.88)` → disparaît en vol
- `scale spread = 1 + hauteur/ARC_H × 0.22` → pénombre légèrement plus large en altitude

### Glow pion actif

`headMatRef` sur la sphère. Quand `isActive` :
```tsx
headMatRef.current.emissiveIntensity = 0.14 + 0.12 * Math.sin(tRef.current * 2.5);
```
`emissive` = couleur du pion → halo teinté, pas blanc. Sinon `emissiveIntensity = 0`.

### Texture de surface (corps)

`THREE.CanvasTexture` générée une seule fois via `useMemo` :
- 128×128 px, fond blanc
- Bandes horizontales à opacité variable (`sin(y)` + bruit)
- 220 points de surbrillance blancs aléatoires
- `wrapS/T = RepeatWrapping`, `repeat(1.5, 3)` → grain fin répété sur le corps cylindrique
- Appliquée comme `map` sur `matBody` (corps + cou) — tinte le grain à la couleur du pion

---

## Note architecture — CSS 2.5D vs R3F

Le Niveau 2 atteint un rendu 2.5D satisfaisant grâce à `translateZ` + `preserve-3d` sur le plateau CSS existant. Le seul gap avec le Niveau 3 R3F est l'**éclairage unifié** : cases et pions n'ont pas la même source lumineuse. Un prototype R3F (`Board.r3f.tsx`) est en cours pour évaluer si le gain visuel justifie la réécriture complète du plateau.
