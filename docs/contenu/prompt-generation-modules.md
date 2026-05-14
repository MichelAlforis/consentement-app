# Prompt — Génération de contenu pédagogique (modules d'apprentissage)

> Copie-colle ce prompt dans une nouvelle conversation Claude pour générer du contenu
> prêt à intégrer dans l'app Consentement.

---

## PROMPT À COPIER

```
Tu vas générer du contenu pédagogique pour l'application **Consentement** — une app d'éducation sexuelle française destinée à deux publics :
- **Adultes** (18+) : langage direct, sujets explicites possibles, humour subtil autorisé
- **Mineurs** (13-14 ans)** : même fond, ton plus doux, zéro langage explicite, jamais condescendant

**Philosophie de ton obligatoire :**
- Éducatif MAIS ludique — jamais moralisateur, jamais honteux
- Parler des mêmes sujets que la pornographie, mais avec le consentement et le droit comme boussoles
- Phrases courtes, vocabulaire accessible, respect de l'intelligence du lecteur
- Inclure des situations concrètes du quotidien (pas des abstractions)
- Perspective inclusive : éviter "il/elle" → préférer "quelqu'un", "la personne", "ton/ta partenaire", "vous"

---

## PARAMÈTRES À REMPLIR

- **Sujet du module** : [ex: alcool et consentement / BDSM / sexting / rupture et pression / jalousie]
- **Public** : adulte | mineur | les deux (générer les deux versions)
- **Format** : quiz | vrai-faux | dans-la-loi (voir specs ci-dessous)
- **Palier Baromètre du Hot** : 1-tiède | 2-chaud | 3-ardent | 4-brûlant | 5-incandescent
  (indique le niveau de franchise autorisé : 1 = tout public, 5 = très explicite adulte)
- **Nombre d'items** : [6 pour quiz, 6-10 pour vrai-faux, 5-8 pour dans-la-loi]
- **Namespace i18n** : [ex: alcoolConsent | sexting | rupturePression]

---

## FORMAT 1 — Quiz (QCM 4 options)

**UX :** L'utilisateur lit une question, choisit parmi 4 options, valide, reçoit feedback (bonne/mauvaise) + explication.

**Règles de design des questions :**
- Une seule bonne réponse, clairement correcte (pas de "ça dépend" ambigu)
- Les 3 mauvaises réponses doivent être plausibles (vraies croyances populaires, pas des absurdités)
- La bonne réponse ne doit PAS toujours être au même index — varier 0,1,2,3 aléatoirement
- L'explication doit apporter quelque chose de nouveau par rapport à la question (pas juste "car X est correct")
- Longueur question : max 120 caractères. Options : max 60 car. chacune. Explication : 1-2 phrases.

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export const [namespace]Quiz: QuizQuestion[] = [
  {
    id: '[namespace]-q1',
    question: '...',
    options: ['...', '...', '...', '...'],
    correctIndex: 0, // 0-3
    explanation: '...',
  },
  // × N items
];

// i18n FR (app/i18n/locales/fr/[namespace].ts) — à dupliquer en EN et ES
export const [namespace] = {
  [namespace]: {
    quiz: {
      title: '...',
      subtitle: '...',
      scoreLabels: { excellent: '...', good: '...', notBad: '...', retry: '...' },
      0: { question: '...', options: { 0: '...', 1: '...', 2: '...', 3: '...' }, explanation: '...' },
      1: { question: '...', ... },
      // × N
    },
  },
};
```

**Exemple d'item bien formé :**
```typescript
{
  id: 'alcool-q1',
  question: 'Ton/ta partenaire a bu et dit "oui". Ce consentement est-il valable ?',
  options: [
    'Oui, il/elle a quand même dit oui',      // index 0 — faux
    'Non, une personne ivre ne peut pas consentir valablement',  // index 1 — CORRECT
    'Ça dépend de combien il/elle a bu',       // index 2 — faux (piège fréquent)
    'Oui si c\'est une relation longue durée', // index 3 — faux
  ],
  correctIndex: 1,
  explanation: 'Le consentement doit être libre et éclairé. Sous l\'influence de l\'alcool, le jugement est altéré — même un "oui" n\'est pas valable légalement ni éthiquement.',
}
```

---

## FORMAT 2 — Vrai / Faux (accordéon comparatif)

**UX :** Chaque item est une carte accordéon avec deux badges côte à côte :
- Badge rouge **"IDÉE REÇUE"** → la croyance populaire fausse ou nuancée
- Badge vert **"RÉALITÉ"** → la vérité courte et directe
- En dépliée : **Explication** (1-3 phrases)

**Règles de design :**
- L'idée reçue doit être une vraie croyance qu'on entend souvent (pas un homme de paille)
- La réalité doit être tranchée, pas hedgée ("Oui mais..." affaiblit le message)
- Choisir un `iconName` parmi : `Heart | Flame | ShieldCheck | Sparkles | MessageCircle | Handshake | Moon | Clock | Zap | Lightbulb | Eye | EyeOff | Compass | MessageSquare`

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export interface VraiFauxItem {
  id: string;
  iconName: IconName;
}

export const [namespace]Items: VraiFauxItem[] = [
  { id: '[namespace]-vf1', iconName: 'Lightbulb' },
  // × N items
];

// i18n FR (app/i18n/locales/fr/[namespace].ts)
export const [namespace] = {
  [namespace]: {
    vraiFaux: {
      title: '...',
      subtitle: '...',
      badgeFaux: 'IDÉE REÇUE',
      badgeVrai: 'RÉALITÉ',
      closing: '...',
      0: { ideeRecue: '...', realite: '...', explication: '...' },
      1: { ... },
      // × N
    },
  },
};
```

**Exemple d'item bien formé :**
```typescript
// données
{ id: 'sexting-vf1', iconName: 'Eye' }

// i18n
0: {
  ideeRecue: 'Envoyer une photo intime à quelqu\'un qu\'on aime, c\'est normal et sans risque.',
  realite: 'Une fois envoyée, tu perds le contrôle de l\'image. Pour toujours.',
  explication: 'Même dans une relation de confiance, une photo peut être partagée sans ton accord — après une rupture, par accident, ou sous pression. Le partage non consenti d\'images intimes est un délit pénal en France (art. 226-2-1 CP).',
}
```

---

## FORMAT 3 — Dans la loi ? (fiches juridiques)

**UX :** Lecture linéaire de fiches textuelles. Chaque fiche = titre + paragraphe de contenu.
Les fiches marquées `important: true` ont un encadré coloré.

**Règles de design :**
- Ouvrir avec 1 fiche d'alerte `important: true` (le fait légal le plus fort)
- Mélanger faits légaux (articles de loi, définitions) et conséquences concrètes (peines, procédures)
- Langage : clair, pas de jargon juridique non expliqué — si terme technique, le définir dans la fiche
- Sources : citer l'article précis quand possible (CP art. XXX, CASF art. XXX)
- Longueur titre : max 60 car. Longueur contenu : 2-4 phrases max.

**Icônes disponibles :** mêmes que Format 2

**Structure de sortie :**

```typescript
// Données (app/data/[namespace].ts)
export interface LoiItem {
  id: string;
  iconName: IconName;
  important: boolean;
}

export const [namespace]LoiPoints: LoiItem[] = [
  { id: '[namespace]-loi1', iconName: 'ShieldCheck', important: true },
  { id: '[namespace]-loi2', iconName: 'Handshake', important: false },
  // × N items
];

// i18n FR (app/i18n/locales/fr/[namespace].ts)
export const [namespace] = {
  [namespace]: {
    loi: {
      title: '...',
      subtitle: '...',
      alert: { title: '...', text: '...' }, // HTML autorisé (<strong>, <br>)
      source1: 'Sources : ...',
      source2: 'Mis à jour : ...',
      0: { titre: '...', contenu: '...' },
      1: { titre: '...', contenu: '...' },
      // × N
    },
  },
};
```

**Exemple d'item bien formé :**
```typescript
// données
{ id: 'alcool-loi2', iconName: 'Zap', important: false }

// i18n
2: {
  titre: 'Ivresse et incapacité à consentir',
  contenu: 'Une personne en état d\'ivresse avancée est considérée comme hors d\'état de consentir. Profiter de cet état pour avoir un rapport sexuel constitue un viol ou une agression sexuelle, même si la personne n\'a pas dit non explicitement.',
}
```

---

## INSTRUCTIONS DE SORTIE

1. Génère d'abord le **bloc données TypeScript** (app/data/[namespace].ts)
2. Puis le **bloc i18n FR** (app/i18n/locales/fr/[namespace].ts)
3. Indique pour chaque item son `correctIndex` clairement commenté (Quiz) ou son `iconName` (Vrai/Faux, Loi)
4. Vérifie que les apostrophes sont **échappées** : `'` → `\'` dans les strings TypeScript
5. Termine par un **résumé de cohérence** : sujets couverts, lacunes éventuelles, suggestions de modules complémentaires

---

## APPEL

Génère maintenant un module **[FORMAT]** sur le sujet **[SUJET]**, pour le public **[PUBLIC]**,
au palier **[PALIER]**, avec **[N]** items, namespace `[NAMESPACE]`.
```

---

## Sujets prioritaires liés au Baromètre du Hot

| Palier | Sujet | Format recommandé | Public | Namespace |
|--------|-------|-------------------|--------|-----------|
| 2 — Chaud | Alcool & consentement | Quiz + Dans la loi | adulte | `alcoolConsent` |
| 2 — Chaud | Sexting & images intimes | Vrai/Faux | adulte + mineur | `sexting` |
| 2 — Chaud | Pression & manipulation | Quiz | adulte + mineur | `pressionManip` |
| 3 — Ardent | Rupture & harcèlement post-relation | Dans la loi | adulte | `ruptureHarcele` |
| 3 — Ardent | BDSM : consentement éclairé | Vrai/Faux | adulte | `bdsmConsent` |
| 4 — Brûlant | Pratiques explicites & communication | Quiz | adulte | `pratiquesExplicit` |
| 4 — Brûlant | Contenu non consenti (revenge porn) | Dans la loi | adulte | `contentNonConsenti` |
| 5 — Incandescent | Zones grises & situations complexes | Quiz | adulte | `zonesGrises` |

---

## Exemple d'appel complet

```
[coller le prompt ci-dessus, puis ajouter :]

Génère maintenant un module **vrai-faux** sur le sujet **sexting & images intimes**,
pour le public **adulte + mineur** (deux versions),
au palier **2-chaud**, avec **8 items**, namespace `sexting`.
```

---

## Notes d'intégration

Après génération, pour brancher le nouveau module dans l'app :

1. Créer `app/data/[namespace].ts` avec les données
2. Créer `app/i18n/locales/fr/[namespace].ts`, `en/[namespace].ts`, `es/[namespace].ts`
3. Ajouter `import { [namespace] } from './[namespace]'` + `...[namespace]` dans chaque `locales/*/index.ts`
4. Ajouter l'ID dans `ModuleId` (app/modules.ts)
5. Ajouter les points heat dans `MODULE_POINTS` (app/lib/heatLevel.ts)
6. Créer le screen ou réutiliser un screen générique (voir `QuizConsentementScreen` / `PornoVsRealiteScreen` / `LoiConsentementScreen` comme base)
7. Ajouter la route dans `app/types/index.ts` (Screen) + `app/routes.ts` + `app/components/app/RouteRenderer.tsx`
