'use client';

import { AppProviders } from './components/app/AppProviders';
import { AppShell } from './components/app/AppShell';
import { useAuthStore } from './stores';

export default function ConsentementApp() {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
  }

  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
