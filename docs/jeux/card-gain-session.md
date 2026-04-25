# Système de gain de cartes — Sessions de jeu

> Créé : 25 avril 2026  
> Statut : 🔲 Phase 6 — À implémenter

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
| 3 sessions cumulées | `unlockStore.sessionsPlayed % 3 === 0` | +1 carte `rare` bonus | calculé après increment |
| Case complicite (jeu de l'oie) | `GooseGameScreen` | 1 carte `rare` depth 2 | case type `complicite` |
| Fin de partie Slow (premium) | `GooseGameScreen` | 1 carte `unique` depth 3 | `isPremium && mode === 'slow'` |

**Règle fondamentale :** les cartes débloquées restent acquises à vie, même sans abonnement premium.  
`unlockedCards` n'expose pas de fonction de suppression — c'est intentionnel.

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

### `UnlockStore` — état persisté

```ts
export interface UnlockStore {
  unlockedCards: string[];   // ids des cartes gagnées — source de vérité déduplication
  sessionsPlayed: number;    // nombre total de sessions complètes
}
```

Clé localStorage : `consentement-unlock`

---

## `computeGainedCards` — pure function

### Signature

```ts
function computeGainedCards(
  input: SessionGainInput,
  collectorCards: CollectorCard[],
  alreadyOwned: string[]
): GainedCard[]
```

Aucun effet de bord. Aucun import React. Testable en Node pur.

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

```ts
// Lecture
function getUnlockedCards(): string[]
function getSessionsPlayed(): number

// Écriture
function addUnlockedCards(ids: string[]): void   // déduplique automatiquement via Set
function incrementSessions(): void               // +1 sessionsPlayed

// Reset (tests / onboarding fresh start)
function resetUnlockStore(): void
```

### Implémentation cible (Zustand + persist)

Pattern cohérent avec `settingsStore`, `authStore`, `premiumStore` :

```ts
// stores/unlockStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UnlockState {
  unlockedCards: string[];
  sessionsPlayed: number;
  addUnlockedCards: (ids: string[]) => void;
  incrementSessions: () => void;
  reset: () => void;
}

export const useUnlockStore = create<UnlockState>()(
  persist(
    (set, get) => ({
      unlockedCards: [],
      sessionsPlayed: 0,
      addUnlockedCards: (ids) =>
        set((state) => ({
          unlockedCards: [...new Set([...state.unlockedCards, ...ids])],
        })),
      incrementSessions: () =>
        set((state) => ({ sessionsPlayed: state.sessionsPlayed + 1 })),
      reset: () => set({ unlockedCards: [], sessionsPlayed: 0 }),
    }),
    { name: 'consentement-unlock' }
  )
);
```

---

## Branchement dans `CardGameScreen`

Le calcul se déclenche **au moment de `goToEnd()`**, juste avant la transition vers le step `end`.

```ts
// CardGame/index.tsx
const { unlockedCards, sessionsPlayed, addUnlockedCards, incrementSessions } = useUnlockStore();
const [gainedCards, setGainedCards] = useState<GainedCard[]>([]);

const handleSeanceDone = useCallback(() => {
  const gained = computeGainedCards(
    { sessionDecks, favorites, seanceSize, isPremium, sessionsPlayed },
    collectorCards,        // depuis data/cards-collector.ts
    unlockedCards
  );

  incrementSessions();

  if (gained.length > 0) {
    addUnlockedCards(gained.map((c) => c.id));
    setGainedCards(gained);
  }

  goToEnd();
}, [sessionDecks, favorites, seanceSize, isPremium, sessionsPlayed, unlockedCards]);
```

`gainedCards` est ensuite transmis à `GameEndCinematic` → `CardUnlockReveal` pour le flip reveal.

Le prop `gainedCards?: GainedCard[]` dans `CardGameScreenProps` devient un state interne —  
la prop externe peut être retirée ou gardée pour les tests.

---

## Triggers `GooseGameScreen`

Ces deux triggers n'utilisent **pas** `computeGainedCards` — ils sont déterministes (1 carte fixe).

```ts
// Case complicite atteinte
const handleComplicite = () => {
  const card = pickOneRare(collectorCards, unlockedCards); // helper local
  if (card) addUnlockedCards([card.id]);
};

// Fin de partie Slow (premium uniquement)
const handleSlowEnd = () => {
  if (!isPremium) return;
  const card = pickOneUnique(collectorCards, unlockedCards);
  if (card) addUnlockedCards([card.id]);
};
```

---

## Migration V3 (cloud)

Le store est conçu pour une migration sans breaking change côté composants.

```
V2 : persist(localStorage, { name: 'consentement-unlock' })
V3 : persist(cloudAdapter,  { name: 'consentement-unlock' })
     + sync bidirectionnelle au login
     + merge local → cloud au premier login (les cartes ne se perdent jamais)
```

Seul le middleware de persistance change. L'API (`addUnlockedCards`, `incrementSessions`) reste identique dans tous les composants.

---

## Interaction avec le gain par modules éducatifs

Les deux chemins alimentent le même `unlockedCards` :

```
CardGameScreen (séance)    → computeGainedCards → addUnlockedCards()
QuizScreen / DuoFlow       → unlockCards(moduleId) → addUnlockedCards()
GooseGameScreen (triggers) → addUnlockedCards() directement
                                      │
                              unlockStore.unlockedCards
                                      │
                    ┌─────────────────┴──────────────────┐
                    ▼                                     ▼
           Hall of Cards                      drawCard (jeu de l'oie)
           (collection visible)               (filtre sur ownedCards)
```

La déduplication dans `addUnlockedCards` garantit qu'une carte ne peut apparaître qu'une fois, quelle que soit la source du gain.

---

## Fichiers à créer

| Fichier | Contenu |
|---|---|
| `stores/unlockStore.ts` | Zustand store + persist + types `UnlockState` |
| `lib/computeGainedCards.ts` | Pure function + types `SessionGainInput`, `GainedCard` |
| `data/cards-collector.ts` | Deck collector A + B, stubs textes, `CollectorCard[]` |
| `lib/computeGainedCards.test.ts` | Tests unitaires — 8 cas minimum |

## Fichiers à modifier

| Fichier | Modification |
|---|---|
| `app/components/screens/CardGame/index.tsx` | Brancher `computeGainedCards` au `goToEnd()`, migrer `gainedCards` en state interne |
| `app/stores/index.ts` | Ajouter `useUnlockStore` aux exports + `resetAllData` inclut `consentement-unlock` |
| `app/components/screens/GooseGame/index.tsx` | Ajouter triggers `complicite` et `fin Slow` |
