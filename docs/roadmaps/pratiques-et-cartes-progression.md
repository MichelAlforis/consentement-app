# Roadmap — Pratiques & Système de Cartes Progressif

> Session brainstorming 2026-05-14 — Michel Marques + Claude
> Statut : à discuter / plan d'implémentation à venir

---

## 1. Hiérarchie des modules "Pratiques"

Quatre modules distincts, chacun gatés par un palier du Baromètre du Hot.
Le palier n'est pas un jugement moral — c'est une logique pédagogique :
**tu comprends le cadre de consentement correspondant avant d'explorer la pratique.**

| Module | Palier requis | Pts | Contenu |
|---|---|---|---|
| `pratiques-base` | 2 — Chaud | 12 | Fellation, cunnilingus, masturbation mutuelle, pénétration vaginale, sodomie |
| `pratiques-divergentes` | 3 — Ardent | 40 | Voyeurisme, exhibitionnisme, jeux de rôle, dirty talk |
| `pratiques-avancees` | 4 — Brûlant | 80 | BDSM intro, bondage léger, domination/soumission, fétichismes courants |
| `pratiques-extremes` | 5 — Incandescent | 130 | Food sex, pratiques très niche |

**Format** : tous utilisent `FichePratiqueScreen` (générique) — seuls data + i18n FR à créer par module.

**Visibilité dans ApprendreScreen** : les modules supérieurs sont **visibles mais lockés** avec l'indicateur 🔥 et le palier requis. L'utilisateur voit ce qui arrive — il est curieux, pas repoussé.

---

## 2. Lexique lié aux modules

Chaque terme du `lexique-consent` (et des futurs lexiques) est **gaté par le module qui en fait référence**.

```
Module pratiques-base complété
  → termes lexique associés débloquables
      → ex : "sodomie", "cunnilingus", "fellation"

Module pratiques-divergentes complété
  → termes lexique associés débloquables
      → ex : "voyeurisme", "exhibitionnisme", "consentement non-verbal"
```

**`LexiqueEntry` — nouveaux champs à ajouter :**

```ts
requiredModuleId?: EffectiveModuleId  // module requis pour débloquer ce terme
cardReward?: { rarity: 'common' | 'rare' | 'unique' }  // carte qui rejoint le pool
```

**Dans `LexiqueScreen`** : si `requiredModuleId` non complété → terme verrouillé avec message
"Complète [nom module] d'abord".

Débloquer un terme donne :
- **+1 pt chaleur** (déjà implémenté)
- **La carte thématique rejoint ton pool** (nouveau — pas donnée directement)

---

## 3. Nouveau modèle de cartes — Accès vs Acquisition

### Principe fondateur

> **Tu ne gagnes pas la carte sodomie en faisant le module sodomie.**
> L'aléatoire force l'exploration de tout le contenu, pas seulement ce qui t'intéresse.

### Deux pools distincts

```
unlockablePool[]
  ← cartes POTENTIELLEMENT gagnables
  ← alimenté par : modules complétés + termes lexique débloqués
  ← grandit avec ton parcours éducatif

ownedCards[]
  ← cartes que tu POSSÈDES réellement
  ← gagné via : sessions de jeu, tirage aléatoire depuis unlockablePool
```

### Deux sources de cartes coexistent

| Source | Mécanisme | Rôle |
|---|---|---|
| **Carte de complétion de module** | Donnée directement à la fin du module | Récompense immédiate, sentiment d'accomplissement |
| **Cartes thématiques** | Rejoignent `unlockablePool` via modules + lexique | Gagnées aléatoirement via les jeux |

La carte de complétion est la "carte du module" — pas la carte de la pratique.
Les cartes thématiques (sodomie, voyeurisme…) ne s'obtiennent que par le jeu.

### Flux complet

```
1. Complète module pratiques-base
   → Carte de complétion donnée directement (ex: rarity rare)
   → Termes lexique pratiques-base débloquables

2. Débloque terme "sodomie" dans lexique
   → +1 pt chaleur
   → Carte "sodomie" (common) rejoint unlockablePool

3. Joue au jeu de dés / oie / cartes
   → Tirage aléatoire dans ton unlockablePool
   → Tu obtiens une carte — pas forcément "sodomie"
   → Suspense, addiction, replayabilité
```

---

## 4. Impact sur l'architecture existante

### Changements requis

- **`unlockStore`** : ajouter `unlockablePool: CardId[]` distinct de `ownedCards`
- **`computeModuleGain`** : module → pousse dans `unlockablePool`, plus dans `ownedCards` directement (sauf carte de complétion)
- **`lexiqueStore.unlock()`** : appelle `unlockStore.addToPool(cardId)` si `entry.cardReward` défini
- **Sessions de jeu** : fin de session → `unlockStore.drawFromPool()` → aléatoire → `ownedCards`
- **`LexiqueEntry`** : + `requiredModuleId` + `cardReward`

### Ce qui ne change pas
- `ownedCards` reste la source de vérité pour CardGame et Hall of Cards
- Le deck starter 24 cartes (module-de-base) reste donné directement — c'est le hook d'onboarding
- Le système de points heat ne change pas

---

## 5. Écran Moi — Connaissance de soi progressive

### Principe

Chaque module complété génère de nouvelles questions dans "Moi" :
**"Comment tu te sens par rapport à ce sujet ?"**

Les questions n'apparaissent que si le module correspondant est complété.
Impossible de répondre sur ce qu'on n'a pas encore abordé.

### Réponses possibles (par sujet)

```
[ Curieux·se ]  [ À l'aise ]  [ Pas pour moi ]  [ Je veux explorer ]  [ Je préfère ne pas répondre ]
```

### Portes de sortie multiples — le "non" sans explication

Une personne qui ne souhaite pas répondre sur un sujet peut :
- ne pas avoir fait le module → question inexistante pour elle
- faire le module et ne pas répondre → silence
- répondre "Pas pour moi" ou "Je préfère ne pas répondre" → opt-out explicite

Dans tous les cas, **rien n'apparaît en duo-flow**. L'autre ne sait pas pourquoi.
C'est le principe du consentement encodé structurellement dans l'UX :
**tu n'as jamais à justifier ton "non".**

### Intégration Baromètre du Hot

Chaque réponse donnée = **+1 pt chaleur** (engagement réel, pas du farming).
Le profil Moi contribue ainsi de façon granulaire au baromètre.

### Intersection en Duo-flow

**Seuls les matches positifs sont révélés** (les deux "curieux·se" ou "à l'aise" sur un même sujet).

```
Partner A : sodomie → "Curieux·se"
Partner B : sodomie → "Curieux·se"
→ Duo-flow : "Vous êtes tous les deux curieux·ses sur ce sujet" ✓

Partner A : sodomie → "Curieux·se"
Partner B : sodomie → "Pas pour moi"  (ou pas répondu, ou module pas fait)
→ Duo-flow : rien ne s'affiche
```

L'ambiguïté est une **protection par design** : l'autre ne sait pas si tu n'as pas fait le module,
si tu ne veux pas en parler, ou si ce n'est simplement pas pour toi.

### Ce que ça crée comme différenciation produit

Kindu / Desire présentent une liste de fantasmes à swiper sans prérequis.
Ici, **tu ne peux comparer vos réponses que si vous avez tous les deux fait le module**.
Ce n'est pas un outil de compatibilité — c'est un outil de communication
fondé sur un socle commun de connaissances et de consentement.

### Architecture à prévoir

- **`preferencesStore`** : store dédié, persist, `Record<topicId, PreferenceAnswer | null>`
- **`topicId`** : lié à un `moduleId` (gate) + un sujet précis (pratique ou concept)
- **Moi screen** : sections progressives selon modules complétés
- **Duo-flow** : lit les préférences des deux partenaires, révèle seulement les intersections positives
- **Contribution heat** : chaque nouvelle réponse → +1 pt via `heatLevel` (nouveau champ `preferences`)

---

## 6. Questions ouvertes

- [ ] Est-ce que **tous** les termes lexique donnent une carte, ou seulement les termes "pratique" ? (Ex : "consentement", "safeword" = termes abstraits — carte aussi ?)
- [ ] Combien de cartes par session de jeu ? 1 tirage ou plusieurs selon durée/score ?
- [ ] Le `unlockablePool` est-il visible par l'utilisateur (ex: "12 cartes à découvrir") ou opaque ?
- [ ] Les cartes dans le pool expirent-elles (urgence) ou restent indéfiniment disponibles ?

---

## 7. Prochaines étapes (à planifier)

**Contenu :**
1. Implémenter sodomie dans `pratiques-base` (5ème fiche, données + i18n FR)
2. Créer `pratiques-divergentes` module (palier 3) — 4 fiches
3. Créer `pratiques-avancees` et `pratiques-extremes` (paliers 4 et 5)

**Lexique :**
4. Ajouter `requiredModuleId` + `cardReward` sur `LexiqueEntry`
5. Gater les termes dans `LexiqueScreen` selon module complété

**Cartes :**
6. Refactorer `unlockStore` — séparer `unlockablePool` et `ownedCards`
7. Wirer le tirage aléatoire dans les fins de session de jeu

**Moi / Préférences :**
8. Créer `preferencesStore` (persist, topics gatés par module)
9. Refonte `MoiScreen` — sections progressives par module complété
10. Intégrer l'intersection dans Duo-flow
11. Brancher les réponses préférences sur le baromètre (+1 pt/réponse)
