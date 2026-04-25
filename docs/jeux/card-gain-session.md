# Système de gain de cartes — Sessions de jeu

> Créé : 25 avril 2026  
> Statut : ✅ Sprint 1 · ✅ Sprint 2 (tests + fusion) · ✅ Sprint 3 (CardGameScreen) · ✅ Sprint 4 (GooseGame) · 🔲 Sprint 5 (validation E2E)

---

## Contexte

Ce document spécifie le **système de gain de cartes déclenché par les sessions de jeu**.  
Il est distinct du gain par modules éducatifs (voir `card-collector.md`).

Les deux systèmes alimentent le même `unlockStore` et la même collection visible dans le Hall of Cards.

### Relation avec `card-collector.md`

```
card-collector.md          → vision produit, Deck A/B, modules éducatifs, Hall of Cards
card-gain-session.md (ici) → spec technique du gain en session (CardGameScreen + GooseGame)
```

---

## Déclencheurs de gain

| Déclencheur | Source | Récompense | Condition |
|---|---|---|---|
| Fin de séance complète | `CardGameScreen` | 1 carte `common` | `isSeanceDone === true` |
| 3 sessions cumulées | `unlockStore.sessionCount % 3 === 0` | +1 carte `rare` bonus | calculé après increment |
| Case complicite (jeu de l'oie) | `GooseGameScreen` | 1 carte `rare` depth 2 | case type `complicite` |
| Fin de partie Slow (premium) | `GooseGameScreen` | 1 carte `unique` depth 3 | `isPremium && mode === 'slow'` |

**Règle fondamentale :** les cartes débloquées restent acquises à vie, même sans abonnement premium.  
`ownedCards` n'expose pas de fonction de suppression — c'est intentionnel.

---

## Types

### `GainedCard` — carte retournée pour l'affichage flip reveal

```ts
export interface GainedCard {
  id: string;           // id correspondant à un CollectorCard dans data/cards-collector.ts
  text: string;
  rarity: 'common' | 'rare' | 'unique';
  gradient: string;     // CSS linear-gradient, ex: "linear-gradient(135deg, #7c3aed, #a855f7)"
  iconName: string;     // nom d'icône Lucide
  border: string;       // couleur hex du bord
}
```

> `GainedCard.id` doit correspondre à un id réel dans `data/cards-collector.ts`. Jamais un id inventé.

---

### `ComputeParams` — input de `computeGainedCards`

```ts
export interface ComputeParams {
  sessionMode: 'seance' | 'libre';  // guard — retourne [] si 'libre'
  cardCount: number;                // doit être >= seanceSize
  seanceSize: number;
  sessionDecks: number[];           // ex: [2, 5] — decks explorés dans la session
  sessionCount: number;             // APRÈS increment — incrémenté avant l'appel
  ownedIds: Set<string>;            // ids déjà possédées (Set pour O(1))
  favorites: string[];              // ids des cartes mises en favori pendant la session
  isPremium: boolean;
}
```

> ⚠️ `sessionCount` est la valeur **après** increment (contrairement à l'ancienne `sessionsPlayed` qui était avant). Milestone : `sessionCount % 3 === 0`.

---

### `OwnedCard` + `UnlockStore` — état persisté

```ts
// stores/unlockStore.ts
export type Rarity = 'common' | 'rare' | 'unique';

export interface OwnedCard {
  id: string;
  rarity: Rarity;
  gainedOn: string;      // ISO date — "2026-04-25T14:32:00.000Z"
  unlockedBy: string;    // 'card-session' | 'card-session-milestone' | 'card-session-premium' | module id
}
```

La structure `OwnedCard` (vs simples ids) permet :
- tracer la source de chaque gain (session vs module)
- afficher "gagné le…" dans le Hall of Cards
- faciliter la migration V3 (sync cloud avec historique)

Clé localStorage : `consentement-unlocks`

---

## `computeGainedCards` — pure function

### Signature

```ts
// app/lib/computeGainedCards.ts
function computeGainedCards(
  p: ComputeParams,
  collectorCards: CollectorCard[]
): { gained: GainedCard[]; ownedCards: OwnedCard[] }
```

Retourne deux tableaux synchronisés :
- `gained` → pour l'affichage `CardUnlockReveal` (visuels, texte)
- `ownedCards` → prêt à passer directement à `unlockCards()` du store (avec `rarity`, `gainedOn`, `unlockedBy`)

Aucun effet de bord. Aucun import React. Testable en Node pur.

### Helpers internes

```ts
excludeOwned(cards, ownedIds: Set<string>)                 → CollectorCard[]
pickRandom<T>(arr)                                         → T | null
pickWeighted(candidates, favorites, allCards)              → CollectorCard | null
```

Helpers publics (utilisés par GooseGame — dans le même fichier) :
```ts
pickOneRare(collectorCards, ownedIds: Set<string>)         → CollectorCard | null
pickOneUnique(collectorCards, ownedIds: Set<string>)       → CollectorCard | null
```

### Règles (appliquées dans l'ordre)

**Règle 1 — Carte common garantie**
- Toujours 1 carte `common` si séance complète
- Prendre une carte `depth 1` des decks explorés (`sessionDecks`)
- Exclure les cartes déjà dans `alreadyOwned`
- Si pool vide dans les decks explorés → random dans `depth 1` global

**Règle 2 — Bonus multiple de 3**
- Si `sessionCount % 3 === 0` (sessionCount déjà incrémenté)
- Si decks profonds joués (3–6) → +1 `rare` depth 2
- Sinon → +1 `common` depth 1 extra (pondérée favoris)
- Ne jamais dépasser 2 cartes au total avant la règle 3

**Règle 3 — Chance unique premium**
- Si `isPremium && sessionDecks.some(d => d === 5 || d === 6)`
- 20% de chance d'une carte `unique` `depth 3`
- S'ajoute aux précédentes — maximum 3 cartes au total
- Ignorée si toutes les uniques disponibles sont déjà dans `alreadyOwned`

**Règle 4 — Pondération favoris**
- Si `favorites.length > 0`
- Les decks représentés dans les favoris ont un poids × 2 lors du pick
- Applicable à toutes les raretés

**Règle 5 — Déduplication**
- Ne jamais retourner une carte déjà dans `alreadyOwned`
- Filtrer avant tout pick
- Si pool vide pour une rareté → ignorer ce tier (pas de substitut d'une rareté à l'autre)

### Limite absolue

**Maximum 3 cartes** par appel, quelle que soit la combinaison de règles déclenchées.

### Schéma de décision

```
sessionMode='seance' && cardCount >= seanceSize ?
  └─ oui → pick 1 common (decks explorés en priorité, hors ownedIds)
            │
            └─ sessionCount % 3 === 0 ?
                  └─ oui → deck profond (3–6) joué ?
                              ├─ oui → +1 rare depth 2
                              └─ non → +1 common extra
                            │
                            └─ isPremium && deck 5|6 ?
                                  └─ oui → rand() < 0.2 → +1 unique depth 3
```

---

## `unlockStore` — API publique

✅ Implémenté dans `app/stores/unlockStore.ts`

```ts
// Lecture (depuis le state Zustand)
state.ownedCards: OwnedCard[]
state.sessionCount: number

// Écriture
unlockCards(cards: OwnedCard[]): void   // déduplique par id — ignore les doublons
incrementSessionCount(): void           // +1 sessionCount
reset(): void                           // remet à zéro (tests / onboarding)
```

La déduplication est gérée dans `unlockCards` via un `Set` sur les ids existants :

```ts
unlockCards: (newCards) => {
  const existing = new Set(get().ownedCards.map((c) => c.id));
  const toAdd = newCards.filter((c) => !existing.has(c.id));
  if (toAdd.length === 0) return;
  set((s) => ({ ownedCards: [...s.ownedCards, ...toAdd] }));
},
```

**Clé localStorage :** `consentement-unlocks`  
**Exporté depuis :** `app/stores/index.ts`  
**Intégré dans :** `resetAllData()` (efface `consentement-unlocks`)

---

## Branchement dans `CardGameScreen`

✅ Implémenté dans `app/components/screens/CardGame/index.tsx`.

Le calcul se déclenche sur le bouton "Terminer la séance" (`handleGoToEnd`), avant la transition vers le step `end`.

```ts
// CardGame/index.tsx — réel
const { ownedCards, sessionCount, unlockCards, incrementSessionCount } = useUnlockStore();
const [gainedCards, setGainedCards] = useState<GainedCard[]>([]);

const handleGoToEnd = useCallback(() => {
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  const nextSessionCount = sessionCount + 1;
  incrementSessionCount();                    // incrémenté AVANT l'appel

  const { gained, ownedCards: newOwned } = computeGainedCards({
    sessionMode: s.sessionMode,
    cardCount: s.cardCount,
    seanceSize: s.seanceSize,
    sessionDecks: s.sessionDecks,
    sessionCount: nextSessionCount,           // post-increment
    ownedIds,
    favorites: s.favorites,
    isPremium,
  }, collectorCards);

  if (newOwned.length > 0) unlockCards(newOwned);
  setGainedCards(gained);
  s.goToEnd();
}, [ownedCards, sessionCount, incrementSessionCount, s, unlockCards, isPremium]);
```

`gainedCards` est affiché dans le step `end` via `CardUnlockReveal` (flip R3F séquentiel, 750 ms par carte).

---

## Triggers `GooseGameScreen`

Ces deux triggers n'utilisent **pas** `computeGainedCards` — ils sont déterministes (1 carte fixe).  
Les helpers `pickOneRare` / `pickOneUnique` sont exportés depuis `app/lib/computeGainedCards.ts`.

Implémentés directement dans `processSquare` de `useGooseGame.ts` via l'API impérative de Zustand (`getState()`) — pas de re-render, pas de stale closure.

```ts
// app/components/screens/GooseGameScreen/hooks/useGooseGame.ts ✅

// Case complicite
case 'complicite': {
  // ... setStep, triggerConfetti ...
  const { ownedCards, unlockCards } = useUnlockStore.getState();
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  const rareCard = pickOneRare(collectorCards, ownedIds);
  if (rareCard) unlockCards([{ id: rareCard.id, rarity: 'rare', gainedOn: new Date().toISOString(), unlockedBy: 'goose-complicite' }]);
  return;
}

// Fin de partie (arrivée — GooseGame est déjà premium-gaté)
case 'arrivee': {
  // ... setPhase('end'), vibrate ...
  const { ownedCards, unlockCards } = useUnlockStore.getState();
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  const uniqueCard = pickOneUnique(collectorCards, ownedIds);
  if (uniqueCard) unlockCards([{ id: uniqueCard.id, rarity: 'unique', gainedOn: new Date().toISOString(), unlockedBy: 'goose-slow' }]);
  return;
}
```

> `GooseGameInner` n'est rendu que si `isPremium === true` — le guard dans `GooseGameScreen` garantit le contexte premium sans passer `isPremium` plus profond.

---

## Migration V3 (cloud)

Le store est conçu pour une migration sans breaking change côté composants.

```
V2 : persist(localStorage, { name: 'consentement-unlocks' })
V3 : persist(cloudAdapter,  { name: 'consentement-unlocks' })
     + sync bidirectionnelle au login
     + merge local → cloud au premier login (les cartes ne se perdent jamais)
```

La structure `OwnedCard` (avec `gainedOn` et `unlockedBy`) facilite le merge : en cas de conflit entre local et cloud, on garde l'union et on choisit la date la plus ancienne comme `gainedOn`.

Seul le middleware de persistance change. L'API (`unlockCards`, `incrementSessionCount`) reste identique dans tous les composants.

---

## Interaction avec le gain par modules éducatifs

Les deux chemins alimentent le même `ownedCards` :

```
CardGameScreen (séance)    → computeGainedCards → unlockCards(OwnedCard[])
GooseGameScreen (triggers) → unlockCards(OwnedCard[]) directement
QuizScreen / DuoFlow       → unlockCards(OwnedCard[]) — unlockedBy = module id
                                      │
                              unlockStore.ownedCards
                                      │
                    ┌─────────────────┴──────────────────┐
                    ▼                                     ▼
           Hall of Cards                      drawCard (jeu de l'oie)
           (collection visible)               (filtre sur ownedCards)
```

La déduplication dans `unlockCards` garantit qu'une carte ne peut apparaître qu'une fois dans `ownedCards`, quelle que soit la source du gain.

---

## État des fichiers

### ✅ Sprint 1 — Créés

| Fichier | Contenu |
|---|---|
| `app/stores/unlockStore.ts` | Zustand + persist — `OwnedCard`, `unlockCards`, `incrementSessionCount`, `reset` |
| `app/data/cards-collector.ts` | 10 stubs `CollectorCard[]` (4 common, 3 rare, 2 unique Deck A, 1 stub Deck B) + helpers |
| `app/lib/computeGainedCards.ts` | `ComputeParams` + pure function + helpers GooseGame (`pickOneRare`, `pickOneUnique`) |

### ✅ Sprint 1 — Modifiés

| Fichier | Modification |
|---|---|
| `app/stores/index.ts` | Export `useUnlockStore` + `OwnedCard` + `Rarity` — `resetAllData` efface `consentement-unlocks` |

### ✅ Sprint 2 — Créés

| Fichier | Contenu |
|---|---|
| `app/lib/computeGainedCards.test.ts` | 14 tests (10 computeGainedCards + 4 helpers) — commit `4f2e6ad` |

**Couverture Sprint 2 :**

| # | Cas testé |
|---|---|
| 1 | 1 common retournée sur séance complète |
| 2 | `[]` si `sessionMode='libre'` (guard) |
| 3 | Common prise en priorité dans les decks explorés |
| 4 | Rare sur milestone ×3 avec deck profond (3–6) |
| 5 | Pas de rare sans milestone |
| 6 | Unique ajoutée si premium + deck 5\|6 + `Math.random < 0.2` |
| 7 | Unique ignorée si `Math.random ≥ 0.2` |
| 8 | Jamais une carte déjà dans `ownedIds` |
| 9 | Maximum 3 cartes même avec toutes les règles déclenchées |
| 10 | `gained` et `ownedCards` synchronisés (longueur + champs) |
| 11–12 | `pickOneRare` — retourne disponible / null si tout possédé |
| 13–14 | `pickOneUnique` — retourne disponible / null si tout possédé |

### ✅ Sprint 2 — Fusion

| Fichier | Résultat |
|---|---|
| `app/game-engine/cards/computeGainedCards.ts` | Supprimé — remplacé par `app/lib/computeGainedCards.ts` |
| `app/game-engine/cards/CollectorCardCanvas.tsx` | Import migré vers `../../lib/computeGainedCards` |

### ✅ Sprint 3 — CardGameScreen branché

| Fichier | Modification |
|---|---|
| `app/components/screens/CardGame/index.tsx` | `handleGoToEnd` utilise `ComputeParams` + `collectorCards` — commit `a61af24` |

### ✅ Sprint 4 — GooseGame branché

| Fichier | Modification |
|---|---|
| `app/components/screens/GooseGameScreen/hooks/useGooseGame.ts` | `processSquare` — `case 'complicite'` → `pickOneRare` + `unlockCards` ; `case 'arrivee'` → `pickOneUnique` + `unlockCards` — commit `3eb9f7e` |
