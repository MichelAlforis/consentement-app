# Roadmap V3 — Card Collector & Home Adaptative

> Créé : 26 avril 2026  
> Mis à jour : 26 avril 2026 (bugfix Deck M + i18n complet + Sprints 18–25 — FlipRevealOverlay partagé + DiceGame tap-to-reveal)  
> Statut global : ✅ Tous les sprints implémentables sans contenu juriste sont terminés  
> Docs de référence détaillés : `docs/jeux/card-gain-modules.md` · `docs/home-v3.md` · `docs/jeux/card-collector.md`

---

## Vision

L'éducation débloque le jeu. Le jeu donne envie d'apprendre davantage.

```
Complète un module
      ↓
Gagne des cartes (flip reveal R3F)
      ↓
Joue avec un deck plus riche
      ↓
Vois les cartes verrouillées → envie du prochain module
```

**Trois decks, même mécanique :**
- **Deck M** — mineurs (13-14 ans) — textes consentement, respect, relations saines
- **Deck A** — adultes — connexion, communication, exploration émotionnelle
- **Deck B** — adultes explicite — juriste, app adulte uniquement

**Même logique quel que soit l'âge.** La Home, les cartes, le flip reveal, le Hall of Cards — identiques. Seul le contenu textuel change.

---

## Règle absolue

> **Seule l'éducation crée des cartes. Les jeux les utilisent.**

`unlockCards()` n'est appelé que depuis `computeModuleGain`. Jamais depuis un événement de jeu.  
GooseGame, CardGame — ils tirent dans `ownedCards`, n'y ajoutent rien.

---

## Progression en 3 niveaux

Calculé depuis `completedModules` uniquement — identique mineur et adulte.

| Niveau | Condition | Home |
|---|---|---|
| **1 — Découverte** | 0 module complété | CTA module de base (skippable) · Hall verrouillé · FOMO |
| **2 — Apprentissage** | 1+ module, aucun difficile | Progression · Prochain module · Jeu accessible |
| **3 — Maîtrise** | 1 module difficile complété | Collection · Duo · FOMO depth 3 / Deck B |

**Modules difficiles** (déclenchent niveau 3) : `loi-consentement`, `duo-flow`, `accompagnement-mineur`, `module-pratiques-adultes`.

```ts
// app/lib/progressLevel.ts
const DEEP_MODULES = ['loi-consentement', 'duo-flow', 'accompagnement-mineur', 'module-pratiques-adultes'];
function getProgressLevel(completedModules: string[]): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  if (completedModules.some(id => DEEP_MODULES.includes(id))) return 3;
  return 2;
}
```

---

## Modules et cartes gagnées

### Adultes → Deck A

| Module | Difficulté | Rareté | Déclencheur |
|---|---|---|---|
| Module de base *(skippable)* | intro | 24 × common | Bouton "J'ai compris" ou skip |
| Quiz consentement | easy | 1 × common | Score affiché + bouton "Voir ma carte" |
| Porno vs Réalité | easy | 1 × common | Bouton "J'ai lu" en bas de page |
| Loi & consentement | medium | 1 × rare | Bouton "J'ai lu" |
| Duo Flow complet | medium | 1 × rare | Étape 9 validée |
| Module pratiques adultes *(juriste)* | hard | 1 × unique | Complétion confirmée |
| Modules Deck B *(juriste)* | hard | 1-2 × unique | idem |

### Mineurs → Deck M

| Module | Difficulté | Rareté | Déclencheur |
|---|---|---|---|
| Module de base *(skippable)* | intro | 24 × common | Bouton "J'ai compris" ou skip |
| Quiz consentement | easy | 1 × common | Score affiché |
| Porno vs Réalité | easy | 1 × common | Bouton "J'ai lu" |
| Loi & consentement | medium | 1 × rare | Bouton "J'ai lu" |
| Accompagnement mineur | medium | 1 × rare | Dernière étape de l'arbre |

**Rareté :** easy → common · medium → rare · hard → unique  
**Random pick** dans le pool filtré par rareté et deck, hors cartes déjà possédées.

---

## Architecture technique

### Nouveaux fichiers

| Fichier | Rôle |
|---|---|
| `app/stores/moduleProgressStore.ts` | `completedModules[]` + `markModuleComplete(id)` — Zustand persist `consentement-modules` |
| `app/lib/progressLevel.ts` | `getProgressLevel(completedModules)` → 1\|2\|3 |
| `app/lib/computeModuleGain.ts` | `computeModuleGain(moduleId, ownedIds, collectorCards)` → `OwnedCard[]` |
| `app/components/screens/HomeScreen/DiscoveryHome.tsx` | Home niveau 1 |
| `app/components/screens/HomeScreen/LearningHome.tsx` | Home niveau 2 |
| `app/components/screens/HomeScreen/MasteryHome.tsx` | Home niveau 3 |
| `app/components/ui/ProgressBar.tsx` | Barre progression modules |
| `app/components/ui/NextModuleSuggestion.tsx` | Card "Prochain module" |
| `app/components/ui/TabBar.tsx` | 4 onglets persistants — Accueil / Apprendre / Jouer / Moi |
| `app/components/screens/ApprendreScreen.tsx` | Hub modules éducatifs (remplace `resources-minor` + `learn`) |
| `app/components/screens/MoiScreen.tsx` | Hub profil — personal-space, duo-space, help, settings |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `app/types/index.ts` | + `'apprendre'` · `'moi'` · `'module-de-base'` au type `Screen` |
| `app/data/cards-collector.ts` | + `deck: 'A'\|'B'\|'M'` · + `theme` (6 catégories) · 24 cartes Deck A · 24 cartes Deck M |
| `app/components/screens/HomeScreen.tsx` | `useProgressLevel` + dispatch vers 3 composants + retrait MenuCards redondantes |
| `app/page.tsx` | TabBar affiché sur écrans racines · lazy load `ApprendreScreen`, `MoiScreen` |
| `app/stores/index.ts` | Export + reset `moduleProgressStore` |
| `app/game-engine/cards/useCardEngine.ts` | `drawCard` pioche dans `ownedCards` filtré par `theme` |
| `app/components/screens/CardGame/index.tsx` | Guard niveau 1 : ownedCards vide → prompt module de base |

### Fichiers à nettoyer

| Fichier | Action |
|---|---|
| `app/components/screens/GooseGameScreen/hooks/useGooseGame.ts` | Supprimer `case 'complicite'` et `case 'arrivee'` (triggers cartes) |
| `app/components/screens/GooseGameScreen/hooks/useGooseGame.test.ts` | Supprimer tests 5.7a, 5.7b, 5.7c |
| `app/lib/computeGainedCards.ts` | Supprimer `pickOneRare` et `pickOneUnique` si non utilisés ailleurs |

### Type `CollectorCard` mis à jour

```ts
export interface CollectorCard {
  id: string;
  deck: 'A' | 'B' | 'M';
  theme: 'osez' | 'parlez' | 'et-si' | 'defi' | 'verite' | 'douceur';
  text: string;
  depth: 1 | 2 | 3;
  tags: string[];
  rarity: 'common' | 'rare' | 'unique';
  unlockedBy: string;  // id du module source
  visual: { gradient: string; iconName: string; border: string };
}
```

---

## Sprints

### Sprint 6 — Données cartes
**Livrable :** 48 cartes dans `cards-collector.ts` (24 Deck A + 24 Deck M)

| # | Tâche | Statut |
|---|---|---|
| 6.1 | Ajouter `deck: 'A'\|'B'\|'M'` et `theme` au type `CollectorCard` | ✅ |
| 6.2 | Rédiger 24 textes Deck A common depth 1 (6 thèmes × 4) | ✅ placeholder équipe |
| 6.3 | Rédiger 24 textes Deck M common depth 1 (même structure, langue 13-14 ans) | ✅ placeholder équipe |
| 6.4 | Ajouter les 48 cartes avec visuels dans `cards-collector.ts` | ✅ |

### Sprint 7 — `computeModuleGain`
**Livrable :** pure function testée + config modules

| # | Tâche | Statut |
|---|---|---|
| 7.1 | Créer `app/lib/computeModuleGain.ts` avec table de config | ✅ |
| 7.2 | Logique : rareté cible par moduleId, random pick, déduplication | ✅ |
| 7.3 | Tests : easy → common, medium → rare, hard → unique, pool épuisé → [] | ✅ |

### Sprint 8 — Module de base
**Livrable :** écran onboarding + 24 cartes au premier lancement

| # | Tâche |
|---|---|
| 8.1 | Créer `ModuleDeBaseScreen` — présentation app, philosophie, skip possible | ✅ |
| 8.2 | Routing : premier lancement adulte/mineur → `module-de-base` (skippable) | ✅ |
| 8.3 | Complétion → `computeModuleGain('module-de-base', ...)` → flip reveal 24 cartes | ✅ |

### Sprint 9 — Wiring modules existants ✅
**Livrable :** 5 modules branchés sur `useModuleComplete` · testé Playwright en dev

| # | Écran | Déclencheur | Statut |
|---|---|---|---|
| 9.1 | `QuizConsentementScreen` | Score affiché → bouton "Voir ma carte" | ✅ |
| 9.2 | `PornoVsRealiteScreen` | Bouton "J'ai lu — Voir ma carte" en bas | ✅ |
| 9.3 | `LoiConsentementScreen` | Bouton "J'ai lu — Voir ma carte" en bas | ✅ |
| 9.4 | `DuoSpaceScreen` | Bouton "Voir ma carte" à l'étape summary | ✅ |
| 9.5 | `AccompagnementMineurScreen` | Bouton "Voir ma carte" à l'étape guide | ✅ |

Hook `useModuleComplete` : idempotent, marque le module + débloque cartes via `computeModuleGain`. Tous naviguent vers `hall-of-cards`.

### Sprint 10 — CardGame pool switch + nettoyage GooseGame
**Livrable :** CardGame pioche dans ownedCards · triggers jeu supprimés

| # | Tâche | Statut |
|---|---|---|
| 10.1 | `drawCard` filtre sur `ownedCards` par `theme` (remplace `diePractices`) | ✅ |
| 10.2 | Guard : `ownedCards` vide → prompt "Module de base pour démarrer" | ✅ |
| 10.3 | Supprimer `case 'complicite'` + `case 'arrivee'` dans `useGooseGame.ts` | ✅ |
| 10.4 | Supprimer tests 5.7a–5.7c dans `useGooseGame.test.ts` | ✅ |
| 10.5 | Nettoyer `pickOneRare` / `pickOneUnique` dans `computeGainedCards.ts` | ✅ |

### Sprint 11 — `moduleProgressStore`
**Livrable :** store Zustand persist + pure functions

| # | Tâche | Statut |
|---|---|---|
| 11.1 | `moduleProgressStore` : `completedModules[]` + `markModuleComplete(id)` (idempotent) | ✅ |
| 11.2 | Export + `reset()` dans `resetAllData()` | ✅ |
| 11.3 | `getProgressLevel(completedModules)` — pure function + tests (niveaux 1/2/3) | ✅ |

### Sprint 12 — Flip reveal animation ✅
**Livrable :** animation flip card au déverrouillage (le wiring logique est fait dans Sprint 9)

| # | Tâche | Statut |
|---|---|---|
| 12.1–12.5 | `useModuleComplete` branché sur les 5 écrans | ✅ (fait Sprint 9) |
| 12.6 | Animation flip reveal séquentielle au retour vers `hall-of-cards` | ✅ |

### Sprint 13 — Composants Home V3
**Livrable :** 3 composants Home + `HomeScreen` refactoré

| # | Tâche | Statut |
|---|---|---|
| 13.1 | `DiscoveryHome({ isAdult, onNavigate })` — niveau 1 | ✅ |
| 13.2 | `LearningHome({ isAdult, ownedCards, completedModules, onNavigate })` — niveau 2 | ✅ |
| 13.3 | `MasteryHome({ isAdult, ownedCards, completedModules, onNavigate })` — niveau 3 | ✅ |
| 13.4 | `ProgressBar` + `NextModuleSuggestion` — inline dans HomeScreen | ✅ |
| 13.5 | `HomeScreen.tsx` — `useProgressLevel` + dispatch vers les 3 composants | ✅ |
| 13.6 | i18n : nouvelles clés home pour les 3 états (FR/EN/ES) | ✅ |

### Sprint 14 — `ModuleDeBaseScreen` ✅
**Livrable :** écran d'intro skippable + 24 cartes au premier lancement

| # | Tâche | Statut |
|---|---|---|
| 14.1 | Contenu du module de base (placeholder équipe) | ✅ `data/moduleDeBase.ts` |
| 14.2 | `ModuleDeBaseScreen` — 4 slides, progress dots, skip | ✅ |
| 14.3 | Routing : `case 'home'` intercepté si `!hasOnboarded` | ✅ `page.tsx` |
| 14.4 | Complétion → 24 cartes → flip reveal séquentiel | ✅ via `useModuleComplete` |

### Sprint 15 — Guard CardGame niveau 1 ✅
**Livrable :** CardGame ne crashe pas si ownedCards vide

| # | Tâche | Statut |
|---|---|---|
| 15.1 | `ownedCards` vide → `EmptyDeckPrompt` (CTA quiz consentement) | ✅ |
| 15.2 | Tests : pool vide → `available.length===0`, `startPlaying` sans crash, `currentCard` null | ✅ 4 tests |

### Bugfix — Deck M invisible (post Sprint 15) ✅

Trois couches de bugs empêchaient les cartes Deck M d'être accessibles aux mineurs.

| Fichier | Problème | Correction |
|---|---|---|
| `app/lib/useModuleComplete.ts` | `moduleId` adulte transmis sans résolution → donnait des cartes Deck A aux mineurs | `resolveModuleId()` + `MINEUR_VARIANTS` map : `module-de-base → module-de-base-mineur`, etc. |
| `app/components/screens/CardGame/hooks/useCardSession.ts` | Filtre `Deck M` : `isAdult && explicitMode` (toujours `false` pour mineurs) | Corrigé en `!isAdult` |
| `app/components/screens/HallOfCardsScreen.tsx` | Seuls Deck A + B affichés — Deck M jamais rendu | `deckM` ajouté, `primaryDeck = isAdult ? deckA : deckM`, `Deck B` conditionnel `{isAdult && …}` |

Tests `useCardSession` mis à jour : fixture `ALL_OWNED` enrichie (cm-001, cm-002), assertions mineur → Deck M, adulte → Deck A uniquement.

---

### Sprint 16 — Navigation Tab Bar V3 ✅
**Livrable :** 4 onglets persistants remplaçant les MenuCards de la Home

#### Arbre de navigation cible

```
Onboarding : welcome → age-check → auth → [module-de-base skippable] → APP

APP — Tab Bar persistant (visible sur les 4 racines seulement)
├── [Accueil]   HomeScreen V3        ← niveau 1 / 2 / 3 automatique
├── [Apprendre] ApprendreScreen      ← hub modules
│                  ├── quiz-consentement
│                  ├── porno-vs-realite
│                  ├── loi-consentement
│                  ├── accompagnement-mineur   (mineur uniquement)
│                  └── module-pratiques-adultes (adulte, juriste)
├── [Jouer]     GamesHubScreen (jeux) ← existant
│                  ├── jeu-des · jeu-oie · jeu-cartes
│                  └── hall-of-cards
└── [Moi]       MoiScreen
                   ├── personal-space  (adulte)
                   ├── duo-space       (adulte)
                   ├── help            (mineur)
                   └── settings → theme-select · premium
```

**Règle d'affichage du TabBar :** visible si `currentScreen ∈ ['home', 'apprendre', 'jeux', 'moi']`. Caché sur tous les sous-écrans (quiz, jeu-oie, duo-space, settings…).

#### Migration

| Avant | Après |
|---|---|
| `resources-minor` (écran racine) | sous-écran de `ApprendreScreen` (mineur) |
| `learn` (écran racine) | sous-écran de `ApprendreScreen` (adulte) |
| `personal-space` depuis HomeScreen MenuCards | accessible depuis onglet Moi |
| `duo-space` depuis HomeScreen MenuCards | accessible depuis onglet Moi |
| `settings` depuis HomeScreen MenuCards | accessible depuis onglet Moi |
| `jeux` (hub jeux existant) | onglet Jouer — inchangé structurellement |
| MenuCards dans HomeScreen | supprimées — navigation assurée par le TabBar |

#### Tâches

| # | Tâche |
|---|---|
| 16.1 | `app/types/index.ts` — ajouter `'apprendre'` · `'moi'` · `'module-de-base'` au type `Screen` |
| 16.2 | `TabBar.tsx` — 4 onglets avec icônes + état actif, caché hors racines |
| 16.3 | `ApprendreScreen.tsx` — liste des modules (cartes cliquables) + badge progression par module |
| 16.4 | `MoiScreen.tsx` — personal-space + duo-space (adulte) / help (mineur) + settings |
| 16.5 | `page.tsx` — constante `TAB_ROOTS`, lazy load nouveaux écrans, afficher `TabBar` |
| 16.6 | `HomeScreen.tsx` — retirer MenuCards redondantes avec le TabBar |
| 16.7 | i18n — clés `tab.home` · `tab.learn` · `tab.play` · `tab.me` (FR / EN / ES) |

### Sprint 18 — Tests `useModuleComplete` ✅
**Livrable :** couverture complète du flux critique module → cartes → reveal

| # | Test | Statut |
|---|---|---|
| 18.1 | Adulte — module-de-base : 24 cartes Deck A communes | ✅ |
| 18.2 | Adulte — quiz / loi / duo : count et rareté | ✅ |
| 18.3 | Mineur — résolution `module-de-base → module-de-base-mineur` (24 cartes Deck M) | ✅ |
| 18.4 | Mineur — résolution `quiz → quiz-consentement-mineur` | ✅ |
| 18.5 | `accompagnement-mineur` : pas de double-résolution, 1 carte rare Deck M | ✅ |
| 18.6 | `completedModules` contient l'`effectiveId` | ✅ |
| 18.7 | Module inconnu : marqué dans `completedModules`, 0 cartes | ✅ |
| 18.8–18.9 | Idempotence : deuxième appel → 0, `ownedCards` inchangé | ✅ |
| 18.10–18.12 | `pendingIds` = IDs gagnés · vide si 0 cartes · non re-setté en cas de doublon | ✅ |
| 18.13–18.14 | `ownedCards` append-only sans dédoublons · `gainedOn` ISO valide | ✅ |

**16 tests · 6 fichiers · 79 tests total — tous verts.**

---

### Sprint 19 — `CardMesh` dans la scène R3F DiceGame ✅
**Livrable :** après l'atterrissage du dé, une carte de la collection de l'utilisateur apparaît dans la même scène R3F

| Fichier | Changement |
|---|---|
| `game-engine/dice/DiceCanvas.tsx` | `CameraUpdater` (pull-back z=3.2, fov=52) · `DiceScene` décale le dé à x=-0.55 · groupe carte à x=0.72 scale=0.55 · `enableBloom={false}` |
| `game-engine/dice/DiceRenderer.tsx` | Thread `previewCard?` + `showCard?` vers `DiceCanvas` |
| `components/screens/DiceGame/index.tsx` | `useUnlockStore` · `samplePreviewCard()` · `showCard` state · clear sur reroll/reset |

**Architecture :** un seul WebGL context, pas de Canvas imbriqué. `CardMesh` intégré directement dans `DiceScene` via le pattern API : `<group position scale><Suspense><CardMesh enableBloom={false}/></Suspense><RarityLights/></group>`

---

### Sprint 20 — Échantillonnage thématique + i18n finaux ✅
**Livrable :** la carte affichée après le lancer correspond à la catégorie du dé · zéro chaîne hardcodée restante

| Fichier | Changement |
|---|---|
| `components/screens/DiceGame/index.tsx` | `FACE_TO_THEME` (1→osez … 6→douceur) · `samplePreviewCard(faceId)` filtre par thème, fallback aléatoire si pool vide |
| `components/screens/CardGame/index.tsx` | Badge `"PREMIUM"` → `t('games.premium')` |

**Invariant :** tous les écrans principaux sont désormais 100 % i18n — aucune chaîne FR hardcodée restante.

---

### Sprint 21 — GooseGame Accord + carte collector ✅
**Livrable :** quand les deux joueurs votent OUI sur une case Accord, une carte de la collection apparaît en 3D dans l'overlay de résultat

| Fichier | Changement |
|---|---|
| `overlays/AccordFlow.tsx` | `useUnlockStore` + `useMemo(bothYes)` → `previewCard` · `CollectorCardCanvas size=120 autoFlip` animé (delay 350ms, spring) |

**Décision d'architecture :** `CollectorCardCanvas` (scène perspective dédiée) plutôt que `CardMesh` inline dans le Canvas orthographique du plateau — la caméra orthographique à 40° d'élévation ne permet pas un rendu satisfaisant d'une carte dressée. L'overlay AccordFlow couvre déjà le plateau ; son propre WebGL context est marginal.

**UX :** dos face visible → flip automatique (`autoFlip`) → face dévoilée · aucune carte si `ownedCards` vide.

---

### Sprint 22 — Tests `sampleCard` + refactor extraction ✅
**Livrable :** logique de sampling extraite en module pur · 19 nouveaux tests unitaires

| Fichier | Rôle |
|---|---|
| `app/lib/sampleCard.ts` | `FACE_TO_THEME` · `sampleCardByFace(faceId, owned, cards?)` · `sampleRandomCard(owned, cards?)` |
| `app/lib/sampleCard.test.ts` | 19 tests : FACE_TO_THEME · sampleCardByFace (7 cas) · sampleRandomCard (5 cas) |
| `DiceGame/index.tsx` | `samplePreviewCard` → délègue à `sampleCardByFace` (3 lignes) |
| `AccordFlow.tsx` | sampling inline → délègue à `sampleRandomCard` |

**Couverture :** empty pool · filtre thématique · fallback pool complet · face inconnue (0) · forme GainedCard · id absent du catalogue · random=0 et random→1

**7 fichiers · 98 tests · tous verts.**

---

### Sprint 23 — Tests stores du flux unlock ✅
**Livrable :** couverture complète des 3 stores critiques · 24 nouveaux tests

| Fichier | Tests | Cas couverts |
|---|---|---|
| `stores/revealStore.test.ts` | 6 | état initial · setPending · clearPending · ordre · dernier gagne |
| `stores/moduleProgressStore.test.ts` | 7 | état initial · markComplete · idempotence · ordre · reset · reprise après reset |
| `stores/unlockStore.test.ts` | 11 | état initial · ajout · dédup cross-appel · lot mixte · métadonnées · sessionCount · reset |

**Note :** `unlockCards` ne déduplique pas dans un même batch (callers fournissent des listes uniques — comportement documenté et correct).

**10 fichiers · 122 tests · tous verts.**

---

### Sprint 24 — DiceGame card label ✅
**Livrable :** label contextuel sous le canvas 3D après chaque lancer

Quand `mode === 'practice' && showCard && previewCard`, un label animé apparaît sous le canvas avec :
- un **dot de rareté** (common=`#94a3b8` · rare=`#a78bfa` · unique=`#f59e0b`)
- le **texte de la carte** (2 lignes max, `line-clamp-2`)
- entrée en fondu + montée (délai 0.6 s pour laisser la carte se retourner)

```tsx
const RARITY_COLOR: Record<string, string> = {
  common: '#94a3b8', rare: '#a78bfa', unique: '#f59e0b',
};

{mode === 'practice' && showCard && previewCard && (
  <motion.div key="card-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }} transition={{ delay: 0.6 }}
    className="mt-2 px-3 py-2 rounded-xl flex items-start gap-2"
    style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, maxWidth: 210 }}>
    <span className="mt-0.5 w-2 h-2 rounded-full shrink-0"
      style={{ background: RARITY_COLOR[previewCard.rarity] }} />
    <p className="text-xs leading-snug line-clamp-2" style={{ color: colors.textSecondary }}>
      {previewCard.text}
    </p>
  </motion.div>
)}
```

**Fichier modifié :** `app/components/screens/DiceGame/index.tsx`  
**122 tests · tous verts.**

---

### Sprint 25 — FlipRevealOverlay partagé + DiceGame tap-to-reveal ✅
**Livrable :** overlay de flip extrait en composant partagé · câblé dans DiceGame

**Extraction :**
- `FlipRevealOverlay` déplacé de `HallOfCardsScreen.tsx` (local) → `app/components/ui/FlipRevealOverlay.tsx` (partagé)
- `HallOfCardsScreen` importe depuis `../ui/FlipRevealOverlay` — comportement identique

**DiceGame — tap-to-reveal :**
- Le `card-label` (dot rareté + texte) devient un bouton `motion.button` avec `whileTap` + `ChevronRight` indicateur
- Tap → `showReveal = true` → `FlipRevealOverlay` plein écran (animation flip 3D)
- `onDone` → `showReveal = false`
- `showReveal` remis à `false` sur `pickRoll`, `reroll`, `reset`

**Fichiers :**
- `app/components/ui/FlipRevealOverlay.tsx` (nouveau)
- `app/components/screens/HallOfCardsScreen.tsx` (import mis à jour, Sparkles retiré)
- `app/components/screens/DiceGame/index.tsx` (showReveal, overlay, label tappable)

**122 tests · tous verts.**

---

### Sprint 17 — i18n polish ✅
**Livrable :** zéro chaîne FR hardcodée dans les écrans principaux

| # | Fichier | Chaînes extraites | Statut |
|---|---|---|---|
| 17.1 | `HallOfCardsScreen.tsx` | `title`, `subtitle`, `deckALabel`, `deckMLabel`, `deckBLabel`, `rarityRare`, `rarityUnique`, `appAdulte` | ✅ |

Namespace `hallOfCards` ajouté dans `app/i18n/locales/fr|en|es/games.ts`.  
`AcquiredCard`, `LockedCard`, `FlipRevealOverlay` et `HallOfCardsScreen` utilisent maintenant tous `t()`.

---

## Ordre d'exécution

```
Sprint 6 (données)
    │
    ├─ Sprint 7 (computeModuleGain)
    │       │
    │       └─ Sprint 9 (wiring modules)
    │                   │
    │                   └─ Sprint 12 (markModuleComplete complet)
    │
    ├─ Sprint 8 (module de base)
    │
    ├─ Sprint 10 (pool switch + nettoyage)
    │
    └─ Sprint 11 (moduleProgressStore)
                │
                └─ Sprint 13 (Home V3)
                            │
                            └─ Sprint 14 (ModuleDeBaseScreen)
                                        │
                                        └─ Sprint 15 (guard CardGame)

Sprint 16 (Tab Bar) — parallèle à 6–15, bloque sur rien
                      mais lisible seulement quand HomeScreen V3 existe (Sprint 13)
```

Sprints 6–10 peuvent avancer en parallèle.  
Sprints 11–15 dépendent de 6–10.  
Sprint 16 est indépendant structurellement — recommandé après Sprint 13 pour tester les 3 niveaux depuis le TabBar.

---

## Invariants

| Invariant | Pourquoi |
|---|---|
| `unlockCards` uniquement depuis `computeModuleGain` | Règle fondamentale — seule l'éducation crée des cartes |
| `markModuleComplete` est idempotent | Sécurité double-appel |
| `getProgressLevel` est une pure function | Testable, sans React |
| Le déclencheur de module est toujours intentionnel | Bouton explicite — jamais sur scroll seul |
| TabBar visible sur racines seulement | Jamais dans un sous-écran (jeu, module, settings…) |
| Deck M rédigé par l'équipe (pas le juriste) | Non bloquant pour les Sprints 6–16 |
| Deck B rédigé par le juriste | Bloquant pour le contenu Deck B uniquement |
| `ownedCards` append-only | Jamais de suppression de cartes |
