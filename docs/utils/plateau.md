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

## Niveau 3 ✅ livré — React Three Fiber

### Architecture

`BoardGrid` est un wrapper conditionnel : WebGL détecté → `BoardGridR3F`, sinon → `BoardGridCSS` (fallback CSS intact).

```ts
function useWebGLSupport(): boolean | null  // null = SSR, false = pas de WebGL
```

### Caméra orthographique isométrique

```ts
// elevation 58°, azimuth 45° — identique au CSS rotateX(58°) rotateZ(45°)
const CAM_POS = [7.5, 16.96, 7.5]  // distance 20, sphérique
<OrthographicCamera zoom={38} onUpdate={self => self.lookAt(0, 0.1, 0)} />
```

Pas de transform CSS sur le Canvas — la caméra gère la perspective.

### Géométrie 3D

- Socle acajou : `BoxGeometry` — `#8a3418`, roughness=0.82.
- Cases : `BoxGeometry(1.0, 0.25, 1.0)`, `MeshStandardMaterial`, couleur par type.
- Gap entre cases : 0.08 world units.
- Case active : `emissiveIntensity` animé via `useFrame` (pulse lent ou flash).

### Couleurs par type de case (MeshStandardMaterial)

```ts
depart:#4ade80  normal:#7a6248  chance:#fbbf24
pause:#f87171   accord:#60a5fa  complicite:#c084fc  arrivee:#34d399
```

### Lumières

```tsx
<ambientLight intensity={0.55} />
<directionalLight position={[5, 10, 5]} intensity={1.4} />       // lumière principale
<directionalLight position={[-4, 6, -4]} intensity={0.35} color="#ffd0a0" />  // chaud fill
```

### Ombres

```tsx
// Ombres des cases sur le socle acajou
<ContactShadows position={[0, -0.01, 0]} far={0.4} frames={1} resolution={128} />
// Ombre du plateau sur le sol virtuel
<ContactShadows position={[0, -0.32, 0]} far={5} frames={1} resolution={128} />
// Disque blob sous chaque pion (mesh circle, opacity 0.28)
<PawnShadowDisc squareIndex={...} />
```

`frames={1}` : ombres calculées une seule fois (scène statique) → mobile-safe.

### Pions (DOM overlay)

`PawnOverlayR3F` : projection 3D → 2D via `THREE.Vector3.project(camera)` au premier frame.
Même logique d'arc Framer Motion que la version CSS. `PawnSvg` identique (réutilisé).

### Fallback WebGL

```
iOS 13+ / Android API 22+ via Capacitor → WebGL disponible dans 99% des cas.
null (SSR) → CSS, false (WebGL absent) → CSS. Pas de flash : CSS rendu immédiatement.
```

### Tuning sandbox

Paramètres à ajuster dans `Board.tsx` :
- `CANVAS_H = 450` : hauteur du canvas en px.
- `zoom={38}` sur `OrthographicCamera` : zoom — plus grand = plateau plus grand.
- `CAM_POS` : position caméra (distance 20, élévation 58°, azimut 45°).

| Feature | CSS iso actuel | R3F |
|---------|---------------|-----|
| Lumière sur les cases | Absente (faces CSS abandonnées) | Réelle (ambiant + directionnel) |
| Ombre des pions | Absente | ContactShadows + PawnShadowDisc |
| Cases avec matière | Gradient CSS | MeshStandardMaterial |
| Faces latérales | Abandonnées (z-order) | Automatiques (géométrie 3D) |
| Brouillard de distance | Impossible | `<fog attach="fog" />` (non branché) |

---

## Tableau récap

| Feature | Avant | Niveau 1 ✅ | Niveau 2 ✅ | Niveau 3 ✅ |
|---------|-------|-----------|---------|---------|
| Vue isométrique | ❌ | ✅ CSS 58°+perspective | ✅ | ✅ caméra ortho R3F |
| Surface plateau | ❌ | ✅ acajou basique | ✅ grain bois + glow | ✅ MeshStandardMaterial |
| Sens Sonic (départ bas) | ❌ | ✅ rangées inversées | ✅ | ✅ |
| Faces latérales | ❌ | ⚠️ abandonnées | — | ✅ auto BoxGeometry |
| Trail de progression | ❌ | ❌ | ❌ inutile | — |
| Ombres pions | ❌ | ❌ | ❌ | ✅ ContactShadows + disc |
| Pions SVG | ❌ | token basique | ✅ SVG cylindrique | ✅ overlay DOM (R3F projection) |
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
