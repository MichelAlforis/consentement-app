'use client';

import Link from 'next/link';

const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

export default function DownloadCTA() {
  return (
    <section id="download" className="py-32 px-6 relative overflow-hidden">
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Ligne de séparation haute */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.2), transparent)' }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Logo OuiClair */}
        <div className="relative inline-block mb-10">
          <div
            className="absolute inset-0 rounded-full blur-3xl logo-pulse"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            aria-hidden
          />
          <div
            className="relative w-24 h-24 rounded-3xl mx-auto flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 0 60px rgba(139,92,246,0.4)',
            }}
          >
            <span className="text-white font-black text-4xl select-none">O</span>
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-5xl lg:text-6xl font-black text-oui-text leading-[1.02] mb-5">
          Télécharge
          <br />
          <span className="text-gradient-main">OuiClair.</span>
        </h2>
        <p className="text-oui-muted text-xl mb-4 font-medium">
          Gratuit. Pour toujours.
        </p>
        <p className="text-oui-subtle text-base mb-12 max-w-md mx-auto leading-relaxed">
          Disponible sur iOS et Android. Aucun compte requis pour commencer.
          Tes données ne quittent jamais ton téléphone.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
          <Link
            href={APP_STORE_URL}
            className="flex items-center gap-3.5 px-7 py-4 rounded-2xl font-bold transition-opacity hover:opacity-90 shadow-xl w-full sm:w-auto justify-center"
            style={{
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              color: '#0d0714',
              boxShadow: '0 8px 32px rgba(248,250,252,0.1)',
            }}
          >
            <AppleIconDark />
            <div className="text-left">
              <div className="text-[11px] opacity-50 leading-none mb-0.5">Télécharger sur</div>
              <div className="text-sm font-bold">App Store</div>
            </div>
          </Link>
          <Link
            href={PLAY_STORE_URL}
            className="flex items-center gap-3.5 px-7 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] w-full sm:w-auto justify-center"
            style={{
              background: 'rgba(26,17,40,0.9)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 40px rgba(139,92,246,0.08)',
            }}
          >
            <PlayIconColor />
            <div className="text-left">
              <div className="text-[11px] text-oui-muted leading-none mb-0.5">Disponible sur</div>
              <div className="text-sm font-bold text-oui-text">Google Play</div>
            </div>
          </Link>
        </div>

        {/* Badges */}
        <div
          className="inline-grid grid-cols-3 gap-8 px-8 py-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {[
            { emoji: '🔒', label: '100% privé', sub: 'Aucune donnée collectée' },
            { emoji: '✅', label: 'Gratuit', sub: 'Accès complet' },
            { emoji: '👨‍⚖️', label: 'Validé', sub: 'Par des experts juridiques' },
          ].map((b) => (
            <div key={b.label} className="text-center">
              <div className="text-2xl mb-2">{b.emoji}</div>
              <div className="text-oui-text text-xs font-semibold">{b.label}</div>
              <div className="text-oui-subtle text-[10px] mt-0.5 leading-tight">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppleIconDark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 flex-shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIconColor() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0">
      <path d="M3.18 23.88c.34.18.73.2 1.08.04l12.47-7.2-2.88-2.88L3.18 23.88z" fill="#EA4335" />
      <path d="M21.54 10.27L18.36 8.4 15.14 11.6l3.22 3.2 3.18-1.85c.9-.52.9-1.86 0-2.38v-.1z" fill="#FBBC05" />
      <path d="M1.07.88C.7 1.27.5 1.84.5 2.55v18.9c0 .72.2 1.3.57 1.68L2 24l11.65-11.6L2 .96 1.07.88z" fill="#4285F4" />
      <path d="M16.73 8.12l-2.86-1.65L2 .88l11.75 11.75 3-3z" fill="#34A853" />
    </svg>
  );
}
