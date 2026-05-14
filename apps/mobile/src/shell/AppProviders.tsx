import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { initRevenueCat, checkPremiumEntitlement } from '../iap/iapService';
import { usePremiumStore, useAuthStore } from '@ouiclair/core';
import { secureTokenStore } from '../storage/secureTokenStore';
import { useDeepLinkHandler } from '../app/deepLinkHandler';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  useDeepLinkHandler();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestTrackingPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    void (async () => {
      initRevenueCat();
      const isPremium = await checkPremiumEntitlement();
      if (isPremium) usePremiumStore.getState().activatePremium();

      try {
        const token = await secureTokenStore.load();
        if (token) {
          const { pbUserId } = useAuthStore.getState();
          if (pbUserId) {
            const { pb } = await import('@ouiclair/core/lib/pb');
            pb.authStore.save(token, { id: pbUserId } as never);
          }
        }
      } catch {
        // Token corrompu ou expiré — non fatal, pb.authStore reste vide
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
