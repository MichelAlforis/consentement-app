# SettingsScreen — État actuel (2026-04-23)

**Fichiers clés :**
- `app/components/screens/SettingsScreen.tsx` — écran paramètres (langue, thème, aide, premium, mode explicite)
- `app/components/ui/ExplicitModeToggle.tsx` — toggle mode explicite (pill + card + modale de confirmation)
- `app/stores/settingsStore.ts` — store Zustand persisté (thème, langue, explicitMode)
- `app/context/LanguageContext.tsx` — `changeLanguage()` + `useLanguage()`

---

## Architecture

```
SettingsScreen
  ├── SettingsRow (composant interne réutilisable)
  │     icon · title · desc · right slot (bouton ou node quelconque)
  ├── LanguagePicker (composant interne)
  │     3 pills FR / EN / ES → changeLanguage()
  └── ExplicitModeToggle (ui externe, pillOnly=true)
        TogglePill + modale de confirmation
```

---

## Lignes de paramètres

| Ligne | Icône | Action | Condition |
|---|---|---|---|
| Langue | `Globe` | `LanguagePicker` inline | Toujours |
| Thème | `Palette` | `onNavigate('theme-select')` | Toujours |
| Aide | `LifeBuoy` | `onNavigate('help')` | Toujours |
| Premium | `Crown` | `onNavigate('premium')` ou rien si actif | Toujours |
| Mode explicite | `Flame` | `ExplicitModeToggle pillOnly` | `isAdult` uniquement |

---

## LanguagePicker

- 3 boutons pill : `🇫🇷 FR` / `🇬🇧 EN` / `🇪🇸 ES`
- Langue active : fond `colors.accent` + texte blanc
- Langue inactive : fond `colors.bgSecondary` + texte `colors.textMuted`
- Branchée sur `useLanguage().changeLanguage(code)` → met à jour `LanguageContext` + `settingsStore`

---

## ExplicitModeToggle

Deux modes via la prop `pillOnly` :

### `pillOnly=true` (SettingsRow right slot)
Simple `TogglePill` rouge/gris — pas de label.

### `pillOnly=false` (HomeScreen adulte)
Card complète avec icône Flame, label, description dynamique (actif/inactif).

### Modale de confirmation
- S'ouvre uniquement à l'**activation** (pas à la désactivation)
- Fond `rgba(0,0,0,0.65)` + `backdropFilter: blur(8px)`
- CTA rouge "Activer" + bouton annuler
- Clic hors modale = fermeture

---

## settingsStore (Zustand + persist)

```ts
{
  themeMode: ThemeMode | null,  // null = thème par défaut
  theme: Theme | null,           // dérivé de themeMode à la réhydratation
  language: Language,            // 'fr' | 'en' | 'es' — défaut 'fr'
  explicitMode: boolean,         // défaut = isAdultApp (true pour la variante adulte)
}
```

**Persistance localStorage :** `'consentement-settings'` — partialize sur `themeMode`, `language`, `explicitMode` (pas `theme` — reconstruit à la réhydratation).
