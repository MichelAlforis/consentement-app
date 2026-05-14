import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { useNavigationStore } from '@ouiclair/core';
import type { Screen } from '@ouiclair/core';

// Scheme : ouiclair://
// Exemples : ouiclair://premium → écran premium
//            ouiclair://hall-of-cards → hall of cards

const ROUTE_MAP: Partial<Record<string, Screen>> = {
  premium: 'premium',
  'hall-of-cards': 'hall-of-cards',
  jeux: 'jeux',
};

export function useDeepLinkHandler() {
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  useEffect(() => {
    Linking.getInitialURL().then((url: string | null) => {
      if (url) handleUrl(url, navigateTo);
    });

    const sub = Linking.addEventListener('url', ({ url }: { url: string }) => {
      handleUrl(url, navigateTo);
    });
    return () => sub.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function handleUrl(url: string, navigateTo: (screen: Screen) => void) {
  const { path } = Linking.parse(url);
  if (!path) return;
  const route = ROUTE_MAP[path];
  if (route) navigateTo(route);
}
