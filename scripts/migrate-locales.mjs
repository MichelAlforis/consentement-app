/**
 * Script de migration : convertit les locales .ts en .json
 *
 * Usage : node scripts/migrate-locales.mjs
 *
 * Ce script :
 * 1. Importe les locales TS compilées via tsx
 * 2. Écrit un fichier .json par langue dans app/i18n/locales/
 * 3. À exécuter une fois, puis supprimer les anciens fichiers .ts
 *
 * Pré-requis : npm install -D tsx
 * Commande   : npx tsx scripts/migrate-locales.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Dynamically import compiled locales
// Note: tsx/ts-node required for TypeScript imports
const { fr } = await import('../app/i18n/locales/fr/index.ts');
const { en } = await import('../app/i18n/locales/en/index.ts');
const { es } = await import('../app/i18n/locales/es/index.ts');

const locales = { fr, en, es };

for (const [lang, translations] of Object.entries(locales)) {
  const outPath = resolve(ROOT, `app/i18n/locales/${lang}.json`);
  writeFileSync(outPath, JSON.stringify(translations, null, 2), 'utf-8');
  console.log(`✓ Written ${outPath}`);
}

console.log('\nMigration complete.');
console.log('Next steps:');
console.log('  1. Update app/i18n/index.ts to import from *.json instead of locales/*/index.ts');
console.log('  2. Delete app/i18n/locales/fr/, en/, es/ directories');
console.log('  3. Run npm run build to verify');
