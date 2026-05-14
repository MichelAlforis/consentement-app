# Architecture Monorepo — OuiClair

> État : 2026-05-14

---

## Structure actuelle

```
consentement-app/  (racine git, workspace root npm)
├── app/                ← App mobile Next.js (Capacitor → iOS + Android)
├── apps/
│   └── vitrine/        ← Site vitrine ouiclair.com (Next.js standalone)
├── android/            ← Capacitor Android (généré, ne pas éditer)
├── ios/                ← Capacitor iOS (généré, ne pas éditer)
├── docs/               ← Documentation projet
├── e2e/                ← Tests Playwright (app mobile)
├── package.json        ← Root workspace (npm workspaces)
├── tailwind.config.js  ← Config Tailwind app mobile
├── next.config.js      ← Config Next.js app mobile
└── capacitor.config.ts ← Config Capacitor (webDir: 'out')
```

---

## Workspaces npm

Le root `package.json` déclare un workspace unique pour la vitrine :

```json
"workspaces": ["apps/vitrine"]
```

L'app mobile reste au root (Capacitor requiert des chemins relatifs fixes).

### Commandes cross-workspace

```bash
# Développement vitrine
npm run vitrine:dev       # next dev -p 3001

# Build vitrine (export statique)
npm run vitrine:build     # next build → out/

# App mobile (inchangé)
npm run dev               # next dev
npm run build:mobile      # next build + cap sync
```

---

## Apps

### `app/` — Application mobile (Capacitor)

- **Tech :** Next.js 15, Tailwind, R3F, Zustand, Framer Motion
- **Output :** Static export (`out/`) → Capacitor → iOS/Android
- **Backend :** PocketBase sur Hetzner (`pb.ouiclair.com`)
- **Deploy :** App Store + Google Play
- **Port dev :** 3000

### `apps/vitrine/` — Site vitrine

- **Tech :** Next.js 15, Tailwind, Framer Motion
- **Output :** Static export → Vercel
- **Domaine :** `ouiclair.com`
- **Port dev :** 3001
- **Audience :** Ados 13-17 ans + jeunes adultes

---

## Backend

- **PocketBase** hébergé sur Hetzner
- URL : `https://pb.ouiclair.com`
- Variable : `NEXT_PUBLIC_PB_URL`
- Utilisé par l'app mobile uniquement (sync offline-first)
- La vitrine n'a pas de backend (site statique)

---

## Migration future : apps/mobile/

L'app mobile est au root pour garder Capacitor fonctionnel sans migration complexe.

Pour migrer vers `apps/mobile/` (V3+) :
1. Déplacer `app/`, `android/`, `ios/`, `e2e/`, les configs dans `apps/mobile/`
2. Mettre à jour `capacitor.config.ts` : `webDir: '../../out'` → `webDir: 'out'`
3. Mettre à jour `package.json` workspaces : `["apps/vitrine", "apps/mobile"]`
4. Mettre à jour les scripts CI/CD

---

## Déploiements

| App | Plateforme | Branche | Domaine |
|-----|-----------|---------|---------|
| Mobile (main variant) | App Store + Google Play | `main` | — |
| Vitrine | Vercel | `main` | `ouiclair.com` |
| PocketBase | Hetzner VPS | — | `pb.ouiclair.com` |
