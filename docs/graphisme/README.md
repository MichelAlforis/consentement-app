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

| Asset | Fichier | Statut |
|---|---|---|
| Icône App Store 1024×1024 | `image/stores/app-store/icon/icon-1024.png` | ✅ |
| Icône Google Play 512×512 | `image/stores/google-play/icon/icon-512.png` | ✅ |
| Logo master noir & blanc | `image/brand/logo/logo.png` | ✅ |
| Symbole vectoriel SVG | `image/brand/logo/*.svg` | ✅ |
| Screenshots App Store | `image/stores/app-store/screenshots/` | ⬜ |
| Feature graphic Google Play | `image/stores/google-play/feature-graphic/` | ⬜ |
| Références DA cartes | `image/cards/templates/` | ⬜ |
| Social / presse | `image/marketing/` | ⬜ |
