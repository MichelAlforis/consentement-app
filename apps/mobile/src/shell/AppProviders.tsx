import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { initRevenueCat, checkPremiumEntitlement } from '../iap/iapService';
import { usePremiumStore } from '@ouiclair/core';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestTrackingPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    initRevenueCat();
    checkPremiumEntitlement().then((isPremium) => {
      if (isPremium) usePremiumStore.getState().activatePremium();
    });
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
