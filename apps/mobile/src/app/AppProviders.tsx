import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../theme/ThemeContext';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
