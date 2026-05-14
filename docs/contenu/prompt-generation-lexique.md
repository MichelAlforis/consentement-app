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

---

## ⚠️ PRINCIPE FONDAMENTAL — Rareté et Heat sont des axes INDÉPENDANTS

La rareté ne découle **pas** du palier. Ce sont deux décisions séparées :

| Axe | Ce qu'il mesure |
|-----|----------------|
| **`unlockedBy: 'heat-N'`** | À quel niveau de progression la carte se débloque (explicitness, confiance requise) |
| **`rarity`** | La valeur collectionnable — à quel point c'est une pépite comme expérience de jeu |

**Exemples qui illustrent l'indépendance :**

- `heat-5` + `common` : "Mime ta position favorite seul" → très explicite (heat 5 requis), mais simple comme idée → common
- `heat-1` + `rare` : "Embrasse ton/ta partenaire avec un vrai french kiss pendant 60s" → accessible dès heat-1, mais vraie action intime mémorable → rare

**Guide pour choisir la rareté (décision éditoriale mot par mot) :**

| Rareté | Critère |
|--------|---------|
| `common` | Simple, direct, facile à jouer |
| `rare` | Nuancé, crée un vrai moment, difficile à dire à voix haute |
| `unique` | Mémorable, surprenant, révélation ou action forte |

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

## REGLE CRITIQUE — Rareté et Heat sont INDÉPENDANTS

Ne jamais déduire la rareté du palier automatiquement.

- `unlockedBy: 'heat-N'` = quand la carte est accessible (explicitness/confiance)
- `rarity` = valeur collectionnable, décision éditoriale mot par mot

Exemples :
- heat-5 + common = "Mime ta position favorite" → très chaud, mais concept simple → common
- heat-1 + rare = "Embrasse avec un vrai french kiss 60s" → accessible, action mémorable → rare
- heat-3 + unique = défi profond de confiance, même à chaleur modérée → unique

Guide rareté :
| Rareté | Critère |
|--------|---------|
| common | Simple, direct, facile à jouer |
| rare | Nuancé, crée un moment, difficile à dire à voix haute |
| unique | Mémorable, surprenant, révélation ou action forte |

---

## PARAMÈTRES À REMPLIR

- **Palier Baromètre** : 1 à 5 (contrôle QUAND la carte se débloque — PAS la rareté)
- **Rareté** : décision éditoriale mot par mot — voir guide ci-dessus
- **Nombre de mots** : recommandé 8-15 par palier
- **Public** : adulte | mineur | les deux
- **Catégories** : juridique | emotionnel | pratique | medical | bdsm | numerique

---

## STRUCTURE DE SORTIE — 3 BLOCS

### Bloc 1 : i18n FR (app/i18n/locales/fr/lexiqueConsent.ts)

export const lexiqueConsent = {
  lexiqueConsent: {
    title: 'Lexique du consentement',
    subtitle: 'Un mot appris = une carte gagnée',
    categories: { juridique: 'Juridique', emotionnel: 'Émotionnel', pratique: 'Pratique', medical: 'Médical', bdsm: 'BDSM & pratiques', numerique: 'Numérique' },
    paliers: { 1: 'Tiède — Les bases', 2: 'Chaud', 3: 'Ardent', 4: 'Brûlant', 5: 'Incandescent' },
    mots: {
      'lex-001': {
        terme: '...',
        definition: '...',          // adulte — 1-3 phrases directes
        definitionMineur: '...',   // mineur — même fond, ton adapté (ou undefined)
        exemple: '...',            // phrase d'usage concret (optionnel)
        source: '...',             // ex: "CP art. 222-22" (ou undefined)
      },
    },
  },
};

### Bloc 2 : Cartes collector (à ajouter dans app/data/cards-collector.ts)

{
  id: 'lex-001',
  deck: 'A',              // 'A' adulte, 'M' mineur
  theme: '...',           // osez | parlez | et-si | defi | verite | douceur
  depth: 1,               // 1=common, 2=rare, 3=unique — INDEPENDANT du palier
  rarity: 'common',       // décision éditoriale (voir guide)
  unlockedBy: 'heat-1',   // heat-1 à heat-5
  tags: ['lexique', 'juridique'],
  visual: { gradient: '...', iconName: '...', border: '...' },
  text: '...',            // QUESTION OU DEFI (jamais la définition brute)
  // Justification rareté : [1 ligne]
},

Visuels par catégorie :
| Catégorie | theme   | gradient                                        | iconName     | border    |
|-----------|---------|--------------------------------------------------|--------------|-----------|
| juridique | defi    | linear-gradient(135deg, #3b82f6, #2563eb)        | ShieldCheck  | #93c5fd   |
| emotionnel| douceur | linear-gradient(135deg, #be123c, #9f1239)        | Heart        | #fda4af   |
| pratique  | osez    | linear-gradient(135deg, #f59e0b, #d97706)        | Lightbulb    | #fbbf24   |
| medical   | parlez  | linear-gradient(135deg, #8b5cf6, #7c3aed)        | Compass      | #a78bfa   |
| bdsm      | et-si   | linear-gradient(135deg, #ec4899, #db2777)        | Zap          | #f9a8d4   |
| numerique | verite  | linear-gradient(135deg, #10b981, #059669)        | Eye          | #6ee7b7   |

Formats du text de carte (choisir le plus adapté) :
- Question  : "Chacun explique [terme] dans ses propres mots. Vos définitions se rejoignent-elles ?"
- Défi      : "Donnez chacun un exemple concret de [terme] dans votre relation."
- Vérité    : "Avez-vous déjà vécu une situation où [terme] n'était pas respecté ?"
- Et-si     : "Et si vous définissiez [terme] ensemble sans chercher sur internet ?"
- Action    : "[Instruction directe à faire maintenant, ex: Mime ta position favorite.]"

### Bloc 3 : Métadonnées (app/data/lexiqueConsent.ts)

export const LEXIQUE_ENTRIES: LexiqueEntry[] = [
  { id: 'lex-001', palier: 1, rarity: 'common', categorie: 'juridique', hasMineur: true },
];

---

## EXEMPLES COMPLETS

### heat-1 + common — "Consentement"
i18n :
'lex-001': {
  terme: 'Consentement',
  definition: 'Accord libre, éclairé, explicite et révocable pour participer à un acte sexuel. Peut être retiré à tout moment — même si on avait dit oui avant. Le silence ne constitue pas un consentement.',
  definitionMineur: 'C\'est dire oui clairement — pas juste ne pas dire non. Tu peux changer d\'avis à tout moment.',
  exemple: '"Ton oui d\'hier soir ne vaut pas pour ce matin."',
  source: 'CP art. 222-22',
},
Carte : depth 1, rarity 'common', theme 'defi', iconName 'ShieldCheck'
// Justification : concept fondamental, question simple → common

### heat-1 + rare — "Safeword"
i18n :
'lex-004': {
  terme: 'Safeword',
  definition: 'Mot convenu pour stopper immédiatement une situation. Doit être respecté sans délai ni question. Utile dans toute relation, pas seulement en BDSM.',
  definitionMineur: 'Un mot que tu peux dire pour que tout s\'arrête immédiatement.',
  exemple: '"Rouge" = stop total. "Orange" = pause.',
  source: undefined,
},
Carte : depth 2, rarity 'rare', theme 'et-si', iconName 'Zap'
// Justification : heat-1 (accessible), rare car action à faire ensemble = moment fort

### heat-5 + common — "Position sexuelle"
i18n :
'lex-041': {
  terme: 'Position sexuelle',
  definition: 'Arrangement corporel pendant un rapport. Chaque position peut être négociée ou refusée indépendamment.',
  definitionMineur: undefined,
  exemple: 'Proposer une position, c\'est une invitation — pas une instruction.',
  source: undefined,
},
Carte : depth 1, rarity 'common', theme 'osez', iconName 'Lightbulb'
// Justification : heat-5 (très explicite), common car l'action demandée est simple

### heat-4 + unique — "Dissociation"
i18n :
'lex-034': {
  terme: 'Dissociation',
  definition: 'Réaction psychologique où une personne se coupe mentalement de ce qui se passe. Corps présent, esprit ailleurs. Pas un refus silencieux — une détresse qui mérite qu\'on s\'arrête.',
  definitionMineur: undefined,
  exemple: 'Quelqu\'un qui regarde dans le vide, ne répond plus, semble absent·e.',
  source: 'DSM-5',
},
Carte : depth 3, rarity 'unique', theme 'verite', iconName 'Eye'
// Justification : heat-4, unique car défi de sincérité profonde et rare à aborder

---

## MOTS SUGGÉRÉS PAR PALIER

Palier 1 : Consentement · Refus · Limite · Safeword · Intimité · Confiance · Autonomie corporelle
Palier 2 : Consentement enthousiaste · Pression implicite · Manipulation émotionnelle · Revenge porn · Sexting · Ivresse & consentement · Harcèlement
Palier 3 : BDSM · Power exchange · Aftercare · Hard limit · Soft limit · CNC · SSC · RACK
Palier 4 : Dissociation · Trauma sexuel · Réponse freeze · Gaslighting sexuel · Viol conjugal · Sextorsion
Palier 5 : Position sexuelle · Fellation · Cunnilingus · Droit comparé du consentement · Affirmative consent doctrine

---

## INSTRUCTIONS DE SORTIE

1. Générer les 3 blocs dans l'ordre : i18n → LEXIQUE_ENTRIES → collectorCards
2. Justifier la rareté de chaque carte (1 ligne en commentaire)
3. IDs : format lex-XXX en continuant depuis le dernier
4. Apostrophes échappées : ' → \'
5. hasMineur: false → definitionMineur: undefined
6. text de carte = toujours naturel à lire à voix haute, jamais une définition
7. Tableau récap final : mot · palier · rareté · justification rareté

---

## APPEL

Génère maintenant le lexique palier [N], [N] mots, catégories [liste], public [adulte/mineur/les deux].
```

---

## Intégration dans l'app

### Trigger de déblocage au franchissement de palier

```typescript
// Dans AppShell — useEffect sur heatLevel
useEffect(() => {
  const newCards = collectorCards.filter(c => c.unlockedBy === `heat-${heatLevel}`);
  if (newCards.length > 0) {
    unlockCards(newCards.map(c => ({ id: c.id, ... })));
    setPending(newCards.map(c => c.id)); // → FlipRevealOverlay
  }
}, [heatLevel]);
```

### Écran Lexique (à créer)
- Tabs par palier (verrouillés si heat insuffisant — FOMO visible)
- Chips catégorie + recherche textuelle
- Mot débloqué = tap → définition complète + badge "Carte gagnée"

### Scoring heat
- Pas de pts heat à la consultation des mots
- Les pts sont gagnés en atteignant le palier (qui débloque les mots)
- Pas de double comptage
