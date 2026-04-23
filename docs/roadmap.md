# Roadmap — Consentement App

> Dernière mise à jour : 23 avril 2026
> Légende : ✅ Fait · 🔄 En cours · 🔲 À faire · ⏸ Bloqué (backend uniquement)

---

## Mission

Application co-fondée par un **juriste en droit pénal spécialisé dans le droit du consentement**.

Constat terrain : des mineurs de **13-14 ans** se retrouvent au tribunal — auteurs ou victimes — par manque d'éducation sur le consentement. La pornographie en libre accès leur sert de référence sans aucun cadre légal ni éthique.

**L'expertise juridique est interne.** Toutes les décisions légales sont prises par le co-fondateur juriste. Aucun point légal n'est "en attente d'un consultant externe".

---

## V1 → V2 — État actuel

| Fonctionnalité | Statut | Notes |
|---|---|---|
| SPA Next.js + Tailwind + Framer Motion | ✅ | Architecture solide |
| Thèmes (Warm, Calm, Dark Luxury, Nude, Youth) | ✅ | 5 thèmes — 3 premium adulte, 1 mineur auto |
| Effets premium (shimmer, grain, transitions) | ✅ | `ThemeEffects.tsx` + `ThemeContext` |
| Sélection âge (mineur / adulte) | ✅ | Auto-déclaratif |
| Auth simulée (FranceConnect mock) | ✅ | Pas de vrai OAuth |
| Profil de confort personnel (18 items) | ✅ | 3 catégories, `ComfortSlider` traduit |
| Duo flow complet (9 étapes) | ✅ | Mock local, pas de vrai réseau |
| Contenu éducatif — principes + loi | ✅ | `LoiConsentementScreen`, `LearnScreen` |
| Porno vs Réalité | ✅ | `PornoVsRealiteScreen` |
| Quiz consentement | ✅ | `QuizConsentementScreen` — 8 questions |
| Accompagnement mineur | ✅ | `AccompagnementMineurScreen` |
| Ressources d'aide (numéros FR) | ✅ | |
| Interface mineurs (thème Youth, modules) | ✅ | `HomeMinorScreen` complet |
| Premium screen + flag `isPremium` | ✅ | Paiement simulé, RevenueCat prévu V3 |
| Jeu 1 — Dé du consentement | ✅ | Solo + duo, 6 catégories, 3 niveaux, R3F Level 2 |
| Jeu 2 — Cartes à tirer (premium) | ✅ | 84 cartes, 6 paquets, séance / libre, flip 3D |
| Jeu 3 — Jeu de l'Oie (premium) | ✅ | 24 cases, 3 zones narratives, accord secret |
| Hub jeux avec lock premium | ✅ | `GamesHubScreen` |
| Portage Capacitor (iOS / Android) | ✅ | Scripts, corrections bloquantes, haptics |
| i18n FR / EN / ES | ✅ | React Context custom, 7 namespaces/locale |
| Persistance localStorage | ✅ | Thème, profil, saves de partie |
| `DynamicIcon` resolver (`iconFromName.tsx`) | ✅ | Résout `iconName: string` → composant Lucide dans Duo + PersonalSpace |
| `WelcomeScreen` Option A | ✅ | `HeartHandshake`, gradient chaud, badge juriste, stagger progressif |
| Tests critiques (Vitest) | ✅ | 25 tests — `useCardSession` (14) + `useGooseGame` (11) — 25/25 ✓ |
| Hard block mineur (`personal-space`, `duo-space`) | ✅ | `useEffect` guard dans `AppShell` |
| `ConsentCheckScreen` adulte | ✅ | 3 panneaux accordéon — checklist consentement, doutes/ressources, questions |

---

## Bloc A — i18n ✅ Terminé

> Implémenté avec un **système React Context custom** (et non `next-intl`) pour compatibilité Capacitor `output: 'export'`.

| Tâche | Statut | Notes |
|---|---|---|
| Système i18n React Context (`LanguageContext`, `useTranslation`) | ✅ | Hook dot-notation + interpolation `{param}` |
| Localisation FR | ✅ | Langue principale |
| Localisation EN | ✅ | |
| Localisation ES | ✅ | |
| Structure en 7 namespaces thématiques par locale | ✅ | ui / onboarding / home / spaces / education / games / data |
| Tous les composants migrés vers `t()` | ✅ | DuoFlow, DiceGame, CardGame, GooseGame, éducatif… |
| Sélecteur de langue dans les paramètres | 🔲 | UI à brancher sur `LanguageContext.setLanguage()` |
| Contenu légal adapté par pays (âge légal) | 🔲 | Dépend du juriste |

---

## Bloc B — Thèmes ✅ Terminé

| Tâche | Statut |
|---|---|
| Thème `dark-luxury` (noir / or / bordeaux) | ✅ |
| Thème `nude` (crème / taupe / nude) | ✅ |
| Thème `youth` (coloré / lumineux — mineurs) | ✅ |
| Effets visuels premium (shimmer, grain SVG) | ✅ |
| Transitions de thème animées | ✅ |
| Verrouillage thèmes premium derrière `isPremium` | ✅ |
| Thème switcher UI (paramètres) | 🔲 |

---

## Bloc C — Mode premium ✅ Terminé (sauf paiement réel)

| Tâche | Statut | Notes |
|---|---|---|
| Flag `isPremium` dans `useAppState` | ✅ | |
| Écran "Passer Premium" | ✅ | `PremiumScreen` |
| Jeux avancés verrouillés derrière premium | ✅ | Cartes, Jeu de l'Oie |
| Thèmes high-end verrouillés | ✅ | |
| Niveau 3 dé verrouillé | ✅ | |
| Paiement réel (StoreKit / Google Play) | ⏸ | RevenueCat prévu V3 |

---

## Bloc D — Pratiques sexuelles adultes 🔲 À faire

> Enrichir `data/index.ts` — filtrage automatique selon profil âge.

| Tâche | Statut | Complexité |
|---|---|---|
| Fiches consentement par pratique (définition + cadre légal) | 🔲 | Moyenne — contenu fourni par le juriste |
| Catégorie BDSM / pratiques avancées (gate adulte 18+) | 🔲 | Moyenne |
| Filtrage automatique des catégories selon âge déclaré | 🔲 | Faible |
| Page info pratiques extrêmes (risques + ressources) | 🔲 | Moyenne |

---

## Bloc E — Interface mineurs ✅ Terminé (base)

| Tâche | Statut | Notes |
|---|---|---|
| `HomeMinorScreen` avec thème Youth | ✅ | Modules E1/E2/E3 |
| Module "Porno vs. Réalité" | ✅ | `PornoVsRealiteScreen` |
| Module "C'est quoi le consentement ?" | ✅ | `LoiConsentementScreen` |
| Module "Ce que dit la loi" | ✅ | À enrichir par le juriste |
| Quiz "Je sais reconnaître un consentement" | ✅ | 8 questions — `QuizConsentementScreen` |
| Flux "Je veux avoir un rapport" | ✅ | `AccompagnementMineurScreen` |
| Ressources d'aide (Fil Santé Jeunes) | ✅ | |
| Hard block catégories adultes | ✅ | `useEffect` dans `AppShell` — redirige vers home si mineur accède à `personal-space` / `duo-space` |
| Module "Ce qui peut arriver" (cas anonymisés) | 🔲 | Contenu à rédiger par le juriste |

---

## Bloc F — Jeux ✅ Terminé (3 jeux V2)

> Scope initial : 2 jeux V2. **Livré : 3 jeux complets.**

| Tâche | Statut | Notes |
|---|---|---|
| Hub jeux avec lock premium | ✅ | `GamesHubScreen` — `FreeCard` (sobre) / `PremiumCard` (gradient riche) visuellement distincts |
| Jeu 1 — Dé du consentement (gratuit) | ✅ | Solo + duo secret, niveau 3 premium, dé R3F Level 2 |
| Jeu 2 — Cartes à tirer (premium) | ✅ | 84 cartes, 6 paquets, flip 3D, mode séance / libre |
| Jeu 3 — Jeu de l'Oie (premium) | ✅ | 24 cases, 3 zones, accord à deux, sauvegarde locale |
| Jeu 4 — Scénarios guidés | 🔲 | Prévu V3 |

---

## Bloc G — Page principale ✅ Terminé

| Tâche | Statut | Notes |
|---|---|---|
| Refonte `WelcomeScreen` Option A | ✅ | `HeartHandshake`, gradient violet→rose, badge juriste, stagger progressif |
| CTA principal vers le processus de consentement | ✅ | Carte "Avant de se lancer" dans `AdultHome` → `consent-check` |
| Messages clés : "Je consens / Je ne consens pas / J'ai des questions" | ✅ | `ConsentCheckScreen` — 3 panneaux accordéon (checklist, doutes, questions) |

---

## Bloc H — Annuaire sexologues 🔲 À faire (V3)

> Sans backend : profils statiques, pas de vraie réservation.

| Tâche | Statut |
|---|---|
| Écran annuaire sexologues (profils mockés) | 🔲 |
| Filtres : spécialité, format, tarif | 🔲 |
| Page profil professionnel | 🔲 |
| Bouton "Prendre RDV" (placeholder — V3) | 🔲 |

---

## Portage mobile Capacitor ✅ Prêt pour le build

> Toutes les corrections bloquantes et importantes sont intégrées.

| Correction | Statut | Fichier |
|---|---|---|
| Clipboard iOS (`@capacitor/clipboard`) | ✅ | `DuoSpaceScreen.tsx` |
| Back button Android (`@capacitor/app`) | ✅ | `useAppState.ts` |
| Flash démarrage (`isHydrated`) | ✅ | `page.tsx` |
| Haptics iOS (`@capacitor/haptics`) | ✅ | `useHaptics.ts`, `GooseGameScreen/utils.ts` |
| Hover tactile (`whileHover` → `whileTap`) | ✅ | `Card.tsx`, `MenuCard.tsx` |
| Barre démo absente en production | ✅ | `page.tsx` |

**Étapes restantes avant soumission :**
```
⏳ Générer ios/ et android/  →  npx cap add ios && npx cap add android
⏳ Icône + splash screen     →  PNG 1024×1024 (icon), 2732×2732 (splash)
⏳ Comptes Apple / Google    →  99 €/an + 25 $ one-time
⏳ Achats intégrés (IAP)     →  RevenueCat avant App Store (obligatoire)
⏳ Test sur appareils réels  →  iPhone SE, Samsung A54 minimum
```

---

## Stratégie stores & app adulte

→ Voir [`docs/strategy/stores-et-app-adulte.md`](strategy/stores-et-app-adulte.md) pour l'analyse complète.

**Résumé :**
- App principale : 12+ ou 17+ — mineurs + adultes, contenu éducatif + jeux soft
- App adulte séparée : 17+ — même codebase, build Capacitor distinct, `explicitMode: true` par défaut
- Contenu explicite = OK stores **si ton éducatif** (position du juriste co-fondateur = atout, pas obstacle)
- Vérification âge renforcée requise pour l'app adulte avant lancement (⚖️ juriste)

**Infrastructure technique ✅ Livrée (2026-04-22) :**

| Élément | Statut |
|---|---|
| `app/lib/appVariant.ts` — vérité unique de la variante | ✅ |
| `capacitor.config.ts` dynamique (`fr.consentement.app` / `fr.consentement.explicit`) | ✅ |
| `authStore` — `isAdult` forcé + navigation 1er lancement adulte | ✅ |
| `settingsStore` — `explicitMode: true` par défaut variante adulte | ✅ |
| Scripts `build:main`, `build:adult`, `cap:sync:adult` | ✅ |
| Contenu `explicit` dans les jeux (juriste) | 🔲 À rédiger |
| Vérification d'âge renforcée (⚖️ juriste) | 🔲 À définir |
| Compte unifié cross-apps (Supabase) | ⏸ V3 backend |

---

## V3 — Backend requis ⛔ Conditionnel

> **⚠️ Ce bloc ne démarre que si l'app est validée** : adoption suffisante sur les stores, retours utilisateurs positifs, décision go/no-go explicite.
> Tant que la V2 n'est pas validée, ces fonctionnalités restent hors scope — pas de charge technique prématurée.

| Fonctionnalité | Dépendances | Priorité |
|---|---|---|
| Vrai duo temps réel (WebSocket) | Supabase Realtime | Haute |
| Comptes utilisateurs persistants | Supabase / Clerk | Haute |
| FranceConnect OAuth réel | API FranceConnect | Haute |
| Paiement abonnement premium | RevenueCat (StoreKit + Google Play) | Haute |
| Prise de RDV réelle (sexologues) | Calendrier API, Stripe | Haute |
| Historique consentements archivés | Base de données + chiffrement | Haute |
| **Compte unifié cross-apps** (principale + adulte) | Supabase même `user_id` | Haute |
| Scénarios guidés (Jeu 4) | — | Moyenne |
| Contenu influenceurs (vidéos, articles) | CMS (Sanity / Strapi) | Moyenne |
| Vérification d'âge robuste | Veriff / Yoti | Élevée ⚖️ |
| i18n V2 : DE, IT, PT, AR, ZH | — | Moyenne |
| Notifications push | Firebase FCM | Faible |

---

## Contenus à rédiger par le co-fondateur juriste ✍️

**Position juriste** : langage explicite, termes exacts définis — pas d'euphémismes. Voir [`docs/strategy/stores-et-app-adulte.md`](strategy/stores-et-app-adulte.md).

| Contenu | Pour quel bloc | Statut |
|---|---|---|
| "Ce que dit la loi" — enrichissement (âges légaux, jurisprudences) | Bloc E | 🔲 À rédiger |
| "Ce qui peut arriver" — cas concrets anonymisés 13-14 ans | Bloc E | 🔲 À rédiger |
| Fiches consentement par pratique (définition + cadre pénal) | Bloc D | 🔲 À rédiger |
| Cadre légal BDSM + double consentement horodaté | Bloc D | 🔲 À rédiger |
| Âge légal du consentement par pays (pour i18n V2) | Bloc A | 🔲 À rédiger |
| Mentions légales & politique de confidentialité (RGPD mineurs) | Global | 🔲 À rédiger |
| **Activités explicites app adulte** — dé + cartes + oie | App adulte | 🔲 À rédiger |
| **Vérification âge app adulte** — cadre légal requis | App adulte ⚖️ | 🔲 Consulter juriste |

---

## Prochaines actions immédiates

```
1. Sélecteur de langue (UI)     →  ✅ déjà en place (LanguagePicker dans SettingsScreen)
2. Tests critiques              →  ✅ 25 tests — useCardSession (14) + useGooseGame (11)
3. Bloc E hard block mineur     →  ✅ useEffect guard personal-space / duo-space
4. Bloc G ConsentCheckScreen    →  ✅ écran adulte 3 panneaux + carte dans AdultHome
5. Build mobile                 →  npx cap add ios && npx cap add android
6. Contenus juriste             →  Blocs D et E
7. Backend Supabase             →  ⛔ uniquement si validation V2 confirmée
```
