# Rendu du dé — État actuel → 2026

**Fichiers clés :**
- `app/components/ui/Dice3D.tsx` — dé hardcodé du Consentement (6 catégories fixes, utilisé par GooseGameScreen — CSS Level 1)
- `app/game-engine/dice/DiceRenderer.tsx` — rendu générique, prop `renderer?: 'css' | 'webgl'` (défaut `'css'`)
- `app/game-engine/dice/DiceCanvas.tsx` — implémentation WebGL R3F (utilisée par DiceGameScreen)
- `app/game-engine/dice/useDiceEngine.ts` — logique de tirage générique (anti-répétition, haptiques)
- `app/game-engine/dice/types.ts` — `DiceFace.id` = numéro de face 1–N (correspond à l'ordre dans `faces[]` et aux clés de `FACE_ROTATIONS`)

---

## État actuel — CSS Level 1 ✅

### Ce qui tourne

**Cube 6 faces (CSS 3D)** — dans `Dice3D` et `DiceRenderer.Cube6`
- `transform-style: preserve-3d` + 6 `<div>` avec `translateZ(50px)` et rotations CSS
- Rotation cumulative via `useRef` : pas de snap-back entre les lancers
- Chaque lancer ajoute 1080°X + 720°Y avant l'angle cible → tourne toujours dans le même sens
- **Instabilité Z** : wobble aléatoire ±5° via keyframes `rotateZ`, revient à 0 en fin d'animation
- Framer Motion `useAnimation` — durée 1.7s, ease `[0.22, 0.61, 0.36, 1]`
- **Shake + micro-rebond** post-atterrissage : `x: [0, -4, 4, -2, 2, 0]`, `scale: [1, 1.05, 0.97, 1.02, 0.99, 1]`, 350ms
- **Ombre portée dynamique** : élément ellipse qui se comprime (`scaleY: 0.45`) pendant le vol et s'étale à l'atterrissage
- **Highlight spéculaire** sur chaque face : `radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.38), transparent 55%)`
- Inset shadows renforcées : haut blanc + bas sombre pour simuler la profondeur
- Glow anneau au posé (thème Dark Luxury : `cardGlow`) via `AnimatePresence` — `DiceRenderer` uniquement
- `ShimmerLayer` sur la face visible si `theme.effects.shimmer` — `DiceRenderer` uniquement

**Fallback N≠6 faces (FlatTile)** — `DiceRenderer` uniquement
- Flip dos→face : même mécanique `preserve-3d` qu'une carte
- Dos : fond sombre `#1e1b2e` + 🎲
- Face : gradient + emoji + label + highlight spéculaire
- `onRollComplete` déclenché 1.5s après le lancer (synchronisé avec le flip)

### Contrainte critique

`filter` CSS ne doit jamais être appliqué sur un élément `preserve-3d` — ça crée un stacking context et aplatit le cube en 2D. Toujours poser le `filter`/`drop-shadow` sur un conteneur *extérieur*.

### Architecture logique

- `DiceGameScreen` utilise `useDiceEngine` + `DiceRenderer renderer="webgl"` → `DiceCanvas` (R3F PBR)
- `GooseGameScreen` utilise `useDice` (hook simple, face 1–6) + `Dice3D` (CSS Level 1) — haptiques via `useHaptics`
- `DiceRenderer` est l'interface publique : `renderer="css"` → CSS Level 1, `renderer="webgl"` → R3F

---

## Niveau 1 — CSS amélioré ✅ FAIT

Toutes les améliorations du niveau 1 sont implémentées dans `Dice3D.tsx` et `DiceRenderer.tsx`.

---

## Niveau 2 — React Three Fiber ✅ FAIT (sans Rapier)

`DiceCanvas.tsx` — cube WebGL actif dans `DiceGameScreen`.

**Stack installée**
```
three + @react-three/fiber + @react-three/drei
```

**Ce qui tourne**
- `AnimatedCube` : `RoundedBox` Three.js, rotation pilotée par `useFrame` avec la même ease cubic-bezier que le CSS
- 6 `MeshPhysicalMaterial` : canvas textures 2D par face (gradient + emoji + label) + `transmission: 0.18`, `clearcoat: 0.6`, `roughness: 0.22`
- Éclairage réel : `PointLight` × 2 + `AmbientLight` + `Environment preset="studio"`
- `ContactShadows` via drei
- Wobble Z pendant le lancer, reset à 0 en fin d'animation
- `DiceRenderer renderer="webgl"` bascule sur `DiceCanvas` ; `renderer="css"` garde le CSS Level 1

**Ce qui n'est pas encore là (Rapier)**
- Physique réelle (rebond, vélocité angulaire)
- Détection de face par raycast
- Pour l'instant : même logique de rotation cumulative qu'en CSS

---

## Niveau 2b — Rapier physics (optionnel, 2–3 jours)

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
| Lumière | Simulée (gradient + spéculaire) | Réelle (PointLight, AmbientLight) |
| Ombre portée | Ellipse animée | Dynamique + contact shadow |
| Matière | Gradient CSS + highlight | MeshStandardMaterial (PBR) |
| Physique | Ease curve + shake | Vélocité angulaire + rebond Rapier |
| Reflets | Shimmer animé | EnvMap + reflet de l'environnement |

**Matériaux envisagés**
- **Verre dépoli** : `MeshPhysicalMaterial` avec `transmission: 0.85`, `roughness: 0.1`, `ior: 1.5`
- **Résine translucide** : même + `color` teinté par la catégorie
- **Marbre** : texture procédurale via shader GLSL (bruit de Perlin)

**Animation lancer**
```ts
// Rapier : appliquer une impulsion rotationnelle aléatoire
rigidBody.applyTorqueImpulse({ x: rand(-8, 8), y: rand(-8, 8), z: rand(-4, 4) });
// Arrêt quand vélocité < threshold → face détectée par raycast → onLanded()
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

## Niveau 3 — Shader custom (avancé, pour un futur)

Faces avec effet **holographique** ou **foil arc-en-ciel** via GLSL fragment shader — la couleur de la face change selon l'angle de vision (iridescence). Voir la section Cartes ci-dessous pour le même effet appliqué aux cartes en premier.

---

## Ordre recommandé

1. ~~**Niveau 1 CSS**~~ ✅ wobble Z, shake, ombre dynamique, spéculaire
2. ~~**Niveau 2 R3F** (sans Rapier)~~ ✅ PBR + éclairage réel + ContactShadows — DiceGameScreen
3. **Niveau 2b Rapier** — physique réelle, rebond, détection face par raycast
4. **Niveau 3 Shader** — iridescent/foil holographique, nécessite R3F en place
