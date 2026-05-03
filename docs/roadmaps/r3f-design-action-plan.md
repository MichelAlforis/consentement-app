# R3F Design Action Plan — Consentement App

> Plan priorisé pour transformer le rendu visuel de l'app, basé sur l'audit complet du code.
> Les fixes sont ordonnés par **ratio impact-visuel / effort**.
>
> **v3 — Stratégie tier-aware (final)** :
> - **Carte unique = wow moment confirmé** par le code (`computeGainedCards.ts` : drop rare ~10% pour premium + thèmes éligibles, vibrate('heavy'), durée flip dédiée, particules or + glow HSL arc-en-ciel). Le foil PBR est justifié.
> - **Pas d'accès device Android physique** → on **gate le foil PBR sur tier 3 uniquement**, fallback CSS shimmer renforcé pour tier 2.
> - **Fusion Phase 1 + Phase 2** : color management et foil partent ensemble sur la carte unique pour un before/after propre.
> - **Extension `renderModeStore`** : exposer `gpuTier` en plus du `renderMode` binaire, pour que les composants puissent activer/désactiver des features selon le tier.
>
> **v2 — Corrections après revue** :
> - `RarityGlowRing` utilise maintenant `makeRoundedCardGeometry` (et plus `ringGeometry` qui ne suivait pas la silhouette de la carte).
> - `CameraLookAt` reçoit `camPos` en prop pour que les deps du `useEffect` détectent vraiment le resize.
> - Ajouts : `frames={1}` sur ContactShadows du DiceCanvas, `anisotropy` sur textures de carte, note sur le coût perf du MeshPhysicalMaterial unique.

---

## Statut d'avancement — 2026-05-03

| Phase | Items | Statut |
|---|---|---|
| **PRE** | `gpuTier` exposé dans store + `useGpuTier()` + `RenderModeInit` layout | ✅ LIVRÉ |
| **Phase 1** | toneMapping + colorSpace + anisotropy sur 4 canvases + antialias/dpr cartes + foil PBR tier-3 + RarityGlowRing + fakeFoil tier-2 | ✅ LIVRÉ |
| **Phase 2** | frameloop par rareté + Environment night cinématique + shadows cleanup board | ✅ LIVRÉ |
| **Phase 3** | CameraLookAt useEffect + LCG pawn + ContactShadows frames={1} DiceCanvas | ✅ LIVRÉ |
| **Phase 3 — différé** | useFrame Cell3D consolidé (24→1) | 🔲 refactor architectural — risque regressions, à faire après tests |
| **Phase 3 — bloqué** | N8AO board (OrthographicCamera incompatible depth math) | 🔲 revisiter si switch caméra Perspective |

---

## TL;DR

| Priorité | Catégorie | Gain visuel | Effort |
|---|---|---|---|
| **PRE** | Dev override + exposition `gpuTier` dans le store | utilitaire | 30 min |
| **P0** | Color management (toneMapping + colorSpace) | ⭐⭐⭐⭐⭐ | 10 min |
| **P0** | Carte unique : foil PBR **gated tier 3** + fallback shimmer tier 2 | ⭐⭐⭐⭐⭐ | 45 min |
| **P0** | Antialiasing carte + DPR dé | ⭐⭐⭐⭐ | 5 min |
| **P0** | Lights cartes nettoyées (suppression pointLights inutiles) | ⭐⭐⭐ | 15 min |
| **P1** | Idle anim rare après flip (frameloop) | ⭐⭐⭐ | 10 min |
| **P1** | SoftShadows + N8AO sur le board | ⭐⭐⭐ | 20 min |
| **P2** | Code quality (camera.lookAt, Math.random, ContactShadows cartes) | ⭐⭐ | 30 min |
| **P2** | Direction artistique unifiée (palette, exposure, vignette params) | ⭐⭐⭐⭐ | 1h |

---

## PRE — Foundation : dev override + exposition gpuTier

Le dev override (`?renderMode=...`, `?renderTier=...`, `__setRenderMode`, `__clearRenderMode`) est déjà mergé. Il faut ajouter une dernière chose pour le tier-gating du foil.

### Exposer `gpuTier` dans le store

```ts
// renderModeStore.ts — extension de l'interface
interface RenderModeState {
  renderMode: RenderMode | null;
  gpuTier: number | null;  // ← AJOUTER : 0 | 1 | 2 | 3 | null
  // ... reste inchangé
}

// État initial
const initialState = {
  renderMode: null,
  gpuTier: null,
  // ...
};

// Dans la détection getGPUTier()
const tier = await getGPUTier();
set({
  renderMode: tier.tier >= 2 ? 'r3f' : 'css',
  gpuTier: tier.tier,
});

// Dans readDevOverride / la branche `override?.tier !== undefined`
if (override?.tier !== undefined) {
  set({
    renderMode: override.tier >= 2 ? 'r3f' : 'css',
    gpuTier: override.tier,  // ← propager le tier simulé
  });
  return;
}

// Dans partialize — ne PAS persister gpuTier non plus quand override actif
// (la persistance habituelle de gpuTier est OK quand pas d'override)
```

### Hook consommateur

```ts
// hooks/useGpuTier.ts (nouveau fichier, 4 lignes)
export function useGpuTier(): number | null {
  return useRenderModeStore((s) => s.gpuTier);
}
```

Usage dans les composants :

```tsx
const gpuTier = useGpuTier();
const enableFoilPBR = gpuTier === 3;
```

Test depuis la barre d'URL : `?renderTier=3` simule du high-end, `?renderTier=2` simule mid-range, sans toucher à ton vrai device.

---

## P0 — Color Management (le plus gros gain pour le moins d'effort)

### 1. Forcer toneMapping + outputColorSpace explicites sur TOUS les canvases

**Pourquoi** : R3F applique `ACESFilmicToneMapping` par défaut, qui désature les couleurs vives (les violets, oranges et roses de tes glows perdent leur peps). Pour un design "premium stylisé sombre" avec glows colorés, **`NeutralToneMapping`** (Three.js ≥0.157) ou `LinearToneMapping` rendent beaucoup mieux les teintes saturées sans cramer les highlights.

**Patch à appliquer sur les 4 canvases** :

```tsx
import * as THREE from 'three';

// CollectorCardCanvas.tsx
<Canvas
  gl={{
    antialias: true, // ← ON, voir P0.3
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.NeutralToneMapping,        // ← AJOUTER
    toneMappingExposure: 1.0,                      // ← AJOUTER
    outputColorSpace: THREE.SRGBColorSpace,        // ← AJOUTER (explicite)
  }}
  dpr={[1, 2]}
  // ...
>
```

Applique le **même bloc `gl`** (avec exposure 1.1 sur le board, 1.0 ailleurs) à `DiceCanvas`, `BoardGridR3F`, et `GameEndCinematic`. La cohérence inter-scènes vient de là.

### 2. Ajouter `colorSpace = SRGBColorSpace` sur TOUTES les CanvasTexture

**Bug actuel** : tes textures de dé et de plateau apparaissent **délavées et désaturées** parce que Three.js les interprète en linear et applique une double conversion gamma au render.

**Fichiers à corriger** :

```tsx
// DiceCanvas.tsx — makeFaceTexture() et makeNumericFaceTexture()
const tex = new THREE.CanvasTexture(canvas);
tex.colorSpace = THREE.SRGBColorSpace; // ← AJOUTER
tex.anisotropy = 4;                    // ← bonus : netteté en oblique
tex.needsUpdate = true;
return tex;

// BoardGridR3F.tsx — useMahoganyTexture()
const tex = new THREE.CanvasTexture(canvas);
tex.colorSpace = THREE.SRGBColorSpace; // ← AJOUTER
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.anisotropy = 8;                    // bois en oblique → anisotropy plus élevé
tex.needsUpdate = true;
return tex;

// BoardGridR3F.tsx — buildIconTexture() (icônes de cases)
const tex = new THREE.CanvasTexture(canvas);
tex.colorSpace = THREE.SRGBColorSpace; // ← AJOUTER
tex.needsUpdate = true;

// BoardGridR3F.tsx — Pawn body noise texture
tex.colorSpace = THREE.SRGBColorSpace; // ← AJOUTER

// CollectorCardCanvas.tsx — makeBackTexture / makeFaceTexture
// (colorSpace déjà OK, AJOUTER seulement anisotropy)
const tex = new THREE.CanvasTexture(canvas);
tex.colorSpace = THREE.SRGBColorSpace;
tex.anisotropy = 4;                    // ← AJOUTER : netteté quand la carte est vue en oblique
tex.needsUpdate = true;
```

**Règle générale** : toute `CanvasTexture` qui contient une **image colorée destinée à être vue** doit être en `SRGBColorSpace`. Les textures de **données** (normalMap, roughnessMap, displacement) restent en `LinearSRGBColorSpace` (défaut).

`anisotropy` est utile dès qu'une texture est vue en perspective non-frontale. Cartes (tilt gyro), dé (toutes faces), bois plateau (très oblique) en bénéficient. Valeur typique : 4 pour textures fines, 8 pour textures à grain marqué (bois).

Le seul endroit où `colorSpace` est déjà bon : `CollectorCardCanvas.tsx` — bonne pratique, juste à généraliser et compléter avec `anisotropy`.

### 3. Cartes : antialiasing + DPR cohérent

```tsx
// CollectorCardCanvas.tsx
<Canvas
  dpr={[1, 2]}                    // ← passer de [1, 1.5] à [1, 2]
  gl={{
    antialias: true,              // ← passer de false à true
    powerPreference: 'low-power',
    // ...
  }}
>
```

Le combo `antialias: false + dpr=1.5` te donne le pire des deux mondes : pas d'AA matériel ET sur-échantillonnage insuffisant pour compenser. Soit `antialias: true + dpr=[1, 1.5]`, soit `antialias: false + dpr=[1, 2]`. Le premier est plus net pour des bords diagonaux (coins arrondis de cartes).

⚠️ **Tester sur device cible** : `antialias: true + dpr=[1, 2]` est l'option qualité max, mais peut être lourde sur mobile low-end (Android API 22-26, iPhone < 11). Si tu vois des chutes de FPS sur device, fallback à `antialias: true + dpr=[1, 1.5]` (compromis raisonnable) ou `antialias: false + dpr=[1, 2]` (FXAA via post-processing à ajouter manuellement si besoin). Mesure avec `r3f-perf` avant de trancher.

### 4. Dé : ajouter `dpr` et supprimer le `gl.setPixelRatio` manuel

```tsx
// DiceCanvas.tsx
<Canvas
  dpr={[1, 2]}                    // ← AJOUTER (cap à 2× au lieu de 3×+ natif)
  camera={{ position: [0, 0, 2.5], fov: 45 }}
  shadows
  gl={{
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.NeutralToneMapping,
    outputColorSpace: THREE.SRGBColorSpace,
  }}
>

// Et dans DiceScene, SUPPRIMER ce useEffect (DiceCanvas.tsx:301-303) :
// ❌ useEffect(() => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); }, [gl]);
```

La prop `dpr` est l'API canonique R3F et gère le resize correctement.

---

## P0 — Cartes : régler l'intention matériaux (tier-aware)

Tu as un conflit d'intention : 4 à 6 lights animées + `MeshBasicMaterial` (qui ignore les lights). Il faut trancher, **et appliquer un tier-gating** sur le matériau de la carte unique pour éviter le risque perf sur tier 2.

### Stratégie recommandée : hybride par rareté ET par tier GPU

| Rareté | Matériau face (tier 3) | Matériau face (tier 2) | Justification |
|---|---|---|---|
| Common | `MeshBasicMaterial` | `MeshBasicMaterial` | Carte imprimée, pas d'effet PBR, lecture du texte propre |
| Rare | `MeshBasicMaterial` + glow externe | `MeshBasicMaterial` + glow externe | Glow ring fait le job sur les deux tiers |
| **Unique** | **`MeshPhysicalMaterial` foil** | `MeshBasicMaterial` + LightOverlay shimmer renforcé | PBR uniquement où on est sûr que ça tourne |

Tier 0-1 : déjà géré par le fallback CSS de `useRenderMode`.

### Patch — face de carte unique (foil tier-gated)

```tsx
// CollectorCardCanvas.tsx — autour de ligne 558
import { useGpuTier } from '@/hooks/useGpuTier';

// Dans CardMesh
const gpuTier = useGpuTier();
const enableFoilPBR = card.rarity === 'unique' && gpuTier === 3;

const faceMat = useMemo((): THREE.Material => {
  if (enableFoilPBR) {
    // Tier 3 : vrai foil holographique
    return new THREE.MeshPhysicalMaterial({
      map: faceTex,
      roughness: 0.28,
      metalness: 0.55,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 800],
      envMapIntensity: 1.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });
  }
  // Common / rare / unique-tier2 = imprimé mat
  return new THREE.MeshBasicMaterial({ map: faceTex });
}, [faceTex, enableFoilPBR]);
```

⚠️ **Coût perf — pourquoi le tier 3 gate** : `MeshPhysicalMaterial` avec `iridescence=1.0` est sensiblement plus lourd que `MeshBasicMaterial`. L'iridescence ajoute du calcul d'interférence couche mince par fragment, et l'envMap ajoute des samples de cubemap. Sur tier 2 (Galaxy A52, Pixel 6a, iPhone 8), le shader peut faire chuter le FPS de 60 → 30-40 sur le canvas carte, sans qu'on puisse mesurer faute de device. Sur tier 3 (Galaxy S24, Pixel 8, iPhone 13+), aucun problème.

**Test sans device cible** :
1. `?renderTier=3` sur ton iPhone/desktop → tu vois le foil PBR full
2. `?renderTier=2` → tu vois le fallback enrichi (cf. patch suivant)
3. Vérifier visuellement que le tier 2 reste "premium" malgré l'absence de PBR

### Patch — fallback shimmer renforcé pour tier 2 unique

L'idée : sur tier 2, on garde `MeshBasicMaterial` (zéro coût GPU supplémentaire) mais on **booste le `LightOverlay` CSS existant** uniquement pour les cartes uniques sur tier 2. Le shimmer + gyro radial fait illusion de foil sans toucher au shader.

```tsx
// components/ui/LightOverlay.tsx (ou wherever it lives)
import { useGpuTier } from '@/hooks/useGpuTier';

interface LightOverlayProps {
  rarity: Rarity;
  // ...autres props existantes
}

export function LightOverlay({ rarity, ...rest }: LightOverlayProps) {
  const gpuTier = useGpuTier();
  const isFakeFoil = rarity === 'unique' && gpuTier === 2;

  return (
    <div
      style={{
        // ... styles existants
        // Sur tier 2 unique : conic-gradient holographique animé
        ...(isFakeFoil && {
          background: `
            conic-gradient(
              from var(--shimmer-angle, 0deg) at 50% 50%,
              rgba(246, 211, 106, 0) 0deg,
              rgba(246, 211, 106, 0.18) 60deg,
              rgba(236, 72, 153, 0.22) 120deg,
              rgba(124, 58, 237, 0.18) 180deg,
              rgba(245, 158, 11, 0.22) 240deg,
              rgba(246, 211, 106, 0) 360deg
            ),
            radial-gradient(circle at var(--gyro-x, 50%) var(--gyro-y, 50%),
              rgba(255, 255, 255, 0.25) 0%,
              transparent 60%)
          `,
          mixBlendMode: 'screen',
          opacity: 0.85,
        }),
      }}
      {...rest}
    />
  );
}
```

Et un useEffect qui anime `--shimmer-angle` via Framer Motion ou `requestAnimationFrame` selon ton existant. Coût : 0 GPU (CSS pur, le compositor s'en charge), résultat visuel "foil holographique" très convaincant à l'œil.

⚠️ **Note** : `mixBlendMode: 'screen'` peut coûter sur certains Android (compositor pas accéléré). Si tu vois un repaint cher dans DevTools Performance sur Android, fallback à `'lighten'` ou retire le blend mode et baisse l'opacity.

⚠️ **Coût perf à mesurer avant de valider** : `MeshPhysicalMaterial` avec `iridescence=1.0` est sensiblement plus lourd que `MeshBasicMaterial`, surtout sur les devices que tu cibles (iOS 13+, Android API 22+). L'iridescence ajoute du calcul d'interférence couche mince par fragment, et l'envMap ajoute des samples de cubemap. Sur iPhone 8 ou Android entry-level, le shader peut faire chuter le FPS de 60 → 30-40 sur le canvas carte.

**Mesure recommandée avant validation** :
1. Active `r3f-perf` en dev avec une carte unique affichée fullscreen
2. Note le FPS et le `gpu` time en ms
3. Si > 8ms GPU sur device cible bas de gamme, deux options :
   - Retirer `transmission` (déjà 0, juste s'assurer qu'il reste à 0)
   - Baisser `iridescence` à 0.7 (suffisamment d'effet, ~30% moins cher)
   - En dernier recours, garder `MeshBasicMaterial` et ajouter une **2e mesh décal foil** par-dessus avec un shader fresnel custom léger

### Patch — supprimer les lights inutiles pour common/rare (et tier 2 unique)

Les lights de `CardScene` ne servent que pour le foil PBR (donc carte unique sur tier 3). Il faut les conditionner :

```tsx
// CollectorCardCanvas.tsx — CardScene (~ligne 771)
import { useGpuTier } from '@/hooks/useGpuTier';

function CardScene({ card }: { card: CardData }) {
  const gpuTier = useGpuTier();
  const enableFoilPBR = card.rarity === 'unique' && gpuTier === 3;

  return (
    <>
      <color attach="background" args={['#0a0810']} />

      {/* Lights + Environment uniquement pour la carte unique tier 3 (PBR foil) */}
      {enableFoilPBR && (
        <>
          <ambientLight intensity={0.15} />
          <pointLight position={[1.5, 1.0, 1.5]} intensity={0.6} color="#f59e0b" />
          <pointLight position={[-1.5, -1.0, 1.2]} intensity={0.4} color="#ec4899" />
          <Environment preset="warehouse" environmentIntensity={0.4} />
        </>
      )}

      {/* Glow ring rare/unique : MeshBasic emissive, pas besoin de lights */}
      <RarityGlowRing rarity={card.rarity} />

      <CardMesh card={card} />
      {/* ... */}
    </>
  );
}
```

⚠️ **Remarque importante** : les lights actuelles sont en **Z négatif** (`-1.5`, `-1.0`, `-0.5`) alors que la caméra est en **Z=+2.2**. Elles éclairaient le dos de la carte (jamais visible). Mes valeurs corrigées sont en **Z positif**, entre la caméra et la carte.

**Économie sur tier 2 unique et tous tiers common/rare** : 4 pointLights + 1 Environment + leurs `useFrame` callbacks de pulsation = un Canvas presque vide niveau coût scène. Tout l'effet visuel est porté par : (a) le `MeshBasicMaterial` face de la carte, (b) le `RarityGlowRing`, (c) le `LightOverlay` CSS par-dessus.

### Patch — RarityLights → RarityGlowRing

Renomme et simplifie : tu n'as plus besoin de `pointLight` animées (rappel : `MeshBasicMaterial` ignore les lights), tu fais pulser directement l'**opacité du glow ring** qui est déjà `MeshBasicMaterial`.

⚠️ **Important** : la carte est un rectangle arrondi (`makeRoundedCardGeometry(1, 1.5, 0.15)`), donc le glow doit suivre la même silhouette. **Pas de `ringGeometry` circulaire** (qui déborderait haut/bas et se ferait tronquer sur les côtés).

On réutilise `makeRoundedCardGeometry` avec des dimensions légèrement supérieures, comme le code actuel le fait déjà. C'est la bonne approche ; on ne change que la *gestion des animations*, pas la géométrie.

```tsx
// CollectorCardCanvas.tsx — remplacer RarityLights
function RarityGlowRing({ rarity }: { rarity: Rarity }) {
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Géométrie arrondie légèrement plus grande que la carte (1×1.5 → 1.06×1.58)
  const glowGeom = useMemo(
    () => makeRoundedCardGeometry(1.06, 1.58, 0.16),
    [],
  );

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    if (rarity === 'rare') {
      glowRef.current.opacity = 0.30 + Math.sin(clock.getElapsedTime() * 1.4) * 0.08;
    } else if (rarity === 'unique') {
      glowRef.current.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 0.9) * 0.10;
    }
  });

  if (rarity === 'common') return null;

  return (
    <mesh position={[0, 0, -0.05]} geometry={glowGeom}>
      <meshBasicMaterial
        ref={glowRef}
        color={rarity === 'unique' ? '#f6d36a' : '#7c3aed'}
        transparent
        opacity={0.4}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

Tu économises 4 lights par scène + leurs callbacks `useFrame` + le bug de positionnement Z, **et** tu gardes la silhouette rectangle arrondi du code actuel.

---

## P1 — Polish

### 5. Idle animation rare préservée après flip

**Bug** : `setFrameloop('demand')` après flip → `useFrame` ne tourne plus → glow rare et float Y arrêtés.

**Fix** : ne basculer en `'demand'` **que** pour les cartes common, garder `'always'` pour rare/unique.

```tsx
// CollectorCardCanvas.tsx (~ligne 1109)
const handleFlipComplete = useCallback(() => {
  // Garder l'idle animation pour les cartes qui en ont une
  if (card.rarity === 'common') {
    setFrameloop('demand');
  }
  // rare et unique restent en 'always'
  onFlipComplete?.();
}, [card.rarity, onFlipComplete]);
```

Alternative plus économe (si tu tiens à `'demand'`) : utiliser `invalidate()` dans un `setInterval` ou via un `useFrame` parent, mais c'est plus complexe pour peu de gain.

### 6. Board : SoftShadows + AO pour profondeur

```tsx
// BoardGridR3F.tsx — top de Scene
import { SoftShadows } from '@react-three/drei';
import { N8AO } from '@react-three/postprocessing';

// Dans Scene, juste après <Environment> :
<SoftShadows size={25} samples={16} focus={0.5} />

// Dans EffectComposer :
<EffectComposer>
  <N8AO aoRadius={0.3} intensity={1.5} distanceFalloff={1.0} />  {/* AVANT Bloom */}
  <Bloom intensity={0.45} luminanceThreshold={0.32} luminanceSmoothing={0.85} mipmapBlur />
  <Vignette eskil={false} offset={0.45} darkness={0.4} />
</EffectComposer>
```

`SoftShadows` remplace `PCFSoftShadowMap` par un rendu poissoné = ombres beaucoup plus douces et naturelles. `N8AO` ajoute des contacts sombres dans les recoins (entre les cellules de la grille, sous les pions) → gain de profondeur immédiat.

⚠️ Coût : `N8AO` est gourmand. Test sur device cible avant de merger ; si chute de FPS, baisse `aoSamples` ou retire-le sur mobile.

### 7. Environment subtil sur GameEndCinematic

Pour que les blobs `MeshDistortMaterial` aient un peu plus de présence :

```tsx
// GameEndCinematic.tsx — CinematicScene
<Environment preset="night" environmentIntensity={0.15} background={false} />
```

Très bas (`0.15`) pour ne pas tuer le contraste sombre, mais suffisant pour donner du highlight aux blobs.

---

## P2 — Code quality / micro-perf

### 8. CameraLookAt : useEffect au lieu de useFrame

⚠️ **Piège React/Three** : `camera.position.x/y/z` ne fonctionne pas comme dépendance d'un `useEffect`. Three.js mute le `Vector3` en place (`position.x = ...`), et React ne détecte pas les mutations d'objet — il compare des références. La valeur est lue **une fois** à la création de l'effect et le re-trigger ne se produit jamais sur resize.

**Bonne approche** : passer le tableau `camPos` (calculé par `useResponsiveBoardConfig`) en prop. Quand le hook recalcule la position, le tableau change de référence → l'effect se re-déclenche correctement.

```tsx
// BoardGridR3F.tsx (~ligne 135) — REMPLACER
function CameraLookAt({ camPos }: { camPos: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera, camPos]); // camPos est le tableau retourné par useResponsiveBoardConfig
  return null;
}

// Et dans Scene, passer camPos :
// <CameraLookAt camPos={camPos} />  ← au lieu de <CameraLookAt />
```

Note : pas besoin de `camera.updateProjectionMatrix()` ici — `lookAt` modifie la matrice de vue, pas de projection. Et la prop `position` du composant `<OrthographicCamera>` de Drei gère déjà l'update de la projection.

Économie : **0 calcul/frame** au lieu de 60, avec re-orientation correcte sur resize.

### 9. Pawn body texture : LCG seedé

```tsx
// BoardGridR3F.tsx — useMemo bodyTexture
const bodyTexture = useMemo(() => {
  // LCG seedé déterministe (cohérent entre mounts)
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  const size = 128;
  // ... remplacer TOUS les Math.random() par rand()
  for (let y = 0; y < size; y++) {
    const a = 0.03 + 0.05 * Math.sin(y * 0.9 + rand() * 0.8);
    // ...
  }
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(255,255,255,${(0.03 + rand() * 0.06).toFixed(3)})`;
    // ...
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}, []);
```

Le pion garde la même texture entre re-mounts → pas de flash visuel, comportement déterministe en test.

### 10. ContactShadows : `frames={1}` partout, et simplifier sur les cartes

**Le `frames={1}` est manquant sur DiceCanvas et CollectorCardCanvas.** Sans cette prop, ContactShadows re-render le shadow buffer à **chaque frame** → coût GPU continu pour une ombre qui ne bouge jamais (la carte et le dé ne changent pas de position pendant l'idle).

```tsx
// DiceCanvas.tsx (~ligne 324) — AJOUTER frames={1}
<ContactShadows
  position={[0, -0.62, 0]}
  opacity={0.55}
  blur={2.5}
  far={2}
  scale={3}
  frames={1}            // ← AJOUTER (bake une fois)
  resolution={256}      // ← AJOUTER (256 suffit largement à 180px d'affichage)
/>

// CollectorCardCanvas.tsx — pour les cartes, deux options :

// Option A — Retirer (le fond #0a0810 fait déjà le job, l'ombre est imperceptible à 120px)
// Supprimer simplement le <ContactShadows ... /> dans CardScene

// Option B — Conserver mais downgrade
<ContactShadows
  position={[0, -0.80, 0]}
  opacity={0.45}
  blur={2.0}
  far={2.0}
  scale={3}
  frames={1}            // ← AJOUTER (bake une fois)
  resolution={128}      // ← AJOUTER (128 suffit, défaut 512 = overkill)
/>
```

Pour le board, `frames={1}` est déjà présent — bonne pratique à étendre aux deux autres canvases.

### 11. 63× useFrame sur Cell3D

Si chaque cellule a un `useFrame` (animation hover/active), **passe à un seul `useFrame` global** qui itère sur les cellules via un `useRef` partagé. Une cell sans état actif n'a pas besoin de tick.

Pattern :

```tsx
// Au niveau Scene
const cellsRef = useRef<Map<number, CellState>>(new Map());

useFrame((state, dt) => {
  cellsRef.current.forEach((cell, idx) => {
    if (cell.isActive || cell.isHovered) {
      // Anime ce cell uniquement
    }
  });
});

// Cell3D enregistre/désenregistre son état
useEffect(() => {
  cellsRef.current.set(idx, { mesh: meshRef, isActive, isHovered });
  return () => { cellsRef.current.delete(idx); };
}, [idx, isActive, isHovered]);
```

Économie : 63 callbacks → 1 callback. Sur mobile ça se sent.

---

## Direction artistique — Cohérence inter-scènes

### Palette unifiée (à mettre dans `theme/colors3D.ts`)

```ts
export const SCENE_COLORS = {
  // Backgrounds
  bgCardScene: '#0a0810',        // Très sombre, légère teinte violette
  bgBoardScene: 'transparent',   // hérite du gradient CSS du body
  bgCinematic: 'transparent',

  // Glows par rareté
  glowCommon: '#475569',         // slate-600 (subtle)
  glowRare: '#7c3aed',           // violet-600
  glowUnique: '#f6d36a',         // amber-300

  // Lumières d'accent
  lightWarm: '#f59e0b',          // amber-500
  lightCool: '#ec4899',          // pink-500
  lightAmbientPurple: '#1e1b4b', // indigo-950 (ambient teinté)

  // Bois plateau
  woodBase: '#3b2418',
  woodHighlight: '#5c3a24',
} as const;
```

### Exposure et toneMapping cohérents

| Scene | toneMapping | exposure | Justification |
|---|---|---|---|
| CollectorCardCanvas | `Neutral` | `1.0` | Préserve les couleurs des cartes imprimées |
| DiceCanvas | `Neutral` | `1.05` | Léger boost pour faire ressortir les arêtes brillantes |
| BoardGridR3F | `ACESFilmic` | `1.15` | Plateau a beaucoup d'emissive → ACES évite la cramure, exposure +0.05 pour compenser |
| GameEndCinematic | `ACESFilmic` | `1.2` | Boost bloom des orbes |

⚠️ **Nuance plateau** : `BoardGridR3F` a deux populations de matériaux qui réagissent différemment à ACES :
- **Bois + cellules** : PBR standard, ACES rend très bien (préserve les highlights bois en oblique)
- **Underlight accent** : `emissive` avec `emissiveIntensity={0.8}` + `toneMapped={false}` — ACES n'affecte pas grâce au flag

Donc en théorie, ACES sur ce canvas est OK. **Mais** si après avoir activé le toneMapping explicite tu trouves que l'underlight semble terne (parce que ACES affecte la lumière qu'il *projette* sur le bois adjacent), deux fallbacks :

```tsx
// Option A — Garder ACES, monter exposure
toneMapping: THREE.ACESFilmicToneMapping,
toneMappingExposure: 1.15,  // au lieu de 1.1

// Option B — Basculer en Neutral, exposure modérée
toneMapping: THREE.NeutralToneMapping,
toneMappingExposure: 1.05,  // ACES écrasait les couleurs primaires des emissives projetées
```

Test les deux après la phase 1 et vois ce qui rend le mieux ton accent color sur le bois.

### Vignette : harmoniser

Tu as actuellement deux vignettes différentes (`darkness 0.5` carte, `darkness 0.4` board). Uniformiser à **`darkness 0.45 / offset 0.42`** sur les deux pour une signature visuelle cohérente.

### Bloom : seuils à revoir

```tsx
// Carte
<Bloom intensity={0.55} luminanceThreshold={0.45} luminanceSmoothing={0.5} mipmapBlur />
//                                       ↑ baisser de 0.55 à 0.45 pour que les glows pulsent davantage

// Board
<Bloom intensity={0.50} luminanceThreshold={0.30} luminanceSmoothing={0.85} mipmapBlur />
//        ↑ +0.05 intensity, threshold OK
```

`mipmapBlur` partout (déjà sur le board, à ajouter sur la carte) — c'est plus joli et moins coûteux que le blur classique.

---

## Ordre d'application recommandé (v3 — fusion P1+P2)

**Phase 0 (15 min) — Foundation**

0a. Exposition `gpuTier` dans `renderModeStore` (déjà fait pour le dev override, juste ajouter le champ tier)
0b. Hook `useGpuTier()`

**Phase 1 (1h) — Foundation visuelle + foil unique tier-gated**

1. Ajouter `toneMapping` + `outputColorSpace` sur les 4 canvases
2. Ajouter `colorSpace = SRGBColorSpace` + `anisotropy` sur toutes les CanvasTextures
3. `antialias: true` + `dpr=[1, 2]` sur CollectorCardCanvas
4. `dpr=[1, 2]` + supprimer `gl.setPixelRatio` manuel sur DiceCanvas
5. `MeshPhysicalMaterial` + iridescence + Environment **conditionnés `gpuTier === 3`** pour la face de la carte unique
6. Lights conditionnées `enableFoilPBR`, repositionnées en Z positif
7. `RarityLights` → `RarityGlowRing` (suppression lights inutiles, garder géométrie rectangle arrondi)
8. Boost LightOverlay CSS pour tier 2 unique (conic-gradient holographique)

→ **La carte unique passe de "carte imprimée + glow" à "vrai foil holographique premium" sur tier 3, et "shimmer holographique CSS convaincant" sur tier 2.**

**Test entre Phase 1 et Phase 2** : capture before/after sur `/card-collector-test/` avec les 3 raretés × {`?renderTier=2`, `?renderTier=3`} × {portrait, landscape} × {dark, light} = 24 captures. Range dans `/test-captures/v3-phase1/`.

**Phase 2 (30 min) — board + cinématique**

9. `SoftShadows` + `N8AO` sur le board
10. `Environment preset="night" environmentIntensity={0.15}` discret sur cinématique
11. Bloom et vignette harmonisés
12. Idle anim rare préservée après flip (frameloop conditionné par rareté)

**Phase 3 (1h) — code quality**

13. `CameraLookAt` en `useEffect` (avec `camPos` en prop, pas `camera.position.x/y/z`)
14. LCG seedé pour pawn body
15. ContactShadows : `frames={1}` partout, simplification cartes
16. `useFrame` partagé pour Cell3D *(refactor architectural — à faire en dernier, c'est le changement le plus risqué)*

---

## Test visuel après chaque phase

À chaque phase, capture la même carte (ex: unique) et le même état du plateau dans les **mêmes conditions** (light/dark mode, même device). Compare en split-screen — c'est le seul moyen de juger si un changement améliore vraiment.

Outils suggérés :

- **`leva`** — déjà compatible R3F. Branche les params de matériau (roughness, iridescence, envMapIntensity) sur des sliders Leva pour tweaker en live sans rebuild.
- **`r3f-perf`** — overlay de perf à activer en dev pour vérifier qu'aucune phase ne dégrade le FPS.

```tsx
// En dev seulement
import { Perf } from 'r3f-perf';
{process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
```

---

## Ce que je n'ai PAS recommandé (et pourquoi)

- **Charger un HDRI custom** : les presets Drei (`studio`, `sunset`, `warehouse`) sont déjà très bien et coûtent moins qu'un fichier `.hdr` à télécharger.
- **GLTF / modèles 3D importés** : ton style "minimaliste géométrique" est cohérent avec la marque. Importer des modèles cassserait l'identité.
- **DepthOfField** : sur mobile c'est cher et l'effet est subtil sur un canvas de 180px. À garder pour la cinématique fullscreen seulement, si jamais.
- **ChromaticAberration / glitch** : tentant pour le côté "premium tech", mais avec ton univers (Consentement, sujet sensible), ça serait dissonant.

---

## Si tu veux aller plus loin

Une fois la phase 1-2 appliquée, partage-moi une capture du **rendu carte unique avant/après**. Je pourrai te dire si ça atteint le niveau "premium foil" visé ou si on doit pousser plus loin (ex: shader fresnel custom pour un vrai effet de réflexion arc-en-ciel angulaire).
