# Politique stores & stratégie app adulte

> Dernière mise à jour : 22 avril 2026

---

## Contexte juriste

Le co-fondateur juriste (droit pénal, spécialiste consentement) pousse **explicitement** à employer un langage clair, non-éludé, avec les termes exacts définis. C'est une position pédagogique et légale : les euphémismes créent de la confusion chez les ados, les termes précis + définis = compréhension réelle et protection juridique.

**Cette approche n'est pas un obstacle aux stores — c'est un atout.**

---

## Ce qu'acceptent App Store et Google Play

### La distinction qui compte

Les stores ne distinguent pas "explicite vs vague" — ils distinguent **éducatif vs titillant** :

| Contenu | App Store | Google Play |
|---------|-----------|-------------|
| Termes anatomiques corrects + définitions | ✅ éducatif | ✅ éducatif |
| Description d'un rapport consenti vs non-consenti | ✅ éducatif | ✅ éducatif |
| Activités de couple suggestives (texte) | ✅ 17+ | ✅ Mature 17+ |
| Descriptions détaillées d'actes à des fins de stimulation | ⚠️ limite | ⚠️ limite |
| Contenu graphique/pornographique | ❌ refus | ❌ refus |

Le contenu rédigé par le juriste avec la boussole "consentement + droit" protège naturellement du côté ❌.

### Ratings disponibles

**App Store Apple**
- `12+` — contenu éducatif, aucune description d'acte sexuel
- `17+` — contenu mature autorisé (activités, vocabulaire sexuel explicite), pas de graphique
- Pas de rating "18+" — le `17+` est le maximum pour l'App Store

**Google Play**
- `PEGI 12 / Teen` — éducatif, pas de sexualité explicite
- `PEGI 18 / Mature 17+` — contenu adulte autorisé, texte explicite OK
- `Adults only 18+` — rarement accordé, réservé aux apps de rencontres avec contenu explicite fort

### Apps comparables qui passent

- **Couple Game: Relationship Quiz** — 17+, activités pour couples, 4.8★, millions de DL
- **Dirty Couple Game for Adults** — 17+, App Store + Google Play, toujours actif
- **iPassion** — jeux couple freemium, contenu adulte, 17+
- **We-Vibe / Blueheat** — apps accessoires intimes avec contenu éducatif explicite, 17+

---

## Problème central : mineurs = public cible

Le cœur de mission est les **mineurs 13-14 ans**. Or :

- Un compte Google/Apple **mineur ne voit pas les apps 17+ ou 18+**
- Une app taguée 17+ coupe la visibilité auprès des 13-14 ans
- Une app taguée tous publics avec du contenu explicite → retrait immédiat

**Solution : deux apps séparées.**

---

## Stratégie 2 apps

### Architecture

| | **App principale** | **App adulte** |
|---|---|---|
| Nom | Consentement | Consentement Adults / [nom TBD] |
| Public | Mineurs + adultes | Adultes 18+ uniquement |
| Rating App Store | 12+ (ou 17+ selon contenu final) | 17+ |
| Rating Google Play | Teen / PEGI 12 | Mature 17+ |
| Visibilité store | Pleine (recherches, suggestions) | Réduite mais ciblée |
| Contenu | Éducatif, jeux consentement soft, loi | Jeux explicites, activités premium sans filtre |
| Monétisation | Freemium + pub | Premium direct, sans pub |
| Vérification âge | Auto-déclaratif + AgeCheck screen | Vérification plus stricte (à définir avec juriste) |

### Flux utilisateur cross-app

```
App principale
  └── Bouton "Version Adulte" (section premium ou paramètres)
        └── Redirige vers l'app adulte sur le store
              └── L'utilisateur télécharge l'app adulte
                    └── Connexion avec le même compte → profil conservé
```

Pas de recréation de compte. Le backend Supabase (prévu V3) gère les deux apps sous le même `user_id`.

---

## Implémentation technique — quasi-gratuite

La codebase est déjà architecturée pour ça. Les flags existent :

```ts
// app/stores/settingsStore.ts
explicitMode: boolean   // mode explicite activé

// props transmises partout
isAdult: boolean        // adulte vs mineur
isPremium: boolean      // accès contenu premium
```

**L'app adulte = même repo, build Capacitor séparé :**

```ts
// capacitor.config.adult.ts
const config: CapacitorConfig = {
  appId: 'com.consentement.adults',
  appName: 'Consentement Adults',
  // ...
};
```

**Différences entre les deux builds :**

| Paramètre | App principale | App adulte |
|-----------|---------------|------------|
| `appId` | `com.consentement.app` | `com.consentement.adults` |
| `isAdult` forcé | non (auto-déclaratif) | `true` |
| `explicitMode` défaut | `false` | `true` |
| `isPremium` requis | non | Payant d'emblée |
| Contenu `diePractices` | `ageGate: 'all'` + `'adult'` | Tout + `'explicit'` |
| Thème par défaut | Warm / Calm | Dark Luxury / Nude |
| AgeCheck screen | ✅ | Vérification renforcée |

Un script de build sélectionne la config :

```sh
# Build app principale
npm run build && npx cap sync

# Build app adulte
ADULT_BUILD=true npm run build && npx cap sync --config capacitor.config.adult.ts
```

---

## Contenu à créer pour l'app adulte

Le juriste valide les deux pools de contenu — c'est l'avantage concurrentiel sur tous les jeux de couple existants.

### Activités supplémentaires (`ageGate: 'explicit'`)

À rédiger avec le juriste :
- Activités du Dé du Consentement — 6 catégories × N activités explicites
- Cartes à tirer — deck adulte explicite
- Jeu de l'oie — cases adultes (remplace les cases normales)

### Contenu éducatif spécifique adultes

- Glossaire des pratiques (BDSM, polyamorie, etc.) avec cadre légal
- Module "Consentement dans les pratiques non-conventionnelles"
- Ressources — sexologues, consultations (marketplace V3)

---

## Recommandations — ordre d'exécution

1. **Maintenant** : soumettre l'app principale aux stores, lire le rapport de review Apple → connaître le rating obtenu et les éventuels refus motivés
2. **Avant l'app adulte** : faire valider par le juriste la liste complète des activités `explicit` — c'est lui qui trace la ligne légale, pas les guidelines Apple
3. **V3 backend** : authentification unifiée (même compte sur les 2 apps) avant de lancer l'app adulte
4. **Lancement app adulte** : après validation du backend + contenu juriste + au moins 1000 utilisateurs sur l'app principale

---

## Risques à surveiller

- **Mineurs sur l'app adulte** : la vérification d'âge auto-déclarative n'est pas suffisante légalement — prévoir FranceConnect ou vérification de CB comme proxy d'âge (RGPD + art. 434-3 CPP à consulter avec le juriste)
- **Rejection Apple** : Apple peut refuser même du 17+ s'il juge le contexte inapproprié — prévoir une version "review" légèrement édulcorée si nécessaire
- **Mises à jour de politique** : les stores durcissent régulièrement leurs règles sur le contenu adulte — veille à maintenir
