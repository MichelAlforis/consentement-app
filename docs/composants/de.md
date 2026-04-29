# Rendu du dé — État actuel → 2026

**Fichiers clés :**
- ~~`app/components/ui/Dice3D.tsx`~~ — **supprimé** (dé CSS Level 1 legacy, remplacé par DiceRenderer dans tous les jeux)
- `app/game-engine/dice/DiceRenderer.tsx` — rendu générique, prop `renderer?: 'css' | 'webgl'` (défaut `'css'`), `size?: number`
- `app/game-engine/dice/DiceCanvas.tsx` — implémentation WebGL R3F (DiceGameScreen + GooseGameScreen)
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

- `DiceGameScreen` utilise `useDiceEngine` + `DiceRenderer renderer="webgl" size={240}` → `DiceCanvas` (R3F PBR)
- `GooseGameScreen` utilise `useDice` (hook simple, face 1–6) + `DiceRenderer renderer="webgl" size={200}` → même moteur R3F
- `DiceRenderer` est l'interface publique : `renderer="css"` → CSS Level 1 (Cube6/FlatTile), `renderer="webgl"` → R3F

---

## Niveau 1 — CSS amélioré ✅ (DiceRenderer uniquement)

Les améliorations CSS Level 1 (wobble Z, shake, ombre dynamique, spéculaire) sont dans `DiceRenderer.tsx` (Cube6 + FlatTile).
`Dice3D.tsx` a été supprimé — GooseGameScreen utilise désormais le renderer WebGL.

---

## Niveau 2 — React Three Fiber ✅ FAIT — DiceGameScreen + GooseGameScreen

`DiceCanvas.tsx` — cube WebGL actif dans les deux jeux.

**Stack installée**
```
three + @react-three/fiber + @react-three/drei + three-stdlib (RoundedBoxGeometry)
```

**Ce qui tourne**
- `AnimatedCube` : `RoundedBoxGeometry` de **three-stdlib** (hérite de BoxGeometry → 6 groupes corrects, coins arrondis `radius=0.08`)
  - ⚠️ Ne pas utiliser `RoundedBox` de **drei** — c'est une ExtrudeGeometry avec seulement 2 groupes (toutes faces mono-couleur)
- 6 `MeshPhysicalMaterial` via `mesh.geometry + mesh.material` : canvas textures 2D par face (gradient + emoji + label)
  - `roughness: 0.18`, `clearcoat: 0.8`, `envMapIntensity: 0.9`
  - UV de three-stdlib déjà orientés correctement — **aucun flip canvas**
- Éclairage : 2 `PointLight` doux (0.55 + 0.18) — `Environment preset="studio"` gère l'IBL ambient (pas d'`AmbientLight`)
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
2. ~~**Niveau 2 R3F** (sans Rapier)~~ ✅ PBR + éclairage réel + ContactShadows — DiceGameScreen **+ GooseGameScreen**
3. **Niveau 2b Rapier** — physique réelle, rebond, détection face par raycast
4. **Niveau 3 Shader** — iridescent/foil holographique, nécessite R3F en place

---

## BoardDice3D — Dé sur plateau (Board.tsx)

> **Fichier :** `app/components/screens/GooseGameScreen/components/Board.tsx`
> **Statut :** ✅ Production-ready — pipeline stable, déterministe, sans artefact visuel

### Architecture du composant

`BoardDice3D` est un composant R3F intégré dans la scène du plateau (OrthographicCamera zoom=68). Il n'utilise **pas** de moteur physique — l'animation est entièrement impérative via `useFrame`.

**Géométrie**
- `RoundedBoxGeometry` de **three-stdlib** — 6 groupes corrects, radius=0.08
- 6 `MeshStandardMaterial` avec textures pip numériques (`makeNumericFaceTexture`)
- Taille : `BOARD_DICE_S = 0.675` world units (≈ 46px à zoom=68)

**Constantes clés**
```ts
BOARD_DICE_S       = 0.675
BOARD_DICE_REST_Y  = CELL_H3 + BOARD_DICE_S/2 + 0.04
BOARD_DICE_THROW_H = 0.9      // hauteur départ hors-champ
BOARD_DICE_ARC_H   = 1.2      // amplitude arc parabolique
BOARD_DICE_ROT_DUR = 2.1      // durée du smoothstep vol (stoppé à l'atterrissage)
```

**Origines de lancer** : 8 points hors bords du plateau (`THROW_ORIGINS`)  
**Zones d'atterrissage** : 6 zones entre les cases (`DICE_LANDING_ZONES`)

**Mapping face → rotation** (`BOARD_DICE_FACE_ROT`)
```ts
1: [0, 0]   2: [0, -π/2]   3: [π/2, 0]
4: [-π/2, 0]   5: [0, π/2]   6: [0, π]
```

### Pipeline d'animation

```
useEffect (isRolling) :
  → reset : slidingRef=false, lockedRef=false, rotElapsedRef=ROT_DUR
  → calcule finalX/finalY = cumulative + 3 tours X + 2 tours Y + offset face
  → rotStartRef = rotation actuelle, rotTargetRef = finalX/finalY
  → anim = { rolling:true, duration:1.7, wobbleAmp, wobbleFreq }

useFrame — 4 blocs séquentiels :

  [1] Vol (a.rolling && !a.done)
      position XZ : horizEase quadratique (throwRef → landingRef)
      position  Y : arc = THROW_H + (REST_Y - THROW_H)*t + ARC_H*sin(π*t)
      rotation  Z : wobble sinusoïdal amorti
      À t=1       : rotElapsedRef = ROT_DUR (stoppe smoothstep)
                    → bounce=0, sliding=true, onComplete()

  [2] Rebond (bounceRef < 1)
      position Y : |sin(1.8π*b)| * exp(-5b) * 0.35 + REST_Y
      (indépendant du slide et de la rotation)

  [3] Slide (slidingRef)
      friction : vel *= (1 - 2.2*dt), clamp < 0.03
      position XZ : vel * dt
      Arrêt (speed=0 ou >1.2s) : slidingRef = false
      ⚠ Le bloc rotation lit slidingRef CI-DESSOUS — ordre garanti

  [4] Rotation — 3 modes exclusifs (!lockedRef) :
      • sliding=true  : slerp couplé vitesse (frame-rate independent)
                        bias = min(1 - exp(-8*dt*(1+spd)), 0.25)
                        coupé si spd < 0.05 (zéro injection à basse vitesse)
      • smoothstep    : pendant le vol (rotElapsed < ROT_DUR)
      • else (verrou) : angle résiduel < 0.05 rad → snap + lockedRef=true
                        sinon → slerp rattrapage k=8, terminaison forcée à 200ms
```

### Garanties du système

| Propriété | Mécanisme |
|---|---|
| Ordre d'exécution | Bloc rotation toujours après bloc slide dans le même `useFrame` |
| Frame-rate independent | `1 - exp(-k*dt*factor)` — même convergence 30/60/120fps |
| Pas de bias à l'arrêt | `spd > 0.05` guard — zéro mouvement injecté sous le seuil |
| Verrou conditionnel | Angle < 0.05 rad requis — pas de snap > 3° possible |
| Terminaison garantie | Fallback 200ms max sur le slerp de rattrapage |
| Déterminisme | `lockedRef` + `rotTargetRef` : résultat identique chaque lancer |

### Historique des approches abandonnées

| Approche | Problème |
|---|---|
| Rotation stop à 80% du vol | Die gelé sur bonne face les 20% finaux |
| Rolling `v=ω*r` pendant slide | Tourne sur mauvaise face → snap visible à la fin |
| Micro-bias constant 0.06/frame | Force permanente → oscillation sans convergence |
| Lerp settling Phase 3 | Triche visible — trop lent, œil le détecte |
| Snap discret après 6 frames stables | Écart résiduel > 30° si ROLL_GAIN faible |
| Smoothstep indépendant sur 2.1s | Die tourne encore posé — non couplé à la physique |

### Évolution future : Rapier

Toutes les implémentations sérieuses (Codrops, dice-box-threejs) utilisent un moteur physique :

1. **Initial conditions prédéterminées** — vélocité angulaire calculée pour atteindre la face cible
2. **Physique réelle** — Rapier / Cannon-es gère rebond, friction, décélération angulaire
3. **Détection par quaternion** — lire la face après arrêt, sans correction

```ts
// Pattern Rapier
rigidBody.setAngularVelocity({ x: rand(-8,8), y: rand(-8,8), z: rand(-4,4) });
// settle → détecter face : worldUp.applyQuaternion(q.inverse())
// localUp.y > 0.7071 → face 1, localUp.z → face 6, etc.
```

**Pourquoi pas encore** : `@react-three/rapier` = ~300 KB WASM. À intégrer quand le jeu est stable en production. Le canvas R3F du plateau est déjà compatible.

### Intégration

```tsx
<BoardDice3D
  isRolling={isDiceRolling ?? false}
  targetFace={diceResult}          // 1–6
  onRollComplete={onDiceRollComplete}
  visible={showDice ?? false}      // true pendant step === 'roll' | 'rolling'
/>
```

---

## Améliorations potentielles — BoardDice3D

Classées par effort / impact. Ne pas implémenter sans décision explicite.

---

### Niveau 1 — Retouches sans refactoring (< 1h chacune)

#### 1a. Easing vol non-linéaire
Actuellement le vol utilise `horizEase = 1 - (1-t)²` (ease-out quadratique) pour XZ et un arc sinus pour Y. On pourrait dissocier les axes pour un lancer plus organique :
```ts
// X/Z : ease-out cubique (décelère plus tard)
const horizEase = 1 - Math.pow(1 - t, 3);
// Y : arc asymétrique (montée rapide, descente plus lente)
const arcY = BOARD_DICE_ARC_H * Math.sin(Math.PI * Math.pow(t, 0.7));
```
**Impact :** Le dé "flotte" un peu moins, la descente semble plus lourde.

#### 1b. Wobble Z directionnel
Le wobble actuel est une sinusoïde pure indépendante de la direction du lancer. Le rendre proportionnel à la vitesse latérale :
```ts
const throwAngle = Math.atan2(dz, dx); // direction du lancer
g.rotation.z = a.wobbleAmp * Math.sin(a.wobbleFreq * t * Math.PI) * (1 - t) * Math.cos(throwAngle);
```
**Impact :** Le dé "banque" dans la direction du lancer — plus naturel.

#### 1c. Ombre portée dynamique pendant le vol
Actuellement `ContactShadows` est statique (`frames={1}`). Ajouter une ombre projetée sur le plateau qui suit la position XZ du dé pendant le vol :
```ts
// Mesh circulaire plat, positionné à REST_Y, suit g.position.x/z
// opacity ∝ 1 - (g.position.y / ARC_H_MAX) — disparaît quand le dé est haut
```
**Impact :** Renforce la perception de hauteur pendant le vol.

#### 1d. Squash-stretch à l'impact ✅ Implémenté (2026-04-24)
Squash bref sur `dieGroupRef` (sous-groupe — shadow non affectée) au moment de l'atterrissage :
```ts
// Au t=1 (landing) : squashRef = 1
// Dans useFrame :
squashRef.current = Math.max(squashRef.current - delta / 0.2, 0);
const s = 1 - squashRef.current;
const scaleY  = 1 - 0.08 * Math.sin(Math.PI * s);
const scaleXZ = 1 + 0.05 * Math.sin(Math.PI * s);
dieGroupRef.current.scale.set(scaleXZ, scaleY, scaleXZ);
```
**Valeurs critiques :** 0.08 Y / 0.05 XZ sur 200ms — au-delà (ex: 0.26/0.16) le dé paraît en gélatine.  
**Impact :** Impact plus "physique" cohérent avec les pions, sans déformation visible.

---

### Niveau 2 — Améliorations visuelles (2–4h)

#### 2a. Matériau PBR amélioré ✅ Implémenté (2026-04-24)
`MeshStandardMaterial` → `MeshPhysicalMaterial` :
```ts
new THREE.MeshPhysicalMaterial({
  map: textures[ti],
  roughness: 0.45,
  metalness: 0.0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.25,
})
```
**Impact :** Reflets speculaires discrets sur les arêtes — le dé a de la matière.  
**Note perf :** Aucune régression observée sur les devices testés.

#### 2b. Rebond secondaire ✅ Implémenté (2026-04-24)
Second rebond additif plus petit :
```ts
const b2 = b > 0.6 ? (b - 0.6) / 0.4 : 0;
const bounce1 = Math.abs(Math.sin(Math.PI * b * 1.8)) * Math.exp(-b * 5) * 0.35;
const bounce2 = Math.abs(Math.sin(Math.PI * b2 * 1.4)) * Math.exp(-b2 * 7) * 0.07;
g.position.y = BOARD_DICE_REST_Y + bounce1 + bounce2;
```
**Impact :** Sensation de masse plus réelle — un dé lourd rebondit deux fois légèrement.

#### 2c. Rotation Z résiduelle post-impact
Après l'atterrissage, laisser un léger spin Z qui décroît avec le slide :
```ts
// Au landing : injecter un spin Z résiduel
const residualZ = (Math.random() - 0.5) * 0.4;
// Dans slide block : amortir
g.rotation.z += residualZ * (1 - slideTimeRef.current / 1.2) * delta * 3;
```
**Impact :** Le dé "dérape" légèrement au contact — plus vivant.

#### 2d. Glow face active après arrêt
Une fois `lockedRef = true`, ajouter un pulse emissif sur la face du dessus (comme les pions quand actifs) :
```ts
// Dans useFrame post-lock :
const pulse = 0.08 + 0.06 * Math.sin(tRef.current * 2.5);
topFaceMaterial.emissiveIntensity = pulse;
```
**Impact :** La face résultat est clairement identifiable — renforce la lisibilité.  
**Difficulté :** Nécessite de tracker le matériau de la face du dessus selon `targetFace`.

---

### Niveau 3 — Refactoring architectural (1–2 jours)

#### 3a. Quantification canonique finale
Même si visuellement parfait, la rotation finale n'est pas un multiple exact de π/2. Après le verrou, imposer l'orientation discrète exacte via quaternion :
```ts
// Trouver le quaternion le plus proche parmi les 24 orientations valides d'un cube
function getNearestCubeQuaternion(q: THREE.Quaternion): THREE.Quaternion {
  const cubeOrientations = generateCubeOrientations(); // 24 quaternions
  return cubeOrientations.reduce((best, cand) =>
    q.angleTo(cand) < q.angleTo(best) ? cand : best
  );
}
```
**Impact :** Élimine les dérives cumulées sur replays ou comparaisons futures.  
**Utilité concrète :** Faible en V2 (localStorage only, pas de comparaison réseau).

#### 3b. Plusieurs dés simultanés
La structure actuelle est mono-dé (un seul `BoardDice3D`). Pour le méta-jeu (Dé A intensité + Dé B style) :
- Extraire `BoardDice3D` en composant générique avec `diceId` prop
- Partager les `THROW_ORIGINS` et `DICE_LANDING_ZONES` entre les deux dés (éviter collision)
- Coordonner les `onRollComplete` via Promise.all ou callback counter

Voir `docs/roadmaps/meta-jeu-roadmap.md` Phase 4 pour le contexte.

#### 3c. Personnalisation visuelle du dé
Pour les thèmes premium (`dark-luxury`, `nude`) : variantes de matériau par thème.
```ts
// dark-luxury : verre sombre teinté
{ roughness: 0.05, metalness: 0.1, transmission: 0.6, color: '#1a0a2e' }
// nude : ivoire chaud mat
{ roughness: 0.7, color: '#f5e6d0' }
```
**Impact :** Le dé est cohérent avec l'identité visuelle du thème.

---

### Niveau 4 — Physique réelle : Rapier (3–5 jours)

Remplacement complet du pipeline impératif par un moteur physique.

**Stack :**
```
@react-three/rapier   // wrapper Rapier WASM (~300 KB)
```

**Architecture cible :**
```ts
// 1. Résultat prédéterminé
const targetFace = diceResult; // déjà connu
const targetQuat = faceToQuaternion(targetFace);

// 2. Calculer les conditions initiales qui produisent naturellement targetFace
// (54 milliards de combinaisons selon dice-box-threejs)
const { initRot, initAngVel } = computeInitialConditions(targetFace);

// 3. Lancer avec physique réelle
rigidBody.setTranslation(throwOrigin);
rigidBody.setRotation(initRot);
rigidBody.setLinvel(throwVelocity);
rigidBody.setAngvel(initAngVel);

// 4. Détecter face après arrêt (pas de correction)
const localUp = new THREE.Vector3(0,1,0).applyQuaternion(q.clone().invert());
// localUp.y > 0.7071 → face 1, etc.
```

**Ce que ça apporte :**
- Rebond réel contre le plateau (collision mesh)
- Friction angulaire naturelle
- Interaction avec les pions (collision optionnelle)
- Zéro correction de rotation — la physique livre la bonne face

**Prérequis :**
- Évaluer impact WASM sur Android API 22 (cible minimum)
- Tester perf avec Rapier + 2 pions `MeshPhysical` simultanément
- `@react-three/rapier` compatible avec OrthographicCamera

**Références :**
- [Codrops — Three.js + Cannon-es](https://tympanus.net/codrops/2023/01/25/crafting-a-dice-roller-with-three-js-and-cannon-es/)
- [dice-box-threejs](https://github.com/3d-dice/dice-box-threejs) — initial conditions prédéterminées
- [threejs-dice (byWulf)](https://github.com/byWulf/threejs-dice) — détection face par quaternion
