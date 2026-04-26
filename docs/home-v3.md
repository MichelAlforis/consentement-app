# Home V3 — Logique de progression en 3 niveaux

> Créé : 25 avril 2026  
> Statut : 🔲 À implémenter — Sprints 11+  
> Scope : refonte structurelle des **deux Homes** (adulte ET mineur) — **même logique, quel que soit l'âge**

---

## Concept

Les deux Homes actuelles (adulte et mineur) sont **statiques** — elles ne changent pas selon ce que l'utilisateur a appris ou débloqué.

La Home V3 est **dynamique** — elle reflète où l'utilisateur en est dans son parcours éducatif.  
**La même logique de 3 niveaux s'applique à tous les profils.** L'âge change le contenu, pas la structure.

> La Home devient un tableau de bord vivant qui grandit avec l'utilisateur — qu'il ait 14 ou 35 ans.

### Même architecture, même récompense, même mécanique

La récompense est **identique** : cartes collector + flip reveal R3F + Hall of Cards.  
Seul le contenu des cartes change — les textes sont adaptés à l'âge.

| | Mineur | Adulte |
|---|---|---|
| Niveau calculé depuis | `completedModules` | `completedModules` |
| Modules référencés | quiz, porno vs réalité, loi, accompagnement | module de base, quiz, porno, loi, duo flow, adultes |
| Récompense | Cartes **Deck M** (textes adaptés 13-14 ans) | Cartes **Deck A** + **Deck B** (adultes) |
| Flip reveal | ✅ R3F — identique | ✅ R3F — identique |
| Hall of Cards | ✅ Deck M visible | ✅ Deck A + B visibles |
| Composants Home | `DiscoveryHome`, `LearningHome`, `MasteryHome` | **idem** — mêmes composants, props `isAdult` |

---

## Les 3 niveaux de progression

### Niveau 1 — Découverte

**Condition :** 0 module complété.

**État de l'utilisateur :** Vient d'installer l'app. Ne sait pas encore ce qu'il peut faire.  
**Enjeu produit :** Le convertir en apprenant. La collection est vide — FOMO maximal.

**Module de base — onboarding skippable :**
- Écran d'intro court (présentation de l'app, philosophie, 2-3 concepts clés)
- **Peut être skippé** — l'utilisateur n'est jamais bloqué
- Si complété → 24 cartes starter + passage niveau 2
- Si skippé → Hall of Cards vide, CardGame affiche un prompt (pas un lock dur)
- Pas de contenu juriste requis — l'équipe peut le rédiger

**Home :**
- Message d'accueil et promesse de valeur
- CTA prioritaire : "Commence par ici" → Module de base (skippable)
- Hall of Cards visible mais tout verrouillé → FOMO maximal
- CardGame accessible mais vide ("Fais ton premier module pour avoir des cartes à jouer")

```
┌──────────────────────────────────┐
│ Bonjour !                        │
│ L'éducation débloque le jeu.     │
│                                  │
│ ┌─────────────────────────────┐  │
│ │  ▶  Commence par ici        │  │  ← CTA prioritaire — module de base
│ │     Module de base · 5 min  │  │
│ └─────────────────────────────┘  │
│                                  │
│  [Ta collection]  ░░░░░░░░░░░░   │  ← 0/100 · toutes verrouillées
│  [Jouer]          🔒 Bientôt     │
└──────────────────────────────────┘
```

---

### Niveau 2 — Apprentissage

**Condition :** Module de base complété. `ownedCards.length` entre 1 et 49. 1–3 modules faits.

**État de l'utilisateur :** A ses premières cartes, peut jouer. Découvre que l'apprentissage enrichit le jeu.  
**Enjeu produit :** Créer l'habitude. Montrer la progression. Donner envie du module suivant.

**Home :**
- Progression visible : X cartes / 100+
- "Prochain module" suggéré dynamiquement (le plus proche non complété)
- Accès au jeu de cartes (CardGame, avec `ownedCards` comme pool)
- Accès rapide au Hall of Cards (collection en croissance)
- Dé du consentement visible
- Duo flow accessible en secondaire

```
┌──────────────────────────────────┐
│ Bonjour {name}                   │
│ Ta collection grandit            │
│                                  │
│  24 cartes · ██░░░░ 24%          │  ← barre de progression collection
│                                  │
│ ┌──────────────────────────────┐ │
│ │  📚  Prochain module         │ │  ← suggestion dynamique
│ │      Quiz consentement · 8Q  │ │
│ └──────────────────────────────┘ │
│                                  │
│ [Jouer]  [Ma collection]  [Duo]  │
└──────────────────────────────────┘
```

---

### Niveau 3 — Maîtrise

**Condition :** 4+ modules complétés. `ownedCards.length` ≥ 50. (Premium ou App adulte pour le Deck B.)

**État de l'utilisateur :** Engagé. Collection riche. Cherche de la profondeur.  
**Enjeu produit :** Retenir. Montrer ce qui reste à découvrir. Convertir vers premium / app adulte.

**Home :**
- Collection en avant-plan avec badge de rareté
- Duo flow mis en avant (l'intimité connectée est la promesse premium)
- Modules restants affichés (FOMO sur le contenu depth 3)
- Deck B visible avec silhouettes → CTA app adulte si non encore abonné
- Stats discrètes (modules faits, sessions jouées)

```
┌──────────────────────────────────┐
│ Bonjour {name}                   │
│                                  │
│  ████████░░ 53 cartes            │
│  ★ 3 rares · ✦ 1 unique          │
│                                  │
│ [Notre Espace]   ← prioritaire   │
│ [Jouer]   [Collection]           │
│                                  │
│ Modules restants                 │
│  · Pratiques adultes  [rare]     │  ← FOMO depth 3
│  · Deck B  [unique] 🔒 App adulte│
└──────────────────────────────────┘
```

---

## Calcul du niveau — universel

Level 3 se mérite : il faut avoir complété au moins un module **difficile** (medium ou hard).  
Le simple volume de modules n'est pas suffisant — quelqu'un qui fait 4 modules easy en une soirée reste niveau 2.

```ts
// app/lib/progressLevel.ts — pure function
// Même logique quel que soit l'âge — pas de isAdult
const DEEP_MODULES = ['loi-consentement', 'duo-flow', 'accompagnement-mineur', 'module-pratiques-adultes'];

function getProgressLevel(completedModules: string[]): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  const hasDeepModule = completedModules.some(id => DEEP_MODULES.includes(id));
  if (hasDeepModule) return 3;
  return 2;
}
```

- Niveau 1 → 2 : **immédiat** — premier module complété (même easy). Premier gain = première envie d'en avoir une autre.
- Niveau 2 → 3 : **module difficile requis** (loi, duo, accompagnement, pratiques adultes). Ne peut pas être atteint en une soirée de modules faciles.

Lecture seule — pas d'effet de bord. Identique pour tout le monde.

---

## Nouveau store — `moduleProgressStore`

Le store tracke les modules éducatifs complétés.  
Il est la source de vérité pour `getProgressLevel` et les suggestions "prochain module".

```ts
// app/stores/moduleProgressStore.ts
interface ModuleProgressStore {
  completedModules: string[];           // ids des modules complétés
  markModuleComplete: (id: string) => void;  // append-only, déduplique
  reset: () => void;
}

// Clé localStorage : 'consentement-modules'
// Export depuis : stores/index.ts
// Inclus dans : resetAllData()
```

**IDs de modules définis :**

| ID | Module | Rareté carte gagnée |
|---|---|---|
| `module-de-base` | Module de base | 24 common (starter) |
| `quiz-consentement` | Quiz consentement | common |
| `porno-vs-realite` | Porno vs Réalité | common |
| `loi-consentement` | Loi & consentement | rare |
| `duo-flow` | Duo Flow complet | rare |
| `module-pratiques-adultes` | Pratiques adultes *(juriste)* | unique |

---

## `computeModuleGain` — pure function

```ts
// app/lib/computeModuleGain.ts
function computeModuleGain(
  moduleId: string,
  ownedIds: Set<string>,
  collectorCards: CollectorCard[]
): OwnedCard[]
```

Appellée au moment où `markModuleComplete(id)` est déclenché.  
Retourne les `OwnedCard[]` à passer à `unlockCards()`.

**Table de configuration interne :**

```ts
const MODULE_CONFIG: Record<string, { rarity: Rarity; count: number }> = {
  'module-de-base':          { rarity: 'common',  count: 24 },
  'quiz-consentement':       { rarity: 'common',  count: 1 },
  'porno-vs-realite':        { rarity: 'common',  count: 1 },
  'loi-consentement':        { rarity: 'rare',    count: 1 },
  'duo-flow':                { rarity: 'rare',    count: 1 },
  'module-pratiques-adultes':{ rarity: 'unique',  count: 1 },
};
```

---

## Architecture Home V3

### Composants — 3 composants partagés, contenu adapté

```
HomeScreen.tsx
  ├── useProgressLevel(completedModules) → 1 | 2 | 3   ← identique mineur et adulte
  │
  ├── [Niveau 1]  DiscoveryHome({ isAdult })
  │     ├── Mineur : "Commence ici" → quiz ou porno vs réalité en CTA
  │     └── Adulte : "Commence ici" → module de base · Hall of Cards verrouillé (FOMO)
  │
  ├── [Niveau 2]  LearningHome({ isAdult, ownedCards? })
  │     ├── Barre de progression modules (commune)
  │     ├── NextModuleSuggestion (commune)
  │     ├── Mineur : [Quiz]  [Porno vs Réalité]  [Aide]  [Jeux]
  │     └── Adulte : [Jouer] [Ma collection]  [Duo]  [Ressources]
  │
  └── [Niveau 3]  MasteryHome({ isAdult, ownedCards? })
        ├── Mineur : tous modules ✓ · ressources avancées · CTA aide & urgences
        └── Adulte : collection en avant-plan · Duo prioritaire · FOMO Deck B
```

**Principe :** La structure (niveaux, ProgressBar, NextModuleSuggestion) est partagée.  
Le contenu dans chaque niveau (modules suggérés, CTAs, cartes ou non) est conditionné par `isAdult`.

### Fichiers nouveaux / modifiés

| Fichier | Type | Notes |
|---|---|---|
| `app/stores/moduleProgressStore.ts` | Nouveau | Zustand + persist — identique mineur et adulte |
| `app/lib/progressLevel.ts` | Nouveau | Pure function `(completedModules) → 1\|2\|3` — pas d'isAdult |
| `app/lib/computeModuleGain.ts` | Nouveau | Pure function gain cartes — Deck A (adultes) et Deck M (mineurs) |
| `app/components/screens/HomeScreen.tsx` | Modifié | Ajoute `useProgressLevel` · dispatch vers 3 composants |
| `app/components/screens/HomeScreen/DiscoveryHome.tsx` | Nouveau | Niveau 1 — props `isAdult` |
| `app/components/screens/HomeScreen/LearningHome.tsx` | Nouveau | Niveau 2 — props `isAdult, ownedCards?` |
| `app/components/screens/HomeScreen/MasteryHome.tsx` | Nouveau | Niveau 3 — props `isAdult, ownedCards?` |
| `app/components/ui/ProgressBar.tsx` | Nouveau | Barre progression modulaire — s'adapte au total de chaque profil |
| `app/components/ui/NextModuleSuggestion.tsx` | Nouveau | Card "Prochain module" — commun mineur et adulte |
| `app/stores/index.ts` | Modifié | Export + reset moduleProgressStore |

---

## Wiring des modules existants

Chaque écran éducatif appelle `markModuleComplete(id)` à sa fin, ce qui déclenche :

```ts
// Pattern dans chaque module
const { completedModules, markModuleComplete } = useModuleProgressStore();
const { ownedCards, unlockCards } = useUnlockStore();

const handleFinish = () => {
  if (completedModules.includes(moduleId)) return; // idempotent
  markModuleComplete(moduleId);
  const ownedIds = new Set(ownedCards.map(c => c.id));
  const newCards = computeModuleGain(moduleId, ownedIds, collectorCards);
  if (newCards.length > 0) {
    unlockCards(newCards);
    // → déclencher flip reveal (CardUnlockReveal)
  }
};
```

**Modules à brancher — adultes :**

| Écran | Déclencheur | ID module | Public |
|---|---|---|---|
| `QuizConsentementScreen` | `finished === true` + score affiché | `quiz-consentement` | mineur + adulte |
| `PornoVsRealiteScreen` | Fin de lecture (scroll bottom ou bouton) | `porno-vs-realite` | mineur + adulte |
| `LoiConsentementScreen` | Fin de lecture | `loi-consentement` | mineur + adulte |
| `AccompagnementMineurScreen` | Arbre de décision complété | `accompagnement-mineur` | mineur seulement |
| `DuoSpaceScreen` | Parcours duo complété (9 étapes) | `duo-flow` | adulte seulement |

Le même hook `markModuleComplete` fonctionne pour les deux publics — le store est unique.  
Seul `computeModuleGain` (gain de cartes) est réservé aux adultes.

---

## Freemium et niveaux

| Niveau | Gratuit | Premium | App adulte |
|---|---|---|---|
| Niveau 1 | Accès module de base | idem | idem |
| Niveau 2 | Modules easy (quiz, porno, loi) · CardGame depth 1 | + depth 2 | idem |
| Niveau 3 | Modules easy complétés, collection depth 1 | + depth 2–3 | + Deck B |

La barrière premium est sur la profondeur du contenu, pas sur l'accès au système de progression.

---

## Sprints

### Sprint 11 — Store + pure functions

| # | Tâche | Fichier |
|---|---|---|
| 11.1 | `moduleProgressStore` Zustand + persist | `stores/moduleProgressStore.ts` |
| 11.2 | Export + `resetAllData` | `stores/index.ts` |
| 11.3 | `computeModuleGain` pure function | `lib/computeModuleGain.ts` |
| 11.4 | Tests `computeModuleGain` (easy/medium/hard, pool épuisé) | `lib/computeModuleGain.test.ts` |
| 11.5 | `getProgressLevel` pure function | `lib/progressLevel.ts` |
| 11.6 | Tests `getProgressLevel` (0 cartes → 1, 24 → 2, 50+ → 3) | `lib/progressLevel.test.ts` |

### Sprint 12 — Wiring modules existants

| # | Tâche | Fichier |
|---|---|---|
| 12.1 | Quiz → `markModuleComplete` + `computeModuleGain` + flip reveal | `QuizConsentementScreen.tsx` |
| 12.2 | Porno vs Réalité → trigger gain | `PornoVsRealiteScreen.tsx` |
| 12.3 | Loi & consentement → trigger gain | `LoiConsentementScreen.tsx` |
| 12.4 | Duo flow → trigger gain | `DuoSpaceScreen.tsx` |

### Sprint 13 — Home V3 composants

| # | Tâche | Fichier |
|---|---|---|
| 13.1 | `DiscoveryHome` (niveau 1) | `HomeScreen/DiscoveryHome.tsx` |
| 13.2 | `LearningHome` (niveau 2) avec `ProgressBar` + `NextModuleSuggestion` | `HomeScreen/LearningHome.tsx` |
| 13.3 | `MasteryHome` (niveau 3) avec collection summary + DeckB teaser | `HomeScreen/MasteryHome.tsx` |
| 13.4 | `useProgressLevel` hook (wrapper de `getProgressLevel`) | `HomeScreen/index.tsx` |
| 13.5 | Refactoring `HomeScreen.tsx` → dispatch vers les 3 sous-composants | `HomeScreen.tsx` |
| 13.6 | i18n : nouvelles clés pour les 3 états de la home | `i18n/locales/*/home.ts` |

### Sprint 14 — Module de base

| # | Tâche | Fichier |
|---|---|---|
| 14.1 | `ModuleDeBaseScreen` — contenu court, guidé (5 min) | `screens/ModuleDeBaseScreen.tsx` |
| 14.2 | Complétion → 24 cartes starter → flip reveal séquentiel | idem |
| 14.3 | Routing : premier lancement adulte → `module-de-base` avant home | `page.tsx` |
| 14.4 | Contenu module de base (rédiger avec le juriste) | `data/moduleDeBase.ts` |

### Sprint 15 — CardGame pool switch (Sprint 10 consolidé)

| # | Tâche | Fichier |
|---|---|---|
| 15.1 | `drawCard` pioche dans `ownedCards` | `game-engine/cards/useCardEngine.ts` |
| 15.2 | Guard niveau 1 : si `ownedCards` vide → redirect `module-de-base` | `CardGame/index.tsx` |
| 15.3 | Test : niveau 1 + CardGame → guard déclenché, pas de crash | test |

---

## Invariants

| Invariant | Raison |
|---|---|
| `markModuleComplete` est idempotent | Sécurité double-appel — filtre si déjà présent |
| `computeModuleGain` ne modifie pas le store | Pure function — l'appelant gère `unlockCards` |
| `getProgressLevel` est une pure function | Testable, sans React |
| Le niveau ne peut que monter | Pas de `unmarkModuleComplete` — progression permanente |
| Le Deck B reste `🔲 À rédiger` | Contenu juriste — non bloquant pour les sprints 11–15 |

---

## Relation avec les autres docs

```
card-gain-modules.md    → Sprints 6–10 (data, computeModuleGain, wiring)
home-v3.md (ici)        → Sprints 11–15 (store, Home adaptative, module de base)
card-collector.md       → Vision produit + Deck A/B
meta-jeu-roadmap.md     → Méta-jeu (GooseGame orchestre, drawCard sur ownedCards)
roadmap.md              → Roadmap globale (à jour avec Bloc J)
```
