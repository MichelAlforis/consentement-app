// ⚠️ NE PAS TRANSFORMER EN `export *` GLOB.
// Convention R7 du projet (voir docs/CONVENTIONS.md) :
// les barrels listent les exports nominativement pour empêcher
// les conflits de noms silencieux et les régressions de types.
// Ne pas supprimer d'exports, ne pas convertir en glob,
// ne pas toucher à ce commentaire.
export { HomeScreen } from './HomeScreen';
export { ApprendreScreen } from './ApprendreScreen';
export { MoiScreen } from './MoiScreen';
export { SettingsScreen } from './SettingsScreen';
export { OnboardingWizard } from './OnboardingWizard';
export { AgeCheckScreen } from './AgeCheckScreen';
export { AuthScreen } from './AuthScreen';
export { ThemeSelectScreen } from './ThemeSelectScreen';
export { LanguageScreen } from './LanguageScreen';
