# Card Collector — Système d'acquisition de cartes

> Créé : 24 avril 2026, màj 2026-04-25
> Légende : ✅ Fait · 🔄 En cours · 🔲 À faire

---

## Plan d'évolution — 3 niveaux

```
Level 1 ✅          Level 2 ✅              Level 3 ✅ (visuel)
──────────────      ──────────────────      ────────────────────────
Composant R3F       Acquisition + End       Méta-jeu complet
──────────────      ──────────────────      ────────────────────────
CollectorCard       unlockStore             Hall of Cards
Canvas.tsx          localStorage            (grille CSS + zoom R3F)

GainedCard          computeGained           Gain depuis modules
type + interface    Cards() pure fn         éducatifs (quiz, duo…)

GameEndCinematic    Remplacer CardFlip      drawCard filtre sur
fond R3F (orbs      CSS par Canvas R3F      ownedCards en jeu
+ sparkles)         dans step='end'         de l'oie

CardUnlockReveal    Séquence flip           Deck B explicite
placeholder vide    animée séquentielle     (juriste, app adulte)
```

### Ce que débloque chaque niveau

| | Jouable | Persisté | Beau |
|---|---|---|---|
| **Level 1** | Non | Non | ✅ Composant prêt |
| **Level 2** | ✅ Gain via modules éducatifs uniquement — GooseGame utilise les cartes, ne les crée pas | ✅ localStorage (fait) | ✅ Flip R3F en jeu (fait) |
| **Level 3** | ✅ + CardGame pioche dans ownedCards | ✅ + historique | ✅ Hall complet |

### Dépendances entre niveaux

```
Level 1 (fait)
    └── Level 2 : unlockStore + computeGainedCards
                      └── Level 3 : Hall of Cards + modules éducatifs
                                        └── Deck B : juriste obligatoire
```

Level 2 est autosuffisant — il ne dépend pas du juriste.
Level 3 nécessite le contenu depth 2–3 rédigé.

---

## Concept

Les cartes ne sont pas données — elles se **méritent via des parcours d'apprentissage**.
Plus le couple s'instruit, plus son deck s'enrichit, plus le jeu devient riche.

> **Apprendre → Gagner → Jouer → Revenir**

C'est le moteur de fidélisation central de l'app.

> ⚠️ **Le contenu sexuellement explicite est le driver #1 de rétention et d'abonnement.**
> Les cartes depth 3 explicites sont le "holy grail" du collector — c'est pour elles que les couples reviennent et s'abonnent. Tout le parcours éducatif est conçu pour mener jusqu'à ce contenu de manière progressive et légitime.

---

## Principe

L'app a deux mondes déjà construits mais non connectés :

- **Éducatif** — quiz, modules, loi, porno vs réalité
- **Jeux** — dé, cartes à tirer, jeu de l'oie

Le Card Collector les connecte. Chaque module éducatif complété débloque des cartes jouables dans les jeux.

---

## Loop de rétention

```
Complète un module éducatif
        ↓
Gagne des cartes spécifiques (permanentes)
        ↓
Joue avec un deck plus riche
        ↓
Envie de compléter le prochain module
```

Les cartes gagnées sont **permanentes** — jamais perdues, même sans abonnement.

---

## Trois decks — même mécanique, contenu adapté

Tous les decks partagent la même structure (depth, rareté, tags thème, visuels, flip reveal).  
Seul le contenu textuel des cartes change selon le public.

### Deck M — Mineurs
Consentement, respect, relations saines, limites, corps. Langue adaptée aux 13-14 ans.  
**Même flip reveal, même Hall of Cards, même FOMO que les adultes.**

### Deck A — Adultes non-explicite
Connexion, communication, exploration émotionnelle et sensorielle.  
Accessible à tous les adultes. Jamais de contenu sexuel direct.

### Deck B — Adultes explicite
Pratiques sexuelles, désirs, exploration physique. Contenu rédigé par le juriste.  
**App adulte uniquement.** Driver #1 de l'abonnement.

> Les trois decks ont la même structure (depth 1→3, rareté, theme, tags).  
> La mécanique de récompense est identique — l'éducation crée les cartes, les jeux les utilisent.

---

## Anatomie d'une carte

```ts
// data/cards-collector.ts — source de données
interface CollectorCard {
  id: string;
  deck: 'A' | 'B' | 'M';   // M = Mineur, A = Adulte, B = Adulte explicite
  theme: 'osez' | 'parlez' | 'et-si' | 'defi' | 'verite' | 'douceur'; // catégorie CardGame
  text: string;
  depth: 1 | 2 | 3;
  tags: string[];            // tags sémantiques (confiance, duo, exploration…)
  rarity: 'common' | 'rare' | 'unique';
  unlockedBy: string;        // id du module source
  visual: { gradient, iconName, border };
}

// Type runtime — affiché dans CardUnlockReveal et Hall of Cards
interface GainedCard {
  id: string;
  text: string;
  rarity: 'common' | 'rare' | 'unique';
  gradient: string;
  iconName: string;
  border: string;
}

// Type persisté — localStorage 'consentement-unlocks'
interface OwnedCard {
  id: string;
  rarity: 'common' | 'rare' | 'unique';
  gainedOn: string;          // date ISO
  unlockedBy: string;        // id du module éducatif
}
```

Chaque deck cible **24 cartes starter** depth 1 + expansion jusqu'à 100+ depth 1–3.  
Défini dans `data/cards-collector.ts` avec le champ `deck: 'A' | 'B' | 'M'` et `theme` (les 6 catégories de jeu).  
Le pool Deck B (juriste) sera ajouté en Level 3. Le Deck M est rédigé par l'équipe.

---

## Mapping modules → cartes

### Deck A — Non-explicite

| Module | Cartes | Depth | Tags | Accès |
|---|---|---|---|---|
| Quiz consentement | 3 | 1 | `confiance` | gratuit |
| Porno vs Réalité | 4 | 1–2 | `communication` | gratuit |
| Ce que dit la loi | 3 | 1 | `cadre` | gratuit |
| Duo flow complet | 5 | 2 | `duo` | gratuit |
| ConsentCheckScreen adulte | 4 | 2 | `confiance`, `cadre` | gratuit |
| Module pratiques adultes *(juriste)* | 6 | 2–3 | `exploration` | **premium** |
| Module BDSM cadre légal *(juriste)* | 5 | 3 | `exploration`, `cadre` | **premium** |

### Deck B — Explicite *(app adulte)*

> Rédigé intégralement par le juriste. Driver #1 de l'abonnement.
> Les couples voient les silhouettes en collection — la frustration contrôlée convertit.

| Module adulte | Cartes | Depth | Tags |
|---|---|---|---|
| Découverte des désirs *(juriste)* | 6 | 1–2 | `désir` |
| Pratiques sexuelles — cadre consentement *(juriste)* | 8 | 2–3 | `pratique` |
| BDSM — double consentement *(juriste)* | 6 | 3 | `pratique`, `exploration` |
| Fantasmes partagés *(juriste)* | 5 | 2–3 | `désir`, `duo` |
| Cartes rares — scénarios *(juriste)* | 4 `rare` | 3 | `pratique` |
| Cartes uniques — événements spéciaux | 3 `unique` | 3 | `pratique` |

---

## Rareté

| Rareté | Fréquence | Condition |
|---|---|---|
| `common` | majorité des cartes | compléter un module |
| `rare` | 1–2 par module | score parfait au quiz / duo flow complet |
| `unique` | 1 par événement | première partie Slow, premier accord réussi… |

---

## Hall of Cards — Écran Collection

Écran dédié séparé du flow de jeu. Accessible depuis le hub jeux et le profil.

**Base existante à réutiliser :** le step `pick` de `CardGameScreen` affiche déjà une grille de 6 decks avec gradient + icône + compteur. Le Hall of Cards reprend ce pattern et l'étend à l'échelle de toute la collection.

### Structure

```
[Hall of Cards]
  ├── Deck A — Non-explicite
  │     ├── [carte acquise]  → visible, jouable
  │     ├── [carte acquise]  → visible, jouable
  │     └── [carte verrouillée] → silhouette + condition lisible
  └── Deck B — Explicite  *(app adulte)*
        ├── [silhouette] "Complète Découverte des désirs"
        ├── [silhouette] "Passe à l'app adulte"
        └── ...
```

- Cartes acquises : visibles, jouables
- Cartes verrouillées : silhouette + condition lisible (jamais un paywall opaque)

> *"Complète Porno vs Réalité pour débloquer ces 4 cartes"*

### Navigation

- Tap sur une carte acquise → affiche la carte en plein écran
- Tap sur une carte verrouillée → affiche la condition + CTA vers le module

---

## Freemium

| | Gratuit | Premium | App adulte (premium) |
|---|---|---|---|
| Deck A | depth 1 seulement | depth 1–2–3 complet | depth 1–2–3 complet |
| Deck B | — silhouettes visibles — | — silhouettes visibles — | **accès complet** |
| Jeux | Quicky uniquement | Quicky + Fast + Slow | Quicky + Fast + Slow |
| Cartes gagnées | conservées à vie | idem | idem |

**Le moteur de conversion :** les silhouettes du Deck B sont visibles en collection dès le lancement — même pour les gratuits. Voir ce qu'on ne peut pas encore jouer crée l'envie. C'est la promesse centrale de l'abonnement app adulte.

---

## Utilisation en jeu

Les cartes du collector alimentent directement les jeux :

- **Cartes à tirer** ✅ — pioche dans `ownedCards` filtrée par `theme` et `deck` (Sprint 10.1)
- **Jeu de l'oie** — cases `normal` tirent depuis le deck acquis (V3 méta-jeu, à venir)
- **Dé** — non concerné (mécanique propre)

```ts
// useCardSession.ts — implémentation réelle (Sprint 10.1)
const available = useMemo(() => {
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  return collectorCards.filter((c) => {
    if (!ownedIds.has(c.id)) return false;
    if (c.deck === 'A') return true;                 // tous âges
    if (c.deck === 'B') return isAdult;              // adultes uniquement
    if (c.deck === 'M') return isAdult && explicitMode;
    return false;
  });
}, [ownedCards, isAdult, explicitMode]);

// pickCard filtre par theme (CardTheme | 'random') + profondeur progressive
let pool = available.filter((c) =>
  (selectedTheme === 'random' || c.theme === selectedTheme) && !excluded.has(c.id)
);
// En mode séance random → progression par c.depth (early: ≤2, late: ≥2)
```

---

## Persistance (V2 localStorage — V3 cloud)

```ts
// app/stores/unlockStore.ts — clé localStorage 'consentement-unlocks'
interface UnlockStore {
  ownedCards: OwnedCard[];   // cartes acquises (jamais supprimées)
  sessionCount: number;      // total séances complètes (toutes sessions confondues)
  unlockCards: (cards: OwnedCard[]) => void;   // déduplication interne par id
  incrementSessionCount: () => void;
  reset: () => void;
}
```

`ownedCards` est **append-only** — `unlockCards()` filtre les doublons, ne supprime jamais.
En V3 (backend) : sync cloud pour ne pas perdre le deck entre appareils.

---

## Roadmap d'implémentation

### Phase 1 — Types + store ✅ (Level 2)

| Tâche | Fichier | Statut |
|---|---|---|
| `GainedCard` (type runtime visuel) | `game-engine/cards/computeGainedCards.ts` | ✅ |
| `OwnedCard`, `UnlockStore` (persistance) | `stores/unlockStore.ts` | ✅ |
| Pool Deck A 12 cartes depth 1–3 | `game-engine/cards/computeGainedCards.ts` | ✅ |
| Export `useUnlockStore` + reset global | `stores/index.ts` | ✅ |

### Phase 2 — Acquisition via modules éducatifs 🔲 (Level 2 — PRIORITÉ)

> ⚠️ **Pivot 2026-04-25** — Le gain principal se déclenche sur la **complétion de modules éducatifs**, pas sur les sessions de jeu.  
> Spec complète : `docs/roadmaps/card-gain-modules.md`

**Logique de gain (modèle actif) :**

| Déclencheur | Récompense | Rareté |
|---|---|---|
| Module de base complété (1ère fois) | 24 cartes starter | `common` |
| Quiz consentement terminé | 1 carte | `common` |
| Porno vs Réalité terminé | 1 carte | `common` |
| Loi & consentement terminé | 1 carte | `rare` |
| Duo Flow parcours complet | 1 carte | `rare` |
| Module pratiques adultes *(juriste)* | 1 carte | `unique` |

**Règle de rareté :** easy → common · medium → rare · hard → unique  
**Random pick** dans le pool filtré par rareté (hors cartes déjà possédées). Pool épuisé → aucune carte.

| Tâche | Fichier | Statut |
|---|---|---|
| `computeModuleGain()` pure function | `lib/computeModuleGain.ts` | 🔲 Sprint 7 |
| `unlockStore` + `CardUnlockReveal` flip R3F | `stores/unlockStore.ts` + `CardGame/index.tsx` | ✅ Infra prête |
| Module de base → 24 cartes starter | `data/cards-collector.ts` + nouveau screen | 🔲 Sprint 6–8 |
| Quiz consentement → trigger gain | `QuizConsentementScreen` | 🔲 Sprint 9 |
| Porno vs Réalité → trigger gain | `PornoVsRealiteScreen` | 🔲 Sprint 9 |
| Loi & consentement → trigger gain | `LoiConsentementScreen` | 🔲 Sprint 9 |
| Duo Flow → trigger gain | `DuoSpaceScreen` | 🔲 Sprint 9 |

### Phase 2bis — Triggers GooseGame ❌ Supprimés

> **Décision finale** : seule l'éducation crée des cartes. Les jeux les utilisent.

Les triggers GooseGame Sprint 4 (`complicite` → rare, `arrivée` → unique) sont supprimés.  
Le trigger CardGameScreen (fin de séance → common) est supprimé.  
Action : retirer de `useGooseGame.ts` + supprimer tests 5.7a–5.7c — Sprint 10.

### Phase 3 — Hall of Cards ✅ (visuel)

| Tâche | Fichier | Statut |
|---|---|---|
| Grille CSS Deck A + Deck B | `components/screens/HallOfCardsScreen.tsx` | ✅ |
| `AcquiredCard` — gradient + texture + badge rareté | idem | ✅ |
| `LockedCard` — silhouette + condition lisible + dots depth | idem | ✅ |
| Deck B fond sombre + label "App adulte" si `!isAdult` | idem | ✅ |
| Tap carte acquise → zoom `CollectorCardCanvas` R3F | idem | ✅ |
| `ZoomOverlay` — spring entrance + texte + dismiss backdrop | idem | ✅ |
| Compteur ownedCards / total dans le header | idem | ✅ |
| Entrée depuis hub jeux et profil | `GamesHubScreen`, `ProfileScreen` | 🔲 autre agent |
| Tap carte verrouillée → CTA module | idem | 🔲 autre agent |

### Phase 4 — CardGame pool switch ✅ Sprint 10.1 · 🔲 Sprint 10.2

| Tâche | Fichier | Statut |
|---|---|---|
| `useCardSession` : pool = `ownedCards` → `collectorCards` lookup, filtré par `deck: 'A'\|'B'\|'M'` | `CardGame/hooks/useCardSession.ts` | ✅ |
| `selectedDeck (1–6)` → `selectedTheme (CardTheme \| 'random')` | idem | ✅ |
| `sessionDecks: number[]` → `sessionThemes: CardTheme[]` | idem + `computeGainedCards.ts` | ✅ |
| `THEME_CATEGORIES` (gradient/icon/border keyed by `CardTheme`) | `data/cards-collector.ts` | ✅ |
| Picker 6 boutons thèmes (compteur depuis `ownedCards`) | `CardGame/index.tsx` | ✅ |
| `PlayingCard` : `CardData` → `CollectorCard`, `depth` direct | `CardGame/PlayingCard.tsx` | ✅ |
| Guard : `ownedCards` vide → `EmptyDeckPrompt` CTA module de base | `CardGame/index.tsx` | 🔲 Sprint 10.2 |

---

## Ce qui ne change pas

- Contenu des modules éducatifs existants
- Mécanique des jeux (dé, cartes, oie)
- Flow duo, quiz, accompagnement mineur

---

## Dépendances

- Cartes depth 2–3 et modules avancés : **à rédiger par le juriste**
- Contenu `explicit` app adulte : idem

---

## Rendu des cartes — split CSS / R3F ✅ terminé

Même logique que le dé (`DiceRenderer` CSS + `DiceCanvas` R3F).

| Contexte | Rendu | Fichier | Statut |
|---|---|---|---|
| Session de jeu (tirage) | CSS 3D | `CardGame/PlayingCard.tsx` | ✅ existant |
| Flip reveal fin de séance | R3F | `CardGame/index.tsx` → `CollectorCardCanvas` | ✅ |
| Hall of Cards — grille | CSS | `HallOfCardsScreen.tsx` — `AcquiredCard` + `LockedCard` | ✅ |
| Hall of Cards — zoom | R3F | `HallOfCardsScreen.tsx` — `ZoomOverlay` + `CollectorCardCanvas` | ✅ |

**Ce que R3F débloque (implémenté dans `CollectorCardCanvas`) :**
- Face/dos canvas texturés (gradient, icône, texte, badge rareté)
- Glow rareté → `pointLight` coloré (violet pour `rare`, amber+pink pour `unique`)
- `SelectiveBloom` sur le ring de glow uniquement
- Flip Y avec easeOutSnap + squash-stretch au landing

**Effet foil/holographique — reporté :**
- `MeshPhysicalMaterial` + iridescence bloqué — hotspots d'éclairage incontrôlables sur mobile
- À reprendre quand Three.js mobile supportera `MeshPhysicalMaterial` de façon fiable

**Contraintes mobiles établies (non négociables) :**
- `MeshBasicMaterial` obligatoire partout
- Three.js 0.184 : `ShapeGeometry` UVs non normalisés → remap manuel `pos → uv` obligatoire
- Un seul contexte WebGL par page sur iOS → `CanvasBoundary` fallback CSS sur chaque Canvas R3F
- `GameEndCinematic` occupe le contexte principal en `step='end'` → `CollectorCardCanvas` tombe en CSS fallback sur iOS 13–14 (acceptable)

---

## Prochaine action immédiate

> **Sprint 10.2** — Guard : `ownedCards` vide → `EmptyDeckPrompt` CTA module de base.  
> **Sprint 12** — Flip reveal animé à l'entrée du Hall of Cards après complétion de module.  
> **Sprint 14** — `ModuleDeBaseScreen` : onboarding skippable + 24 cartes starter au 1er lancement.
