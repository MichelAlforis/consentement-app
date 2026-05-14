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

      // Restaure pbToken depuis SecureStore (source de vérité unique hors MMKV)
      try {
        const token = await secureTokenStore.load();
        if (token) {
          const { pbUserId } = useAuthStore.getState();
          useAuthStore.setState({ pbToken: token });
          if (pbUserId) {
            const { pb } = await import('@ouiclair/core/lib/pb');
            pb.authStore.save(token, { id: pbUserId } as never);
          }
        }
      } catch {
        // Token corrompu ou expiré — non fatal, pb.authStore reste vide
      }
    })();

    // Sync pbToken → SecureStore à chaque mise à jour (ex: re-auth PocketBase)
    let prevToken: string | null = useAuthStore.getState().pbToken;
    const unsubscribe = useAuthStore.subscribe(async (state) => {
      if (state.pbToken !== prevToken) {
        prevToken = state.pbToken;
        if (state.pbToken) await secureTokenStore.save(state.pbToken);
        else await secureTokenStore.clear();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
