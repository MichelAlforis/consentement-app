import { EventSource } from 'react-native-sse';
// Polyfill EventSource for PocketBase realtime before any pb import
(global as any).EventSource = EventSource;

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initStorage } from '@ouiclair/core';
import { mmkvStorage } from './src/storage/mmkvStorage';
import { AppProviders } from './src/app/AppProviders';
import { RouteRenderer } from './src/app/RouteRenderer';

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
