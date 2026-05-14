'use client';

import Image from 'next/image';
import { SectionLabel } from './WhySection';

const IMG_TEENS =
  '/lordenargent_two_teenagers_having_a_serious_conversation_on_a_f3a495f3-80c4-48e8-88e3-0392a05db285_0.png';
const VIDEO_DUO =
  '/lordenargent_httpss.mj.runC0vg1EqosqY_--ar_256193_--video_1_-_bcefa01d-ee9b-43b4-a4b4-090e729c30f8_1.mp4';

export default function AudienceSection() {
  return (
    <section id="audience" className="py-16 sm:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Pour qui ?</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-oui-text mt-4 mb-8 sm:mb-14 leading-tight">
          Deux publics.{' '}
          <span className="text-gradient-static">Un seul but.</span>
        </h2>

        <div className="space-y-5">
          <TeensCard />
          <CouplesCard />
        </div>
      </div>
    </section>
  );
}

/* ── Card ados ───────────────────────────────────────────────────────────────── */
function TeensCard() {
  return (
    <div className="grad-border-violet rounded-3xl">
      <div
        className="grad-inner rounded-[calc(1.5rem-1px)] p-8 lg:p-12 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, #1a1128 50%)' }}
      >
        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Texte gauche */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              Ados — 13 à 17 ans
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-oui-text mb-5 leading-tight">
              T&apos;as des questions.
              <br />
              <span className="text-gradient-static">OuiClair y répond.</span>
            </h3>
            <p className="text-oui-muted leading-relaxed mb-7 text-[1.02rem]">
              Pas de cours magistral. Pas de flou. OuiClair s&apos;adresse à toi directement —
              sans te prendre pour un enfant, sans te traiter en adulte.
              Contenu relu et validé par des experts juridiques.
            </p>
            <ul className="space-y-3.5">
              {[
                'Comprendre le consentement (vraiment)',
                'Connaître tes droits et ceux des autres',
                'Identifier les situations qui ne sont pas normales',
                'En parler avec tes mots, sans gêne',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-oui-muted">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne droite — image Midjourney + cards flottantes */}
          <div className="relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[340px]">
            {/* Image illustration */}
            <Image
              src={IMG_TEENS}
              alt="Deux ados en conversation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay gradient bas pour lisibilité des cards */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(13,7,20,0.92) 0%, rgba(13,7,20,0.45) 45%, rgba(13,7,20,0.08) 100%)',
              }}
            />
            {/* Overlay côté gauche pour fusion avec le fond de la card */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(26,17,40,0.6) 0%, transparent 40%)',
              }}
            />

            {/* Cards scénario superposées en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
              <ScenarioCard
                tag="Scénario réel"
                tagColor="rgba(139,92,246,0.2)"
                tagText="#a78bfa"
                accentLine="rgba(139,92,246,0.35)"
                question={"Mon pote dit que le silence = oui. C'est vrai ?"}
                answer={"Non. Le silence n'est pas un consentement. Il doit être clair, libre et enthousiaste."}
              />
              <ScenarioCard
                tag="Quiz droit"
                tagColor="rgba(139,92,246,0.2)"
                tagText="#a78bfa"
                accentLine="rgba(139,92,246,0.35)"
                question="À quel âge peut-on légalement avoir une relation sexuelle ?"
                answer={"En France, l'âge légal est 15 ans. En dessous, c'est une infraction pénale."}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card couples ────────────────────────────────────────────────────────────── */
function CouplesCard() {
  return (
    <div className="grad-border-pink rounded-3xl">
      <div
        className="grad-inner rounded-[calc(1.5rem-1px)] overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06) 0%, #1a1128 50%)' }}
      >
        {/* Vidéo Midjourney en fond ambiant */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.12, mixBlendMode: 'screen' }}
          aria-hidden
        >
          <source src={VIDEO_DUO} type="video/mp4" />
        </video>

        <div className="relative p-6 sm:p-8 lg:p-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Texte gauche */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(236,72,153,0.1)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.2)' }}
            >
              Jeunes adultes &amp; couples
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-oui-text mb-5 leading-tight">
              Explorez ensemble.
              <br />
              <span className="text-oui-pink">À votre rythme.</span>
            </h3>
            <p className="text-oui-muted leading-relaxed mb-7 text-[1.02rem]">
              Le mode Duo permet de répondre séparément sur vos préférences —
              puis de découvrir ce que vous avez en commun. Sans pression. Sans gêne.
              L&apos;ambiguïté est préservée là où vous ne matchez pas.
            </p>
            <ul className="space-y-3.5">
              {[
                'Questionnaires de préférences séparés',
                'Révélation uniquement des points communs',
                'Jeux interactifs à deux ou en solo',
                'Progression commune dans le baromètre',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-oui-muted">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(236,72,153,0.12)', color: '#f472b6' }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Grille de jeux droite */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🎲', label: 'Jeu du dé', desc: 'Sessions de 10 min', color: 'from-amber-500 to-orange-500' },
              { emoji: '🃏', label: 'Cartes', desc: 'Collection à débloquer', color: 'from-oui-violet to-purple-600' },
              { emoji: '🪢', label: "Jeu de l'oie", desc: 'Plateau progressif', color: 'from-indigo-500 to-violet-600' },
              { emoji: '💬', label: 'Mode Duo', desc: 'Connexion par QR', color: 'from-pink-500 to-rose-500' },
            ].map((card) => (
              <div
                key={card.label}
                className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02]"
                style={{ background: 'rgba(13,7,20,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl`}>
                  {card.emoji}
                </div>
                <div>
                  <div className="text-oui-text font-semibold text-sm">{card.label}</div>
                  <div className="text-oui-subtle text-xs mt-0.5">{card.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ScenarioCard ────────────────────────────────────────────────────────────── */
function ScenarioCard({
  tag, tagColor, tagText, accentLine, question, answer,
}: {
  tag: string; tagColor: string; tagText: string; accentLine: string;
  question: string; answer: string;
}) {
  return (
    <div
      className="p-4 rounded-2xl space-y-2.5"
      style={{ background: 'rgba(13,7,20,0.85)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{ background: tagColor, color: tagText }}
      >
        {tag}
      </div>
      <p className="text-oui-text text-sm font-semibold leading-snug">{question}</p>
      <p
        className="text-oui-muted text-xs leading-relaxed pl-3"
        style={{ borderLeft: `2px solid ${accentLine}` }}
      >
        {answer}
      </p>
    </div>
  );
}
