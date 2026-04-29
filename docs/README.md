# Documentation — Consentement App

> Index de la bibliothèque documentaire. Chaque dossier a un périmètre précis.

---

## Arborescence

```
docs/
├── roadmaps/       Sujets actifs — sprints en cours, features en développement
├── vision/         Stratégie produit, roadmap V1→V3, archives décisions
├── architecture/   Specs techniques transversales (backend, mobile, i18n, logger…)
├── jeux/           Règles, specs et implémentation des jeux
├── contenu/        Textes de l'app (adulte, explicite, mineur, onboarding, support)
├── graphisme/      Identité visuelle, cartes, palette, logo, pipeline assets
├── theme/          Système de thèmes — ThemeContext, couleurs, effets
├── composants/     Référence des composants réutilisables (dé, pions, plateau…)
└── sessions/       Prompts et notes de sessions de travail
```

---

## roadmaps/

| Fichier | Contenu |
|---|---|
| `roadmap-v3.md` | Suivi des sprints actifs (6–27) |
| `home-v3.md` | Home adaptative — 3 niveaux de progression |
| `card-gain-modules.md` | Gain de cartes via modules éducatifs (sprints 6–15) |
| `card-visual-roadmap.md` | Évolution visuelle des cartes collector |
| `meta-jeu-roadmap.md` | Roadmap du méta-jeu collector global |
| `roadmap-visuel.md` | Niveaux L1/L2/L3 de la direction artistique |

## vision/

| Fichier | Contenu |
|---|---|
| `roadmap.md` | Vision produit V1→V3, blocs fonctionnels A–H |
| `stores-et-app-adulte.md` | Stratégie App Store / app adulte 17+ |
| `brainstorming-2026-04-22.md` | Archive réunion fondatrice — contexte juriste + pistes |

## architecture/

| Fichier | Contenu |
|---|---|
| `backend-plan.md` | Plan Supabase V3 (auth, RLS, schéma DB) |
| `render-mode-adaptatif.md` | Détection GPU → CSS ou R3F (detect-gpu) |
| `error-logger.md` | Logger singleton — transports, API, contexte auto |
| `i18n.md` | Système multilingue custom — namespaces, patterns |
| `plan-portage-mobile.md` | Audit Capacitor vs RN — décision + 11 points d'attention |
| `mobile-portage-etat.md` | État d'avancement Capacitor (comptes, icônes, builds) |

## jeux/

| Fichier | Contenu |
|---|---|
| `de-du-consentement.md` | Règles et contenu du dé |
| `jeu-de-loie.md` | Règles et plateau du jeu de l'oie |
| `cartes-a-tirer.md` | Règles du jeu de cartes à tirer |
| `card-collector.md` | Vision méta-jeu collector — Deck A/B, Hall of Cards |
| `card-gain-plan.md` | Implémentation sprints 1–5 du gain de cartes |
| `card-gain-session.md` | Spec technique système gain (types, algo) — archive post-pivot |
| `EndScreen.md` | Écran de fin de séance — cinématique et UX |

## contenu/

| Fichier | Contenu |
|---|---|
| `adulte.md` | 44 prompts suggestifs Deck A (dé + cartes) |
| `explicite.md` | Contenu 18+ toggle — 24 prompts crus |
| `mineurs.md` | Interface 13-14 ans — 114 prompts (dé + cartes + oie) |
| `onboarding.md` | Flux complet — 7 écrans Splash → Home |
| `support.md` | AccompagnementAdulteScreen + annuaire sexologues |

## graphisme/

| Fichier | Contenu |
|---|---|
| `README.md` | Index graphisme |
| `palette.md` | Couleurs fixes, gradients, halos, bordures |
| `logo.md` | Symbole, variantes, règles d'usage + composant `AppLogo` |
| `card-system.md` | Architecture visuelle dos/face SVG + R3F, rarités |
| `card-canvas.md` | Doc technique `CollectorCardCanvas` — R3F, textures, animations, Safari |
| `card-style-convergence.md` | Unification PlayingCard ↔ CollectorCard (C1/C2/C3) |
| `assets-pipeline.md` | Pipeline SVG inline, Canvas 2D, Midjourney |
| `midjourney-prompts.md` | Prompts par usage (icône, screenshots, marketing) |

## theme/

| Fichier | Contenu |
|---|---|
| `README.md` | 5 thèmes, ThemeContext, effets premium, safe area |
| `couleurs-hardcodees.md` | Audit des couleurs en dur à migrer vers le thème |

## composants/

| Fichier | Contenu |
|---|---|
| `cartes.md` | Composant carte (PlayingCard, CSSCardFallback) |
| `de.md` | Composant dé R3F |
| `icons.md` | Système d'icônes — IconName, ICON_NODES, DynamicIcon |
| `pions.md` | Composant PawnToken |
| `plateau.md` | Composant Board — règles et contraintes |
| `settings.md` | SettingsScreen — paramètres utilisateur |

## sessions/

| Fichier | Contenu |
|---|---|
| `game-engine-prompt.md` | Prompt de session pour le game engine générique |
