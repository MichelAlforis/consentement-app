'use client';

import dynamic from 'next/dynamic';

const NotreCarteApp = dynamic(() => import('./NotreCarteApp'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0714', color: '#64748b', fontSize: 13 }}>
      Chargement…
    </div>
  ),
});

export default function NotreCarteLoader() {
  return <NotreCarteApp />;
}
