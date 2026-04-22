# Audit Couleurs Hardcodées — État & Décisions

> Dernière mise à jour : 2026-04-22 — 3 passes effectuées.

Deux passes d'audit effectuées (2026-04-22). Ce document trace ce qui a été corrigé, ce qui reste intentionnellement fixe, et ce qui est en attente.

---

## Passe 1 — Fondation du système de thème

### Créé

**`app/context/ThemeContext.tsx`**
- `ThemeProvider` wrappant l'app dans `page.tsx`
- `useTheme()` hook accessible dans tous les composants enfants
- Remplace le prop-drilling du thème

### Refactorisés

**`app/components/ui/MenuCard.tsx`**
- Supprimé : `from-pink-400 to-rose-500`, `from-violet-400 to-purple-600`, `bg-white/80 border-gray-100`, `text-gray-800/500`
- Remplacé par : `colors.accentGradient`, `colors.secondaryGradient`, `colors.bgCard`, `colors.textPrimary/Secondary`
- Variants renommés : `pink` → `accent`, `purple` → `secondary`

**`app/components/ui/Card.tsx`**
- Supprimé : `bg-white/80 border-gray-100`, `from-pink-400`, `from-violet-400`, `from-emerald-50`, `from-amber-50`
- Remplacé par : inline styles via `colors.*`
- Variants renommés : `gradient-pink` → `accent`, `gradient-purple` → `secondary`, `gradient-green` → `success`, `gradient-amber` → `warning`

**`app/components/screens/HomeAdultScreen.tsx`**
- Supprimé : `from-rose-50/80 to-pink-50/80 border-pink-100`, `text-pink-500`, `text-gray-800/600/400`, `bg-gray-50 border-gray-100`
- Remplacé par : `colors.bgCard`, `colors.accent`, `colors.textPrimary/Secondary/Muted`

---

## Passe 2 — Composants partagés et écrans secondaires

### Refactorisés

**`app/components/ui/Button.tsx`**
- Supprimé : `from-pink-400 to-rose-500 shadow-pink-300/40`, `from-violet-400 to-purple-500 shadow-purple-300/40`, `bg-white/80 border-gray-200 text-gray-800`, `text-gray-600`
- Remplacé par : `colors.accentGradient + accentShadow`, `colors.secondaryGradient`, `colors.bgCard + border + textPrimary`, `colors.textSecondary`

**`app/components/ui/ComfortSlider.tsx`**
- Supprimé : `#f3f4f6` (gris fixe pour cases inactives)
- Remplacé par : `colors.bgSecondary`

**`app/components/screens/PersonalSpaceScreen.tsx`**
- Supprimé : `text-pink-500`, `text-gray-800/500/600/700/400`, `bg-white/80`, `border-gray-100`, `border-amber-200`, `from-rose-50 via-rose-50 to-transparent`
- Remplacé par : `colors.accent`, `colors.textPrimary/Secondary/Muted`, `colors.bgCard`, `colors.divider`, `colors.warning`, `colors.bgPrimary`

**`app/components/screens/GamesHubScreen.tsx`**
- Supprimé : `text-gray-800`, `text-gray-500`, `text-gray-400` (x2, labels sections)
- Remplacé par : `colors.textPrimary`, `colors.textSecondary`, `colors.textMuted`

### Variants Card mis à jour dans les écrans existants

Fichiers mis à jour via sed (anciens noms → nouveaux noms) :
- `app/components/screens/HelpScreen.tsx` : `gradient-amber` → `warning`
- `app/components/screens/PersonalSpaceScreen.tsx` : `gradient-amber` → `warning`
- `app/components/screens/DuoSpaceScreen.tsx` : `gradient-amber` → `warning`
- `app/components/screens/LearnScreen.tsx` : `gradient-green` → `success`
- `app/components/duo/DuoSummaryStep.tsx` : `gradient-amber` → `warning`

---

## Couleurs intentionnellement fixes (ne pas modifier)

### Couleurs sémantiques de sécurité
Ces couleurs doivent rester fixes pour la lisibilité et la convention universelle :

| Composant | Couleur | Raison |
|-----------|---------|--------|
| DiceGameScreen — bouton "Oui" | `green-*` | Convention universelle consentement |
| DiceGameScreen — bouton "Non" | `red-*` | Convention universelle refus |
| HelpScreen — numéros urgence (15, 17, 114) | `text-red-500` | Signalement d'urgence |
| HelpScreen — icônes ambulance/police | `text-red-500` | Identité visuelle services d'urgence |

### Couleurs d'activité des jeux
Les dégradés des cartes de jeux (`GamesHubScreen`, `DiceGameScreen`) sont des identités visuelles propres à chaque jeu, indépendantes du thème :

| Jeu | Dégradé | Raison |
|-----|---------|--------|
| Dé du Consentement | Amber → Orange | Énergie, chaleur |
| Jeu de l'Oie | Indigo → Violet | Mystère, aventure |
| Cartes à tirer | Violet → Fuchsia | Créativité |
| Scénarios guidés | Bleu → Cyan | Clarté, dialogue |

### Écrans pré-thème
Ces écrans s'affichent avant que l'utilisateur choisisse son thème — les couleurs hardcodées n'ont pas d'impact :
- `WelcomeScreen.tsx` — dégradé bleu/violet du logo app
- `AgeCheckScreen.tsx` — vert émeraude (sémantique âge)
- `AuthScreen.tsx` — bleu FranceConnect (identité marque)

---

## Écrans non encore thématisés (priorité basse)

| Fichier | Problème principal | Priorité |
|---------|--------------------|----------|
| `HomeMinorScreen.tsx` | `text-gray-800/500`, `bg-white/80` | Basse (thème youth fixe) |
| `DiceGameScreen.tsx` | Cartes de sélection `bg-white border-amber-200` | Basse (jeu interactif) |
| `LearnScreen.tsx` | `text-gray-800/600`, `from-pink-100` | Basse |
| `HelpScreen.tsx` | `text-gray-800/500/600` (hors urgences) | Basse |
| `DuoSpaceScreen.tsx` | Non audité au-delà de 100 lignes | À faire |

---

## Règle de décision

```
Couleur à thématiser si :
  ✓ Texte sur fond de l'app (titre, description, label)
  ✓ Fond de carte ou conteneur
  ✓ Bordure d'un élément UI
  ✓ Bouton d'action principal

Couleur à laisser fixe si :
  ✗ Sémantique universelle (rouge = stop, vert = ok)
  ✗ Identité de marque externe (FranceConnect bleu)
  ✗ Couleur propre à un jeu/module (identité visuelle)
  ✗ Écran affiché avant sélection du thème
```
