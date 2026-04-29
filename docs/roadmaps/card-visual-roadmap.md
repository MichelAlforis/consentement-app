# Roadmap visuelle des cartes

Objectif: garder les cartes lisibles, identifiables et cohérentes entre onboarding, Hall, zoom et rendu WebGL.

## État des renderers (2026-04-29)

| Renderer | État | Fichier |
|---|---|---|
| R3F / WebGL (`CollectorCardCanvas`) | ✅ complet | `game-engine/cards/CollectorCardCanvas.tsx` |
| CSS fallback (`CSSCardFallback`) | ✅ complet | `game-engine/cards/CollectorCardCanvas.tsx` |
| Tests de régression visuelle CSS | ✅ 6/6 passed | `e2e/visual-regression.spec.ts` |

## Intégration dans les écrans hôtes

| Écran | Intégration | Mode |
|---|---|---|
| `DiceGame` | ✅ Sprint 19 | `CardMesh` inline dans `DiceScene` |
| `AccordFlow` (GooseGame) | ✅ Sprint 21 | `CollectorCardCanvas` standalone |
| `HallOfCardsScreen` | ✅ Sprint 25 | `FlipRevealOverlay` |
| `CardGame` | ✅ Sprint 15 | `CardUnlockReveal` |
| Onboarding (`ModuleDeBaseScreen`) | ✅ Sprint 14 | flip reveal 24 cartes |

## Priorite haute

- ✅ Unifier les rendus CSS autour de `CSSCardFallback` — fallback actif si Canvas crash
- ✅ Garder une hiérarchie stable : theme → rareté → icône → texte (documenté dans `docs/graphisme/carte.md`)
- ✅ Éviter le texte directement sur gradient — panneau contraste opaque sur chaque face
- ✅ Inspection des cartes via tap : `FlipRevealOverlay` (Hall) + tap-to-reveal (DiceGame)

## Priorite moyenne

- ✅ Aligner le rendu WebGL sur les tokens visuels CSS — `makeFaceTexture` utilise les couleurs/gradients du design system
- ✅ Adapter la taille de texte selon la longueur — `Math.round(size * 0.08)` dynamique, fallback `line-clamp-2`
- 🔲 Différencier les thèmes par motifs légers : bulles, cible, vagues, éclats
- ✅ Renforcer les raretés — halo + gyro radial highlight (unique), shimmer sweep (rare), sobre (common) via `LightOverlay`

## Priorite basse

- 🔲 Revoir le dos des cartes : logo centré, bordure nette, texture moins bruitée
- 🔲 Enrichir le zoom Hall avec tags, module de débloquage et niveau
- ✅ Captures Playwright CSS renderer (common/rare/unique × dos/face) — `e2e/visual-regression.spec.ts`, 6/6 passed (2026-04-28)
- 🔲 Captures Playwright manquantes : onboarding 24 cartes, Hall mobile, zoom carte
