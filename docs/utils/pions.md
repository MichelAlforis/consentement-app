# Pion — Modélisation & Mouvement → 2026

**Fichiers clés :**
- `app/components/screens/GooseGameScreen/components/Board.tsx` — rendu pion dans `BoardCell`
- `app/components/screens/GooseGameScreen/hooks/usePawnAnimation.ts` — logique de déplacement
- `app/data/goose-game.ts` — `PAWN_EMOJIS`
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
  {p0Emoji}
</motion.span>
```

- 6 emojis : `['🦊', '🐼', '🦋', '🌙', '🌟', '🎲']` — le pion de J1 retiré du choix de J2
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

- Pion = disque 60 px, sphère CSS opaque, emoji centré (28 px)
- Couleurs distinctes J1 / J2 via `PAWN_COLORS` dans `app/data/goose-game.ts`
- Gradient 3 stops entièrement opaques → effet sphère sans bord transparent :
  ```
  radial-gradient(circle at 32% 28%, #ffffff 0%, {color} 42%, #050505 100%)
  ```
- Ombre portée : `box-shadow: 0 4px 10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.25)`
- Pion placé **hors du `motion.div` de la case** (div sibling, `position: absolute, bottom: -4px`) pour ne pas hériter de l'animation scale de la case (sinon double pulse)

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

### Mouvement — À faire

Le pion est positionné en absolu sur le plateau — il existe en continu entre les cases.

```tsx
await controls.start({
  x: [fromX, midX, toX],
  y: [fromY, midY - 24, toY], // arc : monte de 24px au milieu du saut
  scale: [1, 1.3, 1],
  transition: { duration: 0.18, ease: 'easeInOut' },
});
vibrate(30);
```

- Coordonnées calculées depuis `getBoardCellCenter(index)` (pixel center de chaque case)
- Case Chance (+2) : enchaîne immédiatement un 2e arc sans pause

---

## Niveau 3 — Sphère R3F + arc 3D

### Modélisation

```tsx
<mesh position={[x, y, 0.6]}>
  <sphereGeometry args={[0.28, 32, 32]} />
  <MeshPhysicalMaterial color={player.color} clearcoat={1} clearcoatRoughness={0} metalness={0.1} />
</mesh>
```

- `ContactShadows` drei sous chaque pion
- Prénom du joueur gravé : texture canvas 2D appliquée sur le dessus de la sphère

### Mouvement

```tsx
springPos.start({
  x: toX, y: toY,
  z: [0, 0.8, 0],                               // monte en z pendant le saut
  config: { tension: 280, friction: 18 },
});
springScale.start({ y: [1, 0.75, 1.05, 1] });   // écrasement + rebond à l'atterrissage
```

- `ContactShadows` se déforme en temps réel sous le pion pendant le vol
- Rotation libre sur l'axe Y pendant le saut (idle spin)

---

## Tableau récap

| Feature | Niveau 1 ✅ | Niveau 2 | Niveau 3 |
|---------|-----------|---------|---------|
| Forme | Emoji + badge | Token rond coloré | Sphère R3F |
| Identité J1 / J2 | emoji seul | couleur + emoji | couleur + prénom gravé |
| Ombre portée | ❌ | ✅ box-shadow | ✅ ContactShadows |
| Déplacement | `layoutId` (téléportation) | Arc CSS position absolue | Arc 3D `useSpring` |
| Pion entre les cases | ❌ | ✅ | ✅ |
| Rebond à l'atterrissage | ❌ | ❌ | ✅ scaleY |
| Ombre dynamique en vol | ❌ | ❌ | ✅ ContactShadows |
| Haptique par case | ✅ 30ms | ✅ | ✅ |
| Glow case d'arrivée | ✅ 380ms | ✅ | ✅ emissive |
