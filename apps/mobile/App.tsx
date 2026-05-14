import EventSource from 'react-native-sse';
// Polyfill EventSource for PocketBase realtime before any pb import
(global as unknown as Record<string, unknown>).EventSource = EventSource;

import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initStorage } from '@ouiclair/core';
import { mmkvStorage } from './src/storage/mmkvStorage';
import { AppProviders } from './src/shell/AppProviders';
import { RouteRenderer } from './src/shell/RouteRenderer';

// TODO Phase 9 (pré-production) : remplacer undefined par la vraie DSN Sentry
Sentry.init({
  dsn: __DEV__ ? undefined : 'SENTRY_DSN_PLACEHOLDER',
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
});

initStorage(mmkvStorage);

function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RouteRenderer />
        <StatusBar style="light" />
      </AppProviders>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);
