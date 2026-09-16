'use client';

import dynamic from 'next/dynamic';

const NeedsMapApp = dynamic(() => import('./NeedsMapApp'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-oui-bg text-oui-muted text-sm">
      Chargement de la carte…
    </div>
  ),
});

export default function NeedsMapLoader() {
  return <NeedsMapApp />;
}
