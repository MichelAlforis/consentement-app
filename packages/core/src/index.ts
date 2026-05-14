// @ouiclair/core — public API

// Storage
export { initStorage, getCoreStorage, createCoreStorage } from './storage';
export type { IStorage } from './storage';

// Types
export * from './types';

// Stores
export * from './stores';

// Utils
export * from './utils';

// Constants
export * from './constants';

// Lib
export { isAdultApp, APP_VARIANT } from './lib/appVariant';
export { pb } from './lib/pb';
export * from './lib/moduleIds';
export * from './lib/computePreferenceMatches';
export { logger } from './lib/logger';

// Sync
export * from './lib/sync/duoSync';
export * from './lib/sync/profileSync';

// Modules + Routes
export * from './modules';
export * from './routes';

// Data
export * from './data';
