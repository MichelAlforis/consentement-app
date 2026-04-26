# Roadmap V3 — Card Collector & Home Adaptative

> Créé : 26 avril 2026  
> Statut global : 🔲 En attente d'implémentation  
> Docs de référence détaillés : `docs/jeux/card-gain-modules.md` · `docs/home-v3.md` · `docs/jeux/card-collector.md`

---

## Vision

L'éducation débloque le jeu. Le jeu donne envie d'apprendre davantage.

```
Complète un module
      ↓
Gagne des cartes (flip reveal R3F)
      ↓
Joue avec un deck plus riche
      ↓
Vois les cartes verrouillées → envie du prochain module
```

**Trois decks, même mécanique :**
- **Deck M** — mineurs (13-14 ans) — textes consentement, respect, relations saines
- **Deck A** — adultes — connexion, communication, exploration émotionnelle
- **Deck B** — adultes explicite — juriste, app adulte uniquement

**Même logique quel que soit l'âge.** La Home, les cartes, le flip reveal, le Hall of Cards — identiques. Seul le contenu textuel change.

---

## Règle absolue

> **Seule l'éducation crée des cartes. Les jeux les utilisent.**

`unlockCards()` n'est appelé que depuis `computeModuleGain`. Jamais depuis un événement de jeu.  
GooseGame, CardGame — ils tirent dans `ownedCards`, n'y ajoutent rien.

---

## Progression en 3 niveaux

Calculé depuis `completedModules` uniquement — identique mineur et adulte.

| Niveau | Condition | Home |
|---|---|---|
| **1 — Découverte** | 0 module complété | CTA module de base (skippable) · Hall verrouillé · FOMO |
| **2 — Apprentissage** | 1+ module, aucun difficile | Progression · Prochain module · Jeu accessible |
| **3 — Maîtrise** | 1 module difficile complété | Collection · Duo · FOMO depth 3 / Deck B |

**Modules difficiles** (déclenchent niveau 3) : `loi-consentement`, `duo-flow`, `accompagnement-mineur`, `module-pratiques-adultes`.

```ts
// app/lib/progressLevel.ts
const DEEP_MODULES = ['loi-consentement', 'duo-flow', 'accompagnement-mineur', 'module-pratiques-adultes'];
function getProgressLevel(completedModules: string[]): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  if (completedModules.some(id => DEEP_MODULES.includes(id))) return 3;
  return 2;
}
```

---

## Modules et cartes gagnées

### Adultes → Deck A

| Module | Difficulté | Rareté | Déclencheur |
|---|---|---|---|
| Module de base *(skippable)* | intro | 24 × common | Bouton "J'ai compris" ou skip |
| Quiz consentement | easy | 1 × common | Score affiché + bouton "Voir ma carte" |
| Porno vs Réalité | easy | 1 × common | Bouton "J'ai lu" en bas de page |
| Loi & consentement | medium | 1 × rare | Bouton "J'ai lu" |
| Duo Flow complet | medium | 1 × rare | Étape 9 validée |
| Module pratiques adultes *(juriste)* | hard | 1 × unique | Complétion confirmée |
| Modules Deck B *(juriste)* | hard | 1-2 × unique | idem |

### Mineurs → Deck M

| Module | Difficulté | Rareté | Déclencheur |
|---|---|---|---|
| Module de base *(skippable)* | intro | 24 × common | Bouton "J'ai compris" ou skip |
| Quiz consentement | easy | 1 × common | Score affiché |
| Porno vs Réalité | easy | 1 × common | Bouton "J'ai lu" |
| Loi & consentement | medium | 1 × rare | Bouton "J'ai lu" |
| Accompagnement mineur | medium | 1 × rare | Dernière étape de l'arbre |

**Rareté :** easy → common · medium → rare · hard → unique  
**Random pick** dans le pool filtré par rareté et deck, hors cartes déjà possédées.

---

## Architecture technique

### Nouveaux fichiers

| Fichier | Rôle |
|---|---|
| `app/stores/moduleProgressStore.ts` | `completedModules[]` + `markModuleComplete(id)` — Zustand persist `consentement-modules` |
| `app/lib/progressLevel.ts` | `getProgressLevel(completedModules)` → 1\|2\|3 |
| `app/lib/computeModuleGain.ts` | `computeModuleGain(moduleId, ownedIds, collectorCards)` → `OwnedCard[]` |
| `app/components/screens/HomeScreen/DiscoveryHome.tsx` | Home niveau 1 |
| `app/components/screens/HomeScreen/LearningHome.tsx` | Home niveau 2 |
| `app/components/screens/HomeScreen/MasteryHome.tsx` | Home niveau 3 |
| `app/components/ui/ProgressBar.tsx` | Barre progression modules |
| `app/components/ui/NextModuleSuggestion.tsx` | Card "Prochain module" |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `app/data/cards-collector.ts` | + `deck: 'A'\|'B'\|'M'` · + `theme` (6 catégories) · 24 cartes Deck A · 24 cartes Deck M |
| `app/components/screens/HomeScreen.tsx` | `useProgressLevel` + dispatch vers 3 composants |
| `app/stores/index.ts` | Export + reset `moduleProgressStore` |
| `app/game-engine/cards/useCardEngine.ts` | `drawCard` pioche dans `ownedCards` filtré par `theme` |
| `app/components/screens/CardGame/index.tsx` | Guard niveau 1 : ownedCards vide → prompt module de base |

### Fichiers à nettoyer

| Fichier | Action |
|---|---|
| `app/components/screens/GooseGameScreen/hooks/useGooseGame.ts` | Supprimer `case 'complicite'` et `case 'arrivee'` (triggers cartes) |
| `app/components/screens/GooseGameScreen/hooks/useGooseGame.test.ts` | Supprimer tests 5.7a, 5.7b, 5.7c |
| `app/lib/computeGainedCards.ts` | Supprimer `pickOneRare` et `pickOneUnique` si non utilisés ailleurs |

### Type `CollectorCard` mis à jour

```ts
export interface CollectorCard {
  id: string;
  deck: 'A' | 'B' | 'M';
  theme: 'osez' | 'parlez' | 'et-si' | 'defi' | 'verite' | 'douceur';
  text: string;
  depth: 1 | 2 | 3;
  tags: string[];
  rarity: 'common' | 'rare' | 'unique';
  unlockedBy: string;  // id du module source
  visual: { gradient: string; iconName: string; border: string };
}
```

---

## Sprints

### Sprint 6 — Données cartes
**Livrable :** 48 cartes dans `cards-collector.ts` (24 Deck A + 24 Deck M)

| # | Tâche |
|---|---|
| 6.1 | Ajouter `deck: 'A'\|'B'\|'M'` et `theme` au type `CollectorCard` |
| 6.2 | Rédiger 24 textes Deck A common depth 1 (6 thèmes × 4) |
| 6.3 | Rédiger 24 textes Deck M common depth 1 (même structure, langue 13-14 ans) |
| 6.4 | Ajouter les 48 cartes avec visuels dans `cards-collector.ts` |

### Sprint 7 — `computeModuleGain`
**Livrable :** pure function testée + config modules

| # | Tâche |
|---|---|
| 7.1 | Créer `app/lib/computeModuleGain.ts` avec table de config |
| 7.2 | Logique : rareté cible par moduleId, random pick, déduplication |
| 7.3 | Tests : easy → common, medium → rare, hard → unique, pool épuisé → [] |

### Sprint 8 — Module de base
**Livrable :** écran onboarding + 24 cartes au premier lancement

| # | Tâche |
|---|---|
| 8.1 | Créer `ModuleDeBaseScreen` — présentation app, philosophie, skip possible |
| 8.2 | Routing : premier lancement adulte/mineur → `module-de-base` (skippable) |
| 8.3 | Complétion → `computeModuleGain('module-de-base', ...)` → flip reveal 24 cartes |

### Sprint 9 — Wiring modules existants
**Livrable :** 4 modules adultes + 1 mineur branchés sur `markModuleComplete`

| # | Écran | Déclencheur |
|---|---|---|
| 9.1 | `QuizConsentementScreen` | Score affiché → bouton "Voir ma carte" |
| 9.2 | `PornoVsRealiteScreen` | Bouton "J'ai lu" en bas |
| 9.3 | `LoiConsentementScreen` | Bouton "J'ai lu" en bas |
| 9.4 | `DuoSpaceScreen` | Étape 9 validée |
| 9.5 | `AccompagnementMineurScreen` | Dernière étape de l'arbre |

### Sprint 10 — CardGame pool switch + nettoyage GooseGame
**Livrable :** CardGame pioche dans ownedCards · triggers jeu supprimés

| # | Tâche |
|---|---|
| 10.1 | `drawCard` filtre sur `ownedCards` par `theme` (remplace `diePractices`) |
| 10.2 | Guard : `ownedCards` vide → prompt "Module de base pour démarrer" |
| 10.3 | Supprimer `case 'complicite'` + `case 'arrivee'` dans `useGooseGame.ts` |
| 10.4 | Supprimer tests 5.7a–5.7c dans `useGooseGame.test.ts` |
| 10.5 | Nettoyer `pickOneRare` / `pickOneUnique` dans `computeGainedCards.ts` |

### Sprint 11 — `moduleProgressStore`
**Livrable :** store Zustand persist + pure functions

| # | Tâche |
|---|---|
| 11.1 | `moduleProgressStore` : `completedModules[]` + `markModuleComplete(id)` (idempotent) |
| 11.2 | Export + `reset()` dans `resetAllData()` |
| 11.3 | `getProgressLevel(completedModules)` — pure function + tests (niveaux 1/2/3) |

### Sprint 12 — Wiring `markModuleComplete` dans tous les modules
**Livrable :** chaque module appelle `markModuleComplete` + `computeModuleGain` + flip reveal

Pattern :
```ts
const handleFinish = () => {
  if (completedModules.includes(moduleId)) return;
  markModuleComplete(moduleId);
  const newCards = computeModuleGain(moduleId, new Set(ownedCards.map(c => c.id)), collectorCards);
  if (newCards.length > 0) { unlockCards(newCards); /* → flip reveal */ }
};
```

| # | Écran | Module ID |
|---|---|---|
| 12.1 | `QuizConsentementScreen` | `quiz-consentement` |
| 12.2 | `PornoVsRealiteScreen` | `porno-vs-realite` |
| 12.3 | `LoiConsentementScreen` | `loi-consentement` |
| 12.4 | `DuoSpaceScreen` | `duo-flow` |
| 12.5 | `AccompagnementMineurScreen` | `accompagnement-mineur` |

### Sprint 13 — Composants Home V3
**Livrable :** 3 composants Home + `HomeScreen` refactoré

| # | Tâche |
|---|---|
| 13.1 | `DiscoveryHome({ isAdult, onNavigate })` — niveau 1 |
| 13.2 | `LearningHome({ isAdult, ownedCards, completedModules, onNavigate })` — niveau 2 |
| 13.3 | `MasteryHome({ isAdult, ownedCards, completedModules, onNavigate })` — niveau 3 |
| 13.4 | `ProgressBar` + `NextModuleSuggestion` — composants UI partagés |
| 13.5 | `HomeScreen.tsx` — `useProgressLevel` + dispatch vers les 3 composants |
| 13.6 | i18n : nouvelles clés home pour les 3 états (FR/EN/ES) |

### Sprint 14 — `ModuleDeBaseScreen`
**Livrable :** écran d'intro skippable + 24 cartes au premier lancement

| # | Tâche |
|---|---|
| 14.1 | Rédiger le contenu du module de base (équipe — pas le juriste) |
| 14.2 | Créer `ModuleDeBaseScreen` — scroll guidé, bouton "J'ai compris" + lien "Passer" |
| 14.3 | Routing : premier lancement → `module-de-base` avant `home` |
| 14.4 | Complétion → 24 cartes → flip reveal séquentiel |

### Sprint 15 — Guard CardGame niveau 1
**Livrable :** CardGame ne crashe pas si ownedCards vide

| # | Tâche |
|---|---|
| 15.1 | Si `ownedCards.length === 0` → afficher `EmptyDeckPrompt` (CTA vers module de base) |
| 15.2 | Test : niveau 1 + accès CardGame → guard affiché, pas de crash |

---

## Ordre d'exécution

```
Sprint 6 (données)
    │
    ├─ Sprint 7 (computeModuleGain)
    │       │
    │       └─ Sprint 9 (wiring modules)
    │                   │
    │                   └─ Sprint 12 (markModuleComplete complet)
    │
    ├─ Sprint 8 (module de base)
    │
    ├─ Sprint 10 (pool switch + nettoyage)
    │
    └─ Sprint 11 (moduleProgressStore)
                │
                └─ Sprint 13 (Home V3)
                            │
                            └─ Sprint 14 (ModuleDeBaseScreen)
                                        │
                                        └─ Sprint 15 (guard CardGame)
```

Sprints 6–10 peuvent avancer en parallèle.  
Sprints 11–15 dépendent de 6–10.

---

## Invariants

| Invariant | Pourquoi |
|---|---|
| `unlockCards` uniquement depuis `computeModuleGain` | Règle fondamentale — seule l'éducation crée des cartes |
| `markModuleComplete` est idempotent | Sécurité double-appel |
| `getProgressLevel` est une pure function | Testable, sans React |
| Le déclencheur de module est toujours intentionnel | Bouton explicite — jamais sur scroll seul |
| Deck M rédigé par l'équipe (pas le juriste) | Non bloquant pour les Sprints 6–15 |
| Deck B rédigé par le juriste | Bloquant pour le contenu Deck B uniquement |
| `ownedCards` append-only | Jamais de suppression de cartes |
