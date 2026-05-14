# Prompt 3 — Lexique du consentement + cartes gagnables

> Spécifique au système de mots débloqués par le Baromètre du Hot.
> Chaque mot = 1 carte collector jouable dans CardGame.

---

## CONCEPT CLEF À COMPRENDRE AVANT DE GÉNÉRER

Le lexique n'est **pas** un simple glossaire passif. Chaque mot débloqué devient une **carte collector** qui entre dans le pool de jeu (CardGame). La carte porte :

- **Recto** (visible dans le Hall of Cards) : le mot + sa définition courte
- **Text de jeu** (affiché dans CardGame) : le mot reformulé en **question ou défi de conversation**

Ainsi, apprendre un mot = gagner un outil de discussion. Le lexique est à la fois éducatif et jouable.

**Règle de déblocage :** les mots ne sont pas gagnés par la complétion d'un module, mais par l'atteinte d'un palier du Baromètre du Hot. Convention dans le code : `unlockedBy: 'heat-N'` (N = palier 1 à 5).

**Rareté par palier :**
| Palier | Rareté carte | Couleur thermomètre |
|--------|-------------|---------------------|
| 1 — Tiède | common | bleu |
| 2 — Chaud | common | amber |
| 3 — Ardent | rare | orange |
| 4 — Brûlant | unique | rouge |
| 5 — Incandescent | unique | or |

---

## PROMPT À COPIER

```
Tu vas générer du contenu pour le **Lexique du Consentement** de l'application Consentement.

Ce lexique a une double nature :
1. **Écran Lexique** — définitions pédagogiques consultables
2. **Cartes collector** — chaque mot devient une carte jouable dans le CardGame

**Contexte app :**
- App d'éducation sexuelle française, public adulte (18+) et mineur (13-14 ans)
- Ton : éducatif, direct, non-moralisateur, inclusif
- Lexique adulte : nommer les choses par leur nom, références légales si pertinentes
- Lexique mineur : même mots quand possible, définitions adaptées à l'âge

---

## PARAMÈTRES À REMPLIR

- **Palier Baromètre** : 1 | 2 | 3 | 4 | 5 (détermine rareté + quand les mots se débloquent)
- **Nombre de mots** : [recommandé : 8-15 par palier]
- **Public** : adulte | mineur | les deux (générer deux versions de définition)
- **Catégories à couvrir** : juridique | émotionnel | pratique | médical | BDSM | numérique

---

## STRUCTURE DE SORTIE — 3 BLOCS

### Bloc 1 : Entrées lexique (i18n FR)

```typescript
// app/i18n/locales/fr/lexiqueConsent.ts
export const lexiqueConsent = {
  lexiqueConsent: {
    title: 'Lexique du consentement',
    subtitle: 'Un mot appris = une carte gagnée',
    categories: {
      juridique:   'Juridique',
      emotionnel:  'Émotionnel',
      pratique:    'Pratique',
      medical:     'Médical',
      bdsm:        'BDSM & pratiques',
      numerique:   'Numérique',
    },
    paliers: {
      1: 'Tiède — Les bases',
      2: 'Chaud — Aller plus loin',
      3: 'Ardent — Maîtrise',
      4: 'Brûlant — Expert',
      5: 'Incandescent — Références',
    },
    mots: {
      'lex-001': {
        terme: '...',
        definition: '...',          // adulte — 1-3 phrases, directe
        definitionMineur: '...',   // mineur — même fond, ton adapté
        exemple: '...',            // phrase d'usage concret (optionnel)
        source: '...',             // référence légale si applicable (ex: "CP art. 222-22")
      },
      // × N mots
    },
  },
};
```

### Bloc 2 : Cartes collector (cards-collector)

Pour chaque mot, générer une entrée `CollectorCard` à ajouter dans `app/data/cards-collector.ts` :

```typescript
// À ajouter dans collectorCards[] — Deck L (Lexique)
{
  id: 'lex-001',          // = même id que l'entrée lexique
  deck: 'A',              // 'A' pour adulte, 'M' pour mineur
  theme: '...',           // choisir parmi : osez | parlez | et-si | defi | verite | douceur
  depth: 1,               // 1=common, 2=rare, 3=unique (calé sur le palier)
  rarity: 'common',       // common (palier 1-2) | rare (palier 3) | unique (palier 4-5)
  unlockedBy: 'heat-1',   // heat-1 à heat-5 selon le palier
  tags: ['lexique', 'juridique'],  // toujours inclure 'lexique' + la catégorie
  visual: {
    gradient: '...',  // voir table des visuels ci-dessous
    iconName: '...',  // voir table ci-dessous
    border: '...',
  },
  text: '...',  // ← QUESTION OU DÉFI DE CONVERSATION (pas la définition brute)
},
```

**Règle du `text` de la carte (le plus important) :**
Le text n'est PAS la définition. C'est la définition **transformée en outil de conversation** :
- Format question : "Savez-vous exactement ce que signifie [terme] ? Expliquez-le à voix haute l'un pour l'autre."
- Format défi : "Chacun donne un exemple concret de [terme] dans votre relation."
- Format vérite : "Avez-vous déjà vécu une situation où [terme] n'était pas respecté ? Comment s'est-elle résolue ?"
- Format et-si : "Et si vous définissiez [terme] ensemble, sans regarder une définition — qu'est-ce que vous mettriez dedans ?"
Longueur text : 1-2 phrases max, naturelles à lire à voix haute.

**Table des visuels par catégorie :**
| Catégorie | theme | gradient | iconName | border |
|-----------|-------|----------|----------|--------|
| juridique | defi | `linear-gradient(135deg, #3b82f6, #2563eb)` | `ShieldCheck` | `#93c5fd` |
| émotionnel | douceur | `linear-gradient(135deg, #be123c, #9f1239)` | `Heart` | `#fda4af` |
| pratique | osez | `linear-gradient(135deg, #f59e0b, #d97706)` | `Lightbulb` | `#fbbf24` |
| médical | parlez | `linear-gradient(135deg, #8b5cf6, #7c3aed)` | `Compass` | `#a78bfa` |
| BDSM | et-si | `linear-gradient(135deg, #ec4899, #db2777)` | `Zap` | `#f9a8d4` |
| numérique | verite | `linear-gradient(135deg, #10b981, #059669)` | `Eye` | `#6ee7b7` |

### Bloc 3 : Métadonnées de données (app/data/lexiqueConsent.ts)

```typescript
// app/data/lexiqueConsent.ts
export type LexiqueCategorie = 'juridique' | 'emotionnel' | 'pratique' | 'medical' | 'bdsm' | 'numerique';

export interface LexiqueEntry {
  id: string;                    // ex: 'lex-001'
  palier: 1 | 2 | 3 | 4 | 5;   // palier de déblocage
  categorie: LexiqueCategorie;
  hasMineur: boolean;            // définition mineur disponible
}

export const LEXIQUE_ENTRIES: LexiqueEntry[] = [
  { id: 'lex-001', palier: 1, categorie: 'juridique', hasMineur: true },
  // × N
];
```

---

## EXEMPLES D'ENTRÉES BIEN FORMÉES

### Mot palier 1 — "Consentement" (juridique, commun)

**i18n :**
```typescript
'lex-001': {
  terme: 'Consentement',
  definition: 'Accord libre, éclairé, explicite et révocable donné par une personne pour participer à un acte sexuel. Il peut être retiré à tout moment — même si on a dit oui avant. Le silence ou l\'absence de résistance ne constitue pas un consentement.',
  definitionMineur: 'C\'est dire oui clairement — pas juste ne pas dire non. Tu peux changer d\'avis à tout moment, même si tu avais accepté au départ. Le consentement, ça se donne et ça se reprend.',
  exemple: '"Ton oui d\'hier soir ne vaut pas pour ce matin."',
  source: 'CP art. 222-22, 222-22-1',
},
```

**Carte collector :**
```typescript
{
  id: 'lex-001', deck: 'A', theme: 'defi', depth: 1, rarity: 'common',
  unlockedBy: 'heat-1', tags: ['lexique', 'juridique'],
  visual: { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', iconName: 'ShieldCheck', border: '#93c5fd' },
  text: 'Chacun explique "consentement" dans ses propres mots. Est-ce que vos définitions se rejoignent ?',
}
```

---

### Mot palier 2 — "Safeword" (BDSM/pratique, adulte)

**i18n :**
```typescript
'lex-012': {
  terme: 'Safeword (mot de sécurité)',
  definition: 'Mot ou signal convenu entre partenaires pour stopper immédiatement une situation — quelle qu\'elle soit. Doit être respecté sans délai ni questionnement. Recommandé dans toute relation, pas seulement en BDSM.',
  definitionMineur: 'Un mot ou un signal que tu peux dire pour que tout s\'arrête immédiatement. À définir avec quelqu\'un en qui tu as confiance avant de commencer quoi que ce soit.',
  exemple: '"Rouge" (stop total) / "Orange" (pause) / "Vert" (continue) — le système traffic light.',
  source: undefined,
},
```

**Carte collector :**
```typescript
{
  id: 'lex-012', deck: 'A', theme: 'et-si', depth: 1, rarity: 'common',
  unlockedBy: 'heat-2', tags: ['lexique', 'bdsm'],
  visual: { gradient: 'linear-gradient(135deg, #ec4899, #db2777)', iconName: 'Zap', border: '#f9a8d4' },
  text: 'Et si vous définissiez votre safeword maintenant, même si vous pensez ne pas en avoir besoin ?',
}
```

---

### Mot palier 4 — "Dissociation" (émotionnel/médical, adulte)

**i18n :**
```typescript
'lex-034': {
  terme: 'Dissociation (réponse traumatique)',
  definition: 'Réaction psychologique où une personne "se coupe" mentalement de ce qui se passe — corps présent, esprit ailleurs. Peut survenir pendant un rapport consenti si une expérience passée est réactivée. Ce n\'est pas un refus silencieux — c\'est une détresse qui mérite qu\'on s\'arrête.',
  definitionMineur: undefined,
  exemple: 'Quelqu\'un qui semble "partir ailleurs", ne répond plus, regarde dans le vide en pleine intimité.',
  source: 'DSM-5 · Référence clinique trauma sexuel',
},
```

**Carte collector :**
```typescript
{
  id: 'lex-034', deck: 'A', theme: 'verite', depth: 3, rarity: 'unique',
  unlockedBy: 'heat-4', tags: ['lexique', 'emotionnel', 'medical'],
  visual: { gradient: 'linear-gradient(135deg, #10b981, #059669)', iconName: 'Eye', border: '#6ee7b7' },
  text: 'Sauriez-vous reconnaître si l\'autre dissociait ? Comment réagiriez-vous ?',
}
```

---

## MOTS SUGGÉRÉS PAR PALIER

### Palier 1 — Tiède (bases absolues, common)
Consentement · Refus · Limite · Safeword · Coercition · Autonomie corporelle · Intimité · Confiance

### Palier 2 — Chaud (aller plus loin, common)
Consentement éclairé · Consentement enthousiaste · Pression implicite · Manipulation émotionnelle · Revenge porn · Sexting · Capacité à consentir · Ivresse & consentement · Coercition sexuelle · Harcèlement

### Palier 3 — Ardent (pratiques avancées, rare)
BDSM · Power exchange · Négociation (BDSM) · Aftercare · Hard limit · Soft limit · CNC (Consensual Non-Consent) · Kink · SSC (Safe Sane Consensual) · RACK (Risk-Aware Consensual Kink)

### Palier 4 — Brûlant (expert, unique)
Dissociation · Trauma sexuel · Réponse freeze · Gaslighting sexuel · Viol conjugal · Sextorsion · Droit pénal du viol (définition légale) · Agression sexuelle sans pénétration · Circonstances aggravantes

### Palier 5 — Incandescent (références, unique)
Droit comparé du consentement · Age of consent (international) · Capacité juridique & mineur · Consentement et handicap mental · Doctrine de l\'affirmative consent · Jurisprudence Cour de cassation · CEDH & droit à l\'intimité

---

## INSTRUCTIONS DE SORTIE

1. Génère les **3 blocs** dans l'ordre : i18n → data entries → cartes collector
2. Les cartes collector : sortie prête à copier dans `collectorCards[]` dans `cards-collector.ts`
3. IDs lexique : format `lex-XXX` (continuer à partir de lex-001 ou du dernier ID existant)
4. Apostrophes **échappées** : `'` → `\'`
5. Si `hasMineur: false` → ne pas générer `definitionMineur` (mettre `undefined`)
6. Le `text` de la carte = toujours une phrase naturelle à lire à voix haute, jamais une définition brute
7. Termine par : liste des mots générés + palier + rareté (tableau récap)

---

## APPEL

Génère maintenant le lexique **palier [N]**, [N] mots,
catégories [liste], public [adulte/mineur/les deux].
```

---

## Intégration dans l'app

### Nouveau trigger de déblocage dans `computeHeatPoints`

Les mots lexique ne sont pas débloqués par module — ils le sont par franchissement de palier.
Le store `unlockStore` doit écouter le changement de `heatLevel` et débloquer les cartes dont `unlockedBy === 'heat-N'`.

**À implémenter dans `useHeat()` ou dans un `useEffect` dans `AppShell` :**
```typescript
// Quand heatLevel change (ex: 1→2), débloquer toutes les cartes heat-2
const newCards = collectorCards.filter(c => c.unlockedBy === `heat-${newLevel}`);
if (newCards.length > 0) {
  unlockCards(newCards.map(c => ({ id: c.id, ... })));
  setPending(newCards.map(c => c.id)); // → FlipRevealOverlay
}
```

### Écran Lexique

Nouveau screen `LexiqueScreen` :
- Liste filtrée par palier (tabs) et catégorie (chips)
- Mots verrouillés visibles (FOMO) avec thermomètre et pts manquants
- Mot débloqué = tap → définition complète + badge carte gagnée
- Recherche textuelle

### Stockage
- `unlockedLexique: string[]` dans `unlockStore` (ids des mots consultés)
- Mots disponibles = `LEXIQUE_ENTRIES.filter(e => e.palier <= heatLevel)`
- Cartes gagnées = via le même `unlockCards()` que tous les autres modules

### Scoring heat
- Les mots lexique ne rapportent **pas de pts heat** à la consultation
- Les pts heat sont gagnés en **atteignant le palier** (qui débloque les mots)
- → Pas de double comptage
```
