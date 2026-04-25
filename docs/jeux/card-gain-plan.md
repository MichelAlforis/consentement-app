# Plan d'implémentation — Gain de cartes en session

> 25 avril 2026  
> Référence technique : `card-gain-session.md`  
> Avancement : Sprint 1 ✅ · Sprint 2 ✅ · Sprint 3 ✅ · Sprint 4 🔲 · Sprint 5 🔲

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

### Module E — Triggers `GooseGameScreen` 🔲

**Responsabilité :** déclencher les gains depuis le jeu de l'oie  
**Fichier cible :** `app/components/screens/GooseGame/index.tsx` (ou équivalent)

```
Trigger 1 — Case complicite
  Condition : case.type === 'complicite'
  Action    : pickOneRare(collectorCards, alreadyOwned)    (depuis computeGainedCards.ts)
              → unlockCards([{ id, rarity: 'rare', gainedOn, unlockedBy: 'goose-complicite' }])
  Affichage : toast ou CardUnlockReveal inline (à décider)

Trigger 2 — Fin de partie Slow
  Condition : gameMode === 'slow' && isPremium
  Action    : pickOneUnique(collectorCards, alreadyOwned)
              → unlockCards([{ id, rarity: 'unique', gainedOn, unlockedBy: 'goose-slow' }])
  Affichage : idem GameEndCinematic si disponible

Note : ces triggers n'utilisent PAS computeGainedCards — pick déterministe, 1 carte fixe.
       pickOneRare / pickOneUnique sont exportés depuis app/lib/computeGainedCards.ts.
```

**Dépendances :** Module A + C  
**Peut démarrer en parallèle** de Module D si Module A est prêt.

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

### Sprint 3 — Branchement `CardGameScreen` 🔲

| # | Tâche | Fichier | Critère d'acceptation |
|---|---|---|---|
| 3.1 | Importer `useUnlockStore` | `CardGame/index.tsx` | Destructurer `ownedCards`, `sessionCount`, `unlockCards`, `incrementSessionCount` |
| 3.2 | Importer `collectorCards` | idem | Données disponibles localement sans fetch |
| 3.3 | Migrer `gainedCards` en state interne | idem | `useState<GainedCard[]>([])` — prop externe peut être retirée |
| 3.4 | Créer `handleSeanceDone` | idem | compute → `incrementSessionCount` → `unlockCards(ownedCards)` → `setGainedCards(gained)` → `goToEnd` |
| 3.5 | Brancher sur `isSeanceDone` | idem | Le bon handler déclenche `handleSeanceDone` et non `goToEnd` directement |
| 3.6 | `gainedCards` passe à `GameEndCinematic` | idem | `CardUnlockReveal` reçoit le tableau non-vide |
| 3.7 | Test manuel — séance 5 cartes | App en dev | Flip reveal visible, `localStorage["consentement-unlocks"]` contient l'`OwnedCard` |
| 3.8 | Test manuel — séance 10 cartes | App en dev | Idem, + vérifier `sessionCount` incrémenté |

**Durée estimée :** 2h  
**Bloquant pour :** sprint 5

---

### Sprint 4 — Triggers `GooseGameScreen` 🔲 *(parallélisable avec sprint 3)*

| # | Tâche | Fichier | Critère d'acceptation |
|---|---|---|---|
| 4.1 | Identifier handlers cibles | `GooseGameScreen` | Localiser le handler "case complicite" et "fin partie Slow" |
| ~~4.2~~ | ~~Helper `pickOneRare`~~ | ~~`lib/gooseUnlockHelpers.ts`~~ | ✅ Déjà dans `app/lib/computeGainedCards.ts` |
| ~~4.3~~ | ~~Helper `pickOneUnique`~~ | idem | ✅ Idem |
| 4.4 | Trigger `complicite` | `GooseGameScreen` | `unlockCards([OwnedCard])` avec `unlockedBy: 'goose-complicite'` |
| 4.5 | Trigger `fin Slow` | idem | Conditionnel `isPremium` strict — `unlockedBy: 'goose-slow'` |
| 4.6 | Affichage feedback | idem | Toast ou `CardUnlockReveal` inline (selon disponibilité composant) |
| 4.7 | Test manuel | App en dev | Simuler case complicite → `ownedCards` enrichi sans doublon |

**Durée estimée :** 2h  
**Dépendances :** Sprint 1 uniquement (Module A + C)

---

### Sprint 5 — Validation end-to-end

| # | Scénario | Validation |
|---|---|---|
| 5.1 | 3 sessions complètes | La 3e séance génère bien 1 common + 1 rare dans le flip reveal |
| 5.2 | Persistance cross-reload | Fermer + rouvrir l'app → `unlockedCards` intact |
| 5.3 | Pool épuisé | Toutes les commons possédées → séances suivantes ne génèrent rien (pas d'erreur) |
| 5.4 | `resetAllData` complet | `consentement-unlocks` vidé + `sessionCount = 0` |
| 5.5 | Sans abonnement | `isPremium = false` + deck 5 → jamais de `unique` |
| 5.6 | Déduplication cross-source | Gain séance + gain module → même id → apparaît une seule fois dans `ownedCards` |
| 5.7 | GooseGame trigger | Case complicite → `OwnedCard` dans store avec `unlockedBy: 'goose-complicite'` |

**Durée estimée :** 1h  
**Résultat :** vert → Phase 6 terminée, Hall of Cards débloqué

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
