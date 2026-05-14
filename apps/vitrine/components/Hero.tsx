'use client';

import Link from 'next/link';

const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <HeroContent />
          <div className="hidden lg:block"><PhoneMockup /></div>
        </div>
      </div>

      {/* Fade vers section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-oui-bg to-transparent pointer-events-none" />
    </section>
  );
}

/* ── Contenu gauche ──────────────────────────────────────────────────────────── */
function HeroContent() {
  return (
    <div className="space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-oui-violet/8 border border-oui-violet/20">
        <span className="w-2 h-2 rounded-full bg-oui-violet animate-pulse-slow flex-shrink-0" />
        <span className="text-oui-violet-light text-xs font-semibold tracking-wide whitespace-nowrap">
          Éducation · Consentement · 13+
        </span>
      </div>

      {/* Titre */}
      <h1 className="text-[2.4rem] sm:text-[3rem] lg:text-[4.25rem] font-black leading-[1.05] lg:leading-[1.02] tracking-tight">
        <span className="text-oui-text">Parle de sexe.</span>
        <br />
        <span className="text-gradient-main">Sans gêne.</span>
        <br />
        <span className="text-oui-text">Sans honte.</span>
      </h1>

      {/* Sous-titre */}
      <p className="text-[1.1rem] text-oui-muted leading-relaxed max-w-[420px]">
        OuiClair t&apos;apprend le consentement en jouant — modules rédigés par un juriste en droit pénal,
        jeux interactifs, espace duo.{' '}
        <strong className="text-oui-text font-semibold">Gratuit.</strong>
      </p>

      {/* Boutons stores */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <StoreButton href={APP_STORE_URL} icon={<AppleIcon />} label="App Store" sub="Télécharger sur" dark />
        <StoreButton href={PLAY_STORE_URL} icon={<PlayIcon />} label="Google Play" sub="Disponible sur" />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <Stat value="Gratuit" label="pour toujours" />
        <Divider />
        <Stat value="13+" label="ans minimum" />
        <Divider />
        <Stat value="FR · EN · ES" label="langues" />
      </div>
    </div>
  );
}

function StoreButton({
  href, icon, label, sub, dark = false,
}: {
  href: string; icon: React.ReactNode; label: string; sub: string; dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all group ${
        dark
          ? 'bg-oui-text text-oui-bg hover:opacity-90'
          : 'bg-oui-card border border-oui-border hover:border-oui-violet/40 hover:bg-oui-card-hover'
      }`}
    >
      <div className={`w-7 h-7 flex-shrink-0 ${dark ? 'text-oui-bg' : 'text-oui-text group-hover:text-oui-violet-light transition-colors'}`}>
        {icon}
      </div>
      <div>
        <div className={`text-[10px] leading-none mb-0.5 ${dark ? 'opacity-50' : 'text-oui-subtle'}`}>{sub}</div>
        <div className="text-sm font-bold">{label}</div>
      </div>
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-oui-text font-bold text-base leading-none">{value}</div>
      <div className="text-oui-subtle text-xs mt-1">{label}</div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-9 bg-oui-border flex-shrink-0" />;
}

/* ── Mockup téléphone ────────────────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Halo derrière le téléphone */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <div
          className="w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative animate-float">
        {/* Téléphone principal */}
        <PhoneShell>
          <StatusBar />
          <AppContent />
          <HomeIndicator />
        </PhoneShell>

        {/* Téléphone secondaire (arrière, incliné) */}
        <SecondPhone />
      </div>
    </div>
  );
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-[268px] h-[560px] rounded-[46px] overflow-hidden flex flex-col shadow-phone z-10"
      style={{
        background: '#0d0714',
        border: '2px solid rgba(139,92,246,0.3)',
        boxShadow: '0 32px 96px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative flex-shrink-0 h-14 flex items-end pb-2 px-6">
      {/* Dynamic island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full flex items-center justify-center">
        <div className="w-12 h-3 bg-black rounded-full" />
      </div>
      {/* Heure */}
      <span className="text-white/80 text-[11px] font-semibold z-10">9:41</span>
      {/* Icônes droite */}
      <div className="ml-auto flex gap-1.5 items-center z-10">
        <svg className="w-3 h-3 text-white/70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
        <svg className="w-5 h-3 text-white/70" viewBox="0 0 24 10" fill="none">
          <rect x="0.5" y="0.5" width="20" height="9" rx="2" stroke="currentColor" strokeOpacity="0.5"/>
          <rect x="1.5" y="1.5" width="15" height="7" rx="1.5" fill="currentColor"/>
          <path d="M22 3.5v3c.83-.37 1.5-1.1 1.5-1.5S22.83 3.87 22 3.5z" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="flex-1 overflow-hidden px-5 py-1 flex flex-col gap-3.5">
      {/* Header app */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white/40 text-[10px] font-medium">Bonjour 👋</p>
          <h3 className="text-white font-bold text-[15px] leading-tight">Continue !</h3>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-oui-violet to-oui-pink flex items-center justify-center shadow-violet flex-shrink-0">
          <span className="text-white font-black text-sm">O</span>
        </div>
      </div>

      {/* Baromètre */}
      <div
        className="rounded-2xl px-4 py-3.5"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
      >
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🌡️</span>
            <span className="text-white/80 text-[11px] font-semibold">Baromètre Hot</span>
          </div>
          <span className="text-oui-violet-light text-[10px] font-bold">Palier 2</span>
        </div>
        <div className="w-full h-2 rounded-full bg-oui-border overflow-hidden">
          <div className="bar-fill-anim h-full rounded-full" />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-white/30 text-[9px]">28 pts</span>
          <span className="text-white/30 text-[9px]">40 pts →</span>
        </div>
      </div>

      {/* Module card */}
      <MockupCard
        emoji="📚"
        title="Pratiques de base"
        sub="Module · 4 fiches"
        progress={0.72}
        color="from-oui-violet to-purple-600"
      />

      {/* Jeu card */}
      <MockupCard
        emoji="🎲"
        title="Jeu du dé"
        sub="Session duo · 10 min"
        progress={null}
        color="from-amber-500 to-orange-500"
        cta="Jouer"
      />

      {/* Lexique teaser */}
      <div
        className="rounded-xl px-3.5 py-2.5 flex items-center gap-3"
        style={{ background: 'rgba(26,17,40,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-base">📖</span>
        <div className="flex-1 min-w-0">
          <div className="text-white/70 text-[10px] font-medium">Lexique</div>
          <div className="text-white/30 text-[9px]">3 nouveaux termes débloqués</div>
        </div>
        <span className="text-oui-violet-light text-[10px] font-bold badge-pop">+3</span>
      </div>
    </div>
  );
}

function MockupCard({
  emoji, title, sub, progress, color, cta,
}: {
  emoji: string; title: string; sub: string;
  progress: number | null; color: string; cta?: string;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
      style={{ background: 'rgba(26,17,40,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-lg">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white/90 text-[12px] font-semibold">{title}</div>
        <div className="text-white/35 text-[10px] mt-0.5">{sub}</div>
        {progress !== null && (
          <div className="mt-2 w-full h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>
      {cta && (
        <div
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r ${color}`}
        >
          {cta} ▶
        </div>
      )}
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="flex-shrink-0 h-8 flex items-center justify-center">
      <div className="w-28 h-1 rounded-full bg-white/25" />
    </div>
  );
}

function SecondPhone() {
  return (
    <div
      className="absolute -right-10 top-1/4 w-[132px] h-[276px] rounded-[32px] overflow-hidden opacity-50"
      style={{
        transform: 'rotate(8deg)',
        background: '#0d0714',
        border: '1.5px solid rgba(236,72,153,0.25)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-oui-bg to-oui-card" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-4xl">🎲</div>
        <div className="text-center">
          <div className="text-white/90 font-bold text-xs">Jeu du dé</div>
          <div className="text-white/40 text-[9px] mt-0.5">Session avec Alex</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <span className="text-white text-xs font-black">▶</span>
        </div>
      </div>
    </div>
  );
}

/* ── Background ──────────────────────────────────────────────────────────────── */
const VIDEO_HERO =
  '/lordenargent_httpss.mj.runaqlJMUtEzAo_--ar_256143_--video_1_-_187f6509-1abc-4f8c-ba74-9996f71954b2_3.mp4';

function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Vidéo Midjourney en loop — ambiance atmosphérique */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.28, mixBlendMode: 'screen' }}
      >
        <source src={VIDEO_HERO} type="video/mp4" />
      </video>
      {/* Overlay gradient pour lisibilité */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,7,20,0.3) 0%, rgba(13,7,20,0.1) 40%, rgba(13,7,20,0.5) 100%)',
        }}
      />
      {/* Grille de points */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ── Icônes SVG ──────────────────────────────────────────────────────────────── */
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M3.18 23.88c.34.18.73.2 1.08.04l12.47-7.2-2.88-2.88L3.18 23.88z" fill="#EA4335" />
      <path d="M21.54 10.27L18.36 8.4 15.14 11.6l3.22 3.2 3.18-1.85c.9-.52.9-1.86 0-2.38v-.1z" fill="#FBBC05" />
      <path d="M1.07.88C.7 1.27.5 1.84.5 2.55v18.9c0 .72.2 1.3.57 1.68L2 24l11.65-11.6L2 .96 1.07.88z" fill="#4285F4" />
      <path d="M16.73 8.12l-2.86-1.65L2 .88l11.75 11.75 3-3z" fill="#34A853" />
    </svg>
  );
}
