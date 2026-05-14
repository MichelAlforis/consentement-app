# Prompt 2 — Formats avancés & sujets manquants

> Complément du prompt 1 (quiz / vrai-faux / loi).
> Ce prompt couvre 2 nouveaux formats + les sujets non traités en session 1.

---

## PROMPT À COPIER

```
Tu vas générer du contenu pédagogique pour l'application **Consentement** — une app d'éducation sexuelle française.

**Contexte obligatoire à lire avant de générer :**

Public double :
- **Adultes (18+)** : langage direct, pratiques explicites nommées sans détour, références légales précises
- **Mineurs (13-14 ans)** : même fond, zéro langage sexuel explicite, ton pair-à-pair (pas "adulte qui explique"), jamais condescendant

Philosophie de ton :
- Éducatif MAIS ludique — jamais moralisateur, jamais honteux
- Situations concrètes du quotidien (pas abstractions théoriques)
- Inclusif : "quelqu'un", "ton/ta partenaire", "vous" — éviter il/elle systématique
- Consentement et droit comme boussoles — pas la morale religieuse ou sociétale
- Nommer les choses par leur nom (adultes) ou par métaphore claire sans euphémisme flou (mineurs)

---

## PARAMÈTRES À REMPLIR

- **Sujet** : [voir tableau des sujets manquants en bas]
- **Public** : adulte | mineur | les deux
- **Format** : fiche-pratique | scenario | lexique (voir specs ci-dessous)
- **Palier Baromètre** : 1-tiède | 2-chaud | 3-ardent | 4-brûlant | 5-incandescent
- **Nombre d'items** : [5-8 pour fiche-pratique, 3-5 pour scenario, 10-20 pour lexique]
- **Namespace i18n** : [ex: pratiquesBase | scenariosConsent | lexiqueConsent]

---

## FORMAT 4 — Fiche pratique (descriptif + angle consentement)

**UX :** Chaque fiche = une pratique sexuelle ou un concept. Structure en 4 blocs :
1. **Définition** : 1-2 phrases neutres, factuelles
2. **Ce que le consentement implique** : spécifique à cette pratique, concret
3. **Ce que dit la loi** : article de loi FR si applicable, peine si violation
4. **Question clé** : 1 question à se poser avant / pendant / après

**Règles de design :**
- Définition : neutre et précise — ni romantisée ni alarmiste
- Angle consentement : toujours spécifique à la pratique (pas "demandez toujours", mais COMMENT pour cette pratique précisément)
- Loi : citer l'article exact. Si pas d'article spécifique → écrire "Régi par les principes généraux du consentement (art. 222-22 CP)"
- Question clé : pratique, fermée, utilisable dans une vraie conversation
- Ton adulte : nommer fellation, cunnilingus, pénétration, etc. sans détour
- Ton mineur : "contact intime oral", "rapport sexuel", "relations sexuelles" — clair mais pas graphique
- Longueur définition : 2-3 phrases. Consentement : 3-4 phrases. Loi : 2-3 phrases. Question : 1 phrase.

**iconName disponibles :** `Heart | Flame | ShieldCheck | Sparkles | MessageCircle | Handshake | Moon | Clock | Zap | Lightbulb | Eye | EyeOff | Compass | MessageSquare`

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export interface FichePratiqueItem {
  id: string;
  iconName: IconName;
}

export const [namespace]Fiches: FichePratiqueItem[] = [
  { id: '[namespace]-f1', iconName: 'Heart' },
  // × N
];

// i18n FR (app/i18n/locales/fr/[namespace].ts)
export const [namespace] = {
  [namespace]: {
    fiches: {
      title: '...',
      subtitle: '...',
      sectionDef: 'Définition',
      sectionConsent: 'Consentement',
      sectionLoi: 'Ce que dit la loi',
      sectionQuestion: 'Question à se poser',
      0: {
        titre: '...',
        definition: '...',
        consentement: '...',
        loi: '...',
        question: '...',
      },
      // × N
    },
  },
};
```

**Exemple d'item bien formé (adulte) :**
```typescript
0: {
  titre: 'Fellation',
  definition: 'Stimulation orale du pénis. Pratique courante dans les relations hétérosexuelles et homosexuelles masculines.',
  consentement: 'Le consentement doit être explicite et réitéré — notamment pour l\'éjaculation (lieu, moment). La personne qui donne peut s\'arrêter à tout moment sans avoir à s\'en justifier. La pression physique (maintien de la tête) sans accord préalable est une agression.',
  loi: 'Imposer une fellation sans consentement constitue un viol (art. 222-23 CP), puni de 15 ans de réclusion criminelle. La contrainte peut être physique ou morale (pression, menace implicite).',
  question: 'Avons-nous parlé de ce qui est ok et de ce qui ne l\'est pas pour cette pratique ?',
}
```

---

## FORMAT 5 — Scénario (situation → choix → conséquence)

**UX :** Une situation concrète est décrite. L'utilisateur choisit parmi 3-4 réactions possibles.
Chaque choix révèle une conséquence expliquée (pas de "bonne" réponse unique forcément — certains scénarios ont 2 réponses acceptables, d'autres une seule vraiment correcte).

**Règles de design :**
- La situation doit être réaliste et reconnaissable ("Tu es chez lui/elle, vous regardez un film...")
- Les choix doivent refléter des réactions réelles, pas des straw men ("violer quelqu'un" n'est pas un choix réaliste)
- La conséquence = ce qui se passe + pourquoi ce choix est bon/problématique + conseil concret
- 1-2 choix "plutôt bons", 1-2 choix "problématiques mais compréhensibles"
- Longueur situation : 3-5 phrases. Choix : 1 phrase chacun. Conséquence : 2-4 phrases.
- Champ `isIdeal: boolean` sur chaque choix (true = meilleure réponse, pour le scoring)

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export interface ScenarioChoice {
  isIdeal: boolean;
}

export interface ScenarioItem {
  id: string;
  choices: [ScenarioChoice, ScenarioChoice, ScenarioChoice] | [ScenarioChoice, ScenarioChoice, ScenarioChoice, ScenarioChoice];
}

export const [namespace]Scenarios: ScenarioItem[] = [
  {
    id: '[namespace]-s1',
    choices: [
      { isIdeal: false },
      { isIdeal: true },
      { isIdeal: true },
      { isIdeal: false },
    ],
  },
  // × N
];

// i18n FR
export const [namespace] = {
  [namespace]: {
    scenarios: {
      title: '...',
      subtitle: '...',
      labelChoix: 'Que fais-tu ?',
      labelConsequence: 'Ce qui se passe',
      0: {
        situation: '...',
        c0: { texte: '...', consequence: '...' },
        c1: { texte: '...', consequence: '...' },
        c2: { texte: '...', consequence: '...' },
        c3: { texte: '...', consequence: '...' },
      },
      // × N
    },
  },
};
```

**Exemple d'item bien formé :**
```typescript
0: {
  situation: 'Tu es chez quelqu\'un que tu viens de rencontrer. L\'ambiance est bonne, vous vous embrassez. Il/elle commence à défaire tes vêtements. Tu n\'as pas vraiment envie d\'aller plus loin ce soir, mais tu ne sais pas comment le dire sans "casser l\'ambiance".',
  c0: {
    texte: 'Tu te laisses faire — de toute façon c\'est agréable.',
    consequence: 'Continuer sans envie réelle, c\'est te mettre en dehors de l\'équation. Le consentement, c\'est aussi ton propre désir — pas juste l\'absence de refus. Sur le long terme, ça peut créer des situations où tu te sens utilisé·e.',
  },
  c1: {
    texte: 'Tu dis : "Attends, je voudrais qu\'on ralentisse un peu."',
    consequence: 'C\'est la meilleure option. Simple, direct, sans dramatiser. Une personne qui te respecte s\'arrêtera immédiatement. Si elle insiste malgré ça, c\'est une information importante sur elle.',
  },
  c2: {
    texte: 'Tu t\'inventes une excuse (mal à la tête, heure tardive).',
    consequence: 'Ça marche à court terme, mais ça ne te donne pas l\'habitude de communiquer clairement. Et si l\'autre pense que c\'est juste "ce soir", ça peut créer des malentendus pour la prochaine fois.',
  },
  c3: {
    texte: 'Tu continues et tu espères que ça se passe bien.',
    consequence: 'Espérer que ça passe plutôt que de le dire, c\'est mettre ton propre bien-être en parenthèse. Ce n\'est pas une question de courage — c\'est une habitude qui s\'apprend. Commencer par "attends" suffit.',
  },
}
```

---

## FORMAT 6 — Lexique (glossaire interactif)

**UX :** Liste de termes définis, avec possibilité de "débloquer" chaque mot (+1 pt heat).
Chaque entrée = mot + définition courte + niveau de maîtrise.

**Règles de design :**
- Définition : 1-3 phrases max, vocabulaire accessible
- Niveau : `debutant` | `intermediaire` | `expert` (détermine l'ordre d'affichage)
- Catégorie : `juridique` | `pratique` | `emotionnel` | `medical`
- Adultes : termes explicites nommés directement
- Mineurs : termes adaptés à l'âge (même catégories, autre vocabulaire si nécessaire)

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export interface LexiqueEntry {
  id: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
  categorie: 'juridique' | 'pratique' | 'emotionnel' | 'medical';
}

export const [namespace]Lexique: LexiqueEntry[] = [
  { id: 'lex-001', niveau: 'debutant', categorie: 'juridique' },
  // × N
];

// i18n FR
export const [namespace] = {
  [namespace]: {
    lexique: {
      title: 'Lexique du consentement',
      subtitle: '...',
      niveaux: { debutant: 'Débutant', intermediaire: 'Intermédiaire', expert: 'Expert' },
      categories: { juridique: 'Juridique', pratique: 'Pratique', emotionnel: 'Émotionnel', medical: 'Médical' },
      'lex-001': { terme: '...', definition: '...' },
      // × N
    },
  },
};
```

**Exemple d'entrées :**
```typescript
'lex-001': { terme: 'Consentement', definition: 'Accord libre, éclairé et révocable donné par une personne pour participer à un acte. Il peut être retiré à tout moment, même si on a dit oui avant.' },
'lex-002': { terme: 'Safeword', definition: 'Mot ou signal convenu entre partenaires pour stopper immédiatement une situation. Doit être respecté sans exception ni délai.' },
'lex-003': { terme: 'Viol', definition: 'Acte de pénétration sexuel sans consentement. Défini par l\'art. 222-23 du Code pénal français, puni de 15 ans de réclusion criminelle.' },
```

---

## SUJETS MANQUANTS (non couverts en session 1)

| Palier | Sujet | Format recommandé | Public | Namespace |
|--------|-------|-------------------|--------|-----------|
| 1 — Tiède | Pratiques de base (fellation, cunnilingus, masturbation mutuelle, pénétration) | Fiche pratique | adulte | `pratiquesBase` |
| 1 — Tiède | Lexique du consentement (20 termes essentiels) | Lexique | adulte + mineur | `lexiqueConsent` |
| 2 — Chaud | Scénarios quotidiens (pression implicite, ambiguïté, communication) | Scénario | adulte + mineur | `scenariosQuotidiens` |
| 2 — Chaud | Inclusion LGBTQ+ & consentement (spécificités, mythes) | Vrai/Faux | adulte + mineur | `lgbtqConsent` |
| 3 — Ardent | Pratiques avancées (BDSM base, jeux de rôle, menottes) | Fiche pratique | adulte | `pratiquesAvancees` |
| 3 — Ardent | Scénarios couple établi (routine, baisse de désir, pression affective) | Scénario | adulte | `scenariosCouple` |
| 4 — Brûlant | Pratiques explicites avancées (sodomie, scat, fétichismes) | Fiche pratique | adulte | `pratiquesExtremes` |
| 4 — Brûlant | Numérique & consentement (cam sex, OnlyFans, IA générative) | Quiz + Vrai/Faux | adulte | `numerique` |
| 5 — Incandescent | Droit comparé (âges légaux, lois par pays) | Loi (format étendu) | adulte | `droitCompare` |
| Mineur only | Scénarios ado (première fois, pression des ami·e·s, réseaux sociaux) | Scénario | mineur | `scenariosAdo` |
| Mineur only | Premières fois — ce qu'on ne dit jamais (émotions, douleur, droit de changer d'avis) | Fiche pratique (ton adapté) | mineur | `premiereFois` |

---

## INSTRUCTIONS DE SORTIE

1. Génère le **bloc données TypeScript** (app/data/[namespace].ts)
2. Génère le **bloc i18n FR** (app/i18n/locales/fr/[namespace].ts)
3. Pour les scénarios, note clairement `isIdeal: true/false` sur chaque choix
4. Pour les fiches pratiques, distingue clairement le bloc adulte et le bloc mineur si tu génères les deux
5. Apostrophes **échappées** : `'` → `\'`
6. Termine par : lacunes éventuelles dans le contenu généré + suggestion du module complémentaire logique

---

## APPEL

Génère maintenant un module **[FORMAT]** sur le sujet **[SUJET]**,
pour le public **[PUBLIC]**, au palier **[PALIER]**,
avec **[N]** items, namespace `[NAMESPACE]`.
```

---

## Notes d'intégration spécifiques aux nouveaux formats

### Fiche pratique → écran à créer
Réutiliser le layout de `LoiConsentementScreen` comme base — même structure de cartes verticales.
Ajouter 4 sections par carte (def / consentement / loi / question) avec des `AccordionSection` ou des blocs colorés différenciés.

### Scénario → écran à créer
Nouveau composant `ScenarioScreen` :
- Affichage de la situation (card narrative)
- 3-4 boutons choix (tap → révèle la conséquence + indicateur idéal/problématique)
- Pas de score : l'objectif est la réflexion, pas la performance
- Bouton "Suivant" après avoir lu la conséquence

### Lexique → écran à créer
Composant `LexiqueScreen` :
- Liste filtrée par niveau / catégorie
- Chaque entrée "déverrouillable" → +1 pt heat au premier tap
- Recherche textuelle basique
- Stockage dans `moduleProgressStore` : `unlockedLexique: string[]`
```
