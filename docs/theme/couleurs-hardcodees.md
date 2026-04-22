# Audit Couleurs Hardcodées — État & Décisions

> Dernière mise à jour : 2026-04-22 — 5 passes effectuées.

Cinq passes d'audit effectuées (2026-04-22). Ce document trace ce qui a été corrigé, ce qui reste intentionnellement fixe, et ce qui est en attente.

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

### Identité visuelle Duo
Les couleurs de la session Duo incarnent la rencontre de deux personnes — elles restent fixes indépendamment du thème :

| Composant | Couleur | Raison |
|-----------|---------|--------|
| `DuoBumpStep` — bouton principal | `from-purple-500 to-pink-500` | Identité Bump : fusion deux individus |
| `DuoConnectedStep` — cercle de fusion | `accent → secondary` via dégradé dynamique | S'adapte au thème tout en conservant la symbolique |
| `DuoSpaceScreen` — badge "Recommandé" | `from-purple-500 to-pink-500` | Continuité identité Bump |
| `DuoSpaceScreen` — fond caméra | `bg-gray-900` | Sémantique viewfinder (doit rester sombre) |

### Écrans pré-thème
Ces écrans s'affichent avant que l'utilisateur choisisse son thème — les couleurs hardcodées n'ont pas d'impact :
- `WelcomeScreen.tsx` — dégradé bleu/violet du logo app
- `AgeCheckScreen.tsx` — vert émeraude (sémantique âge)
- `AuthScreen.tsx` — bleu FranceConnect (identité marque)

---

## Passe 3 — Contraste dark-luxury (2026-04-22)

### Problème résolu
`text-gray-800/700/600/500/400` sur fond `#0f0d0e` (dark-luxury) = contraste 1.5–4:1 → quasi-invisible.
`textMuted` du thème dark-luxury `#7a7068` = contraste ~4:1, sous le seuil WCAG AA (4.5:1).

### Corrigés

**`app/types/theme.ts`**
- `textMuted` dark-luxury : `#7a7068` → `#8a8078` (contraste ~5:1)

**Écrans de contenu (tous thématisés) :**
- `HelpScreen.tsx` — textes + boutons urgence `bg-white/80` → `colors.bgCard`
- `LearnScreen.tsx` — tous les textes
- `PremiumScreen.tsx` — textes + feature list container `bg-white` → `colors.bgCard`
- `QuizConsentementScreen.tsx` — textes + progress bars + options quiz (états sémantiques conservés)
- `LoiConsentementScreen.tsx` — textes + cards loi `bg-white` → `colors.bgCard`
- `PornoVsRealiteScreen.tsx` — textes + cards comparaison + explication dépliable

**Composants Duo (tous thématisés) :**
- `DuoBumpStep.tsx`, `DuoConnectedStep.tsx`, `DuoFillingStep.tsx`, `DuoReadyStep.tsx`
- `DuoPactStep.tsx`, `DuoRevealStep.tsx`, `DuoSummaryStep.tsx`, `DuoWaitingStep.tsx`

### Écrans non encore thématisés (priorité basse)

| Fichier | Problème principal | Priorité |
|---------|--------------------|----------|
| `HomeMinorScreen.tsx` | `text-gray-800/500`, `bg-white/80` | Basse (thème youth fixe) |

---

## Passe 4 — Composants Duo + UI partagés (2026-04-22)

### Contexte
Audit visuel global : l'app paraissait "2020" malgré les 3 premières passes. Cause : composants Duo et UI partagés encore 0 % thématisés, rendant le thème dark-luxury incohérent dans les flux principaux.

### Refactorisés

**`app/components/duo/DuoNavBar.tsx`** — réécriture complète (0% → 100% thématisé)
- Supprimé : `bg-gray-900/90`, `text-white`, `text-gray-400`, `bg-gray-700`, `bg-gray-800`, Tailwind color classes sur tous les boutons/étapes
- Remplacé par :
  - Fond barre : `colors.bgCard` + `backdrop-blur-sm`
  - Étape active : `background: colors.accent, color: '#fff'`
  - Étape passée : `background: colors.bgSecondary, color: colors.textSecondary`
  - Étape future : `background: colors.bgPrimary, color: colors.textMuted`
  - Hover : `hover:opacity-80` (agnostique au thème)
  - Bouton reset : `hover:text-red-400` conservé (sémantique destructive)

**`app/components/duo/DuoConnectedStep.tsx`** — animations de fusion thématisées
- Supprimé : `from-purple-400 to-pink-400` (cercle gauche), `from-violet-400 to-purple-400` (cercle droit), `bg-purple-200` (pulses), couleurs hardcodées sur le cercle fusionné et la particule centrale
- Remplacé par :
  - Cercle gauche : `background: colors.accentGradient`
  - Pulse gauche : `background: colors.accentLight`
  - Cercle droit : `background: colors.secondaryGradient`
  - Pulse droit : `background: colors.secondaryLight`
  - Cercle fusionné : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`
  - Particule centrale : `background: colors.accentLight`

**`app/components/duo/DuoWaitingStep.tsx`** — animation d'attente thématisée
- Supprimé : `border-purple-300` (anneaux concentriques), couleurs hardcodées particules et cœur
- Remplacé par :
  - Anneaux : `borderColor: colors.border` (fusionné dans l'objet `style` existant)
  - Cœur : `color: colors.accent, fill: colors.accentLight`
  - Fond cœur : `background: colors.bgSecondary`
  - Particules : `background: colors.accentLight` (fusionné dans l'objet `style` existant)

**`app/components/duo/DuoPactStep.tsx`** — items du pacte thématisés
- Supprimé : tableau `pactItems` statique à scope module avec couleurs hardcodées `#c9a84c` et `#8b1a3a`
- Remplacé par : config statique `pactItemsConfig` (structure uniquement) + tableau dynamique `pactItems` calculé à l'intérieur du composant avec `colors.accent` et `colors.secondary`
- Fond conteneur : `colors.bgSecondary`

**`app/components/ui/QRCode.tsx`** — thématisation complète
- Supprimé : `from-gray-800 to-gray-900` (cadre), `bg-white` (fond intérieur), `bg-gray-900` (modules remplis), `border-purple-400` (anneau pulsé)
- Remplacé par :
  - Cadre : `colors.bgSecondary`
  - Fond intérieur : `colors.bgCard`
  - Module rempli : `colors.textPrimary` / vide : `colors.bgCard`
  - Marqueurs de coin : `colors.textPrimary` (extérieur), `colors.bgCard` (anneau), `colors.textPrimary` (point)
  - Anneau pulsé : `borderColor: colors.accent`

**`app/components/screens/LearnScreen.tsx`** — icônes déplacées dans le composant
- Supprimé : tableau `principleIcons` à scope module (inaccessible à `colors`)
- Remplacé par : tableau `principleIcons` déclaré à l'intérieur de `LearnScreen()`, utilisant `colors.accent` pour tous les 5 icônes
- Fond icône : `colors.bgSecondary`

**`app/components/screens/DuoSpaceScreen.tsx`** — 26 occurrences corrigées
- Supprimé : `text-gray-800/500/400`, `bg-gray-200`, `text-gray-400`, `border-gray-200`, `bg-purple-50/text-purple-600`, `border-purple-400/bg-purple-400`, toutes les classes Tailwind de couleur sur les icônes, séparateurs, inputs
- Remplacé par :
  - Titres/textes : `colors.textPrimary`, `colors.textSecondary`, `colors.textMuted`
  - Séparateur : `background: colors.divider`
  - Fonds icônes : `colors.bgSecondary`
  - Scanner (coins + ligne) : `colors.accent`
  - Affichage code : `background: colors.bgSecondary, color: colors.accent`
  - Inputs : `border: colors.border` / `colors.accent` (état focus)
- Conservé : `from-purple-500 to-pink-500` (bouton Bump), badge "Recommandé", `bg-gray-900` (fond caméra)

### Erreurs rencontrées et solutions

| Composant | Erreur | Solution |
|-----------|--------|---------|
| `DuoWaitingStep` | Attribut `style` en double sur `motion.div` | Fusionner toutes les props CSS dans un seul objet `style` |
| `DuoBumpStep` | `Button` n'accepte pas la prop `style` | Remplacer `!text-gray-400` par `className="opacity-50"` |
| `DuoSpaceScreen` | `Card` n'accepte pas la prop `style` | Supprimer le style override — `Card variant="elevated"` se thématise lui-même |

---

## Passe 5 — Jeux + typographie (2026-04-22)

### Typographie

**`app/layout.tsx`**
- Ajout de `Inter` via `next/font/google` (téléchargée au build, zéro dépendance npm)
- Remplace la pile système `font-sans` (ui-sans-serif, system-ui…)
- Appliquée via `inter.className` sur `<body>` — s'applique à toute l'app

### Refactorisés

**`app/components/screens/DiceGameScreen.tsx`** — ~25 occurrences corrigées
- Supprimé : `text-gray-800/700/500/400`, `bg-white` (cartes Solo/À deux), `bg-gray-50/100` (fonds activité, écran rideau)
- Remplacé par :
  - Titres/textes : `colors.textPrimary`, `colors.textSecondary`, `colors.textMuted`
  - Fonds cartes : `colors.bgCard`
  - Fonds activité + rideau : `colors.bgSecondary`
- Conservé :
  - `border-amber-200` / `border-orange-200` sur les cartes Solo/À deux (identité dé)
  - `bg-amber-100/50` + `text-amber-500/600` sur l'icône header et les icônes modes (identité)
  - `bg-amber-500` / `bg-orange-500` sur les badges 1/2 du vote (identité)
  - `border-red-200 bg-red-50 text-red-*` et `border-green-200 bg-green-50 text-green-*` sur boutons Non/Oui (sémantique consentement)
  - Boîte bleue anonymat `bg-blue-50 border-blue-100 text-blue-700` (info sémantique)
  - Gradients catégories (identité visuelle jeu)

**`app/components/screens/CardGameScreen.tsx`** — ~25 occurrences corrigées
- Supprimé : `text-gray-900/400`, `bg-gray-50` (container réglages), `bg-white border-gray-200` (toggle, bouton retour), `#fff`/`#9ca3af`/`#f3f4f6`/`#e5e7eb`/`#fafafa` hardcodés dans les ternaires
- Remplacé par :
  - Titres/labels : `colors.textPrimary`, `colors.textMuted`
  - Container réglages : `colors.bgSecondary`
  - Toggle Séance/Libre container : `colors.bgCard` + `border: colors.border`
  - États inactifs (Solo/Séance/Taille/Aléatoire) : `colors.bgCard`, `colors.border`, `colors.textMuted`
  - Progress dot inactif : `colors.border`
  - Carte face (recto) : `colors.bgCard` + `border: colors.border`
  - Texte carte face : `colors.textPrimary`
  - Boutons "Changer de paquet" / "Continuer en mode libre" : `colors.bgCard` + `colors.border` + `colors.textSecondary`
- Conservé :
  - Violet `#8b5cf6`/`#7c3aed` sur tous les états actifs (identité jeu Cartes à tirer)
  - Anneau sélection deck `0 0 0 3px #8b5cf6` (identité)
  - Badge PREMIUM gradient violet-fuchsia (identité)
  - Progress dots actifs gradient violet (identité)
  - `border-rose-*`/`bg-rose-*` bouton favoris activé (sémantique favori)
  - Gradient vert bouton "Terminer la séance" (sémantique succès)
  - Boîte insight fin de séance `bg-violet-50 border-violet-100 text-violet-700` (identité jeu)

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
