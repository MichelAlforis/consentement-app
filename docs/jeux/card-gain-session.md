# Système de gain de cartes — Sessions de jeu

> Créé : 25 avril 2026  
> Statut : 🔄 Sprint 1 ✅ · Sprint 2 (tests) en cours

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

### `SessionGainInput` — input de `computeGainedCards`

```ts
export interface SessionGainInput {
  sessionDecks: number[];    // ex: [2, 5] — decks explorés dans la session
  favorites: string[];       // ids des cartes mises en favori pendant la session
  seanceSize: 5 | 10;
  isPremium: boolean;
  sessionsPlayed: number;    // avant cette session (avant increment)
}
```

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
  input: SessionGainInput,
  collectorCards: CollectorCard[],
  alreadyOwned: string[]          // ownedCards.map(c => c.id)
): { gained: GainedCard[]; ownedCards: OwnedCard[] }
```

Retourne deux tableaux synchronisés :
- `gained` → pour l'affichage `CardUnlockReveal` (visuels, texte)
- `ownedCards` → prêt à passer directement à `unlockCards()` du store (avec `rarity`, `gainedOn`, `unlockedBy`)

Aucun effet de bord. Aucun import React. Testable en Node pur.

### Helpers internes

```ts
excludeOwned(cards, alreadyOwned)                          → CollectorCard[]
pickRandom<T>(arr)                                         → T | null
pickWeightedByFavoriteDecks(candidates, sessionDecks,
  favorites, allCards)                                     → CollectorCard | null
```

Helpers publics (utilisés par GooseGame — dans le même fichier) :
```ts
pickOneRare(collectorCards, alreadyOwned)                  → CollectorCard | null
pickOneUnique(collectorCards, alreadyOwned)                → CollectorCard | null
```

### Règles (appliquées dans l'ordre)

**Règle 1 — Carte common garantie**
- Toujours 1 carte `common` si séance complète
- Prendre une carte `depth 1` des decks explorés (`sessionDecks`)
- Exclure les cartes déjà dans `alreadyOwned`
- Si pool vide dans les decks explorés → random dans `depth 1` global

**Règle 2 — Bonus multiple de 3**
- Si `(sessionsPlayed + 1) % 3 === 0`
- Ajouter +1 carte `rare` de `depth 2`
- Pondérer vers les decks représentés dans les favoris
- Ne jamais dépasser 2 cartes au total (common + rare)

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
isSeanceDone ?
  └─ oui → pick 1 common (decks explorés, hors alreadyOwned)
            │
            └─ (sessionsPlayed+1) % 3 === 0 ?
                  └─ oui → +1 rare (depth 2, pondérée favoris)
                            │
                            └─ isPremium && deck 5|6 ?
                                  └─ oui → rand() < 0.2 → +1 unique
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

Le calcul se déclenche **au moment de `goToEnd()`**, juste avant la transition vers le step `end`.

```ts
// CardGame/index.tsx — Sprint 3
const { ownedCards, sessionCount, unlockCards, incrementSessionCount } = useUnlockStore();
const [gainedCards, setGainedCards] = useState<GainedCard[]>([]);

const alreadyOwned = ownedCards.map((c) => c.id);

const handleSeanceDone = useCallback(() => {
  const { gained, ownedCards: newOwned } = computeGainedCards(
    { sessionDecks, favorites, seanceSize, isPremium, sessionsPlayed: sessionCount },
    collectorCards,        // depuis data/cards-collector.ts
    alreadyOwned
  );

  incrementSessionCount();

  if (newOwned.length > 0) {
    unlockCards(newOwned);          // OwnedCard[] direct — pas de mapping
    setGainedCards(gained);
  }

  goToEnd();
}, [sessionDecks, favorites, seanceSize, isPremium, sessionCount, alreadyOwned]);
```

`gainedCards` est ensuite transmis à `GameEndCinematic` → `CardUnlockReveal` pour le flip reveal.

Le prop `gainedCards?: GainedCard[]` dans `CardGameScreenProps` devient un state interne —  
la prop externe peut être retirée ou gardée pour les tests.

---

## Triggers `GooseGameScreen`

Ces deux triggers n'utilisent **pas** `computeGainedCards` — ils sont déterministes (1 carte fixe).  
Les helpers `pickOneRare` / `pickOneUnique` sont exportés depuis `app/lib/computeGainedCards.ts`.

```ts
// GooseGameScreen — Sprint 4
import { pickOneRare, pickOneUnique } from '@/lib/computeGainedCards';

const { ownedCards, unlockCards } = useUnlockStore();
const alreadyOwned = ownedCards.map((c) => c.id);

// Case complicite atteinte
const handleComplicite = () => {
  const card = pickOneRare(collectorCards, alreadyOwned);
  if (card) unlockCards([{ id: card.id, rarity: 'rare', gainedOn: new Date().toISOString(), unlockedBy: 'goose-complicite' }]);
};

// Fin de partie Slow (premium uniquement)
const handleSlowEnd = () => {
  if (!isPremium) return;
  const card = pickOneUnique(collectorCards, alreadyOwned);
  if (card) unlockCards([{ id: card.id, rarity: 'unique', gainedOn: new Date().toISOString(), unlockedBy: 'goose-slow' }]);
};
```

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
| `app/stores/unlockStore.ts` | ✅ Zustand + persist — `OwnedCard`, `unlockCards`, `incrementSessionCount`, `reset` |
| `app/data/cards-collector.ts` | ✅ 10 stubs `CollectorCard[]` (4 common, 3 rare, 2 unique Deck A, 1 stub Deck B) + helpers |
| `app/lib/computeGainedCards.ts` | ✅ Types + pure function complète + helpers GooseGame |

### ✅ Sprint 1 — Modifiés

| Fichier | Modification |
|---|---|
| `app/stores/index.ts` | ✅ Export `useUnlockStore` + `OwnedCard` + `Rarity` — `resetAllData` efface `consentement-unlocks` |

### 🔲 À créer

| Fichier | Contenu |
|---|---|
| `app/lib/computeGainedCards.test.ts` | Tests unitaires — 10 cas (Sprint 2) |

### 🔲 À modifier

| Fichier | Modification |
|---|---|
| `app/components/screens/CardGame/index.tsx` | Brancher `computeGainedCards` au `goToEnd()` — Sprint 3 |
| `app/components/screens/GooseGame/index.tsx` | Ajouter triggers `complicite` et `fin Slow` — Sprint 4 |
