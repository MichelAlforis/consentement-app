# consentement-app

---

> # 🚨 CIBLE DE DÉPLOIEMENT EXCLUSIVE
>
> # 📱 CETTE APPLICATION EST DESTINÉE UNIQUEMENT À L'APP STORE (iOS) ET AU GOOGLE PLAY STORE (Android)
>
> **Aucun déploiement web. Aucune PWA. Aucune version navigateur desktop.**
>
> Toutes les décisions d'architecture, de rendu, d'UI et de compatibilité sont prises **exclusivement** pour les environnements mobiles natifs via **Capacitor**.

---

## Stack

- **Next.js** (export statique) + **Capacitor** — iOS & Android
- **App ID** : `fr.consentement.app`
- **Cible iOS** : iOS 13+ (Capacitor 5)
- **Cible Android** : API 22+ (Android 5.1)

## Conséquences techniques directes

| Décision | Raison mobile |
|----------|---------------|
| `output: 'export'` dans `next.config.js` | Build statique requis par Capacitor |
| `-webkit-backdrop-filter` sur tous les blurs | Compatibilité iOS WebKit |
| `env(safe-area-inset-bottom)` partout | Home indicator iPhone + barres Android |
| `viewportFit: 'cover'` dans layout.tsx | Activer les safe area insets |
| `@capacitor/clipboard` pour la copie | `navigator.clipboard` non fiable en WebView |
| `@capacitor/haptics` pour les retours tactiles | API vibration web insuffisante sur iOS |
| `@capacitor/app` pour le bouton retour Android | Hardware back button Android |

## Docs

- [`docs/mobile-portage-etat.md`](docs/mobile-portage-etat.md) — état Capacitor
- [`docs/theme/README.md`](docs/theme/README.md) — système de thèmes
- [`docs/roadmap.md`](docs/roadmap.md) — roadmap
