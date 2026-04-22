# Roadmap — Consentement App

> Dernière mise à jour : 22 avril 2026
> Légende : ✅ Fait · 🔄 En cours · 🔲 À faire · ⏸ Bloqué (backend uniquement)

---

## Mission

Application co-fondée par un **juriste en droit pénal spécialisé dans le droit du consentement**.

Constat terrain : des mineurs de **13-14 ans** se retrouvent au tribunal — auteurs ou victimes — par manque d'éducation sur le consentement. La pornographie en libre accès leur sert de référence sans aucun cadre légal ni éthique.

**L'expertise juridique est interne.** Toutes les décisions légales sont prises par le co-fondateur juriste. Aucun point légal n'est "en attente d'un consultant externe".

---

## V1 — État actuel (base existante)

| Fonctionnalité | Statut | Notes |
|---|---|---|
| SPA Next.js + Tailwind + Framer Motion | ✅ | Architecture solide |
| 2 thèmes (Warm / Calm) | ✅ | |
| Sélection âge (mineur / adulte) | ✅ | Auto-déclaratif uniquement |
| Auth simulée (FranceConnect mock) | ✅ | Pas de vrai OAuth |
| Profil de confort personnel (18 items) | ✅ | 3 catégories génériques |
| Duo flow complet (9 étapes) | ✅ | Mock local, pas de vrai réseau |
| Contenu éducatif (5 principes) | ✅ | |
| Ressources d'aide (3 numéros FR) | ✅ | |
| Persistance localStorage | ✅ | |
| Interface mineurs (HomeMinorScreen) | ✅ partiel | Basique, à enrichir |
| i18n | ❌ | Tout en dur en français |
| Backend / temps réel | ❌ | Zéro serveur |

---

## V2 — Frontend uniquement (pas de backend requis)

> **Objectif :** Enrichir massivement l'app sans infrastructure serveur.
> Toutes ces tâches sont implémentables maintenant.

---

### Bloc A — i18n (priorité 1)

> Faire maintenant avant que le texte en dur explose.

| Tâche | Statut | Complexité | Fichiers concernés |
|---|---|---|---|
| Installer `next-intl` | 🔲 | Faible | `package.json`, `next.config.js` |
| Extraire toutes les chaînes FR en `fr.json` | 🔲 | Moyenne | Tous les composants |
| Créer `en.json` (traduction anglaise) | 🔲 | Moyenne | Nouveau fichier |
| Créer `es.json` (traduction espagnole) | 🔲 | Moyenne | Nouveau fichier |
| Sélecteur de langue dans les paramètres | 🔲 | Faible | `useAppState`, settings screen |
| Adapter les contenus légaux par pays | 🔲 | Moyenne | `data/index.ts` |

---

### Bloc B — Thèmes high-end (priorité 2)

> Structure `theme.ts` déjà prête — juste ajouter des entrées.

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Thème `dark-luxury` (noir / or / bordeaux) | ✅ | Faible | Premium adulte |
| Thème `nude` (crème / taupe / nude) | ✅ | Faible | Premium adulte |
| Thème `youth` (coloré / lumineux / rassurant) | ✅ | Faible | Interface mineurs — auto-appliqué |
| Thème switcher dans les paramètres | 🔲 | Faible | |
| Verrouiller thèmes premium derrière flag `isPremium` | ✅ | Faible | |

---

### Bloc C — Mode premium (priorité 2)

> Simulé en local — sans paiement réel pour l'instant.

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Ajouter flag `isPremium` dans `useAppState` | ✅ | Faible | |
| Écran "Passer Premium" (UI uniquement) | 🔲 | Faible | Nouveau screen |
| Verrouiller jeux avancés derrière premium | 🔲 | Faible | |
| Verrouiller thèmes high-end derrière premium | ✅ | Faible | |
| Verrouiller catégories adultes avancées derrière premium | 🔲 | Faible | |
| Badge premium visible sur le profil | 🔲 | Faible | |

---

### Bloc D — Pratiques sexuelles & consentement (priorité 3)

> Enrichir `data/index.ts` — filtrage automatique selon profil âge.

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Nouvelles catégories adultes : Pratiques de base | 🔲 | Moyenne | Fellation, cunnilingus, pénétration, sodomie... |
| Fiches consentement par pratique (définition + cadre légal) | 🔲 | Moyenne | Nouveau composant `PracticeCard` |
| Catégorie BDSM / Pratiques avancées (gate adulte 18+) | 🔲 | Moyenne | Safeword renforcé, double confirmation |
| Filtrage automatique des catégories selon âge déclaré | 🔲 | Faible | Dans `useAppState` |
| Page info pratiques extrêmes (risques + ressources) | 🔲 | Moyenne | Adultes vérifiés uniquement |

---

### Bloc E — Interface mineurs (priorité 1 — cœur de mission)

> **C'est le bloc le plus important du projet.** La philosophie : parler franchement des mêmes sujets que le porno, mais avec le consentement, la réalité et le droit comme boussoles. Pas de morale. Pas d'esquive. Un discours adulte adapté à des 13-14 ans.

#### E1 — Déconstruire le porno (nouveau module clé)

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Module "Porno vs. Réalité" | 🔲 | Élevée | Ce que le porno montre / ce que la réalité est — franc, sans jugement |
| Fiche "Ce que le porno ne montre jamais" | 🔲 | Moyenne | Consentement, douleur, refus, conséquences émotionnelles |
| Fiche "Les corps dans le porno vs. les vrais corps" | 🔲 | Moyenne | Rédigée avec un sexologue partenaire |
| Fiche "Pourquoi imiter le porno peut blesser" | 🔲 | Élevée | Cas concrets anonymisés — rédigés par le juriste |

#### E2 — Comprendre le consentement

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Refonte `HomeMinorScreen` avec thème `youth` | ✅ | Moyenne | Structure modules E1/E2/E3 |
| Module "C'est quoi le consentement ?" — 13-14 ans | ✅ | Élevée | `LoiConsentementScreen` — contenus à enrichir par le juriste |
| Module "Ce que dit la loi" — âge légal, définitions pénales | ✅ | Élevée | Contenu initial en place — à valider/enrichir par le juriste |
| Module "Ce qui peut arriver" — conséquences judiciaires réelles | 🔲 | Élevée | Cas anonymisés à rédiger par le juriste |
| Quiz "Je sais reconnaître un consentement" | ✅ | Moyenne | 8 questions interactives — `QuizConsentementScreen` |

#### E3 — Accompagnement

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Flux "Je veux avoir un rapport" — guidé, sans jugement | ✅ | Élevée | `AccompagnementMineurScreen` — flux branché par âge |
| Question : "En as-tu parlé à un adulte de confiance ?" | ✅ | Faible | Intégré dans le flux accompagnement |
| Ressources d'aide (Fil Santé Jeunes, numéros d'urgence) | ✅ | Faible | Liens téléphoniques directs |
| Hard block catégories adultes | 🔲 | Faible | |

---

### Bloc F — Jeux (priorité 3)

> 1 jeu gratuit livrable en V2. Les autres en V3.

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Jeu 1 gratuit : "Vrai ou Faux — Le Consentement" (quizz) | 🔲 | Moyenne | Solo, accessible à tous |
| Jeu 2 premium : "Cartes à tirer — Et toi ?" | 🔲 | Moyenne | À deux, exploration mutuelle |
| Jeu 3 premium : "Scénarios guidés" | 🔲 | Élevée | Solo ou duo |
| Écran d'accueil jeux avec lock premium | 🔲 | Faible | |

---

### Bloc G — Page principale (priorité 2)

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Refonte `WelcomeScreen` : focus consentement sexuel explicite | 🔲 | Moyenne | Nouveau ton, nouveau visuel |
| CTA principal vers le processus de consentement | 🔲 | Faible | |
| Messages clés : "Je consens / Je ne consens pas / J'ai des questions" | 🔲 | Faible | |

---

### Bloc H — Annuaire sexologues (UI mock, priorité 4)

> Sans backend : profils statiques, pas de vraie réservation.

| Tâche | Statut | Complexité | Notes |
|---|---|---|---|
| Écran annuaire sexologues (profils mockés) | 🔲 | Moyenne | 5-10 profils fictifs |
| Filtres : spécialité, format (call/visio/présentiel), tarif | 🔲 | Faible | |
| Page profil professionnel | 🔲 | Faible | |
| Bouton "Prendre RDV" (placeholder — V3) | 🔲 | Faible | UI uniquement |

---

## V2 — Récapitulatif & ordre d'exécution

> Priorité révisée : l'interface mineurs passe en tête de liste — c'est le cœur de mission du projet.

```
Semaine 1    → Bloc A (i18n) + Bloc G (homepage refonte)
Semaine 2    → Bloc E (interface mineurs — modules éducatifs 13-14 ans)
Semaine 3    → Bloc E suite (flux "Je veux avoir un rapport" + quiz)
Semaine 4    → Bloc B (thèmes) + Bloc C (premium) + Bloc D (pratiques adultes)
Semaine 5    → Bloc F (jeux) + Bloc H (annuaire sexologues mock) + polish
```

---

## V3 — Backend requis (post V2)

> Ces fonctionnalités nécessitent une infrastructure serveur.

| Fonctionnalité | Dépendances | Priorité |
|---|---|---|
| Vrai duo temps réel (WebSocket) | Serveur Node / Supabase Realtime | Haute |
| Comptes utilisateurs persistants | Auth backend (Supabase / Clerk) | Haute |
| FranceConnect OAuth réel | Intégration API FranceConnect | Haute |
| Prise de RDV réelle (sexologues) | Calendrier API, Stripe | Haute |
| Paiement abonnement premium | Stripe / RevenueCat | Haute |
| Historique consentements archivés | Base de données + chiffrement | Haute |
| Contenu influenceurs (vidéos, articles) | CMS (Sanity / Strapi) | Moyenne |
| Système de pub (AdSense / MoPub) | SDK pub | Moyenne |
| Vérification d'âge robuste (mineurs) | Service tiers (Veriff / Yoti) | Élevée ⚖️ |
| Notifications push | Firebase FCM | Faible |

---

## Contenus à rédiger par le co-fondateur juriste ✍️

> Ces contenus nécessitent l'expertise juridique interne. Ce sont des livrables textuels — une fois rédigés, l'implémentation est rapide.

| Contenu | Pour quel bloc | Statut |
|---|---|---|
| "Ce que dit la loi" — âge légal, définitions pénales (FR) | Bloc E | 🔲 À rédiger |
| "Ce qui peut arriver" — cas concrets anonymisés 13-14 ans | Bloc E | 🔲 À rédiger |
| Fiches consentement par pratique (définition + cadre pénal) | Bloc D | 🔲 À rédiger |
| Cadre légal pratiques BDSM + double consentement horodaté | Bloc D | 🔲 À rédiger |
| Âge légal du consentement par pays (pour i18n) | Bloc A | 🔲 À rédiger |
| Mentions légales & politique de confidentialité (RGPD mineurs) | Global | 🔲 À rédiger |

---

## Notes techniques V2

- **Pas de breaking change** sur l'architecture — tout s'ajoute sur l'existant
- **`next-intl`** recommandé pour i18n (natif Next.js App Router)
- **`theme.ts`** extensible sans refacto
- **`useAppState`** à étendre avec : `isPremium`, `language`, `ageGroup` (minor16 / minor18 / adult)
- **`data/index.ts`** à restructurer avec un champ `ageGate: 'all' | 'adult' | 'premium'` sur chaque item
