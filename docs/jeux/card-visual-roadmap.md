# Roadmap visuelle des cartes

Objectif: garder les cartes lisibles, identifiables et cohérentes entre onboarding, Hall, zoom et rendu WebGL.

## Priorite haute

- Unifier les rendus CSS autour de `CollectorCardFace`.
- Garder une hierarchie stable: theme, rarete, icone, texte.
- Eviter le texte directement sur gradient: conserver un panneau contraste.
- Permettre l'inspection rapide des lots de cartes via tap-to-zoom.

## Priorite moyenne

- Aligner progressivement le rendu WebGL sur les tokens visuels du composant CSS.
- Adapter la taille de texte selon la longueur, sans troncature quand l'espace le permet.
- Differencier les themes par motifs legers: bulles, cible, vagues, eclats.
- Renforcer les raretes: halo pour rare, foil/particules pour unique, common plus sobre.

## Priorite basse

- Revoir le dos des cartes: logo centre, bordure nette, texture moins bruitee.
- Enrichir le zoom Hall avec tags, module de debloquage et niveau.
- Ajouter des captures Playwright de non-regression: onboarding 24 cartes, Hall mobile, zoom carte.
