'use client';

import Image from 'next/image';
import { SectionLabel } from './WhySection';

const IMG_CARD_BG =
  '/lordenargent_minimal_dark_UI_card_with_a_glowing_violet_borde_dca4efb9-0266-4361-874e-44ced8c35752_2.png';

/* 2 featured cards + 7 secondary */
const FEATURED = [
  {
    icon: '📚',
    label: 'Modules progressifs',
    desc: 'Du débutant à l\'expert. Fiches pratiques, quiz, scénarios réels — tu choisis ton rythme.',
    accent: 'rgba(139,92,246,0.08)',
    borderClass: 'grad-border-violet',
  },
  {
    icon: '🎲',
    label: '3 jeux interactifs',
    desc: 'Jeu du dé, jeu de l\'oie, cartes collector — des sessions de 10 min qui changent tout.',
    accent: 'rgba(245,158,11,0.06)',
    borderClass: 'grad-border-amber',
  },
];

const SECONDARY = [
  { icon: '💬', label: 'Mode Duo', desc: 'Réponds séparément, découvrez vos points communs.' },
  { icon: '📖', label: 'Lexique', desc: '+20 termes déverrouillables progressivement.' },
  { icon: '🌡️', label: 'Baromètre Hot', desc: '5 paliers qui grandissent avec ton parcours.' },
  { icon: '⚡', label: '100% offline', desc: 'Aucune connexion. Tes données sur ton téléphone.' },
  { icon: '🔓', label: 'Totalement gratuit', desc: 'Accès complet, sans abonnement, sans carte.' },
  { icon: '🌍', label: 'FR · EN · ES', desc: 'Trois langues, zéro barrière.' },
  { icon: '👨‍⚖️', label: 'Co-rédigé par un juriste', desc: 'Droit pénal du consentement à chaque ligne.' },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-28 px-6 relative"
      style={{ background: 'linear-gradient(to bottom, #0d0714, rgba(26,17,40,0.5), #0d0714)' }}
    >
      {/* Image décorative Midjourney — fond flou droite */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] pointer-events-none overflow-hidden" aria-hidden>
        <Image
          src={IMG_CARD_BG}
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.18, maskImage: 'radial-gradient(ellipse 60% 80% at 80% 50%, black 30%, transparent 75%)' }}
        />
      </div>

      {/* Glow central */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-[160px]"
        style={{ width: 600, height: 300, background: 'rgba(139,92,246,0.06)' }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionLabel>Fonctionnalités</SectionLabel>
        <h2 className="text-4xl lg:text-5xl font-black text-oui-text mt-4 mb-3 leading-tight">
          Tout ce dont t&apos;as besoin.
        </h2>
        <p className="text-oui-muted text-[1.05rem] mb-14">
          Rien de plus, rien de moins.
        </p>

        {/* Featured 2-col */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {FEATURED.map((f) => (
            <FeaturedCard key={f.label} {...f} />
          ))}
        </div>

        {/* Secondary grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SECONDARY.map((f, i) => (
            <SecondaryCard key={f.label} {...f} highlight={i === 6} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  icon, label, desc, accent, borderClass,
}: (typeof FEATURED)[0]) {
  return (
    <div className={`${borderClass} rounded-2xl`}>
      <div
        className="grad-inner rounded-[calc(1rem-1px)] p-8 h-full flex flex-col gap-5 transition-all duration-200 hover:scale-[1.01]"
        style={{ background: `linear-gradient(145deg, ${accent}, #1a1128 60%)` }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-oui-text font-bold text-lg mb-2">{label}</h3>
          <p className="text-oui-muted text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function SecondaryCard({
  icon, label, desc, highlight,
}: { icon: string; label: string; desc: string; highlight?: boolean }) {
  return (
    <div
      className={`p-5 rounded-2xl flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] ${
        highlight ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
      style={{
        background: 'rgba(26,17,40,0.7)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-oui-text font-semibold text-sm leading-tight">{label}</div>
        <div className="text-oui-subtle text-xs mt-1 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
