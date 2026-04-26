# Plan d'implémentation — Gain de cartes

> 25 avril 2026 — màj pivot 2026-04-25  
> Référence session (déprécié) : `card-gain-session.md`  
> Référence modules (actif) : `card-gain-modules.md`

> ⚠️ **PIVOT — L'architecture de gain a changé le 2026-04-25.**  
> Les Sprints 1–5 ci-dessous sont terminés mais dépréciés pour le gain de cartes.  
> **Seule l'éducation crée des cartes. Les jeux les utilisent.**  
> Tous les triggers de jeu (CardGameScreen fin de séance, GooseGame complicite + arrivée) sont supprimés.  
> Action technique : Sprint 10 — nettoyer `useGooseGame.ts` + supprimer tests 5.7a–5.7c.  
> **Suite du travail → voir `card-gain-modules.md` (Sprints 6+).**

---

## Level 1 — Architecture (vision d'ensemble)

### Blocs fonctionnels et flux de données

```
[CardGameScreen]          ──(séance complète)──▶
[GooseGameScreen]         ──(case complicite)──▶  [computeGainedCards]
                          ──(fin Slow)─────────▶   (pure function)
                                                        │
                                                        ▼
[QuizScreen / modules éducatifs] ──────────────▶  [unlockStore]
                                                  (localStorage)
                                                        │
                                    ┌───────────────────┴──────────────────┐
                                    ▼                                      ▼
                           [CardUnlockReveal]                    [Hall of Cards]
                           (flip reveal fin                       (collection
                            de séance)                            permanente)
                                                                       │
                                                                       ▼
                                                             [drawCard — jeu de l'oie]
                                                             (filtre sur ownedCards)
```

### Invariants à respecter

| Invariant | Raison |
|---|---|
| `computeGainedCards` est une pure function | Testable sans React, sans mock store |
| `unlockStore` est la seule source de vérité | Pas de state dupliqué côté composant |
| `unlockCards` déduplique via `Set` sur les ids | Impossible d'avoir deux fois la même carte |
| Max 3 cartes par gain de séance | UX — le flip reveal ne doit pas saturer |
| Aucune fonction de suppression dans le store | Les cartes sont permanentes par design |
| V3 : seul le middleware de persist change | L'API du store reste identique côté composants |

### Positionnement dans la roadmap

Ce système est **la Phase 6** mentionnée dans `CardGameScreenProps.gainedCards`.  
Il débloque ensuite le Hall of Cards (Phase 3 de `card-collector.md`) et le branching `drawCard` en jeu de l'oie (Phase 4).

---

## Level 2 — Modules et interfaces

### Module A — `unlockStore` ✅

**Responsabilité :** persistance des cartes gagnées et du compteur de sessions  
**Fichier :** `app/stores/unlockStore.ts` — implémenté  

```
Interface réelle (diffère légèrement de la spec initiale — plus riche)
  state.ownedCards: OwnedCard[]     → tableau complet avec rarity, gainedOn, unlockedBy
  state.sessionCount: number        → compteur de séances complètes
  unlockCards(cards: OwnedCard[])   → void  (déduplique par id)
  incrementSessionCount()           → void
  reset()                           → void

Clé localStorage : "consentement-unlocks"
Export depuis : stores/index.ts  ✅
Intégré dans : resetAllData()    ✅
```

**Différence vs spec :** `OwnedCard[]` au lieu de `string[]` — plus riche, meilleur pour V3.  
**Dépendances :** `zustand`, `zustand/middleware`

---

### Module B — `computeGainedCards` ✅

**Responsabilité :** décider quelles cartes sont gagnées en fin de séance  
**Fichier :** `app/lib/computeGainedCards.ts` — implémenté + fusionné (commit `a61af24`)

```
Signature réelle (fusion des deux implémentations)
  computeGainedCards(
    p: ComputeParams,
    collectorCards: CollectorCard[]
  ): { gained: GainedCard[]; ownedCards: OwnedCard[] }

  ComputeParams {
    sessionMode, cardCount, seanceSize   ← guard intégré (game-engine)
    sessionDecks, sessionCount,          ← post-increment (game-engine)
    ownedIds: Set<string>,               ← O(1) lookup (game-engine)
    favorites, isPremium                 ← pondération (lib)
  }

Helpers internes
  excludeOwned(cards, ownedIds: Set)    → CollectorCard[]
  pickRandom<T>(arr)                    → T | null
  pickWeighted(candidates, favorites,
    allCards)                           → CollectorCard | null

Helpers publics (GooseGame)
  pickOneRare(collectorCards, ownedIds: Set)    → CollectorCard | null
  pickOneUnique(collectorCards, ownedIds: Set)  → CollectorCard | null

Règles (dans l'ordre) — version fusionnée
  0. Guard : sessionMode !== 'seance' || cardCount < seanceSize → []
  1. 1 common garantie (depth 1, decks explorés en priorité)
  2. sessionCount % 3 === 0 :
       decks 3–6 joués → +1 rare   (game-engine)
       sinon           → +1 common  (game-engine)
  3. isPremium && deck 5|6 → rand() < 0.2 → +1 unique (lib — probabiliste)
  4. Pondération favoris × 2 sur tous les picks (lib)
  5. Déduplication via ownedIds — live Set mis à jour entre chaque règle
  6. Jamais > 3 cartes retournées
```

**Tests :** 14/14 passing (`app/lib/computeGainedCards.test.ts`)

---

### Module C — `data/cards-collector.ts` ✅

**Responsabilité :** données des cartes collector (textes, visuels, rareté, depth)  
**Fichier :** `app/data/cards-collector.ts` — implémenté

```
CollectorCard (réel — +1 champ vs spec)
  id: string              // "ca-001" … "cb-001" — stables
  deck: 'A' | 'B'
  text: string
  depth: 1 | 2 | 3
  tags: string[]
  rarity: 'common' | 'rare' | 'unique'
  unlockedBy: string
  sourceDeck?: number     // deck gameplay 1–6 — pour le mapping session → gain
  visual: { gradient, iconName, border }

Distribution actuelle
  ca-001 → ca-004 : common depth 1 Deck A (4 cartes)
  ca-005 → ca-007 : rare   depth 2 Deck A (3 cartes)
  ca-008 → ca-009 : unique depth 3 Deck A (2 cartes)
  cb-001          : unique depth 3 Deck B (1 stub placeholder)

Helpers exportés
  getCollectorCardById(id)   → CollectorCard | undefined
  getCardsByDepth(depth)     → CollectorCard[]
  getCardsByRarity(rarity)   → CollectorCard[]
```

**Différence vs spec :** champ `sourceDeck` ajouté — permet à `computeGainedCards` de filtrer par deck gameplay sans lookup externe.

---

### Module D — Branchement `CardGameScreen` ✅

**Responsabilité :** déclencher le calcul au bon moment, transmettre les cartes à l'affichage  
**Fichier :** `app/components/screens/CardGame/index.tsx` — implémenté (commit `a61af24`)

```
Implémentation réelle
  handleGoToEnd()
    ├── ownedIds = new Set(ownedCards.map(c => c.id))
    ├── nextSessionCount = sessionCount + 1
    ├── incrementSessionCount()
    ├── computeGainedCards({ ..., sessionCount: nextSessionCount, ownedIds, favorites }, collectorCards)
    │     → { gained, ownedCards: newOwned }
    ├── if (newOwned.length > 0) unlockCards(newOwned)
    ├── setGainedCards(gained)
    └── s.goToEnd()

Flux visuel
  bouton "Terminer la séance" → handleGoToEnd()
                                      ↓
                              step = 'end' (GameEndCinematic)
                                      ↓
                              CardUnlockReveal (gainedCards)
                                      ↓
                              flip R3F séquentiel, 750ms/carte
```

**Test manuel :** séance 5 cartes → vérifier flip reveal + `localStorage["consentement-unlocks"]`

---

### Module E — Triggers `GooseGameScreen` ✅

**Responsabilité :** déclencher les gains depuis le jeu de l'oie  
**Fichier :** `app/components/screens/GooseGameScreen/hooks/useGooseGame.ts` — implémenté (commit `3eb9f7e`)

```
Implémentation réelle — dans processSquare() via Zustand getState() impératif

Trigger 1 — Case complicite
  case 'complicite':
    const { ownedCards, unlockCards } = useUnlockStore.getState();
    const ownedIds = new Set(ownedCards.map(c => c.id));
    const rareCard = pickOneRare(collectorCards, ownedIds);
    if (rareCard) unlockCards([{ id, rarity: 'rare', gainedOn, unlockedBy: 'goose-complicite' }]);

Trigger 2 — Fin de partie (arrivée)
  case 'arrivee':
    const { ownedCards, unlockCards } = useUnlockStore.getState();
    const ownedIds = new Set(ownedCards.map(c => c.id));
    const uniqueCard = pickOneUnique(collectorCards, ownedIds);
    if (uniqueCard) unlockCards([{ id, rarity: 'unique', gainedOn, unlockedBy: 'goose-slow' }]);

Note : GooseGameInner est rendu uniquement si isPremium === true (guard dans GooseGameScreen)
       → pas besoin de passer isPremium plus profond dans le hook.
       getState() impératif → pas de re-render, pas de stale closure.
```

---

## Level 3 — Tâches d'implémentation

### Sprint 1 — Fondations ✅ *(terminé)*

| # | Tâche | Fichier | Résultat |
|---|---|---|---|
| 1.1 | `useUnlockStore` Zustand | `stores/unlockStore.ts` | ✅ Existait déjà — API plus riche : `OwnedCard[]`, `unlockCards`, `incrementSessionCount` |
| 1.2 | Export depuis `stores/index.ts` | `stores/index.ts` | ✅ `useUnlockStore` + types `OwnedCard`, `Rarity` |
| 1.3 | `resetAllData` inclut la clé unlock | `stores/index.ts` | ✅ Efface `consentement-unlocks` + appelle `reset()` |
| 1.4 | 10 stubs `CollectorCard[]` | `data/cards-collector.ts` | ✅ 10 cartes — distribution : 4 common, 3 rare, 2 unique A, 1 unique B stub |
| 1.5 | Types + pure function complète | `lib/computeGainedCards.ts` | ✅ Anticipé sprint 2 — logique entière + helpers GooseGame implémentés |

**Note :** 1.5 a été étendu au-delà des types — la pure function est complète.  
Sprint 2 se réduit donc aux **tests uniquement**.

---

### Sprint 2 — Tests *(pure function déjà implémentée)*

| # | Tâche | Fichier | Critère d'acceptation |
|---|---|---|---|
| ~~2.1~~ | ~~Helper `pickByDepth`~~ | ~~implémenté~~ | ✅ `excludeOwned` + `pickWeightedByFavoriteDecks` |
| ~~2.2~~ | ~~Helper `weightByFavorites`~~ | ~~implémenté~~ | ✅ pondération × 2 via `favoriteDeckSet` |
| ~~2.3~~ | ~~Helper `pickWeighted`~~ | ~~implémenté~~ | ✅ `pickRandom` sur tableau pondéré |
| ~~2.4~~ | ~~Implémenter `computeGainedCards`~~ | ~~implémenté~~ | ✅ logique complète |
| 2.5 | Test : séance simple | `lib/computeGainedCards.test.ts` | `sessionsPlayed=0` → `gained` contient 1 carte `common` |
| 2.6 | Test : multiple de 3 | idem | `sessionsPlayed=2` → `gained` contient 1 common + 1 rare |
| 2.7 | Test : premium + deck 5 | idem | `Math.random = () => 0.1` → `gained` contient 1 unique |
| 2.8 | Test : max 3 cartes | idem | Premium + multiple 3 + deck 5 → `gained.length ≤ 3` |
| 2.9 | Test : déduplication totale | idem | Toutes commons dans `alreadyOwned` → `gained` vide |
| 2.10 | Test : sans premium | idem | `isPremium=false` + deck 5 → jamais de `unique` |

**Commande :** `npm test lib/computeGainedCards` → 6/6 passing

---

### Sprint 3 — Branchement `CardGameScreen` ✅ *(commit `a61af24`)*

| # | Tâche | Fichier | Résultat |
|---|---|---|---|
| 3.1 | Importer `useUnlockStore` | `CardGame/index.tsx` | ✅ `ownedCards`, `sessionCount`, `unlockCards`, `incrementSessionCount` |
| 3.2 | Importer `collectorCards` | idem | ✅ depuis `data/cards-collector.ts` |
| 3.3 | `gainedCards` en state interne | idem | ✅ `useState<GainedCard[]>([])` |
| 3.4 | `handleGoToEnd` avec compute | idem | ✅ `nextSessionCount` post-increment, `computeGainedCards`, `unlockCards`, `setGainedCards`, `goToEnd` |
| 3.7 | Test manuel — séance 5 cartes | App en dev | Flip reveal visible, `localStorage["consentement-unlocks"]` contient l'`OwnedCard` |

---

### Sprint 4 — Triggers `GooseGameScreen` ✅ implémenté · ❌ À supprimer (Sprint 10)

| # | Tâche | Fichier | Résultat |
|---|---|---|---|
| 4.1 | Identifier handlers cibles | `GooseGameScreen/hooks/useGooseGame.ts` | ✅ `processSquare` — `case 'complicite'` + `case 'arrivee'` |
| ~~4.2~~ | ~~Helper `pickOneRare`~~ | ~~`lib/gooseUnlockHelpers.ts`~~ | ✅ Déjà dans `app/lib/computeGainedCards.ts` |
| ~~4.3~~ | ~~Helper `pickOneUnique`~~ | idem | ✅ Idem |
| 4.4 | Trigger `complicite` | `useGooseGame.ts` | ✅ `unlockCards([OwnedCard])` avec `unlockedBy: 'goose-complicite'` |
| 4.5 | Trigger `arrivée` | idem | ✅ `unlockCards([OwnedCard])` avec `unlockedBy: 'goose-slow'` — GooseGame est premium-gaté |
| ~~4.6~~ | ~~Affichage feedback~~ | — | Reporté sprint 5+ — store enrichi, UI révèle en Hall of Cards |
| 4.7 | Test manuel | App en dev | Case complicite → `ownedCards` enrichi sans doublon |

---

### Sprint 5 — Validation end-to-end ✅ (auto) · 🔲 (manuel)

| # | Scénario | Résultat |
|---|---|---|
| 5.1 | 3 sessions → rare | ✅ Tests 4 + 16 (`sessionCount % 3 === 0` + deck profond) |
| 5.2 | Persistance cross-reload | 🔲 Manuel : fermer + rouvrir l'app, vérifier `localStorage["consentement-unlocks"]` |
| 5.3 | Pool épuisé → pas d'erreur | ✅ Tests 15–17 (`computeGainedCards.test.ts`) — commit `740dc36` |
| 5.4 | `resetAllData` complet | 🔲 Manuel : appeler `resetAllData()` → clé absente + `sessionCount = 0` |
| 5.5 | Sans premium → jamais unique | ✅ Tests 6 + 7 (`isPremium=false` + deck 5) |
| 5.6 | Déduplication cross-source | ✅ Test 8 (ids déjà dans `ownedIds` exclus) |
| 5.7 | GooseGame triggers | ✅ Tests 5.7a–5.7c écrits · ❌ À supprimer Sprint 10 (triggers supprimés) |

**45/45 tests passing** · 2 scénarios manuels restants (5.2, 5.4 — nécessitent le navigateur)

---

## Ordre d'exécution recommandé

```
Sprint 1 (fondations)
    │
    ├── Sprint 2 (pure function + tests)
    │       │
    │       └── Sprint 3 (CardGameScreen)
    │                   │
    │                   └── Sprint 5 (validation)
    │
    └── Sprint 4 (GooseGame triggers)  ← parallèle à sprint 2-3
```

---

## Dépendances critiques

| Dépendance | Impact | État |
|---|---|---|
| `data/cards-collector.ts` (stubs) | Bloquait sprint 2 et 3 | ✅ Résolu — 10 stubs créés |
| `stores/unlockStore.ts` | Bloquait tout | ✅ Résolu — existait déjà |
| `lib/computeGainedCards.ts` | Bloquait sprint 3 | ✅ Résolu — implémentée en sprint 1 |
| Contenu Deck B depth 2–3 (juriste) | Bloque le deck B complet | 🔲 Non-bloquant pour sprints 2–5 — stub `"À venir"` en place |
| `GooseGameScreen` structure interne | Bloque sprint 4 | 🔲 À investiguer (tâche 4.1) |
