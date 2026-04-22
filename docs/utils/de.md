# Rendu du dé — État actuel → 2026

**Fichiers clés :**
- `app/game-engine/dice/DiceRenderer.tsx` — rendu configurable (moteur générique)
- `app/components/ui/Dice3D.tsx` — dé hardcodé du Consentement (ne pas modifier)
- `app/game-engine/dice/useDiceEngine.ts` — logique de tirage

---

## État actuel

### Ce qui tourne

**Cube 6 faces (CSS 3D)**
- `transform-style: preserve-3d` + 6 `<div>` avec `translateZ(50px)` et rotations CSS
- Rotation cumulative via `useRef` : pas de snap-back entre les lancers
- Chaque lancer ajoute 1080°X + 720°Y avant l'angle cible → tourne toujours dans le même sens
- Framer Motion `useAnimation` — durée 1.7s, ease `[0.22, 0.61, 0.36, 1]`
- Faces : gradient CSS + emoji + label en uppercase
- Glow anneau au posé (thème Dark Luxury : `cardGlow`) via `AnimatePresence`
- `ShimmerLayer` sur la face visible si `theme.effects.shimmer`

**Fallback N≠6 faces (FlatTile)**
- Flip dos→face : même mécanique `preserve-3d` qu'une carte
- Dos : fond sombre `#1e1b2e` + 🎲
- Face : gradient + emoji + label de la face tirée
- `onRollComplete` déclenché 1.5s après le lancer (synchronisé avec le flip)

### Contrainte critique

`filter` CSS ne doit jamais être appliqué sur un élément `preserve-3d` — ça crée un stacking context et aplatit le cube en 2D. Toujours poser le `filter`/`drop-shadow` sur un conteneur *extérieur*.

### Limitations actuelles

| Problème | Impact |
|----------|--------|
| CSS 3D n'a pas de lumière — les faces ont toutes le même éclairage | Le cube ne "tourne" pas vraiment, il pivote |
| Ease curve linéaire — accélération/décélération non physique | Pas de sensation de poids |
| Pas de rebond à l'atterrissage | L'arrêt est brutal |
| Gradient plat sur les faces | Matière 0 — plastique d'écran |
| Ombre fixe (`drop-shadow` statique) | Pas de déplacement d'ombre pendant le vol |

---

## Vers 2026

### Niveau 1 — CSS amélioré (zéro nouvelle dép, 1–2 jours)

**Physique de l'animation**
```
Lancer :
  - Ease initiale : accélération rapide (anticipation)
  - Milieu : vitesse max + légère instabilité (rotation aléatoire sur Z ±5°)
  - Fin : décélération dure + micro-rebond spring (stiffness 200, damping 12)

Atterrissage :
  - Shake caméra : translateX([0, -4px, 4px, -2px, 0]) sur le conteneur, 180ms
  - Scale : [1, 1.06, 0.97, 1.02, 1], 300ms
  - Ombre portée : compress pendant le vol (scale Y 0.6 → 1.0 à l'atterrissage)
```

**Matière CSS**
```
Chaque face :
  - Highlight spéculaire : pseudo-element top-left, radial-gradient blanc 0.25 opacity, blur 12px
  - Bevel intérieur : inset shadow + outer shadow pour simuler l'épaisseur
  - Bord chanfreiné : border-radius 20px + box-shadow intérieur diagonal

Conteneur :
  - Ombre portée dynamique (suit une direction fixe) pour donner l'impression de lumière directionelle
```

**Résultat attendu** : même technologie, mais le dé a l'air d'être en résine mate avec une source lumineuse visible. Acceptable.

---

### Niveau 2 — React Three Fiber (dépendance ~500kb, 3–5 jours)

Le vrai saut qualitatif. Un objet 3D dans un canvas WebGL.

**Stack**
```
@react-three/fiber      → renderer React pour Three.js
@react-three/drei       → helpers (Environment, ContactShadows, RoundedBox)
@react-three/rapier     → physique (rebond réel, vélocité angulaire)
```

**Ce que ça change**

| Fonctionnalité | CSS 3D actuel | R3F |
|---------------|---------------|-----|
| Lumière | Simulée (gradient) | Réelle (PointLight, AmbientLight) |
| Ombre portée | Statique | Dynamique + contact shadow |
| Matière | Gradient CSS | MeshStandardMaterial (PBR) |
| Physique | Ease curve fixe | Vélocité angulaire + rebond Rapier |
| Reflets | Shimmer animé | EnvMap + reflet de l'environnement |

**Matériaux envisagés**
- **Verre dépoli** : `MeshPhysicalMaterial` avec `transmission: 0.85`, `roughness: 0.1`, `ior: 1.5` — le contenu derrière traverse légèrement
- **Résine translucide** : même + `color` teinté par la catégorie
- **Marbre** : texture procédurale via shader GLSL (bruit de Perlin)

**Animation lancer**
```ts
// Rapier : appliquer une impulsion rotationnelle aléatoire
rigidBody.applyTorqueImpulse({ x: rand(-8, 8), y: rand(-8, 8), z: rand(-4, 4) });
// Rapier arrête la physique quand la vélocité < threshold, face détectée par raycast
// onLanded() déclenche la suite de jeu
```

**Structure composant**
```tsx
<Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
  <ambientLight intensity={0.4} />
  <pointLight position={[3, 5, 3]} intensity={1.2} />
  <Environment preset="studio" />
  <ContactShadows opacity={0.6} blur={2} far={4} />
  <RigidBody ref={dieRef} colliders="cuboid">
    <RoundedBox args={[1, 1, 1]} radius={0.12}>
      <MeshPhysicalMaterial
        color={faceColor}
        transmission={0.7}
        roughness={0.08}
        metalness={0.0}
        ior={1.45}
      />
    </RoundedBox>
  </RigidBody>
</Canvas>
```

**Intégration avec DiceRenderer**
- `DiceRenderer` reste l'interface publique
- Un prop `renderer?: 'css' | 'webgl'` (default `'css'`) bascule entre les deux implémentations
- Les hooks (`useDiceEngine`) ne changent pas — seul le render change

---

### Niveau 3 — Shader custom (avancé, pour un futur)

Faces avec effet **holographique** ou **foil arc-en-ciel** via GLSL fragment shader — la couleur de la face change selon l'angle de vision (iridescence). Voir la section Cartes ci-dessous pour le même effet appliqué aux cartes en premier.

---

## Ordre recommandé

1. **Maintenant** : Niveau 1 CSS (physique + matière) — ROI immédiat, aucune dépendance
2. **Sprint 2** : Niveau 2 R3F — intégration progressive, le CSS reste le fallback
3. **Plus tard** : Shader iridescent une fois R3F en place
