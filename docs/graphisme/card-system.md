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

### Structure SVG — ordre de rendu

```
<svg width height viewBox>
  <defs>
    bg        — linearGradient diagonal fond (#010007 → #0c0920 → #3b1f85)
    halo      — radialGradient violet centré (0.48 → 0.18 → 0)
    vig       — radialGradient vignette noire bords (0 → 0.72)
    spec      — radialGradient spéculaire haut-gauche (0.14 → 0)
    shim      — linearGradient shimmer diagonal blanc (0 → 0.09 → 0)
    brd       — linearGradient bordure blanche (0.55 → 0.18 → 0.55)
    grain     — filter feTurbulence fractalNoise opacity 0.032
    clip      — clipPath rect arrondi r=14
    dia       — pattern grille losanges 8.8% cellule
    sym       — linearGradient symbole (#ddd6fe → #a78bfa → #6d28d9)
  </defs>

  <rect fill=bg />                   — 1. fond
  <rect fill=dia clip=clip />        — 2. grille losanges
  <rect fill=vig />                  — 3. vignette
  <rect fill=halo clip=clip />       — 4. halo violet central
  <rect fill=spec clip=clip />       — 5. spéculaire top-left
  <rect fill=shim clip=clip />       — 6. shimmer diagonal
  <rect filter=grain clip=clip />    — 7. grain feTurbulence

  <svg viewBox="0 0 336 1044"        — 8. symbole vectoriel
    preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient sym /></defs>
    <path d=SYMBOL_PATH fill=sym opacity=0.78 />
  </svg>

  <text>CONSENTEMENT</text>          — 9. signature (opacity 0.28)
  <rect stroke=brd />                — 10. bordure blanche dégradée
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

### makeBackTexture — ordre de rendu

```
fond 3-stop (#010007 → #0c0920 → #3b1f85)
grille losanges (stroke 0.07, cellule 8.8%)
halo radial violet centré
vignette noire bords (0 → 0.72)
spéculaire radial haut-gauche (0.14 → 0)
shimmer diagonal blanc (0 → 0.09 → 0)
symbole Path2D — gradient vertical #ddd6fe → #6d28d9, globalAlpha 0.78
bordure — gradient blanc (0.55 → 0.18 → 0.55), lineWidth 2.5
```

> **Ne pas utiliser `ctx.shadowBlur` sur Path2D complexe** — freeze navigateur garanti sur un path de 7KB.

### makeFaceTexture — ordre de rendu

```
fond gradient (couleur rareté, 2 stops)
grain horizontal bands sin() + highlights aléatoires
spéculaire radial top-left (0.08 → 0)
[unique] compression luminance centre + highlight directionnel
vignette bords (0 → 0.42)
icône Lucide (drawIconNodes, iconR * 1.6, centré à h*0.30)
séparateur horizontal (opacity 0.15, padding 14%)
texte wrappé (font-weight 500, padding 18%, lineHeight 13.4%, shadow)
bordure card.border — 2.5px common / 5px rare+unique (Bloom)
badge rareté (common = rien, rare = pill violet, unique = pill brun/or + filet doré)
```

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

### Géométrie 3D

- `makeRoundedCardGeometry(w, h, r)` → `THREE.ShapeGeometry` avec UVs remappés [0..1]
- Dimensions world-space : 1.0 × 1.5 unités, radius 0.086
- Glow ring face rare/unique : 1.06 × 1.58, radius 0.092 — dans `<Select>` pour SelectiveBloom ciblé

### Animation flip

Trois `useRef<THREE.Group>` imbriqués, chacun contrôle un axe :

| Group | Transformation | Rôle |
|---|---|---|
| `outerRef` | `rotation.z` + `position.y` | Wobble latéral (0.04 rad) + arc vertical |
| `flipRef` | `rotation.y` | Rotation flip 0 → π |
| `styleRef` | `scale` | Squash-stretch atterrissage |

**Durées par rareté** (ease : `easeOutSnap`, ~3.7% overshoot) :

| Rareté | Durée flip |
|---|---|
| common | 0.52s |
| rare | 0.62s |
| unique | 0.70s |

### Idle animations

| Rareté | Comportement idle |
|---|---|
| common | statique |
| rare | flottement vertical `sin(t * 0.8) * 0.015` sur `position.y` |
| unique | scale pulse `1 ± 0.006 × sin(t * 1.2)` |

---

## Rarités — comportement visuel complet

| Rareté | Bloom | Lights | Idle light | Bordure | Overlay |
|---|---|---|---|---|---|
| common | aucun | aucune | — | `#60a5fa` 2.5px | aucun |
| rare | glow ring violet | `pointLight #7c3aed` **pulsé** (0.26±0.08) | ✅ | `#c084fc` 5px | — |
| unique | glow ring or | 2× pointLights `#f59e0b` + `#ec4899` fixes | — | `#fcd34d` 5px | compression luminance |

---

## Symbole vectoriel

### Origine

Tracé vectoriel Midjourney — silhouette "deux personnages en étreinte formant un cœur".
Pipeline : image PNG → Inkscape auto-trace → filtre top 2 subpaths → SVGO → 7.2KB (1 subpath).

### Stockage

Embarqué inline comme constante module dans les deux fichiers :

```ts
// prettier-ignore
const SYMBOL_PATH = 'm133 0 2 2q3 0 3 3 ...';   // 7 260 chars
```

`// prettier-ignore` obligatoire — Prettier freeze sur les strings > ~2KB.

### viewBox

`0 0 336 1044` — les dimensions naturelles du path tracé.

---

## Carte verrouillée (`LockedCard.tsx`)

Silhouette CSS pure — affichée à la place de `CollectorCardCanvas` quand la carte n'est pas encore débloquée. Pas de WebGL.

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `app/game-engine/cards/CardBack.tsx` | Dos SVG inline |
| `app/game-engine/cards/CollectorCardCanvas.tsx` | Renderer R3F + textures Canvas 2D |
| `app/game-engine/cards/LockedCard.tsx` | Carte verrouillée CSS |
| `app/card-collector-test/page.tsx` | Sandbox de test (WebGL / CSS / autoFlip) |
| `docs/graphisme/palette.md` | Palette couleurs complète |
| `docs/roadmaps/roadmap-visuel.md` | Plan d'amélioration 3 niveaux |
