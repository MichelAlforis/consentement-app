'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { DiceRenderer } from '../game-engine/dice/DiceRenderer';
import { DICE_CATEGORIES } from '../data';
import type { DiceConfig, DiceFace } from '../game-engine/dice/types';

// ─── Configs ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: DiceConfig = {
  faces: ([1, 2, 3, 4, 5, 6] as const).map(n => ({
    id: n,
    label: DICE_CATEGORIES[n].name,
    iconName: DICE_CATEGORIES[n].iconName,
    gradient: DICE_CATEGORIES[n].gradient,
    border: DICE_CATEGORIES[n].border,
    color: DICE_CATEGORIES[n].border,
  })),
};

const NUMERIC_CONFIG: DiceConfig = {
  faces: ([1, 2, 3, 4, 5, 6] as const).map(n => ({
    id: n, label: String(n), iconName: '', gradient: '', border: '', color: '',
  })),
};

// ─── Mini hook local ──────────────────────────────────────────────────────────

function useDie(config: DiceConfig) {
  const [face, setFace] = useState<DiceFace>(config.faces[0]);
  const [rolling, setRolling] = useState(false);
  const faceRef = useRef(config.faces[0]);

  const roll = useCallback(() => {
    const f = config.faces[Math.floor(Math.random() * config.faces.length)];
    faceRef.current = f;
    setFace(f);
    setRolling(true);
  }, [config.faces]);

  const onComplete = useCallback(() => setRolling(false), []);

  return { face, rolling, roll, onComplete };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiceTestPage() {
  const cat = useDie(CATEGORY_CONFIG);
  const num = useDie(NUMERIC_CONFIG);
  const [renderer, setRenderer] = useState<'webgl' | 'css'>('webgl');

  // Auto-roll both on mount for a live first impression
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    setTimeout(() => { cat.roll(); num.roll(); }, 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f0d1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 16px 48px',
      gap: 24,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
        DÉ — SANDBOX
      </p>

      {/* Renderer toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['webgl', 'css'] as const).map(r => (
          <button key={r} onClick={() => setRenderer(r)} style={{
            background: renderer === r ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: renderer === r ? 'white' : 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 12,
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {r}
          </button>
        ))}
      </div>

      {/* Dice side by side */}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>

        {/* Numérique */}
        <DiceCard
          label="Jeu de l'Oie"
          sublabel={`→ ${num.face.id} point${num.face.id > 1 ? 's' : ''}`}
          color="#f0a020"
        >
          <DiceRenderer
            config={NUMERIC_CONFIG}
            currentFace={num.face}
            isRolling={num.rolling}
            onRollComplete={num.onComplete}
            renderer={renderer}
            size={160}
            mode="numeric"
          />
          <RollButton onClick={num.roll} disabled={num.rolling} color="#c45628" />
        </DiceCard>

        {/* Catégorie */}
        <DiceCard
          label="Jeu de dé"
          sublabel={`→ ${DICE_CATEGORIES[cat.face.id as 1|2|3|4|5|6]?.name ?? '—'}`}
          color="#8b5cf6"
        >
          <DiceRenderer
            config={CATEGORY_CONFIG}
            currentFace={cat.face}
            isRolling={cat.rolling}
            onRollComplete={cat.onComplete}
            renderer={renderer}
            size={160}
            mode="category"
          />
          <RollButton onClick={cat.roll} disabled={cat.rolling} color="#7c3aed" />
        </DiceCard>

      </div>

      {/* Roll both */}
      <button
        onClick={() => { cat.roll(); num.roll(); }}
        disabled={cat.rolling || num.rolling}
        style={{
          background: 'rgba(255,255,255,0.08)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 14, padding: '13px 40px',
          fontWeight: 800, fontSize: 15, cursor: 'pointer',
          opacity: (cat.rolling || num.rolling) ? 0.4 : 1,
          marginTop: 8,
        }}
      >
        ⟳ Lancer les deux
      </button>

      {/* Links */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <Link href="/plateau-test" style={linkStyle}>Plateau →</Link>
        <Link href="/" style={linkStyle}>App →</Link>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DiceCard({ label, sublabel, color, children }: {
  label: string;
  sublabel: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '24px 28px',
      minWidth: 200,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
        {label}
      </span>
      {children}
      <span style={{ fontSize: 13, fontWeight: 700, color, minHeight: 20 }}>
        {sublabel}
      </span>
    </div>
  );
}

function RollButton({ onClick, disabled, color }: { onClick: () => void; disabled: boolean; color: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: color,
        color: 'white',
        border: 'none',
        borderRadius: 12, padding: '10px 28px',
        fontWeight: 800, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      Lancer
    </button>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: 12,
  fontWeight: 600,
  textDecoration: 'none',
};
