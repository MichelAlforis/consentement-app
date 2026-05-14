'use client';

import { useEffect } from 'react';
import { AppProviders } from './components/app/AppProviders';
import { AppShell } from './components/app/AppShell';
import { useAuthStore } from './stores';
import { useProfileStore } from './stores/profileStore';

export default function ConsentementApp() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const authenticateWithPocketBase = useAuthStore((s) => s.authenticateWithPocketBase);
  const syncFromServer = useProfileStore((s) => s.syncFromServer);

  useEffect(() => {
    if (!isHydrated) return;
    // Fire-and-forget — ne bloque pas le rendu
    void authenticateWithPocketBase().then(() => syncFromServer());
  }, [isHydrated, authenticateWithPocketBase, syncFromServer]);

  if (!isHydrated) {
    return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
  }

  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
