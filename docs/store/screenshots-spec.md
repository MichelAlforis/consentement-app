# Screenshots — Spécifications

## App Store (obligatoire)

| Format | Résolution | Quantité |
|---|---|---|
| iPhone 6.9" (iPhone 15 Pro Max) | 1320×2868 px | 3 min, 10 max |
| iPhone 6.5" (iPhone 14 Plus) | 1284×2778 px | Si visuels différents du 6.9" |
| iPad Pro 13" | 2064×2752 px | Recommandé si tablette supportée |

> L'iPhone 6.9" est le format principal — il s'affiche en priorité sur la fiche App Store.

## Google Play (obligatoire)

| Format | Résolution | Quantité |
|---|---|---|
| Téléphone | 1080×1920 px min | 2 min, 8 max |
| Feature graphic | 1024×500 px | 1 obligatoire |
| Tablette 7" | 1200×1920 px | Recommandé |

## Écrans à capturer (priorité décroissante)

1. **HomeScreen** — progression visible (niveau, cartes débloquées, baromètre)
2. **Module éducatif ouvert** — contenu pédagogique, carte débloquée en fin
3. **HallOfCards** — carousel de cartes collectibles, animation gyroscopique
4. **DiceGame** — dé lancé, résultat affiché, interface de jeu
5. **PremiumScreen** — présentation offre Premium, bénéfices clés

## Contraintes éditoriales

- Aucun contenu explicite visible sur les screenshots publics
- Utiliser des données de démonstration (pas de profil utilisateur réel)
- Le baromètre doit être visible sur le HomeScreen (palier 2 ou 3 recommandé)
- Masquer le gate 18+ sur les captures — montrer l'interface avant déverrouillage

## Outil recommandé

- **iOS** : Simulateur Xcode → iPhone 15 Pro Max (Device > iPhone 15 Pro Max)
- **Android** : Android Emulator → Pixel 8 Pro (API 34)

```bash
# Capture iOS via xcrun (depuis terminal, simulateur ouvert)
xcrun simctl io booted screenshot screenshot-home.png

# Capture Android via adb
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshot-home.png
```

## Checklist avant soumission

- [ ] Screenshots iPhone 6.9" réalisés (3 minimum)
- [ ] Screenshots Google Play téléphone réalisés (2 minimum)
- [ ] Feature graphic Google Play créé (1024×500 px)
- [ ] Aucun contenu explicite visible
- [ ] Textes lisibles (pas de lorem ipsum)
- [ ] Nom de l'app visible sur au moins 1 screenshot
- [ ] Cohérence visuelle entre toutes les captures (même thème)
