// ⚠️ NE PAS TRANSFORMER EN `export *` GLOB.
// Convention R7 du projet (voir docs/CONVENTIONS.md) :
// les barrels listent les exports nominativement pour empêcher
// les conflits de noms silencieux et les régressions de types.
// Ne pas supprimer d'exports, ne pas convertir en glob,
// ne pas toucher à ce commentaire.
export { GooseGameScreen } from './GooseGameScreen';
export type { GooseGameScreenProps } from './GooseGameScreen';
