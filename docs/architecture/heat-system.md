# Heat System — Architecture technique

> Référence développeur · 2026-05-14

Ce document décrit le câblage interne du Baromètre du Hot. Pour la spec produit (paliers, UX, roadmap), voir [docs/vision/barometre-du-hot.md](../vision/barometre-du-hot.md).

---

## Flux de données

```
Stores Zustand (persisted)
  moduleProgressStore.completedModules
  unlockStore.ownedCards + sessionCount
  profileStore.personalProfile (safeword, tenderness, intensity, trust)
  authStore.pronouns
  lexiqueStore.unlockedIds
        │
        ▼
  useHeatLevel()              ← app/lib/useHeatLevel.ts
  (hook, memoïsé, monté 1×)
        │
        ▼
  HeatProvider                ← app/context/HeatContext.tsx
  (React Context, root)
        │
        ▼
  useHeat()                   ← n'importe quel composant
  → { points, level, progress, toNext, breakdown, profileDetails }
```

---

## Fichier map

| Fichier | Type | Rôle |
|---------|------|------|
| `app/lib/heatLevel.ts` | logique pure | Constantes, calcul de points, seuils |
| `app/lib/heatGate.ts` | logique pure | Gate features par niveau |
| `app/lib/useHeatLevel.ts` | hook React | Lit les 5 stores, calcule HeatState |
| `app/context/HeatContext.tsx` | context React | Provider + `useHeat()` |
| `app/lib/usePalierUp.ts` | hook React | Détecte les franchissements de palier |
| `app/components/ui/HeatThermometer.tsx` | composant UI | Visualisation thermomètre animé |

---

## API publique

### `useHeat()` — usage composants

```typescript
import { useHeat } from '../../context/HeatContext';

const { points, level, progress, toNext, breakdown, profileDetails } = useHeat();
```

N'importe quel composant sous `HeatProvider` peut l'appeler. Pas d'imports de stores directs nécessaires pour afficher ou réagir au niveau de chaleur.

### `HeatState`

```typescript
interface HeatState {
  points: number;           // total brut
  level: 1 | 2 | 3 | 4 | 5;
  progress: number;         // 0.0 → 1.0 dans le palier actuel
  toNext: number | null;    // pts manquants, null si palier 5
  breakdown: {
    modules: number;        // somme des MODULE_POINTS des modules complétés
    cards: number;          // somme des CARD_POINTS des cartes possédées
    sessions: number;       // sessionCount × SESSION_POINT_VALUE
    profile: number;        // safeword + pronoms + catégories confort + lexique
  };
  profileDetails: {
    comfortFilled: number;  // 0–3 catégories renseignées
    safewordSet: boolean;
    pronounsSet: boolean;
  };
}
```

`profileDetails` est exposé pour éviter que les composants (ex: MoiScreen) re-lisent `profileStore` et `authStore` directement.

### `isHeatUnlocked(feature, level)` — gate features

```typescript
import { isHeatUnlocked } from '../../lib/heatGate';

if (isHeatUnlocked('explicit', level)) { ... }
```

Features : `'explicit'` · `'quiz-intermediaire'` · `'scenarios'` · `'kamasutra'` · `'quiz-expert'` · `'expert-cards'`.

---

## Memoïsation

`useHeatLevel` utilise trois `useMemo` en cascade :

1. **`profileDetails`** — dérive les booléens profil depuis `personalProfile` + `pronouns`
2. **`input`** — assemble l'objet `HeatInput` en stabilisant la référence
3. **`breakdown`** — appelle `computeHeatBreakdown(input)`
4. **retour** — assemble `HeatState` final

Sans ce découpage, chaque keystroke dans un input profil déclencherait un recalcul complet des cards et modules. Avec ce découpage, seul `profileDetails` recalcule sur les inputs profil.

---

## Ajouter un nouveau trigger

**Cas 1 — nouveau store persisté** (ex: lexique mots) :

1. Créer / modifier le store Zustand avec `persist`
2. Dans `useHeatLevel.ts` : importer le store, lire la valeur, l'ajouter à l'objet `input`
3. Dans `heatLevel.ts` : ajouter le champ optionnel dans `HeatInput`, calculer les pts dans `computeHeatBreakdown` (bucket `profile` ou nouveau bucket)
4. Mettre à jour `HeatBreakdown` si un nouveau bucket est nécessaire
5. Ajouter dans `resetAllData()` de `stores/index.ts`
6. Ajouter la clé localStorage dans la liste de clear de `resetAllData()`

**Cas 2 — nouveau type de module** (ex: quiz niveau expert) :

1. Dans `heatLevel.ts` : ajouter l'entrée dans `MODULE_POINTS`
2. Dans `modules.ts` : configurer le reward (`cardReward`) pour le module
3. Tests : le test d'intégration `heatIntegration.test.ts` valide automatiquement si le module y est référencé

**Cas 3 — nouvelle feature gatée** :

1. Dans `heatGate.ts` : ajouter l'entrée dans `HeatGatedFeature` union et `GATE_THRESHOLDS`
2. Utiliser `isHeatUnlocked('ma-feature', level)` dans le composant concerné
3. Les tests de `heatGate.test.ts` couvrent automatiquement toute valeur de `GATE_THRESHOLDS`

---

## Tests

```
app/lib/heatLevel.test.ts        ~49 cas — logique pure, constantes, dual-reward
app/lib/heatGate.test.ts          33 cas — toutes features × tous paliers
app/lib/usePalierUp.test.ts        9 cas — hook, franchissements, clear()
app/lib/heatIntegration.test.ts   12 cas — chain complète avec collectorCards réelles
```

Lancer : `npm test -- heat`

---

## Invariants à ne pas casser

- `computeHeatPoints` est déterministe et sans effet de bord — ne jamais y lire de stores
- `MODULE_POINTS` et `CARD_POINTS` sont les seules sources de vérité des points — pas de valeurs hardcodées dans les composants
- `profileDetails` dans `HeatState` est la seule source de vérité profil côté composants — pas de lecture directe de `profileStore` / `authStore` pour l'affichage lié au heat
- `SESSION_POINT_VALUE` est exportée — ne pas dupliquer la constante 1 ailleurs
- `GATE_THRESHOLDS` est exportée — utiliser `isHeatUnlocked()` plutôt que des comparaisons directes
