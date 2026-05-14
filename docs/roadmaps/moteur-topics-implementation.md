# Plan d'implémentation — Moteur Topics (v3 — final)

> Brainstorming + corrections 2026-05-14
> Référence : `pratiques-et-cartes-progression.md`

---

## Principe directeur

> La logique "qui dépend de quoi" sort des stores et des écrans.
> Elle vit dans des **fonctions métier pures et testables**.
> Les stores stockent, les écrans affichent, les fonctions décident.
> **Les fonctions métier sont aussi les points de sync backend.**

```
topicRegistry.ts        ← données + API interne (helpers purs)
        ↓
useAvailableTopics()    ← hook : module complété → topics disponibles
        ↓
unlockLexiqueTerm()     ← fn métier : palier check + word + pool (atomic + sync point)
completeGameSession()   ← fn métier : session + draw partagé (sync point)
        ↓
LexiqueScreen  ·  MoiScreen  ·  DiceGame / GooseGame / CardGame
        ↓
[backend — sync via fonctions métier, stores = cache local]
```

---

## Données enrichies — `LexiqueEntry` (màj 2026-05-14)

`lexiqueConsent.ts` a été enrichi avec deux nouveaux champs :

```ts
export interface LexiqueEntry {
  id: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
  categorie: 'juridique' | 'pratique' | 'emotionnel' | 'medical';
  palier: 1 | 2 | 3;              // heat palier requis pour débloquer ce terme
  rarity: 'common' | 'rare' | 'unique'; // rarity de la carte reward à ajouter au pool
}
```

**Impact sur l'architecture :**

| Avant | Après |
|---|---|
| Gate lexique = `moduleGate` dans TopicDefinition | Gate lexique = `entry.palier` vs `currentHeatLevel` |
| Rarity carte = à définir dans TopicDefinition | Rarity carte = `entry.rarity` directement |
| Phase 0 = mapper cardId spécifiques | Phase 0 simplifiée — rarity connue, cardId résolu au tirage |

**Modèle de pool simplifié :**
Au lieu de stocker des `cardId` spécifiques dans le pool, on stocke `{ rarity, sourceTermId }`.
`drawFromPool()` tire aléatoirement parmi les cartes Deck B non possédées de la bonne rarity.
→ Phase 0 ne bloque plus Phase 3.

---

## Séparation des états — 3 concepts distincts

| Concept | Store | Signification |
|---|---|---|
| Topic **disponible** | `moduleProgressStore` | Le module gate est complété |
| Terme lexique **débloqué** | `lexiqueStore.unlockedIds` | Le mot a été consulté/ouvert |
| Préférence **donnée** | `preferencesStore.answers` | L'utilisateur a répondu à la question |

Ces trois états sont indépendants. Un topic peut être disponible sans que son terme soit débloqué.

---

## Phase 0 — Audit contenu & IDs (prérequis tout le reste)

Avant d'écrire une ligne de code :

1. **Vérifier les vrais IDs lexique** — `lex-001`…`lex-020` dans `lexiqueConsent.ts` :
   mapper chaque ID à son terme réel (actuellement les IDs sont opaques)

2. **Décider les cartes Deck B** — `cb-001` est aujourd'hui le seul, "À venir".
   Créer les cartes pratiques explicites dans `cards-collector.ts` (IDs `cb-002`…)
   ou décider que Phase 0 = `cardIds: []` partout jusqu'à ce que Deck B soit prêt

3. **Ne mapper que des IDs existants** dans le registre — zéro IDs inventés

**Livrable** : table de mapping `lex-xxx → terme réel → topicId → cardId réel` validée.

---

## Phase 1 — topicRegistry : données + API interne

### `app/data/topicRegistry.ts` (nouveau)

```ts
import type { EffectiveModuleId } from '../modules';

export type TopicId = string;

export type PreferenceAnswer =
  | 'curious'           // Curieux·se
  | 'comfortable'       // À l'aise
  | 'not-for-me'        // Pas pour moi
  | 'want-to-explore'   // Je veux explorer
  | 'no-comment';       // Je préfère ne pas répondre

export const POSITIVE_ANSWERS: ReadonlySet<PreferenceAnswer> = new Set([
  'curious', 'comfortable', 'want-to-explore',
]);

export interface TopicDefinition {
  id: TopicId;
  moduleGate: EffectiveModuleId;
  lexiqueTermId?: string;
  cardIds: string[];           // IDs existants dans collectorCards — [] jusqu'à Deck B prêt
  hasPreferenceQuestion: boolean;
  heatOnPreference: number;
}

export const TOPIC_REGISTRY: TopicDefinition[] = [
  // ── Pratiques de base (gate: pratiques-base) ──────────────────────────
  { id: 'topic-fellation',             moduleGate: 'pratiques-base', lexiqueTermId: 'lex-XXX', cardIds: [], hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-cunnilingus',           moduleGate: 'pratiques-base', lexiqueTermId: 'lex-XXX', cardIds: [], hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-masturbation-mutuelle', moduleGate: 'pratiques-base', lexiqueTermId: 'lex-XXX', cardIds: [], hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-penetration',           moduleGate: 'pratiques-base', lexiqueTermId: 'lex-XXX', cardIds: [], hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-sodomie',               moduleGate: 'pratiques-base', lexiqueTermId: 'lex-XXX', cardIds: [], hasPreferenceQuestion: true,  heatOnPreference: 1 },

  // ── Termes fondamentaux (gate: quiz-consentement) ─────────────────────
  { id: 'topic-lex-001', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-001', cardIds: [], hasPreferenceQuestion: false, heatOnPreference: 0 },
  // ... à compléter après Phase 0
];

// ── API interne — les écrans et stores n'accèdent PAS au tableau directement ──

export function getTopicById(id: TopicId): TopicDefinition | undefined {
  return _byId[id];
}

export function getTopicByLexiqueTermId(termId: string): TopicDefinition | undefined {
  return _byLexiqueTermId[termId];
}

export function getTopicsByModuleGate(moduleId: string): TopicDefinition[] {
  return _byModuleGate[moduleId] ?? [];
}

export function getUnlockedTopics(completedModules: string[]): TopicDefinition[] {
  const set = new Set(completedModules);
  return TOPIC_REGISTRY.filter((t) => set.has(t.moduleGate));
}

// ── Index privés (build-time, zéro coût runtime) ─────────────────────────

const _byId: Record<TopicId, TopicDefinition> =
  Object.fromEntries(TOPIC_REGISTRY.map((t) => [t.id, t]));

const _byLexiqueTermId: Record<string, TopicDefinition> =
  Object.fromEntries(
    TOPIC_REGISTRY.filter((t) => t.lexiqueTermId)
      .map((t) => [t.lexiqueTermId!, t])
  );

const _byModuleGate: Record<string, TopicDefinition[]> =
  TOPIC_REGISTRY.reduce<Record<string, TopicDefinition[]>>((acc, t) => {
    (acc[t.moduleGate] ??= []).push(t);
    return acc;
  }, {});
```

### `app/lib/useAvailableTopics.ts` (nouveau)

```ts
'use client';
import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { getUnlockedTopics } from '../data/topicRegistry';
import type { TopicDefinition } from '../data/topicRegistry';

// "Disponible" = module gate complété
// ≠ "débloqué" (lexiqueStore) ≠ "répondu" (preferencesStore)
export function useAvailableTopics(): TopicDefinition[] {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  return useMemo(() => getUnlockedTopics(completedModules), [completedModules]);
}
```

**Livrable Phase 1** : registre typé, API encapsulée, hook nommé correctement. Rien ne casse.

---

## Backend — Architecture de stockage (màj 2026-05-14)

Le backend adopte le pattern **Zustand persist + `sqliteStorage` adapter** :

```ts
// Tous les stores :
persist(fn, {
  name: STORAGE_KEYS.XXX,
  storage: () => sqliteStorage,  // ← remplace localStorage
})
```

`app/lib/storage.ts` = le seul point de contact avec le backend SQLite.
Les stores ne changent pas leur API — seul le moteur de persistance change.

**Stores à migrer vers `sqliteStorage` :**
- `unlockStore` ✅ migré
- `lexiqueStore` ✅ migré
- `moduleProgressStore` 🔲
- `profileStore` 🔲
- `authStore` 🔲
- `preferencesStore` 🔲 (à créer directement avec sqliteStorage)

**Impact sur le moteur topics :**
- Les fonctions métier (`unlockLexiqueTerm`, `completeGameSession`) appellent `.getState()` sur les stores → fonctionnent identiquement que le storage soit SQLite ou localStorage
- Ces fonctions sont les points naturels pour de futures mutations API REST si le backend évolue au-delà de SQLite local

---

## Phase 2 — Nouveaux stores

### `app/stores/storageKeys.ts`
```ts
PREFERENCES: 'consentement-preferences',
// Pas de clé séparée pour le pool — il reste dans UNLOCKS
```

### `app/stores/preferencesStore.ts` (nouveau, persist v1)

```ts
interface PreferencesStore {
  answers: Record<TopicId, PreferenceAnswer>;
  answer: (topicId: TopicId, value: PreferenceAnswer) => void;
  getAnswer: (topicId: TopicId) => PreferenceAnswer | undefined;
  reset: () => void;
}
```

### `app/stores/unlockStore.ts` — version 2

Grâce à `LexiqueEntry.rarity`, le pool n'a pas besoin d'un `cardId` spécifique.
La carte concrète est résolue au tirage parmi les Deck B non possédées de la bonne rarity.

Nouveaux types :
```ts
interface PoolEntry {
  rarity: Rarity;         // connu dès l'unlock (entry.rarity)
  sourceTermId: string;   // lex-xxx — traçabilité
  addedOn: string;        // ISO
}
```

Nouvelles actions :
```ts
unlockablePool: PoolEntry[]
addToPool: (entry: Omit<PoolEntry, 'addedOn'>) => void  // ignore si sourceTermId déjà présent
drawFromPool: () => OwnedCard | null
// drawFromPool :
//   1. pool vide → null
//   2. tirage aléatoire dans pool
//   3. trouve une carte Deck B non possédée avec entry.rarity
//   4. crée OwnedCard, push ownedCards, retire du pool, return
//   5. si aucune carte Deck B dispo pour cette rarity → retire du pool sans récompense
```

Migration douce (sqliteStorage déjà wired) :
```ts
{ name: STORAGE_KEYS.UNLOCKS, version: 2, migrate: (s) => ({ ...s, unlockablePool: [] }), storage: () => sqliteStorage }
```

**Livrable Phase 2** : stores opérationnels, comportement prod intact.

---

## Phase 3 — Fonction métier `unlockLexiqueTerm()`

### `app/lib/unlockLexiqueTerm.ts` (nouveau)

Utilise `entry.palier` pour le gate et `entry.rarity` pour la récompense.
Les stores ne se connaissent pas entre eux.

```ts
import { useLexiqueStore } from '../stores/lexiqueStore';
import { useUnlockStore } from '../stores/unlockStore';
import { lexiqueConsentEntries } from '../data/lexiqueConsent';
import type { HeatLevel } from '../lib/heatLevel';

export function unlockLexiqueTerm(termId: string, currentHeatLevel: HeatLevel): boolean {
  const entry = lexiqueConsentEntries.find((e) => e.id === termId);
  if (!entry) return false;

  // Gate : palier lexique vs palier heat actuel
  if (currentHeatLevel < entry.palier) return false;

  const { unlockedIds, unlock } = useLexiqueStore.getState();
  if (unlockedIds.includes(termId)) return false;

  unlock(termId);

  // Récompense : rarity connue depuis l'entrée, cardId résolu au tirage
  useUnlockStore.getState().addToPool({ rarity: entry.rarity, sourceTermId: termId });

  return true; // succès — l'écran peut afficher le feedback
}
```

`LexiqueScreen` appelle `unlockLexiqueTerm(entry.id, currentHeatLevel)`.
Retourne `false` silencieusement si le palier n'est pas atteint (guard dans le handler).

**Livrable Phase 3** : découplage stores, point d'entrée unique pour l'unlock.

---

## Phase 4 — LexiqueScreen gated par `entry.palier`

`LexiqueScreen` reçoit `currentHeatLevel` depuis `useHeat()`.

Pour chaque entrée :
- `currentHeatLevel >= entry.palier` → débloquable, `unlockLexiqueTerm(id, heatLevel)`
- `currentHeatLevel < entry.palier` → visible + indicateur "Palier [X] requis 🔥" + handler bloqué

Plus besoin de `useAvailableTopics()` pour le lexique — le gate est `entry.palier` directement.
`useAvailableTopics()` reste utile pour `MoiScreen` (gate par module complété).

**Livrable Phase 4** : lexique gaté proprement, UX non dégradée.

---

## Phase 5 — Heat preferences + MoiScreen progressif

### `app/lib/heatLevel.ts`

```ts
// HeatInput :
preferencesAnswered?: number;  // nb de réponses dans preferencesStore

// HeatBreakdown — champ SÉPARÉ :
export interface HeatBreakdown {
  modules: number;
  cards: number;
  sessions: number;
  profile: number;
  preferences: number;  // nouveau — pas mélangé à profile
}

// Total : modules + cards + sessions + profile + preferences
```

### `app/components/screens/MoiScreen.tsx`
Sections progressives groupées par `moduleGate` :
- Module complété → section ouverte avec questions topics
- Module non complété → section "À venir" en bas, visible, lockée
- Réponse existante = bouton highlighted, re-tapable

### i18n — questions et labels réponses par topic

**Livrable Phase 5** : Moi grandit avec le parcours. Réponses = +1 pt heat chacune.

---

## Phase 6 — `completeGameSession()` partagé

### `app/lib/completeGameSession.ts` (nouveau)

```ts
import { useUnlockStore } from '../stores/unlockStore';
import type { OwnedCard } from '../stores/unlockStore';

export type GameSource = 'dice' | 'goose' | 'card';

export interface SessionResult {
  gainedCard: OwnedCard | null;
}

export function completeGameSession(source: GameSource): SessionResult {
  const store = useUnlockStore.getState();
  store.incrementSessionCount();

  const drawnCard = store.drawFromPool(); // pool-first
  // Si pool vide → gainedCard null → les écrans font leur fallback actuel

  return { gainedCard: drawnCard };
}
```

`DiceGameScreen`, `GooseGameScreen`, `CardGameScreen` — fin de session :
```ts
const { gainedCard } = completeGameSession('dice');
if (gainedCard) { /* afficher carte → hall-of-cards */ }
else { /* fallback computeGainedCards actuel */ }
```

**Livrable Phase 6** : règle partagée, DRY, pool-first garanti partout.

---

## Phase 7 — Duo-flow intersection

> Dépend d'une décision d'architecture sur le transport duo.
> Duo actuel = local/mocké (`useDuoSession.ts` génère un `partnerProfile`).
> Intersection réelle = partager `preferencesStore.answers` entre deux appareils.

**Règle** : révéler seulement les topics où les deux ont une réponse dans `POSITIVE_ANSWERS`.
**À concevoir** : QR code ? code partagé ? BLE local ? → décision séparée.

---

## Ordre d'exécution

```
Phase 0 (audit IDs) ──────────────────────────── prérequis tout le reste
Phase 1 (topicRegistry + API) ────────────────── peut commencer dès maintenant
Phase 2 (stores) ─────────────────────────────── peut commencer dès maintenant
         ↓
Phase 3 (unlockLexiqueTerm) ──────────────────── nécessite 1 + 2
Phase 4 (LexiqueScreen gated) ────────────────── nécessite 1 + 3
Phase 5 (Heat + Moi) ─────────────────────────── nécessite 1 + 2
Phase 6 (completeGameSession) ────────────────── nécessite 2
         ↓
Phase 7 (Duo intersection) ───────────────────── nécessite 5 + décision transport
```

---

## Ce qui NE change pas

- `ownedCards` = source de vérité CardGame + Hall of Cards
- Deck starter 24 cartes (`module-de-base`) donné directement
- Carte de complétion de module via `computeModuleGain` — inchangée
- Heat existant (modules + cards + sessions + profile) — on ajoute `preferences`, rien retiré
