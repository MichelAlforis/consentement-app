'use client';

const WHY_CARDS = [
  {
    emoji: '🧠',
    title: 'Apprendre sans s\'ennuyer',
    desc: 'Des modules courts, des quiz et des scénarios réels. Tu avances à ton rythme, tu ne subis pas un cours.',
    borderClass: 'grad-border-violet',
    accent: 'rgba(139,92,246,0.06)',
    hoverGlow: '0 0 60px rgba(139,92,246,0.12)',
    tag: 'Éducatif',
  },
  {
    emoji: '🎲',
    title: 'Jouer pour explorer',
    desc: 'Jeu du dé, jeu de l\'oie, cartes — seul·e ou avec ton partenaire. Explorer n\'a jamais été aussi safe.',
    borderClass: 'grad-border-amber',
    accent: 'rgba(245,158,11,0.05)',
    hoverGlow: '0 0 60px rgba(245,158,11,0.1)',
    tag: 'Jeux',
  },
  {
    emoji: '⚖️',
    title: 'Connaître ses droits',
    desc: 'Contenu co-rédigé par un juriste spécialisé en droit pénal du consentement. Pour de vrai, pas du bullshit.',
    borderClass: 'grad-border-emerald',
    accent: 'rgba(16,185,129,0.05)',
    hoverGlow: '0 0 60px rgba(16,185,129,0.1)',
    tag: 'Légal',
  },
];

export default function WhySection() {
  return (
    <section id="pourquoi" className="py-28 px-6 relative overflow-hidden">
      {/* Fond avec dot grid atténué */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionLabel>Pourquoi OuiClair ?</SectionLabel>
        <h2 className="text-4xl lg:text-5xl font-black text-oui-text mt-4 mb-5 leading-tight">
          L&apos;éducation sexuelle
          <br />
          <span className="text-gradient-static">qu&apos;on aurait dû t&apos;enseigner.</span>
        </h2>
        <p className="text-oui-muted max-w-lg mb-16 text-[1.05rem] leading-relaxed">
          La pornographie libre est la principale source d&apos;éducation sexuelle des ados.
          OuiClair parle des mêmes sujets — franchement, avec le consentement comme boussole.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {WHY_CARDS.map((card) => (
            <WhyCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({
  emoji, title, desc, borderClass, accent, hoverGlow, tag,
}: (typeof WHY_CARDS)[0]) {
  return (
    <div
      className={`${borderClass} rounded-2xl group transition-all duration-300`}
      style={{ '--hover-glow': hoverGlow } as React.CSSProperties}
    >
      <div
        className="grad-inner rounded-[calc(1rem-1px)] p-7 h-full flex flex-col transition-all duration-300 group-hover:scale-[1.01]"
        style={{ background: `linear-gradient(145deg, ${accent}, #1a1128)` }}
      >
        {/* Icône */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {emoji}
        </div>

        {/* Tag */}
        <div className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {tag}
        </div>

        <h3 className="text-oui-text font-bold text-[1.05rem] mb-3 leading-snug">{title}</h3>
        <p className="text-oui-muted text-sm leading-relaxed flex-1">{desc}</p>
      </div>
    </div>
  );
}

/* Réexporté pour usage dans Features et AudienceSection */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-oui-subtle text-[11px] font-semibold uppercase tracking-widest"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {children}
    </div>
  );
}
