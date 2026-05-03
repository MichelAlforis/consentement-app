# Rendu du plateau — État actuel → 2026

**Fichiers clés :**
- `app/components/screens/GooseGameScreen/components/Board.tsx` — implémentation Jeu de l'Oie (**c'est ici que tout se passe**)
- `app/game-engine/board/BoardRenderer.tsx` — moteur générique (non branché au Jeu de l'Oie pour l'instant)
- `app/game-engine/board/useBoardEngine.ts` — logique déplacement générique
- `app/plateau-test/page.tsx` — sandbox `/plateau-test` pour itérer sans passer par le flow jeu

---

## Niveau 1 ✅ livré

### Ce qui tourne

**Vue isométrique CSS**
```ts
const ISO_TRANSFORM = 'rotateX(58deg) rotateZ(45deg) scale(0.78)';
```
- `rotateX(58deg)` — angle empirique donnant l'effet "sol qui s'éloigne" (Sonic 3D Blast)
- `rotateZ(45deg)` — orientation diamant classique
- `scale(0.78)` — compression pour tenir dans un écran portrait 390px
- `perspective: 800px` sur le conteneur `mx-auto` — point de fuite centré, effet tunnel léger
- `transformStyle: 'preserve-3d'` sur les divs intermédiaires

**Rangées inversées**
```ts
[...BOARD_LAYOUT].reverse().map((row, rowIndex) => { ... })
```
Case 0 (Départ) en bas/proche du joueur → case 23 (Arrivée) en haut/loin.

**Surface du plateau**
```ts
background: texture grain bois + linear-gradient(145deg, #c45628, #8a3418, #582210)
border: '2px solid rgba(240,170,60,0.85)'
boxShadow: glow ambré externe + inset sombre
inset: -22   // dépasse les cases de 22px tout autour
```

**Pions (PawnToken)**
- SVG 60px avec radialGradient (reflet + ombre) + emoji centré
- Positionnés `position: absolute` hors du `motion.div` de la case — immunisés contre le scale de la case
- Décalés en `translateX(±10px)` quand les deux joueurs sont sur la même case

**Overflow mobile**
- `overflowX: hidden` sur le wrapper externe
- `maxWidth: 380, padding: '8px 16px 48px'`

### Ce qui a été tenté et abandonné

**Faces CSS 3D** (`rotateX(-90deg)` / `rotateY(90deg)`) — trop fragiles :
- Z-ordering cassé avec `preserve-3d` + Framer Motion
- Ombres qui "remontent vers le ciel" après inversion des rangées + rotateX élevé
- **Résolution prévue** : Niveau 3 R3F (lumière réelle, ContactShadows)

**Trail SVG** — implémenté puis supprimé :
- Polyline SVG reliant les centres des cases visitées
- Dans un serpentin boustrophédon la ligne zigzague de façon illisible
- Le trail n'apporte pas d'info stratégique en Jeu de l'Oie (position déjà visible via pion)

---

## Niveau 2 ✅ livré

### Améliorations visuelles plateau

**Texture grain bois sur le socle**
```ts
background: `
  repeating-linear-gradient(89deg, transparent 0px, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px),
  repeating-linear-gradient(86deg, transparent 0px, transparent 9px, rgba(255,255,255,0.14) 9px, rgba(255,255,255,0.14) 11px),
  repeating-linear-gradient(91deg, transparent 0px, transparent 18px, rgba(0,0,0,0.18) 18px, rgba(0,0,0,0.18) 20px),
  linear-gradient(145deg, #c45628 0%, #8a3418 50%, #582210 100%)
`
```
3 couches de stries à angles légèrement différents (89°, 86°, 91°) simulant fibres, reflets et cernes.
La texture s'applique uniquement sur le socle — les cases ont leurs propres backgrounds opaques qui la masquent.

**Bordure lumineuse ambrée**
```ts
border: '2px solid rgba(240,170,60,0.85)'
boxShadow: '0 0 18px rgba(240,160,40,0.55), 0 0 40px rgba(200,100,20,0.25), inset 0 0 30px rgba(0,0,0,0.45)'
```
Double glow externe (halo proche + halo diffus) + inset sombre pour la profondeur.

**Acajou visible**
Gradient corrigé : `#c45628 → #8a3418 → #582210` (+40% luminosité vs version initiale quasi-noire).

### Repris par la feature pion

**Animation arc pion** — intégré dans la feature modélisation pion (agent dédié).
Le déplacement case par case à 210ms/case (`usePawnAnimation`) reste actif en attendant la livraison.

---

## Niveau 3 ✅ livré — React Three Fiber (finalisé)

### Architecture

`BoardGrid` est un wrapper conditionnel : WebGL détecté → `BoardGridR3F`, sinon → `BoardGridCSS` (fallback CSS intact).

```ts
function useWebGLSupport(): boolean | null  // null = SSR, false = pas de WebGL
```

### Caméra orthographique isométrique

```ts
// Azimut 0° + group rotationY 45° = même effet que CSS rotateX(58°) rotateZ(45°)
const CAM_DIST = 20
const CAM_ELEV = 40 * Math.PI / 180
const CAM_POS = [0, CAM_DIST * sin(CAM_ELEV), CAM_DIST * cos(CAM_ELEV)]
<OrthographicCamera zoom={68} />
// CameraLookAt : useFrame(() => camera.lookAt(0,0,0)) — stable à chaque frame
```

Le losange vient du `<group rotation={[0, Math.PI/4, 0]}>` qui englobe tout le contenu du plateau.

### Géométrie 3D

- Socle acajou : `BoxGeometry`, texture procédurale `CanvasTexture` (grain bois baked, même stries que CSS), roughness=0.75.
- Cases : `RoundedBox(1.0, 0.14, 1.0)`, radius=0.07, **`meshBasicMaterial`** — couleur plate, zéro lumière, rendu carton imprimé.
- Gap entre cases : 0.12 world units.
- Case active : modulation directe de `color` via `useFrame` (pulse lent ou flash) — pas d'emissive.
- `meshBasicMaterial` intentionnel : contraste voulu entre cases flat (print-like) et socle réaliste (PBR).

### Couleurs par type de case

Cases spéciales : couleurs fixes.
Cases `normal` : couleur par face de dé via `DICE_FACE_COLOR` (miroir de `DICE_CATEGORIES.gradient`).

```ts
// Spéciales
depart:#4ade80  chance:#fbbf24  pause:#f87171
accord:#60a5fa  complicite:#c084fc  arrivee:#34d399

// Normales par face
1:#f59e0b  2:#8b5cf6  3:#ec4899  4:#3b82f6  5:#10b981  6:#be123c
```

### Color management (Phase 1 — 2026-05-03)

```tsx
// Canvas gl — valeurs explicites, cohérentes inter-scènes
gl={{
  antialias: true,
  powerPreference: 'low-power',
  failIfMajorPerformanceCaveat: false,
  toneMapping: THREE.ACESFilmicToneMapping,  // préserve les highlights bois en oblique
  toneMappingExposure: 1.15,                  // +0.05 pour compenser la compression ACES
  outputColorSpace: THREE.SRGBColorSpace,
}}
dpr={[1, 2]}

// Textures
// useMahoganyTexture() :
tex.colorSpace = THREE.SRGBColorSpace;  // sans ça : double gamma, couleurs délavées
tex.anisotropy = 8;                     // netteté en vue oblique (forte inclinaison caméra)
// buildIconTexture() + bodyTexture pion :
tex.colorSpace = THREE.SRGBColorSpace;
```

### Pipeline lumière (ordre critique en PBR)

```tsx
// 1. IBL ambiance (sunset = tons chauds, cohérent avec acajou)
<Environment preset="sunset" />
// 2. Directionnel principal (forme + ombres portées)
<directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.001} />
// 3. Ambient fill
<ambientLight intensity={0.35} />
// 4. Fill secondaire (anti-shadow trop dur)
<directionalLight position={[-4, 4, -4]} intensity={0.2} />
```

### Ombres

```tsx
// Une seule ContactShadows (fusionnées) — frames={1} mobile-safe
<ContactShadows position={[0, -(BASE_H+0.02), 0]} opacity={0.28} scale={14} blur={3.5} frames={1} />
// Disque blob par pion (mesh circle, opacity dynamique selon hauteur d'arc)
```

### Icônes sur les cases (pipeline 3D pur)

```tsx
<mesh position={[0, CELL_H3/2+0.002, 0]} rotation={[-Math.PI/2, 0, 0]}>
  <planeGeometry args={[0.55, 0.55]} />
  <meshBasicMaterial map={getIconTexture(iconName)} transparent depthWrite={false} />
</mesh>
```

Zéro DOM overlay, zéro fichier externe. Chaque icône est une `THREE.CanvasTexture` 64×64 générée via `Path2D` + Canvas API au premier render, mise en cache au niveau module.

**`buildIconTexture(iconName)`** :
- Dessine les nodes SVG Lucide (path/polygon/rect/circle/line) en canvas 24→64px
- `lineWidth = 2.8 / scale` — traits épais lisibles à toute taille
- Cercles avec `fill:'true'` → remplis (ex: point du `?` dans HelpCircle)
- `getIconTexture` : cache `Map<string, CanvasTexture>` — texture construite une seule fois par icône

**Icônes supportées** : Rocket, Star, Pause, Handshake, Heart, Flag, Layers, MessageCircle, HelpCircle, Target, Sparkles

Le plane est à `depthWrite:false` + légèrement au-dessus de la case (`+0.002`) — pas de z-fighting. La géométrie 3D des pions occlut naturellement les icônes par depth testing.

### Pions (Pawn3D — géométrie WebGL native)

Cylindres + sphère `meshPhysicalMaterial` (clearcoat, iridescence). Animation arc via `useFrame` (pas de Framer Motion). Ombre blob dynamique dont l'opacité suit la hauteur.

### Texture bois (procédurale)

`useMahoganyTexture()` génère un `THREE.CanvasTexture` 512×512 au premier render :
- Gradient acajou baked (`#c45628 → #8a3418 → #582210`)
- 3 couches de stries (spacing 4/10/19, slant 0.02/-0.07/0.04) — identiques aux CSS `repeating-linear-gradient`
- Aucun fichier externe requis

### Fallback WebGL

```
iOS 13+ / Android API 22+ via Capacitor → WebGL disponible dans 99% des cas.
null (SSR) → CSS, false (WebGL absent) → CSS. Pas de flash.
```

### Tuning sandbox (`/plateau-test`)

- `CANVAS_H = 660` : hauteur canvas px.
- `zoom={68}` sur `OrthographicCamera` : taille du plateau.
- `CAM_ELEV = 40°` : élévation caméra.
- `CAM_DIST = 20` : distance caméra.

| Feature | CSS iso actuel | R3F finalisé |
|---------|---------------|-------------|
| Lumière sur les cases | Absente | Réelle (PBR pipeline) |
| Ombre des pions | Absente | ContactShadows + blob dynamique |
| Cases avec matière | Gradient CSS | MeshStandardMaterial + micro-roughness |
| Faces latérales | Abandonnées | Automatiques (RoundedBox) |
| Texture bois socle | CSS stries | CanvasTexture procédurale |
| Couleurs cases normales | Par face dé | Par face dé (DICE_FACE_COLOR) |
| Icônes sur cases | Toujours face caméra | Pipeline 3D pur — CanvasTexture + plane mesh |
| Bloom | Impossible | EffectComposer + Bloom ciblé emissives |

---

## Tableau récap

| Feature | Avant | Niveau 1 ✅ | Niveau 2 ✅ | Niveau 3 ✅ |
|---------|-------|-----------|---------|---------|
| Vue isométrique | ❌ | ✅ CSS 58°+perspective | ✅ | ✅ caméra ortho R3F |
| Surface plateau | ❌ | ✅ acajou basique | ✅ grain bois + glow | ✅ MeshStandardMaterial + CanvasTexture |
| Sens Sonic (départ bas) | ❌ | ✅ rangées inversées | ✅ | ✅ |
| Faces latérales | ❌ | ⚠️ abandonnées | — | ✅ auto RoundedBox |
| Trail de progression | ❌ | ❌ | ❌ inutile | — |
| Ombres pions | ❌ | ❌ | ❌ | ✅ ContactShadows + blob dynamique |
| Pions | ❌ | token basique | ✅ SVG cylindrique (CSS) | ✅ géométrie WebGL native (meshPhysical) |
| Couleurs cases normales | ❌ | ❌ | ❌ | ✅ DICE_FACE_COLOR par face |
| Icônes sur cases | ❌ | ❌ | ❌ | ✅ Html transform+occlude (à plat sur case) |
| Bloom | ❌ | ❌ | ❌ | ✅ EffectComposer ciblé emissives |
| Fallback CSS (WebGL absent) | — | — | — | ✅ automatique |
| Légende | ✅ | ✅ | ✅ | ✅ |

---

## Notes d'implémentation

**Angle rotateX**
58° actuel (empirique). Les standards jeux mobiles (Unity/Godot) utilisent 30°, mais 30° donne un "panneau en biais" sans perspective. La combinaison `rotateX(58deg) + perspective: 800px` donne l'effet sol voulu.

**Perspective**
Sans `perspective` sur le parent, la projection est orthographique — le plateau flotte comme un panneau. `800px` donne un effet tunnel léger. Valeurs de référence : `500px` = fort, `1200px` = subtil.

**Overflow mobile**
`rotateX(58deg) rotateZ(45deg)` crée un losange plus large que le rectangle d'origine. `overflowX: hidden` + `maxWidth: 380` + `scale(0.78)` résout le dépassement sur iPhone 15 (390px).

**Texture grain bois**
Uniquement visible dans les 22px de marge autour de la grille et les 5px de gap entre cases. Les cases ont des backgrounds opaques (gradients catégories dé) qui masquent complètement le bois en dessous. Opacités volontairement élevées (14–22%) car la zone visible est petite.

**Trail SVG — pourquoi abandonné**
En serpentin boustrophédon, une polyline reliant les centres des cases visitées zigzague de façon illisible (changement de direction brutal à chaque fin de rangée). Pas de valeur stratégique non plus : la position du pion suffit.
