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

Sentry.init({
  dsn: __DEV__ ? undefined : 'https://6bcf9c06debf4f28f4945b95ae7c549b@o4510205968187392.ingest.de.sentry.io/4511390422990928',
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
