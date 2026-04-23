# Rendu du plateau — État actuel → 2026

**Fichiers clés :**
- `app/components/screens/GooseGameScreen/components/Board.tsx` — implémentation Jeu de l'Oie (**c'est ici que tout se passe**)
- `app/game-engine/board/BoardRenderer.tsx` — moteur générique (non branché au Jeu de l'Oie pour l'instant)
- `app/game-engine/board/useBoardEngine.ts` — logique déplacement générique
- `app/plateau-test/page.tsx` — sandbox `/plateau-test` pour itérer sans passer par le flow jeu

---

## État actuel — Niveau 1 ✅ livré

### Ce qui tourne

**Vue isométrique CSS**
```ts
// Board.tsx
const ISO_TRANSFORM = 'rotateX(68deg) rotateZ(45deg) scale(0.78)';
```
- `rotateX(68deg)` — angle mobile games (Unity/Godot standard ~30°, mais 68° donne l'effet "sol qui s'éloigne" voulu)
- `rotateZ(45deg)` — orientation diamant classique
- `scale(0.78)` — compression pour tenir dans un écran portrait 390px
- `perspective: 800px` sur le conteneur `mx-auto` — point de fuite centré sur le plateau, effet tunnel léger
- `transformStyle: 'preserve-3d'` sur les divs intermédiaires

**Rangées inversées**
```ts
[...BOARD_LAYOUT].reverse().map((row, rowIndex) => {
  const origRowIndex = BOARD_LAYOUT.length - 1 - rowIndex;
  // ...
})
```
Case 0 (Départ) en bas/proche du joueur → case 23 (Arrivée) en haut/loin. Sens Sonic 3D Blast.

**Surface du plateau**
```ts
background: 'linear-gradient(145deg, #4a2010 0%, #2e1208 55%, #1c0a05 100%)'
border: '1.5px solid rgba(200,130,50,0.45)'
boxShadow: '0 0 28px rgba(160,80,20,0.45), inset 0 0 40px rgba(0,0,0,0.5)'
inset: -22   // dépasse les cases de 22px tout autour
```
Acajou chaud — contraste thermique garanti contre les fonds de zone froids (vert/bleu/violet).

**Pions (PawnToken)**
- Token circulaire 22px coloré (`p0Color` / `p1Color`) avec emoji
- Anti-transform : `rotateZ(-45deg) rotateX(-45deg) scale(1.4)` → lisible en vue ISO
- Pulse au repos sur case active, spring stiffness 500 damping 26

**Overflow mobile**
- `overflowX: hidden` sur le wrapper externe
- `maxWidth: 380, padding: '8px 16px 48px'`

### Ce qui a été tenté et abandonné

**Faces CSS 3D** (`rotateX(-90deg)` / `rotateY(90deg)`) — trop fragiles :
- Z-ordering cassé avec `preserve-3d` + Framer Motion
- Ombres qui "remontent vers le ciel" après inversion des rangées + rotateX élevé
- Remplacées par `inset box-shadow` → puis supprimées (artefacts directionnels)
- **Résolution prévue** : Niveau 3 R3F (lumière réelle, ContactShadows)

### Limitations restantes

| Problème | Impact |
|----------|--------|
| Pas de trail de progression | On ne voit pas le chemin parcouru |
| Déplacement pion = téléportation | Pas de saut visuel entre cases |
| Pas de distinction visuelle par zone | Toutes les cases ont le même poids |

---

## Niveau 2 — Chemin lumineux + animation arc ← **EN COURS**

### Trail de progression

Un SVG superposé en `position: absolute` sur le conteneur ISO trace le chemin parcouru. Les cases visitées s'allument progressivement.

```tsx
// Overlay SVG — position absolute sur le conteneur ISO, pointerEvents: none
<svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
  <polyline
    points={history.map(idx => `${centerX(idx)},${centerY(idx)}`).join(' ')}
    stroke={`url(#trail-${playerId})`}
    strokeWidth={3}
    fill="none"
    strokeLinecap="round"
    strokeDasharray="4 8"
    opacity={0.5}
  />
  <defs>
    <linearGradient id={`trail-${playerId}`}>
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor={playerColor} />
    </linearGradient>
  </defs>
</svg>
```

**Calcul des centres** : chaque case a une position dans la grille. `centerX(idx)` et `centerY(idx)` se calculent depuis l'index, le nombre de colonnes et la taille des cases.

### Animation arc

Le pion saute d'une case à l'autre via `useAnimationControls` de Framer Motion :

```tsx
await controls.start({
  x: [fromX, midX, toX],
  y: [fromY, midY - 28, toY],  // arc : monte au milieu
  scale: [1, 1.3, 1],
  transition: { duration: 0.18, ease: 'easeInOut' },
});
vibrate(30);
```

---

## Niveau 3 — React Three Fiber (avancé)

| Feature | CSS iso actuel | R3F |
|---------|---------------|-----|
| Lumière sur les cases | Absente (faces CSS abandonnées) | Réelle (ambiant + directionnel) |
| Ombre des pions | Absente | ContactShadows |
| Cases avec matière | Gradient CSS | MeshStandardMaterial |
| Faces latérales | Abandonnées (z-order) | Automatiques (géométrie 3D) |
| Brouillard de distance | Impossible | `<fog attach="fog" />` |

---

## Tableau récap

| Feature | Avant | Niveau 1 ✅ | Niveau 2 | Niveau 3 |
|---------|-------|-----------|---------|---------|
| Vue isométrique | ❌ | ✅ CSS 68°+perspective | ✅ | ✅ WebGL |
| Surface plateau | ❌ | ✅ acajou | ✅ | ✅ PBR |
| Sens Sonic (départ bas) | ❌ | ✅ rangées inversées | ✅ | ✅ |
| Faces latérales | ❌ | ⚠️ abandonnées | — | ✅ auto R3F |
| Trail de progression | ❌ | ❌ | ✅ SVG | ✅ |
| Arc de déplacement | ❌ | ❌ | ✅ | ✅ physique |
| Pions 3D | ❌ | token circulaire | token + arc | ✅ mesh |
| Légende | ✅ | ✅ | ✅ | ✅ |

---

## Notes d'implémentation

**Angle rotateX**
L'angle 68° a été trouvé empiriquement. Les standards jeux mobiles (Unity/Godot) utilisent 30°, mais 30° donne un "panneau en biais" sans perspective. La combinaison `rotateX(68deg) + perspective: 800px` donne l'effet sol voulu.

**Perspective**
Sans `perspective` sur le parent, la projection est orthographique — le plateau flotte comme un panneau. `800px` donne un effet tunnel léger. Valeurs de référence : `500px` = fort, `1200px` = subtil.

**Overflow mobile**
`rotateX(68deg) rotateZ(45deg)` crée un losange plus large que le rectangle d'origine. `overflowX: hidden` + `maxWidth: 380` + `scale(0.78)` résout le dépassement sur iPhone 15 (390px).

**Faces CSS 3D**
`transformStyle: preserve-3d` + faces `rotateX(-90deg)` / `rotateY(90deg)` : instable à rotateX élevé + rangées inversées. Reporter au Niveau 3 R3F où la géométrie gère ça automatiquement.
