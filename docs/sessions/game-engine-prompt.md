# Prompt — Session : moteur de jeu générique

## Contexte projet

Application Next.js 14 / React 18 / TypeScript / Tailwind CSS.
Framer Motion pour les animations. Pas de backend — tout en localStorage.

Dossier de travail : `app/`

---

## Ce qui existe déjà

### Données

**`app/data/index.ts`** — données du jeu de dé du Consentement :
```typescript
export type AgeGate = 'all' | 'adult' | 'premium';

export const DICE_CATEGORIES: Record<number, { name, emoji, gradient, border }> = {
  1: { name: 'Osez',    emoji: '🎭', gradient: '...amber...', border: '...' },
  2: { name: 'Parlez',  emoji: '💬', gradient: '...violet...', border: '...' },
  3: { name: 'Et si…',  emoji: '🤔', gradient: '...rose...', border: '...' },
  4: { name: 'Défi',    emoji: '🎯', gradient: '...bleu...', border: '...' },
  5: { name: 'Vérité',  emoji: '✨', gradient: '...vert...', border: '...' },
  6: { name: 'Douceur', emoji: '❤️', gradient: '...bordeaux...', border: '...' },
};

export interface DiePractice {
  id: string;
  face: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  ageGate: AgeGate;
}
// + diePractices: DiePractice[] (36 items)
// + cardData: CardData[] (84 items, face = 1|2|3|4|5|6)
```

**`app/data/goose-game.ts`** — données du Jeu de l'Oie :
```typescript
export interface BoardSquare { index: number; type: SquareType; face?: 1|2|3|4|5|6; }
export const BOARD: BoardSquare[]         // 24 cases
export const BOARD_LAYOUT: number[][]    // serpentin 6×4
export const PAUSE_ACTIVITIES, ACCORD_ACTIVITIES  // pools de 12 items chacun
export function pickNoRepeat<T extends {id:string}>(pool, usedIds: Set<string>): T
export function getBoardActivitiesForFace(face, isAdult): DiePractice[]
export function saveGame / loadSavedGame / clearSavedGame(...)
```

### Composants UI existants

**`app/components/ui/Dice3D.tsx`**
```typescript
interface Dice3DProps {
  targetFace: 1 | 2 | 3 | 4 | 5 | 6;
  isRolling: boolean;
  onRollComplete: () => void;
}
// Cube CSS 3D pur. Les 6 faces sont hard-codées avec DICE_CATEGORIES du consentement.
// RÈGLE CRITIQUE : ne jamais mettre filter CSS sur l'élément preserve-3d (aplatit le cube).
```

### Hooks génériques déjà créés (dans GooseGameScreen)

Ces hooks sont dans `app/components/screens/GooseGameScreen/hooks/` — ils sont réutilisables :

**`useDice.ts`** :
```typescript
function useDice(onLanded: (face: 1|2|3|4|5|6) => void) {
  // → { diceResult, isRolling, roll, handleRollComplete }
  // Gère le tirage, l'anti-stale-closure via ref, la vibration haptique
}
```

**`usePawnAnimation.ts`** :
```typescript
function usePawnAnimation() {
  // → { animatingPos, animate(from, to, onDone) }
  // Déplace un pion case par case à 210ms/case avec vibration tactile
}
```

**`useConfetti.ts`** :
```typescript
function useConfetti() {
  // → { show, key, trigger }
  // 18 particules emoji, burst animé Framer Motion
}
```

**`utils.ts`** :
```typescript
function vibrate(pattern: number | number[]) // progressive enhancement
const ZONE_BG: string[]  // 3 gradients pour zones narratives
```

### Écrans de jeu existants

- **`DiceGameScreen.tsx`** (519 lignes) — monolithe, jeu de dé du consentement
- **`CardGameScreen.tsx`** (519 lignes) — monolithe, jeu de cartes du consentement
- **`GooseGameScreen/`** (modulaire, découpé en 18 fichiers) — jeu de l'oie

---

## Objectif de la session

Créer un **moteur de jeu générique** dans `app/game-engine/` avec 3 primitives configurables.

L'idée centrale : les mécaniques (dé, cartes, plateau) sont séparées du contenu (thèmes, textes, couleurs). N'importe quelle app peut configurer et réutiliser ces primitives sans recoder la logique.

---

## Ce qu'il faut construire

### 1. Dé configurable — `app/game-engine/dice/`

**Interface de configuration :**
```typescript
// app/game-engine/dice/types.ts

export interface DiceFace {
  id: number;          // 1–N (pas limité à 6)
  label: string;       // nom affiché
  emoji: string;
  gradient: string;    // CSS gradient pour la face
  border: string;      // couleur de bordure
  color: string;       // couleur d'accent (texte, badge)
}

export interface DiceConfig {
  faces: DiceFace[];              // 4, 6, 8, 12 faces — la lib gère
  size?: number;                  // px, default 100
  animationDuration?: number;     // ms, default 1700
}

export interface DiceItem {
  id: string;
  faceId: number;      // associé à une face du dé
  text: string;
  tags?: string[];     // pour filtrage (ex: ageGate)
}
```

**Hook :**
```typescript
// app/game-engine/dice/useDiceEngine.ts

function useDiceEngine(config: DiceConfig, items: DiceItem[], filter?: (item: DiceItem) => boolean) {
  // Étend useDice.ts existant
  // Gère : tirage de face aléatoire, pioche d'item dans la face tirée, anti-répétition
  // Retourne : { currentFace, currentItem, isRolling, roll, onRollComplete, history }
}
```

**Composant rendu :**
```typescript
// app/game-engine/dice/DiceRenderer.tsx

// Wrapper autour de Dice3D.tsx existant — mais les styles de faces viennent de DiceConfig
// Si faces.length !== 6 : adapter géométriquement (ou fallback visuel)
// Pour 6 faces : réutilise exactement Dice3D avec les couleurs de la config
```

**Compatibilité ascendante :**
Le dé du Consentement existant doit pouvoir s'exprimer comme :
```typescript
const CONSENTEMENT_DICE_CONFIG: DiceConfig = {
  faces: Object.values(DICE_CATEGORIES).map((c, i) => ({
    id: i + 1, label: c.name, emoji: c.emoji,
    gradient: c.gradient, border: c.border, color: '...',
  })),
};
```

---

### 2. Cartes configurables — `app/game-engine/cards/`

**Interface de configuration :**
```typescript
// app/game-engine/cards/types.ts

export interface CardConfig {
  id: string;
  label: string;       // nom du paquet
  emoji: string;
  gradient: string;    // gradient de la face avant
  backGradient: string; // gradient du dos de la carte
  color: string;       // couleur d'accent
}

export interface Card {
  id: string;
  deckId: string;      // référence CardConfig.id
  text: string;
  tags?: string[];
  depth?: 1 | 2 | 3;  // profondeur émotionnelle (icebreaker → intime)
}

export interface CardEngineConfig {
  decks: CardConfig[];
  shuffleOnDeal?: boolean;          // default true
  allowFavorites?: boolean;         // default false
  favoritesStorageKey?: string;     // clé localStorage
  historySize?: number;             // nombre de cartes gardées en historique
}
```

**Hook :**
```typescript
// app/game-engine/cards/useCardEngine.ts

function useCardEngine(config: CardEngineConfig, cards: Card[], filter?: (card: Card) => boolean) {
  // Gère : sélection de paquet, tirage, shuffle, historique, favoris
  // Retourne : {
  //   availableDecks, selectedDeckId, selectDeck,
  //   currentCard, drawCard, remaining,
  //   history, favorites, toggleFavorite,
  //   reset,
  // }
}
```

**Composant rendu :**
```typescript
// app/game-engine/cards/CardRenderer.tsx

// Carte avec flip animation (dos → face)
// Props : card, deckConfig, isRevealed, onReveal
// Le dos utilise backGradient, la face utilise gradient + texte
// Animation Framer Motion : rotateY 0→180deg
```

---

### 3. Plateau configurable — `app/game-engine/board/`

**Interface de configuration :**
```typescript
// app/game-engine/board/types.ts

export type SquareKind = 'normal' | 'start' | 'end' | 'special';

export interface SquareConfig {
  id: string;
  kind: SquareKind;
  label: string;
  emoji: string;
  gradient: string;        // couleur de la case
  // Comportement déclenchable quand un joueur arrive :
  action?: 'activity' | 'bonus-move' | 'vote' | 'forced' | 'end';
  bonusMoves?: number;     // pour action: 'bonus-move'
  pool?: string;           // id du pool d'activités à piocher
}

export interface BoardLayout {
  columns: number;         // ex: 4
  snake: boolean;          // true = serpentin
}

export interface BoardSquareInstance {
  index: number;           // position 0-based
  configId: string;        // référence SquareConfig.id
  faceId?: number;         // pour les cases normales avec dé
}

export interface BoardConfig {
  squares: BoardSquareInstance[];
  layout: BoardLayout;
  pawnEmojis: string[];
  maxPlayers?: number;     // default 2
  saveKey?: string;        // clé localStorage pour persistance
}

export interface ActivityPool {
  id: string;
  items: { id: string; text: string; tags?: string[] }[];
}
```

**Hook :**
```typescript
// app/game-engine/board/useBoardEngine.ts

function useBoardEngine(
  boardConfig: BoardConfig,
  squareConfigs: SquareConfig[],
  activityPools: ActivityPool[],
  options?: { filter?: (item: { tags?: string[] }) => boolean }
) {
  // Étend usePawnAnimation + logique Jeu de l'Oie
  // Gère : positions joueurs, déplacement, détection de case, anti-répétition
  // Retourne : {
  //   positions, currentPlayer, move(steps, onLanded),
  //   currentSquare, currentActivity,
  //   accordState, vote, revealAccord,
  //   save, load, clear,
  // }
}
```

**Composant rendu :**
```typescript
// app/game-engine/board/BoardRenderer.tsx

// Grille configurable (columns × rows, snake ou non)
// Réutilise la structure de Board.tsx du Jeu de l'Oie (Option B : flèches de direction)
// Props : boardConfig, squareConfigs, positions, pawns, activeSquare, isAnimating
```

---

## Architecture cible

```
app/game-engine/
  dice/
    types.ts
    useDiceEngine.ts      ← étend hooks/useDice.ts
    DiceRenderer.tsx      ← wrapper configurable de Dice3D.tsx
  cards/
    types.ts
    useCardEngine.ts
    CardRenderer.tsx
  board/
    types.ts
    useBoardEngine.ts     ← étend usePawnAnimation.ts
    BoardRenderer.tsx     ← étend components/Board.tsx
  shared/
    useAntiRepeat.ts      ← extrait de pickNoRepeat (déjà dans goose-game.ts)
    usePersist.ts         ← save/load/clear localStorage générique
    useHaptics.ts         ← extrait de vibrate() (déjà dans utils.ts)
```

---

## Contraintes techniques

- **TypeScript strict** — pas de `any`, interfaces complètes
- **Hooks React** — respecter les règles (ordre constant, pas de hooks conditionnels)
- **Anti-stale closure** — pattern `useRef` pour les callbacks async (voir useDice.ts existant)
- **Progressive enhancement** — vibrate(), pas d'erreur si indisponible
- **Pas de over-engineering** — ne pas construire ce qui n'est pas demandé dans ce prompt
- **Rétro-compatibilité** — les 3 écrans existants (DiceGameScreen, CardGameScreen, GooseGameScreen) ne doivent pas casser. On ne les refactorise pas dans cette session.

## Contrainte prioritaire

Commencer par `shared/` (useAntiRepeat, usePersist, useHaptics) — ce sont les fondations réutilisées par les 3 moteurs.

Ensuite dans l'ordre : `dice/` → `cards/` → `board/`.

Pour chaque moteur : types → hook → renderer.

Valider avec `tsc --noEmit` après chaque moteur.

---

## Vérification finale attendue

À la fin de la session, il doit être possible d'écrire ceci et que ça compile :

```typescript
// Exemple : dé à 4 faces pour un autre jeu
const MY_DICE: DiceConfig = {
  faces: [
    { id: 1, label: 'Curiosité', emoji: '🔍', gradient: '...', border: '...', color: '...' },
    { id: 2, label: 'Courage',   emoji: '🦁', gradient: '...', border: '...', color: '...' },
    { id: 3, label: 'Douceur',   emoji: '🌸', gradient: '...', border: '...', color: '...' },
    { id: 4, label: 'Vérité',    emoji: '💎', gradient: '...', border: '...', color: '...' },
  ],
};

const MY_ITEMS: DiceItem[] = [
  { id: 'i1', faceId: 1, text: 'Posez une question que vous n'osez jamais poser.' },
  { id: 'i2', faceId: 2, text: 'Dites quelque chose de difficile.' },
  // ...
];

function MyGame() {
  const dice = useDiceEngine(MY_DICE, MY_ITEMS);
  return <DiceRenderer config={MY_DICE} currentFace={dice.currentFace} isRolling={dice.isRolling} onRollComplete={dice.onRollComplete} />;
}
```
