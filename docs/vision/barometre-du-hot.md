# Baromètre du Hot — Spec technique

> Dernier état : 2026-05-14 · Statut : **implémenté V2.0**

---

## Concept

Le Baromètre du Hot est le système nerveux de progression globale de l'app. Il remplace la lecture sèche `ownedCards + completedModules` par une métaphore thermique émotionnellement engageante. Plus l'utilisateur apprend et joue, plus son baromètre monte — et plus des contenus avancés se débloquent.

---

## 5 Paliers

| # | Nom | Seuil (pts) | Ce qui se débloque |
|---|-----|-------------|-------------------|
| 1 | 🔵 Tiède | 0 | Contenu de base (état par défaut) |
| 2 | 🟡 Chaud | 12 | Contenu explicite + Quiz Intermédiaire |
| 3 | 🟠 Ardent | 40 | Mode Scénario (V2) |
| 4 | 🔴 Brûlant | 80 | Gamme Kamasutra + Quiz Expert (V2) |
| 5 | ⚪ Incandescent | 130 | Cartes Expert (V2) |

> **Palier 2 atteignable en 1 soirée** — module-de-base complet (27 pts dual-reward) dépasse déjà le seuil de 12 pts.  
> Palier 3 requiert un engagement multi-sessions.

---

## Système de points — design dual-reward

### Principe dual-reward (intentionnel)

Compléter un module récompense **deux choses distinctes** :
1. **MODULE_POINTS[moduleId]** — l'apprentissage lui-même
2. **CARD_POINTS × cartes gagnées** — la collection débloquée

Les deux stores (`moduleProgressStore` et `unlockStore`) sont indépendants. Ce n'est pas du double-comptage.

**Exemple module-de-base** : 3 pts module + 24 cartes common × 1 pt = **27 pts** → palier 2 atteint dès la première complétion.

### Modules éducatifs

| Module | Palier difficulté | Points module | Total max (avec cartes) |
|--------|-------------------|---------------|------------------------|
| `module-de-base` / `-mineur` | intro | 3 | 27 pts (24 common) |
| `porno-vs-realite` / `-mineur` | easy | 2 | 3 pts (1 common) |
| `quiz-consentement` / `-mineur` | easy | 2 | 3 pts (1 common) |
| `loi-consentement` / `-mineur` | medium | 5 | 7 pts (1 rare) |
| `duo-flow` | medium | 5 | 7 pts (1 rare) |
| `accompagnement-mineur` | medium | 5 | 7 pts (1 rare) |
| `module-pratiques-adultes` | hard | 10 | 15 pts (1 unique) |
| `quiz-d1/d2/d3` | easy | 2 | 3 pts chacun |
| `quiz-i1/i2/i3` | medium | 4 | 6 pts chacun |
| `quiz-e1/e2/e3` | hard | 8 | 13 pts chacun |

### Cartes possédées

| Rareté | Points par carte |
|--------|-----------------|
| common | 1 |
| rare | 2 |
| unique | 5 |

### Séances de jeu

- **CardGame** : 1 pt par séance complète (bouton "Quitter")
- **GooseGame** : 1 pt par partie (arrivée case 23)
- **DiceGame** : 1 pt par session (bouton "Quitter" après au moins 1 lancer)

Constante : `SESSION_POINT_VALUE = 1` dans `heatLevel.ts`.

### Profil utilisateur

| Action | Points |
|--------|--------|
| Catégorie confort renseignée (tendresse / intensité / confiance) | +1 pt chacune (max 3 pts) |
| Mot de sécurité (safeword) défini | +3 pts |
| Pronoms renseignés | +2 pts |

Bonus profil maximum : **8 pts** — accélère significativement le palier 2.

### Lexique

+1 pt par mot débloqué (`lexiqueStore.unlockedIds`). Intégré en V2.0 via `useLexiqueStore`.

---

## Architecture technique

### Fichiers clés

| Fichier | Rôle |
|---------|------|
| `app/lib/heatLevel.ts` | Logique pure : constantes, calcul de points, seuils |
| `app/lib/heatGate.ts` | Gate des fonctionnalités par palier |
| `app/lib/useHeatLevel.ts` | Hook React : lit les stores, calcule l'état |
| `app/context/HeatContext.tsx` | Provider React + `useHeat()` |
| `app/lib/usePalierUp.ts` | Détecte les franchissements de palier |
| `app/components/ui/HeatThermometer.tsx` | Visualisation thermomètre |

### Logique pure — `app/lib/heatLevel.ts`

```typescript
// Types
export type HeatLevel = 1 | 2 | 3 | 4 | 5;
export interface HeatInput { completedModules, ownedCards, sessionCount, profileComfortCategories?, safewordDefined?, pronounsDefined?, lexiqueWords? }
export interface HeatBreakdown { modules: number; cards: number; sessions: number; profile: number; }

// Constantes exportées
export const MODULE_POINTS: Partial<Record<EffectiveModuleId, number>>
export const CARD_POINTS: Record<OwnedCard['rarity'], number>
export const SESSION_POINT_VALUE = 1
export const HEAT_THRESHOLDS: Record<HeatLevel, number>

// Fonctions
computeHeatBreakdown(input: HeatInput): HeatBreakdown
computeHeatPoints(input: HeatInput): number
getHeatLevel(points: number): HeatLevel
getHeatLevelFromInput(input: HeatInput): HeatLevel
pointsToNextLevel(points: number): number | null
heatLevelProgress(points: number): number   // 0–1 (% dans le palier)
```

### Gate des fonctionnalités — `app/lib/heatGate.ts`

```typescript
export type HeatGatedFeature =
  | 'explicit'            // palier 2
  | 'quiz-intermediaire'  // palier 2
  | 'scenarios'           // palier 3 (V2)
  | 'kamasutra'           // palier 4 (V2)
  | 'quiz-expert'         // palier 4
  | 'expert-cards';       // palier 5 (V2)

export const GATE_THRESHOLDS: Record<HeatGatedFeature, HeatLevel>
export function isHeatUnlocked(feature, level): boolean
export function requiredLevel(feature): HeatLevel
```

### Sources de données

| Donnée | Store | Clé localStorage |
|--------|-------|-----------------|
| `completedModules` | `moduleProgressStore` | `consentement-modules` |
| `ownedCards` | `unlockStore` | `consentement-unlocks` |
| `sessionCount` | `unlockStore` | `consentement-unlocks` |
| `personalProfile` (tendresse/intensité/confiance/safeword) | `profileStore` | `consentement-profile` |
| `pronouns` | `authStore` | `consentement-auth` |
| `unlockedIds` (lexique) | `lexiqueStore` | `consentement-lexique` |

> Le niveau de chaleur est **dérivé** — pas de store séparé. Calculé une seule fois dans `HeatProvider`.

### État exposé — `HeatState`

```typescript
interface HeatState {
  points: number;           // total brut
  level: HeatLevel;         // 1–5
  progress: number;         // 0–1 dans le palier actuel
  toNext: number | null;    // pts manquants pour le suivant
  breakdown: HeatBreakdown; // { modules, cards, sessions, profile }
  profileDetails: {         // évite la re-lecture des stores dans les composants
    comfortFilled: number;  // 0–3
    safewordSet: boolean;
    pronounsSet: boolean;
  };
}
```

---

## Visualisation — HeatThermometer

`app/components/ui/HeatThermometer.tsx`

- **Thermomètre vertical** : tube 18×96px + bulbe 28px
- **Fill animé** bottom → top via Framer Motion v11 (`DURATION.medium`, `EASING.standard`)
- **Couleur par palier** : bleu → amber → orange → rouge → or+shimmer (Incandescent)
- **Props** : `{ points: number; compact?: boolean; sidebar?: boolean }`
- **compact** : version réduite (utilisée dans `PalierUpOverlay`)
- **sidebar** : bande 40px pleine hauteur, visible sur tous les écrans hors jeux/modules/settings
- **prefers-reduced-motion** : animation désactivée, hauteur statique
- **ARIA** : `role="meter"`, `aria-valuenow`, `aria-valuemin/max`

### Couleurs fixes (indépendantes du thème)

| Palier | Couleur | Hex |
|--------|---------|-----|
| Tiède | Bleu | `#60a5fa` |
| Chaud | Amber | `#f59e0b` |
| Ardent | Orange | `#f97316` |
| Brûlant | Rouge | `#ef4444` |
| Incandescent | Or + shimmer | `#fbbf24 → #ffffff` |

---

## Intégration globale

### HeatContext
`app/context/HeatContext.tsx` — expose `useHeat()` via React Context.  
`HeatProvider` est monté dans `AppProviders` (root) — calculé une seule fois pour toute l'app.

```typescript
const { points, level, progress, toNext, breakdown, profileDetails } = useHeat();
```

### Sidebar thermomètre (AppShell)
Bande 40px à droite, animée via `AnimatePresence` — visible sur tous les onglets sauf Settings.
Cache automatiquement pendant les jeux et modules (détecté via `showTabBar`).

### PalierUpOverlay
Célébration plein écran déclenchée par `usePalierUp(level)` dans `AppShell`.
S'affiche une seule fois par palier franchi (état `justUnlocked` remis à zéro après dismiss).

### HomeScreen
`HeatBar` : sous-composant qui lit `useHeat()` et rend `<HeatThermometer compact />`.
`HeatGatedExplicitMode` : remplace `<ExplicitModeToggle>` pour les adultes.
- Palier >= 2 → affiche le toggle normal
- Palier 1 → affiche un placeholder verrouillé avec pts manquants

### MoiScreen
- Affiche le thermomètre + breakdown sources (📚 Modules · 🃏 Cartes · 🎲 Séances · 👤 Profil)
- Nudges profil (badges orange) pour les bonus non encore réclamés — safeword / pronoms / catégories confort

### FlipRevealOverlay
- Badge "+Xpts 🌡️" dans le header — total pour le batch ou pts de la carte courante
- Importé depuis `CARD_POINTS` de `heatLevel.ts`

---

## Tests

| Fichier | Cas | Couverture |
|---------|-----|-----------|
| `app/lib/heatLevel.test.ts` | 49+ | Points, seuils, dual-reward, constantes |
| `app/lib/heatGate.test.ts` | 33 | Toutes features × tous paliers, GATE_THRESHOLDS |
| `app/lib/usePalierUp.test.ts` | 9 | Franchissements, clear(), stabilité référence |
| `app/lib/heatIntegration.test.ts` | 12 | Chain complète avec données réelles collectorCards |
| **Total** | **~103** | — |

---

## Roadmap gates V2

| Palier | Gate | Écran | Priorité |
|--------|------|-------|---------|
| 3 — Ardent | Mode Scénario | à créer | Sprint 20+ |
| 4 — Brûlant | Gamme Kamasutra | à créer | Sprint 25+ |
| 4 — Brûlant | Quiz Expert | `apprendre` | Sprint 20+ |
| 5 — Incandescent | Cartes Expert (depth 3) | `hall-of-cards` | Sprint 25+ |

---

## Test manuel

1. Lancer l'app sur simulateur iOS ou web
2. Compléter `module-de-base` → baromètre monte (27 pts dual-reward), palier 2 atteint
3. Vérifier que le contenu explicite est débloqué (toggle visible dans Home)
4. Définir un safeword dans Moi → +3pts immédiat, badge nudge disparaît
5. Renseigner les pronoms dans le profil → +2pts, badge nudge disparaît
6. Renseigner les 3 catégories de confort → +1pt chacune (max 3), badges disparaissent
7. Vérifier le breakdown affiché dans Moi : 📚 / 🃏 / 🎲 / 👤 avec les bons totaux
8. Vérifier l'animation du fill thermomètre (bottom → top) dans la sidebar
9. Switcher de thème → fond et texte s'adaptent, couleurs fill restent fixes
10. Activer `prefers-reduced-motion` → fill statique sans animation
11. Jouer au DiceGame, quitter → `sessionCount` incrémenté
12. Finir une partie GooseGame (case 23) → `sessionCount` +1
13. Franchir un palier → `PalierUpOverlay` s'affiche, dismiss → ne réapparaît plus
14. FlipRevealOverlay → badge "+Xpts 🌡️" visible avec pts corrects selon rareté

### Vérification localStorage
```
consentement-profile  → personalProfile.safeword / tenderness / intensity / trust
consentement-auth     → pronouns
consentement-unlocks  → sessionCount, ownedCards
consentement-modules  → completedModules
consentement-lexique  → unlockedIds (lexique)
```
