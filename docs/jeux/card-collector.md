# Card Collector — Système d'acquisition de cartes

> Créé : 24 avril 2026, màj 2026-04-25
> Légende : ✅ Fait · 🔄 En cours · 🔲 À faire

---

## Plan d'évolution — 3 niveaux

```
Level 1 ✅          Level 2 ✅              Level 3 🔲
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
| **Level 2** | ✅ Gain réel à la fin de séance (fait) | ✅ localStorage (fait) | ✅ Flip R3F en jeu (fait) |
| **Level 3** | ✅ + alimenté par l'éducatif | ✅ + historique | ✅ Hall complet |

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

## Deux decks distincts

Le collector repose sur **deux decks parallèles et complémentaires**.

> Parler de consentement sans parler de sexe, c'est de la théorie. Les deux decks sont nécessaires pour que l'app soit honnête et utile.

### Deck A — Non-explicite
Connexion, communication, exploration émotionnelle et sensorielle.
Accessible à tous les adultes. Jamais de contenu sexuel direct.

### Deck B — Explicite
Pratiques sexuelles, désirs, exploration physique. Contenu rédigé par le juriste.
**App adulte uniquement.** Driver #1 de l'abonnement.

Les deux decks ont la même structure (depth 1→3, rareté, tags).
Les deux progressent via des parcours d'apprentissage distincts.

---

## Anatomie d'une carte

Deux types coexistent : `GainedCard` (runtime, visuel) et `OwnedCard` (persistance).

```ts
// app/game-engine/cards/computeGainedCards.ts
// Type runtime — affiché dans CardUnlockReveal et Hall of Cards
interface GainedCard {
  id: string;
  text: string;
  rarity: 'common' | 'rare' | 'unique';
  gradient: string;   // CSS gradient de la face
  iconName: string;   // Lucide icon name
  border: string;     // couleur bordure CSS
}

// app/stores/unlockStore.ts
// Type persisté — ce qu'on stocke dans localStorage
interface OwnedCard {
  id: string;
  rarity: 'common' | 'rare' | 'unique';
  gainedOn: string;     // date ISO
  unlockedBy: string;   // 'card-session' | 'slow-session' | id module éducatif
}
```

Le pool Deck A (12 cartes depth 1–3) est défini dans `computeGainedCards.ts`. Le pool Deck B (juriste) sera ajouté en Level 3.

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

- **Cartes à tirer** — pioche dans le deck acquis
- **Jeu de l'oie** — cases `normal` tirent depuis le deck acquis (V3 méta-jeu)
- **Dé** — non concerné (mécanique propre)

```ts
// drawCard filtre sur les cartes possédées
function drawCard(phase, history, ownedCards) {
  const pool = ownedCards
    .filter(c => matchesPhase(c, phase))
    .filter(c => !history.session.has(c.id));
  return weightedPick(pool, getWeights(phase));
}
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

### Phase 2 — Acquisition jeu de cartes ✅ (Level 2)

| Tâche | Fichier | Statut |
|---|---|---|
| `computeGainedCards()` pure function | `game-engine/cards/computeGainedCards.ts` | ✅ |
| `handleGoToEnd` orchestre compute + persist | `components/screens/CardGame/index.tsx` | ✅ |
| `CardUnlockReveal` flip R3F séquentiel | `components/screens/CardGame/index.tsx` | ✅ |
| `CollectorCardCanvas` import GainedCard partagé | `game-engine/cards/CollectorCardCanvas.tsx` | ✅ |

**Logique de gain dans le jeu de cartes :**

| Déclencheur | Récompense | Condition |
|---|---|---|
| Séance complète | 1 `common` garanti | `sessionMode='seance'` + `cardCount >= seanceSize` |
| Toutes les 3 séances | +1 `rare` (ou `common` si decks légers) | `sessionCount % 3 === 0` |
| Decks 5–6 joués + premium | +1 `unique` | Vérité ou Douceur dans `sessionDecks` |
| Max par séance | 3 cartes | `gained.slice(0, 3)` |

### Phase 2bis — Acquisition modules éducatifs 🔲 (Level 3)

À brancher sur les écrans éducatifs existants — nécessite `unlockStore` (déjà prêt).

| Tâche | Fichier | Statut |
|---|---|---|
| Quiz consentement terminé → 3 `common` | `QuizConsentementScreen` | 🔲 |
| Score parfait quiz → +1 `rare` | `QuizConsentementScreen` | 🔲 |
| Duo flow complet → 5 cartes `duo` | `DuoSpaceScreen` | 🔲 |
| CTA "Voir ma collection" dans `GameEndCinematic` | `game-engine/shared/GameEndCinematic.tsx` | 🔲 |

### Phase 3 — Hall of Cards 🔲

| Tâche | Fichier |
|---|---|
| `HallOfCardsScreen` — grille Deck A + Deck B | `components/screens/HallOfCardsScreen.tsx` |
| Réutiliser pattern grille du step `pick` de `CardGameScreen` | idem |
| Silhouette + condition lisible pour les cartes verrouillées | idem |
| Deck B entièrement en silhouette (sauf app adulte) | idem |
| Tap carte acquise → plein écran R3F | idem |
| Tap carte verrouillée → condition + CTA module | idem |
| Entrée depuis hub jeux et profil | `GamesHubScreen`, `ProfileScreen` |

### Phase 4 — Brancher en jeu 🔲

| Tâche | Fichier |
|---|---|
| `drawCard` filtre sur `ownedCards` dans Cartes à tirer | `game-engine/cards/useCardEngine.ts` |
| Compteur cartes possédées dans le hub | `GamesHubScreen` |

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

## Rendu des cartes — split CSS / R3F

Même logique que le dé (`DiceRenderer` CSS + `DiceCanvas` R3F).

| Contexte | Rendu | Raison |
|---|---|---|
| Session de jeu (tirage) | CSS 3D — `PlayingCard` existant | 1 carte, perf critique, fonctionne |
| Flip reveal `GameEndCinematic` | R3F | moment showcase, 2–3 cartes max |
| Hall of Cards — grille | CSS | 30–50 cartes visibles, mobile oblige |
| Hall of Cards — carte zoomée | R3F | 1 carte plein écran, effets foil/shimmer |

**Ce que R3F débloque (implémenté dans `CollectorCardCanvas`) :**
- Face/dos canvas texturés (gradient, icône, texte, badge rareté)
- Glow rareté → `pointLight` coloré (violet pour `rare`, amber+pink pour `unique`)
- `SelectiveBloom` sur le ring de glow uniquement
- Flip Y avec easeOutSnap + squash-stretch au landing

**Contrainte mobile établie :**
- `MeshBasicMaterial` obligatoire — `MeshPhysicalMaterial` crée des hotspots d'éclairage incontrôlables sur mobile
- Three.js 0.184 : `ShapeGeometry` UVs non normalisés → remap manuel `pos → uv` obligatoire
- Un seul contexte WebGL par page sur iOS → `CanvasBoundary` fallback CSS sur chaque Canvas R3F (déjà en place partout)
- En `step='end'`, `GameEndCinematic` occupe le contexte WebGL principal → `CollectorCardCanvas` peut tomber en CSS fallback sur iOS 13–14 (acceptable)

---

## Prochaine action immédiate

> **Level 3 — Hall of Cards** — `HallOfCardsScreen` : grille Deck A + Deck B, silhouettes verrouillées, tap → plein écran R3F.
> Entrée depuis `GamesHubScreen` + `ProfileScreen`.
