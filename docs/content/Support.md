# Support & Ressources — Blocs G et H

> Dernière mise à jour : 2026-04-27 — **IMPLÉMENTÉ** ✅

---

## Vue d'ensemble

Deux écrans complémentaires accessibles depuis `MoiScreen` (adultes) :

| Bloc | Écran | Route | Description |
|------|-------|-------|-------------|
| G | `AccompagnementAdulteScreen` | `accompagnement-adulte` | Orientation situationnelle + ressources d'urgence |
| H | `AnnuaireSexologuesScreen` | *(modal depuis Bloc G)* | Annuaire sexologues filtrable |

**⚠️ Contenu à valider avec le juriste co-fondateur avant publication** (commentaire en tête de `AccompagnementAdulteScreen.tsx`).

---

## Bloc G — AccompagnementAdulteScreen

**Fichier :** `app/components/screens/AccompagnementAdulteScreen.tsx`  
**i18n :** `education.accompagnementAdulte.*`  
**Accès :** adultes uniquement (card "Soutien & accompagnement" dans MoiScreen)

### Flow 3 étapes

```
[intro]
  "Tu traverses quelque chose ?"
  "Un espace confidentiel, sans jugement."
  Note : aucune donnée enregistrée
  → CTA "Continuer"
        ↓
[situation] — 3 choix
  ① "J'ai vécu quelque chose qui m'a perturbé·e"  → victim
  ② "Je m'interroge sur mon propre comportement"   → self
  ③ "J'ai été témoin d'une situation"              → witness
        ↓
[resources] — ressources ciblées selon situation
```

### Ressources par situation

| Situation | Ressources affichées |
|-----------|---------------------|
| **victim** | 3919 (Violences Femmes Info), Police/Gendarmerie 17, signalement.gouv.fr |
| **self** | Planning Familial, lien direct vers l'Annuaire Sexologues (Bloc H) |
| **witness** | 3919, Police/Gendarmerie 17 |

### Props

```ts
interface AccompagnementAdulteScreenProps {
  onBack: () => void;
  onGoAnnuaire?: () => void;  // lien direct Bloc H depuis situation "self"
}
```

---

## Bloc H — AnnuaireSexologuesScreen

**Fichier :** `app/components/screens/AnnuaireSexologuesScreen/index.tsx`  
**Data :** `app/data/sexologues.ts`  
**Accès :** carte "Annuaire sexologues" dans MoiScreen + lien depuis Bloc G (situation "self")

### Données — `sexologues.ts`

**10 profils fictifs réalistes** basés sur la structure des annuaires SNSC/AIUS/Doctolib.  
À remplacer par de vrais profils avec accord des professionnels avant publication.

```ts
type Sexologue = {
  id, prenom, nom, titre, labels, ville, departement,
  bio, specialites, approches, publics,
  consultation,           // 'présentiel' | 'téléconsultation' | 'les deux'
  tarifPremiere, tarifSuivi, tarifCouple?, dureeMinutes,
  remboursementSS,
  langues, telephone, doctolib?
}

type TitreProf =
  | 'Médecin sexologue'
  | 'Psychologue sexologue'
  | 'Sexologue clinicien·ne (SNSC)'
  | 'Psychosexologue'
  | 'Sexosexologue & thérapeute de couple'

type Label = 'SNSC' | 'AIUS' | 'SFSC'
```

**Spécialités couvertes :** vaginisme, dyspareunie, anorgasmie, dysfonction érectile, éjaculation précoce/retardée, BDSM/kink, polyamour, traumatismes sexuels.

**Départements disponibles :** exportés via `ALL_DEPARTEMENTS` depuis `sexologues.ts`.

### Filtres

```
[Recherche libre]  → prenom, nom, ville, spécialités
[Consultation]     → tous / présentiel / téléconsultation
[Région/Dép.]      → select par département
```

### UI — liste + modal détail

- **Liste** : `ProfileCard` — nom, titre, ville, labels SNSC/AIUS/SFSC, indicateur téléconsultation, tarif première
- **Modal détail** (AnimatePresence, slide depuis le bas) :
  - Bio complète
  - Spécialités + approches thérapeutiques
  - Publics accueillis
  - Tarifs (1ère consultation, suivi, couple si applicable)
  - Remboursement SS
  - Langues parlées
  - CTA téléphone (`tel:`)
  - CTA Doctolib (lien externe) si disponible

### Props

```ts
interface AnnuaireSexologuesScreenProps {
  onBack: () => void;
}
```

---

## Intégration MoiScreen

Deux nouvelles cards ajoutées dans `MoiScreen` (adultes uniquement) :

| Icon | Label | Action |
|------|-------|--------|
| `HeartHandshake` | Soutien & accompagnement | → `accompagnement-adulte` |
| `BookUser` | Annuaire sexologues | → `annuaire-sexologues` *(à router)* |

---

## Routing

| Screen | Route enregistrée | Header |
|--------|-------------------|--------|
| `AccompagnementAdulteScreen` | `accompagnement-adulte` | Visible (`headers.accompagnementAdulte`) |
| `AnnuaireSexologuesScreen` | *non encore routé en tant qu'écran standalone* | — |

> **Note :** L'annuaire est actuellement accessible uniquement via la modal depuis MoiScreen ou le lien dans Bloc G. Si une route standalone est souhaitée, l'ajouter dans `types/index.ts`, `screenMeta.ts`, `routes.ts` et `RouteRenderer.tsx` (pattern identique à `accompagnement-adulte`).

---

## i18n

**Namespace :** `education` (`app/i18n/locales/fr/education.ts`)

```
accompagnementAdulte.title
accompagnementAdulte.subtitle
accompagnementAdulte.intro.{text, note, cta}
accompagnementAdulte.situation.{question, victim, self, witness}
accompagnementAdulte.victim.message
accompagnementAdulte.self.message
accompagnementAdulte.witness.message
accompagnementAdulte.resources.{violences, police, signalement, planning, sexologue, sexologueDesc}
```

L'annuaire n'a pas de clés i18n propres (labels hardcodés, données fictives en dur dans `sexologues.ts`). À internationaliser si besoin.

---

## Statut données / validation juridique

| Point | Statut |
|-------|--------|
| Profils sexologues | ❌ Fictifs — remplacer avant publication |
| Numéros d'urgence (3919, 17) | ✅ Réels et vérifiés |
| Lien signalement.gouv.fr | ✅ URL officielle |
| Contenu AccompagnementAdulte | ⚠️ À valider avec le juriste co-fondateur |
| Labels SNSC/AIUS/SFSC | ⚠️ Ne pas afficher sur de vrais profils sans vérification des accréditations |
