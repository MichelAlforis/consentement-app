# Système de cartes — Architecture visuelle

> Màj 2026-04-25

---

## Vue d'ensemble

Chaque carte a deux faces (dos / face) et existe dans **deux renderers** :

| Renderer | Fichier | Usage |
|---|---|---|
| SVG inline | `app/game-engine/cards/CardBack.tsx` | HTML pur — comparaison, UI statique |
| WebGL R3F | `app/game-engine/cards/CollectorCardCanvas.tsx` | Animation flip 3D, bloom, effets |

Les deux partagent exactement les mêmes couleurs et la même hiérarchie de couches.

---

## Dos de carte (`CardBack.tsx`)

### Structure SVG

```
<svg width height viewBox>
  <defs>
    bg        — linearGradient diagonal fond
    halo      — radialGradient violet centré
    vig       — radialGradient vignette noire bords
    spec      — radialGradient spéculaire haut-gauche
    shim      — linearGradient shimmer diagonal blanc
    brd       — linearGradient bordure blanche
    clip      — clipPath rect arrondi
    dia       — pattern grille losanges
  </defs>

  <rect fill=bg />                   — fond
  <rect fill=dia clip=clip />        — grille
  <rect fill=vig />                  — vignette
  <rect fill=halo clip=clip />       — halo
  <rect fill=spec clip=clip />       — spéculaire
  <rect fill=shim clip=clip />       — shimmer

  <svg viewBox="0 0 336 1044"        — symbole vectoriel
    preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient sym /></defs>
    <path d=SYMBOL_PATH fill=sym />
  </svg>

  <text>CONSENTEMENT</text>          — signature
  <rect stroke=brd />                — bordure
</svg>
```

### Centrage du symbole

Le symbole utilise un `<svg>` imbriqué avec `preserveAspectRatio="xMidYMid meet"` — c'est la seule approche fiable. Pas de `transform + clipPath` (les coordonnées du clip restent dans le space parent).

```jsx
<svg
  x={W * 0.1}   y={H * 0.04}
  width={W * 0.8}  height={H * 0.88}
  viewBox="0 0 336 1044"
  preserveAspectRatio="xMidYMid meet"
>
  <path d={SYMBOL_PATH} fill="url(#sym)" fillRule="evenodd" opacity="0.78" />
</svg>
```

---

## Renderer WebGL (`CollectorCardCanvas.tsx`)

### Textures Canvas 2D

- `makeBackTexture(size=512)` — texture 512×768 pour le dos
- `makeFaceTexture(card, size=512)` — texture 512×768 pour la face

### Centrage du symbole (Canvas 2D)

`Math.min` pour scale-to-fit avec préservation du ratio :

```js
const symS  = Math.min(size / 336, h / 1044) * 0.85;
const symOX = (size - 336 * symS) / 2;
const symOY = (h - 1044 * symS) / 2;

ctx.save();
ctx.translate(symOX, symOY);
ctx.scale(symS, symS);
ctx.fillStyle = gradient;     // linearGradient vertical
ctx.globalAlpha = 0.78;
ctx.fill(new Path2D(BACK_SYMBOL_PATH), 'evenodd');
ctx.restore();
```

> **Ne pas utiliser `ctx.shadowBlur` sur Path2D complexe** — freeze navigateur garanti sur un path de 7KB.

### Géométrie 3D

- `makeRoundedCardGeometry(w, h, r)` → `THREE.ShapeGeometry` avec UVs remappés [0..1]
- Dimensions world-space : 1.0 × 1.5 unités, radius 0.086
- Glow ring face rare/unique : 1.06 × 1.58, radius 0.092 — dans `<Select>` pour SelectiveBloom ciblé

### Animation flip

Trois `useRef<THREE.Group>` imbriqués, chacun contrôle un axe :

| Group | Transformation | Rôle |
|---|---|---|
| `outerRef` | `rotation.z` + `position.y` | Wobble lateral + arc vertical |
| `flipRef` | `rotation.y` | Rotation flip 0 → π |
| `styleRef` | `scale` | Squash-stretch atterrissage |

Ease : `easeOutSnap` (easeOutBack c1=1.0, ~3.7% overshoot), durée 0.62s.

---

## Symbole vectoriel

### Origine

Tracé vectoriel Midjourney — silhouette "deux personnages en étreinte formant un cœur".
Pipeline : image PNG → Inkscape auto-trace → filtre top 2 subpaths → SVGO → 7.2KB (1 subpath).

### Stockage

Le path est embarqué inline comme constante module dans les deux fichiers :

```ts
// prettier-ignore
const SYMBOL_PATH = 'm133 0 2 2q3 0 3 3 ...';   // 7 260 chars
```

`// prettier-ignore` obligatoire — Prettier freeze sur les strings > ~2KB.

### viewBox

`0 0 336 1044` — les dimensions naturelles du path tracé.

---

## Face de carte — structure texture

```
fond gradient (couleur rareté)
grain horizontal + highlights aléatoires
spéculaire radial top-left
vignette bords
icône Lucide (Path2D, drawIconNodes)
séparateur horizontal
texte wrappé (wrapText, shadow)
bordure card.border (épaisse → Bloom la fait briller)
badge rareté (common = rien, rare/unique = pill coloré)
```

---

## Rarités — comportement visuel

| Rareté | Bloom | Lights | Bordure |
|---|---|---|---|
| common | aucun | aucune | `#60a5fa` |
| rare | glow ring violet SelectiveBloom | `pointLight #7c3aed` | `#c084fc` |
| unique | glow ring or SelectiveBloom | 2x pointLights `#f59e0b` + `#ec4899` | `#fcd34d` |

---

## Carte verrouillée (`LockedCard.tsx`)

Silhouette CSS pure — affichée à la place de CollectorCardCanvas quand la carte n'est pas encore débloquée. Pas de WebGL.

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `app/game-engine/cards/CardBack.tsx` | Dos SVG inline |
| `app/game-engine/cards/CollectorCardCanvas.tsx` | Renderer R3F + textures |
| `app/game-engine/cards/LockedCard.tsx` | Carte verrouillée CSS |
| `app/card-collector-test/page.tsx` | Sandbox de test |
| `docs/graphisme/palette.md` | Palette complète |
