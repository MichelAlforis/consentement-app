# Phase 5D — Contenu pédagogique (planification)

Phases 5A/B/C ont créé le squelette de routing et le composant générique
`FichePratiqueScreen`. Phase 5D crée le CONTENU des 14 modules éducatifs.

---

## Point critique : ce n'est PAS une migration technique

Les types V3 (`VraiFauxItem`, `ConsentTopic`, etc.) sont **incompatibles**
avec `FichePratiqueItem` (V4). Le contenu V3 dans `app/data/` sert de
**source éditoriale uniquement** — il ne peut pas être copié-collé.

| Type V3 (app/data/) | Type V4 (fiches-pratiques.ts) |
|---|---|
| `VraiFauxItem { id, iconName, question, answer, explication }` | `FichePratiqueItem { id, iconName }` |
| Logique quiz vrai/faux | Carousel de fiches sections (def / consentement / loi / question) |
| Texte inline dans le type | Texte externalisé en i18n JSON |

---

## Plan d'exécution Phase 5D

Pour chacun des 14 modules (`module-de-base`, `pratiques-base`,
`pratiques-avancees`, `pratiques-explicit`, `lexique-consent`,
`scenarios-quotidiens`, `bdsm-consent`, `sexting`, `pression-manip`,
`rupture-harcele`, `content-non-consenti`, `zones-grises`,
`lgbtq-consent`, `alcool-consent`) :

1. **Lire** le contenu V3 dans `app/data/<module>.ts` comme matière
   éditoriale (concepts, exemples, angles pédagogiques).

2. **Concevoir** les fiches V4 : chaque fiche = 1 `FichePratiqueItem`
   avec `{ id, iconName }`. Nombre de fiches recommandé : 3–8 selon le
   module.

3. **Mettre à jour** `apps/mobile/src/data/fiches-pratiques.ts` avec la
   liste définitive de `FichePratiqueItem[]` (id + iconName uniquement,
   pas de texte).

4. **Créer** les clés i18n dans
   `apps/mobile/src/i18n/<lang>/<namespace>.json` :
   ```json
   {
     "fiches": {
       "0": { "titre": "...", "definition": "...", "consentement": "...", "loi": "...", "question": "..." },
       "1": { ... }
     }
   }
   ```

5. **Tester** l'affichage dans `FichePratiqueScreen` (chaque section
   affiche les 4 clés : définition, consentement, loi, question).

---

## Localisation finale du contenu

```
apps/mobile/src/data/fiches-pratiques.ts  → FichePratiqueItem[] (id + iconName)
apps/mobile/src/i18n/fr/<namespace>.json  → tout le texte (titres, corps)
apps/mobile/src/i18n/en/<namespace>.json  → traductions anglaises
```

Les données brutes (`id`, `iconName`) restent dans `fiches-pratiques.ts`.
Le texte pédagogique va **exclusivement** dans les fichiers i18n JSON —
jamais dans les types TypeScript.

---

## Contrainte app/ V3

`app/` reste sous **feature freeze total** (R10 des conventions).
Aucune modification de `app/data/` dans le cadre de Phase 5D.
La lecture des fichiers V3 est en lecture seule, à titre éditorial.

---

## Estimation effort

Phase 5D est un **sprint éditorial + i18n**, pas un sprint technique.

- Technique : faible (modifier `fiches-pratiques.ts` + créer les JSON)
- Éditorial : moyen-élevé (14 modules × 3–8 fiches × 4 sections = ~200–450 clés i18n à rédiger)

**Valider le scope avec l'orchestrateur avant de lancer.**
