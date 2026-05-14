docs/AGENTS.md

## Stack non négociable
- Expo SDK 55, RN 0.83, React 19
- NativeWind v4 + Tailwind v3 (PAS v5)
- Reanimated 3 (PAS v4 — incompatible NativeWind v4)
- Moti pour anims simples, Reanimated direct pour le reste
- MMKV pour storage local
- expo-secure-store pour le pbToken
- react-native-sse pour PocketBase realtime
- expo-blur pour backdrop-blur
- react-native-svg pour SVG inline
- lucide-react-native pour icônes

## Conventions
- Tous les écrans dans apps/mobile/src/components/screens/<ScreenName>/index.tsx
- Logique métier UNIQUEMENT dans @ouiclair/core, jamais dans apps/mobile
- Hooks RN-spécifiques dans apps/mobile/src/hooks/
- Aucun import depuis app/ root V3 (sauf pendant la phase de coexistence)
- Pas de StyleSheet.create — tout en NativeWind className
- Pas de useEffect pour fetch — utiliser les stores Zustand
- i18n via useTranslation() depuis le namespace approprié

## Pattern écran de référence
Voir apps/mobile/src/components/screens/WelcomeScreen/index.tsx