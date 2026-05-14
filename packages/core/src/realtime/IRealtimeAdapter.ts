/**
 * Abstraction du transport realtime PocketBase.
 * Web  : EventSource natif (géré par le SDK PocketBase)
 * Mobile : polyfill global EventSource via react-native-sse (injecté au démarrage de l'app)
 *
 * Aucun adaptateur explicite nécessaire à ce niveau — le SDK PocketBase
 * utilise EventSource via le global. Injecter react-native-sse AVANT d'importer pb.ts.
 *
 * Exemple dans apps/mobile/App.tsx :
 *   import { EventSource } from 'react-native-sse';
 *   global.EventSource = EventSource as unknown as typeof globalThis.EventSource;
 */
export type RealtimeUnsubscribe = () => void;
