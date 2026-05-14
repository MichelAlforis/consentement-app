import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../context/ToastContext';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestTrackingPermissionsAsync();
    }
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
