# Méta-jeu — Roadmap d'intégration

> Créé : 23 avril 2026
> Légende : ✅ Fait · 🔄 En cours · 🔲 À faire

---

## Concept

Un seul système de jeu, plusieurs vitesses. Le plateau orchestre, les cartes fournissent le contenu, le dé modifie.

> **Carte = quoi faire · Dé A = à quel point · Dé B = comment**

---

## Architecture cible

```
[Sélection mode]
       ↓
[Plateau (GooseGame)] — orchestre
       ↓
[Cartes (depth filtré)] — contenu
       ↓         ↘
[Dé A intensity]  [Dé B style] — modificateurs
```

---

## 3 modes = compression du même jeu

Base : **24 cases réelles**. Les modes définissent un point de départ — pas un plateau virtuel différent.

| Paramètre | Quicky (10 min) | Fast (20 min) | Slow (45 min) |
|---|---|---|---|
| Départ (case réelle) | case 16 (Zone 3) | case 8 (Zone 2) | case 0 (Zone 1) |
| `maxDepth` cartes | 2 | 2 | 3 |
| Poids depth | 2 > 1 > 3 | 2 > 1 ≈ 3 | progressif par zone |
| Dés utilisés | 1 (A) + 20–30% Dé B | 1–2 | 2 systématique |
| Combos (case accord) | fréquents | standard | rares, tardifs |

> Pas de `projectPosition` ni d'étapes virtuelles — on avance sur le vrai plateau depuis un point de départ différent. Simple et sans complexité inutile.

---

## Mapping des cases (existantes → comportement cible)

| `SquareType` | Comportement actuel | Comportement cible |
|---|---|---|
| `normal` | `getBoardActivitiesForFace(face 1–6)` | `drawCard(phase, history)` |
| `chance` | lance le dé, avance de 2 | `rollDice()` → applique **immédiatement** + stocke pour la prochaine carte |
| `accord` | carte fixe + vote à deux | `drawCard()` + **Dé A obligatoire** + vote + Dé B en Slow |
| `complicite` | face 6 + confettis | 1 pouvoir parmi 3 : relancer 1 dé / ignorer modificateur / choisir entre 2 cartes |
| `pause` | activité pause | inchangé |
| `arrivee` | fin de partie | inchangé |

---

## Rôle des dés

### Dé A — Intensité
| Faces | Modificateur |
|---|---|
| 1–2 | léger |
| 3–4 | normal |
| 5–6 | intensifié |

### Dé B — Style
| Face | Modificateur |
|---|---|
| 1 | lent |
| 2 | rapide |
| 3 | silencieux |
| 4 | communicatif |
| 5 | joueur |
| 6 | créatif |

Les deux s'appliquent à une carte, jamais seuls. Les joueurs peuvent toujours relancer, ajuster, ou ignorer.

---

## Phases de la partie (dérivées de la position, pas du mode)

```ts
function getPhaseFromPosition(pos: number): 1 | 2 | 3 {
  if (pos <= 7)  return 1; // connexion
  if (pos <= 15) return 2; // montée
  return 3;                // climax
}
```

| Zone | Cases | Contenu | Dés |
|---|---|---|---|
| Zone 1 — connexion | 0–7 | depth 1 dominant | peu ou pas |
| Zone 2 — montée | 8–15 | depth 1–2 | Dé A |
| Zone 3 — climax | 16–23 | depth 2–3 | Dé A + B |

---

## Historique cartes (anti-répétition)

- **Court terme** : éviter les 5 dernières cartes jouées
- **Session** : éviter toutes les cartes déjà jouées dans la session en cours
- Fallback si pool épuisé : réautoriser les plus anciennes en premier

```ts
type CardHistory = {
  recent: string[];  // derniers 5 ids
  session: Set<string>; // tous les ids de la session
};
```

---

## Comportement `chance` (immédiat + différé)

```ts
case 'chance':
  const roll = rollDice();
  applyModifierToCurrent(roll);   // si une carte est en cours
  setPendingModifier(roll);        // s'applique aussi à la prochaine carte
```

---

## Modèle freemium

### Principe : limite sur le contenu, pas la fréquence

Ne jamais bloquer un couple qui veut jouer. La friction est sur la profondeur, pas sur le nombre de parties.

| | Gratuit | Premium (abonnement) |
|---|---|---|
| Jeu de l'oie | **Quicky uniquement** (depth 1) | Quicky + Fast + Slow |
| Contenu cartes | depth 1 seulement | depth 1 + 2 + 3 |
| Cartes gagnées | conservées à vie | deck complet dès le départ |
| Historique sessions | — | sauvegardé (localStorage → V3 cloud) |
| Thèmes | 1 thème de base | tous les thèmes premium |
| Contenu adulte explicite | — | oui (app adulte) |

> **Décision : Option B** — Le freemium accède au Quicky (depth 1, ~10 min) pour découvrir la mécanique. Fast et Slow sont verrouillés. Le Quicky gratuit est intentionnellement limité à depth 1 : connexion légère, pas d'intimité profonde — le cœur du jeu reste premium.

### Gain de cartes (engagement sans paywall)

Les cartes débloquées restent acquises même sans abonnement — c'est une récompense de jeu, pas un contournement du premium.

| Déclencheur | Récompense |
|---|---|
| 3 sessions complètes | +5 cartes depth 2 offertes |
| Case `complicite` atteinte | +1 carte rare depth 2 |
| Fin de partie Slow (premium) | +1 carte thématique depth 3 |

### Logique de filtrage (un seul check dans `drawCard`)

```ts
function drawCard(phase, history, isPremium, unlockedCards) {
  const pool = deck
    .filter(c => c.depth === 1
      || isPremium
      || unlockedCards.includes(c.id)
    )
    .filter(c => !history.session.has(c.id));

  // fallback si pool épuisé : réautoriser les plus anciennes
  if (pool.length === 0) return drawCardFallback(history);

  return weightedPick(pool, getWeights(phase));
}
```

### Stores localStorage

```ts
// Gratuit — persiste toujours
unlockedCards: string[]     // ids des cartes gagnées
sessionsPlayed: number

// Premium — actif si abonnement
isPremium: boolean
sessionHistory: SessionRecord[]  // historique intime (V2 local, V3 cloud)
```

---

## Roadmap d'implémentation

### Phase 1 — Données 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| Définir `DiceModifier` type (intensity + style) | `game-engine/dice/types.ts` | Ajouter aux types existants |
| Définir `SessionMode` type (quicky/fast/slow + startPos + params) | `game-engine/shared/types.ts` | |
| Définir `CardHistory` type | `game-engine/cards/types.ts` | |
| Définir `UnlockStore` (unlockedCards + sessionsPlayed) | `stores/unlockStore.ts` | localStorage, gratuit |
| Définir `SessionHistory` type + store | `stores/sessionHistoryStore.ts` | localStorage V2, cloud V3 — premium only |
| Migrer activités `face 1–6` → cartes avec `depth` + `tags` | `data/cards-goose.ts` | Nouveau deck dédié jeu de l'oie |
| Migrer `PAUSE_ACTIVITIES` + `ACCORD_ACTIVITIES` → cartes taggées | idem | Tags : `pause`, `accord` |

> Garder un **fallback temporaire** vers `getBoardActivitiesForFace` pendant la migration pour ne pas casser le jeu existant.

### Phase 2 — Moteur cartes dans useGooseGame 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| Ajouter `mode: SessionMode` en param de `useGooseGame` | `hooks/useGooseGame.ts` | |
| Remplacer `getBoardActivitiesForFace` par `drawCard(phase, history)` dans `case 'normal'` | `hooks/useGooseGame.ts` | Point d'entrée principal |
| Ajouter `pendingModifier` + `applyModifierToCurrent` | `hooks/useGooseGame.ts` | `chance` : immédiat + différé |
| Adapter `case 'accord'` : `drawCard()` + Dé A obligatoire | `hooks/useGooseGame.ts` | |
| `getPhaseFromPosition(pos)` dans `utils.ts` | `utils.ts` | |

### Phase 3 — Sélection de mode (UX) 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| Écran choix "10 / 20 / 45 min" | `phases/ModeSelectScreen.tsx` | Nouveau, inséré avant `IntroScreen` |
| Brancher `SessionMode` (+ `startPos`) sur le hook | `index.tsx` (GooseGameScreen) | Pions démarrent à la bonne case |

### Phase 4 — 2 dés visuels 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| Adapter `DiceConfig` pour un dé "style" (6 faces texte) | `game-engine/dice/types.ts` | |
| Afficher 2x `DiceRenderer` en parallèle sur les cases combo | `overlays/ChanceOverlay.tsx` | Dé A + Dé B côte à côte |
| `rollDice()` retourne `{ a: face, b: face }` | `hooks/useDice.ts` | |

### Phase 5 — UX consentement 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| Bouton Skip / Adapter **visible** sur chaque carte | `overlays/ActivityOverlay.tsx` | Pas caché dans un menu — cœur de la marque |
| 3 pouvoirs `complicite` : relancer / ignorer / choisir | `overlays/ActivityOverlay.tsx` | Pas plus de 3 |

### Phase 6 — Freemium + gain de cartes 🔲

| Tâche | Fichier cible | Notes |
|---|---|---|
| `unlockStore` — `unlockedCards[]` + `sessionsPlayed` | `stores/unlockStore.ts` | localStorage, toujours persisté |
| Filtrage `drawCard` par `isPremium` ou `unlockedCards` | `game-engine/cards/useCardEngine.ts` | Un seul check |
| Déclencheurs de gain : fin de session, `complicite` | `hooks/useGooseGame.ts` | +5 / +1 carte selon le déclencheur |
| Écran fin de partie — afficher les cartes gagnées | `phases/EndScreen.tsx` | Moment de récompense visible |
| `sessionHistoryStore` — log des sessions jouées | `stores/sessionHistoryStore.ts` | Premium only — V2 local, V3 cloud |
| Écran historique sessions (premium) | `screens/SessionHistoryScreen.tsx` | Liste des sessions avec date + mode |
| Gate modes Fast / Slow derrière `isPremium` | `phases/ModeSelectScreen.tsx` | Quicky toujours accessible — lock visuel sur Fast + Slow avec CTA premium |
| Retirer le lock global du jeu de l'oie dans `GamesHubScreen` | `screens/GamesHubScreen.tsx` | Le jeu devient accessible en gratuit (Quicky) — was: entièrement premium |

---

## Ce qui ne change pas

- Structure du plateau (24 cases, `BOARD` dans `goose-game.ts`)
- Animations pions, dé sur plateau R3F
- Flow accord à deux (votes secrets)
- Sauvegarde locale
- Phases `intro → setup → pacte → playing → end`
- Tests existants (25 tests — à mettre à jour après Phase 2)

---

## Dépendances

- Contenu cartes depth 1–3 : **à rédiger par le juriste** pour les niveaux 2 et 3
- Contenu `explicit` pour la variante app adulte : idem

---

## Prochaine action immédiate

> **Phase 1** : types (`SessionMode`, `DiceModifier`, `CardHistory`) + 10 cartes test (depth 1–3) + branchement `normal → drawCard`.
> Objectif : voir le jeu tourner avec le nouveau moteur en une session de dev.
