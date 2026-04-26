'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CardBack } from '../game-engine/cards/CardBack';
import type { GainedCard } from '../components/screens/CardGame/index';
import { ThemeProvider } from '../context/ThemeContext';
import { PlayingCard } from '../components/screens/CardGame/PlayingCard';
import type { CollectorCard } from '../data/cards-collector';

const CollectorCardCanvas = dynamic(
  () => import('../game-engine/cards/CollectorCardCanvas').then(m => ({ default: m.CollectorCardCanvas })),
  { ssr: false },
);

// ─── Données de test ──────────────────────────────────────────────────────────

const PLAYING_CARD_DEMO: CollectorCard = {
  id: 'demo-playing',
  deck: 'A',
  theme: 'parlez',
  text: 'Décrivez un souvenir qui vous a rapprochés, une chose que vous n\'avez jamais oublié.',
  depth: 1,
  tags: [],
  rarity: 'common',
  unlockedBy: 'demo',
  visual: {
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    iconName: 'MessageCircle',
    border: '#a78bfa',
  },
};

const PLAYING_CAT = {
  name: 'Parlez-vous',
  iconName: 'MessageCircle',
  gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  border: '#a78bfa',
};

const CARDS: GainedCard[] = [
  {
    id: 'common-1',
    rarity: 'common',
    text: 'Décrivez un souvenir qui vous a rapprochés.',
    gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    border: '#60a5fa',
    iconName: 'MessageCircle',
  },
  {
    id: 'rare-1',
    rarity: 'rare',
    text: 'Partagez quelque chose que vous n\'avez jamais osé dire à voix haute.',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: '#c084fc',
    iconName: 'Sparkles',
  },
  {
    id: 'unique-1',
    rarity: 'unique',
    text: 'Ce moment vous appartient. Inventez votre propre règle du jeu.',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    border: '#fcd34d',
    iconName: 'Crown',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardCollectorTestPage() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [size, setSize] = useState(160);
  const [useFallback, setUseFallback] = useState(false);

  const toggle = (id: string) => setFlipped(f => ({ ...f, [id]: !f[id] }));
  const flipAll = () => {
    const allFlipped = CARDS.every(c => flipped[c.id]);
    const next: Record<string, boolean> = {};
    CARDS.forEach(c => { next[c.id] = !allFlipped; });
    setFlipped(next);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f0d1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 16px 60px',
      gap: 28,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
        CARD COLLECTOR — SANDBOX
      </p>

      {/* Contrôles */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Taille */}
        {([120, 160, 200] as const).map(s => (
          <button key={s} onClick={() => setSize(s)} style={chipStyle(size === s)}>
            {s}px
          </button>
        ))}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch' }} />
        {/* Fallback toggle */}
        <button onClick={() => setUseFallback(f => !f)} style={chipStyle(useFallback)}>
          {useFallback ? 'CSS fallback' : 'WebGL'}
        </button>
      </div>

      {/* Cartes */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>
        {CARDS.map(card => (
          <CardSlot
            key={card.id}
            card={card}
            isFlipped={!!flipped[card.id]}
            size={size}
            useFallback={useFallback}
            onToggle={() => toggle(card.id)}
          />
        ))}
      </div>

      {/* Actions globales */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={flipAll} style={actionStyle('#7c3aed')}>
          ⟳ Flip toutes
        </button>
        <button
          onClick={() => setFlipped({})}
          style={actionStyle('rgba(255,255,255,0.08)')}
        >
          Reset
        </button>
      </div>

      {/* Test autoFlip */}
      <AutoFlipDemo size={size} />

      {/* ── CONVERGENCE VISUELLE ──────────────────────────────────────────── */}
      <ConvergenceSection />

      {/* CardBack SVG — comparaison rendu HTML vs WebGL */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '22px 28px',
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          CardBack SVG — rendu HTML
        </span>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {([120, 160, 200] as const).map(s => (
            <CardBack key={s} width={s} height={Math.round(s * 1.5)} />
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <a href="/dice-test" style={linkStyle}>Dé →</a>
        <a href="/plateau-test" style={linkStyle}>Plateau →</a>
        <a href="/" style={linkStyle}>App →</a>
      </div>
    </div>
  );
}

// ─── CardSlot ─────────────────────────────────────────────────────────────────

function CardSlot({
  card, isFlipped, size, useFallback, onToggle,
}: {
  card: GainedCard;
  isFlipped: boolean;
  size: number;
  useFallback: boolean;
  onToggle: () => void;
}) {
  const rarityColor = card.rarity === 'unique' ? '#f59e0b' : card.rarity === 'rare' ? '#a855f7' : '#60a5fa';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '22px 20px',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 800, letterSpacing: 2,
        color: rarityColor, textTransform: 'uppercase',
      }}>
        {card.rarity}
      </span>

      {/* La carte — key force remount si on bascule useFallback */}
      {useFallback ? (
        <CSSFallbackPreview card={card} isFlipped={isFlipped} size={size} />
      ) : (
        <CollectorCardCanvas
          key={`${card.id}-webgl`}
          card={card}
          isFlipped={isFlipped}
          size={size}
        />
      )}

      <button
        onClick={onToggle}
        style={{
          background: isFlipped ? 'rgba(255,255,255,0.12)' : rarityColor,
          color: 'white',
          border: 'none',
          borderRadius: 10, padding: '8px 22px',
          fontWeight: 800, fontSize: 12, cursor: 'pointer',
          letterSpacing: 0.5,
        }}
      >
        {isFlipped ? '← Dos' : 'Flip →'}
      </button>
    </div>
  );
}

// ─── CSS Fallback preview (pour comparer) ────────────────────────────────────

function CSSFallbackPreview({ card, isFlipped, size }: { card: GainedCard; isFlipped: boolean; size: number }) {
  const w = size;
  const h = Math.round(size * 1.5);
  return (
    <div style={{ width: w, height: h, perspective: 600 }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: 'linear-gradient(135deg, #1e1b2e 0%, #2d2640 100%)',
          border: '2px solid rgba(255,255,255,0.14)',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 900, color: 'rgba(255,255,255,0.09)' }}>C</span>
        </div>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: card.gradient, border: `2px solid ${card.border}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '8px 6px', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: 'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.28) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />
          <p style={{
            fontSize: size * 0.055, fontWeight: 700, color: 'rgba(255,255,255,0.88)',
            textAlign: 'center', lineHeight: 1.35, position: 'relative', margin: 0,
            padding: '0 6px',
          }}>
            {card.text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Convergence visuelle — PlayingCard ↔ CollectorCard ──────────────────────

const COLLECTOR_FOR_CONVERGENCE: GainedCard = {
  id: 'convergence-demo',
  rarity: 'common',
  text: PLAYING_CARD_DEMO.text,
  gradient: PLAYING_CARD_DEMO.visual.gradient,
  border: PLAYING_CARD_DEMO.visual.border,
  iconName: PLAYING_CARD_DEMO.visual.iconName,
};

function ConvergenceSection() {
  const [revealed, setRevealed] = useState(false);
  const [collectorFlipped, setCollectorFlipped] = useState(false);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, padding: '24px 28px',
      width: '100%', maxWidth: 700,
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
        Convergence visuelle C1 + C3
      </span>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* CollectorCard */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            CollectorCard · R3F · 160px
          </span>
          <CollectorCardCanvas
            card={COLLECTOR_FOR_CONVERGENCE}
            isFlipped={collectorFlipped}
            size={160}
          />
          <button
            onClick={() => setCollectorFlipped(f => !f)}
            style={{ ...chipStyle(collectorFlipped), fontSize: 11 }}
          >
            {collectorFlipped ? '← Dos' : 'Face →'}
          </button>
        </div>

        {/* Séparateur */}
        <div style={{
          alignSelf: 'stretch', width: 1,
          background: 'rgba(255,255,255,0.08)',
          minHeight: 240,
        }} />

        {/* PlayingCard */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            PlayingCard · CSS · 290px
          </span>
          <ThemeProvider>
            <PlayingCard
              card={PLAYING_CARD_DEMO}
              cat={PLAYING_CAT}
              isRevealed={revealed}
              isAnimating={false}
              deckRemaining={3}
              onDraw={() => {}}
              themeId="dark-luxury"
            />
          </ThemeProvider>
          <button
            onClick={() => setRevealed(f => !f)}
            style={{ ...chipStyle(revealed), fontSize: 11 }}
          >
            {revealed ? '← Dos' : 'Face →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AutoFlip demo ────────────────────────────────────────────────────────────

function AutoFlipDemo({ size }: { size: number }) {
  const [key, setKey] = useState(0);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, padding: '22px 28px',
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
        autoFlip — flip auto après 800ms
      </span>
      <CollectorCardCanvas
        key={key}
        card={CARDS[2]}
        isFlipped={false}
        size={size}
        autoFlip
        onFlipComplete={() => {/* flip done */}}
      />
      <button
        onClick={() => setKey(k => k + 1)}
        style={actionStyle('#b45309')}
      >
        ↺ Rejouer
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: active ? 'white' : 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, padding: '6px 14px',
    fontWeight: 700, fontSize: 12, cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: 1,
  };
}

function actionStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: 12, padding: '11px 28px',
    fontWeight: 800, fontSize: 14, cursor: 'pointer',
  };
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: 12,
  fontWeight: 600,
  textDecoration: 'none',
};
