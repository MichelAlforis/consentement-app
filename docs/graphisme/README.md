# Graphisme — Direction artistique

> Consentement App · Màj 2026-04-25

---

## Documents

| Fichier | Contenu |
|---|---|
| [palette.md](palette.md) | Palette complète — couleurs fixes, gradients dos/face, effets PostProcessing |
| [card-system.md](card-system.md) | Architecture visuelle des cartes — SVG, WebGL, textures, animation flip |
| [assets-pipeline.md](assets-pipeline.md) | Pipeline assets — symbole vectoriel, icônes Lucide, exports stores |
| [midjourney-prompts.md](midjourney-prompts.md) | Prompts Midjourney par usage (icône, stores, marketing, références DA) |

---

## Règle clé

> **Aucune image bitmap dans le code runtime.** Canvas 2D / SVG inline uniquement.

---

## Assets générés en code

| Asset | Fichier | Technique |
|---|---|---|
| Dos de carte HTML | `CardBack.tsx` | SVG inline |
| Dos de carte R3F | `makeBackTexture()` | CanvasTexture 512×768 |
| Face de carte R3F | `makeFaceTexture()` | CanvasTexture 512×768 |
| Icônes Lucide | `drawIconNodes()` | Path2D Canvas 2D |
| Carte verrouillée | `LockedCard.tsx` | CSS |

---

## Assets dans `image/`

| Asset | Dossier | Source |
|---|---|---|
| Icône app | `image/stores/` | Midjourney → export PNG |
| Screenshots stores | `image/stores/` | Simulateur → Midjourney bg |
| Feature graphic Google Play | `image/google-play/` | Midjourney |
| Références cartes DA | `image/cards/templates/` | Midjourney (jamais importé dans le code) |
| Social / presse | `image/marketing/` | Midjourney |
