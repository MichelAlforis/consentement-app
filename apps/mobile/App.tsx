import EventSource from 'react-native-sse';
// Polyfill EventSource for PocketBase realtime before any pb import
(global as unknown as Record<string, unknown>).EventSource = EventSource;

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initStorage } from '@ouiclair/core';
import { mmkvStorage } from './src/storage/mmkvStorage';
import { AppProviders } from './src/shell/AppProviders';
import { RouteRenderer } from './src/shell/RouteRenderer';

initStorage(mmkvStorage);

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RouteRenderer />
        <StatusBar style="light" />
      </AppProviders>
    </SafeAreaProvider>
  );
}
