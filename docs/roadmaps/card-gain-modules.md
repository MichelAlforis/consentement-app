# Système de gain de cartes — Modules éducatifs

> Créé : 25 avril 2026  
> Statut : 🔲 Sprint 6 (en attente)

---

## Principe directeur

**L'éducation est récompensée. Pas le jeu.**

Finir un module d'apprentissage débloque des cartes collector.  
Ces cartes deviennent jouables dans le CardGame — la récompense est utile, pas cosmétique.  
Plus on apprend, plus le jeu est riche.

> **Apprendre → Gagner → Jouer → Revenir**

---

## Mécanique d'addiction

| Levier | Effet |
|---|---|
| **FOMO** | Cartes verrouillées visibles dans le Hall of Cards — envie de compléter |
| **Dopamine** | Flip reveal animé (R3F) à chaque déverrouillage |
| **Utilité** | Les cartes gagnées enrichissent directement le pool du CardGame |
| **Variable reward** | Rareté aléatoire (common/rare/unique) selon la difficulté du module |

---

## Architecture du gain

```
[Module éducatif complété]
        │
        ▼
computeModuleGain(moduleId, ownedIds)
 ─ pure function (pas d'effet de bord)
 ─ rareté = f(difficulté du module)
 ─ random pick dans le pool filtré
        │
        ▼
unlockCards(OwnedCard[])
 ─ déduplique par id
 ─ persiste dans localStorage
        │
        ▼
flip reveal R3F (CardUnlockReveal)
 ─ 1 animation par carte gagnée
 ─ 750 ms / carte
        │
        ▼
Hall of Cards = ownedCards = Pool CardGame
```

---

## Module de base → 24 cartes starter

**Nature :** Écran d'onboarding, pas un module éducatif complet. **Peut être skippé.**

**Contenu :** Présentation de l'app, philosophie du consentement, 2-3 concepts clés.  
Rédigeable par l'équipe sans le juriste — pas de contenu légal requis.

**Déclencheur :** Premier lancement adulte → proposer le module avant d'accéder au Hall of Cards.

**Si complété :**
- 24 cartes `common` depth 1 débloquées (Deck A pour adultes, Deck M pour mineurs)
- Flip reveal séquentiel (CardUnlockReveal)
- Passage automatique niveau 1 → 2

**Si skippé :**
- `ownedCards` reste vide
- CardGame accessible mais affiche "Fais ton premier module pour avoir des cartes à jouer"
- Hall of Cards visible — FOMO maximal, pas de lock dur

---

## Déclencheurs par module

La même mécanique s'applique aux mineurs et aux adultes. Seul le deck de destination change.

### Modules adultes → Deck A (et Deck B juriste)

| Module | Difficulté | Cartes gagnées | Rareté | Deck |
|---|---|---|---|---|
| Module de base | intro | 24 cartes starter | common | A |
| Quiz consentement | easy | 1 carte | common | A |
| Porno vs Réalité | easy | 1 carte | common | A |
| Loi & consentement | medium | 1 carte | rare | A |
| Duo Flow (parcours duo complet) | medium | 1 carte | rare | A |
| Module pratiques adultes *(juriste)* | hard | 1 carte | unique | A |
| Modules Deck B *(juriste)* | hard | 1–2 cartes | unique | B |

### Modules mineurs → Deck M

| Module | Difficulté | Cartes gagnées | Rareté | Deck |
|---|---|---|---|---|
| Module de base (intro) | intro | 24 cartes starter | common | M |
| Quiz consentement | easy | 1 carte | common | M |
| Porno vs Réalité | easy | 1 carte | common | M |
| Loi & consentement | medium | 1 carte | rare | M |
| Accompagnement mineur | medium | 1 carte | rare | M |

**Deck M** = textes adaptés aux 13-14 ans. Mêmes visuels, même rareté, même flip reveal que Deck A.

**Règle de rareté :**
- easy → `common` (depth 1)
- medium → `rare` (depth 2)
- hard → `unique` (depth 3)

**Règle de random :** pick aléatoire dans le pool de la rareté cible, en excluant les cartes déjà possédées.  
Si pool épuisé pour cette rareté → aucune carte gagnée (pas de substitution vers une rareté différente).

---

## CardGame — nouveau pool

**Avant pivot :** CardGame pioche dans `diePractices` (données statiques).  
**Après pivot :** CardGame pioche **uniquement** dans `ownedCards` (Hall of Cards).

```
CardGame.drawCard()
  ─ pool = ownedCards filtré par deck(s) sélectionnés
  ─ shuffle → tirage séquentiel
  ─ si pool vide → afficher prompt "Apprends pour débloquer des cartes"
```

**Progression cible :**  
24 cartes (starter) → 50 cartes (engagement régulier) → 100+ cartes (collection complète)

---

## CSS vs R3F

| Usage | Technologie |
|---|---|
| Grille Hall of Cards | CSS (grid Tailwind) |
| Cartes en jeu (CardGame) | CSS |
| Cartes verrouillées | CSS |
| **Flip reveal** (déverrouillage) | **R3F — CollectorCardCanvas** |
| Flip reveal dans ZoomOverlay | R3F — CollectorCardCanvas |

R3F est réservé aux moments d'émotion forte (déverrouillage, zoom inspection).  
Pas de R3F dans les grilles ou le flux de jeu normal.

---

## Sprints à venir

### Sprint 6 — Cartes starter dans `cards-collector.ts`

Ajouter `deck: 'M'` au type `CollectorCard`. Chaque carte porte aussi un tag thème parmi les 6 decks de jeu (Osez, Parlez, Et si…, Défi, Vérité, Douceur) — le CardGame les utilise pour filtrer par thème.

| # | Tâche |
|---|---|
| 6.1 | Ajouter `deck: 'A' \| 'B' \| 'M'` dans le type `CollectorCard` |
| 6.2 | Ajouter `theme: 'osez' \| 'parlez' \| 'et-si' \| 'defi' \| 'verite' \| 'douceur'` dans le type |
| 6.3 | Rédiger 24 textes Deck A `common` depth 1 — adultes (thèmes : communication, confiance, exploration) |
| 6.4 | Rédiger 24 textes Deck M `common` depth 1 — mineurs (même thèmes, langue adaptée 13-14 ans) |
| 6.5 | Ajouter les 48 cartes dans `data/cards-collector.ts` avec visuels (gradient, iconName, border, theme) |
| 6.6 | Intégrer les 4 stubs ca-001–ca-004 dans les 24 Deck A ou les archiver |

### Sprint 7 — `computeModuleGain`

| # | Tâche |
|---|---|
| 7.1 | Créer `app/lib/computeModuleGain.ts` — pure function |
| 7.2 | Signature : `computeModuleGain(moduleId, ownedIds: Set<string>, collectorCards)` → `OwnedCard[]` |
| 7.3 | Table de config modules → rareté cible |
| 7.4 | Tests : easy → common, medium → rare, hard → unique, pool épuisé → [] |

### Sprint 8 — Module de base

| # | Tâche |
|---|---|
| 8.1 | Créer `ModuleDeBase` screen (ou intégrer dans onboarding) |
| 8.2 | Déclencheur : première ouverture → inviter le module avant le jeu |
| 8.3 | Complétion → `computeModuleGain('module-de-base', ...)` → 24 cartes → `unlockCards` → flip reveal |

### Sprint 9 — Wiring modules existants

Le déclencheur doit être **intentionnel** — bouton "J'ai compris" ou fin de quiz confirmée.  
Pas de trigger sur scroll seul (trop facilement contournable).

| # | Tâche | Déclencheur |
|---|---|---|
| 9.1 | `QuizConsentementScreen` — `onFinish` → `computeModuleGain` | Score affiché + bouton "Voir ma carte" |
| 9.2 | `PornoVsRealiteScreen` — fin de lecture → trigger | Bouton "J'ai lu" en bas de page |
| 9.3 | `LoiConsentementScreen` — fin de lecture → trigger | Bouton "J'ai lu" en bas de page |
| 9.4 | `DuoSpaceScreen` — parcours duo complet → trigger | Étape 9 validée |
| 9.5 | `AccompagnementMineurScreen` — arbre de décision complété → trigger (mineur) | Dernière étape de l'arbre |

### Sprint 10 — CardGame pool switch

| # | Tâche |
|---|---|
| 10.1 | Remplacer `diePractices` par `ownedCards` dans `CardGame/index.tsx` |
| 10.2 | Guard : si `ownedCards.length === 0` → afficher prompt "Module de base requis" |
| 10.3 | Test : ownedCards vide → pas de crash, message contextuel |

---

## Invariants

| Invariant | Raison |
|---|---|
| `computeModuleGain` est une pure function | Testable sans React, sans mock store |
| Pas de substitution de rareté | Si pool épuisé → rien, pas de downgrade |
| Max 24 cartes pour le module de base | UX — le flip reveal doit rester court |
| Cartes acquises à vie | Pas de fonction de suppression dans `unlockStore` |
| R3F uniquement pour le flip reveal | Performance — pas de R3F dans les grilles |

---

## Relation avec l'ancien système (Sprints 1–5)

> ⚠️ **Décision finale 2026-04-25** — Seule l'éducation crée des cartes. Les jeux les utilisent.

**Règle :** `unlockCards()` n'est appelé que depuis `computeModuleGain`. Jamais depuis un événement de jeu.

| Ancien trigger | Décision |
|---|---|
| `CardGameScreen` fin de séance → common | ❌ Supprimé |
| GooseGame `complicite` → rare | ❌ Supprimé |
| GooseGame `arrivée` → unique | ❌ Supprimé |

**Action technique (Sprint 10) :** Retirer `case 'complicite'` et `case 'arrivee'` de `useGooseGame.ts`. Supprimer les tests 5.7a–5.7c. Nettoyer `pickOneRare` / `pickOneUnique` si plus utilisés.

```
Modules éducatifs (SEUL canal de gain)
        │
        ▼
unlockStore.ownedCards
        │
  ┌─────┴──────┐
  ▼             ▼
Hall of Cards  CardGame pool
(collection)   (tirage)
        ↑
GooseGame — utilise les cartes, n'en crée pas
```
