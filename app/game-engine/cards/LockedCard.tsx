'use client';

import type { CSSProperties } from 'react';
import { Lock } from 'lucide-react';

export interface LockedCardProps {
  deck: 'a' | 'b';
  condition: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
}

// Gradients très sombres — évoquent le deck sans révéler
const BG: Record<'a' | 'b', string> = {
  a: 'linear-gradient(135deg, #070b18 0%, #0c0928 50%, #130e3c 100%)',
  b: 'linear-gradient(135deg, #0c0009 0%, #1c020d 50%, #250817 100%)',
};

const GLOW: Record<'a' | 'b', string> = {
  a: '0 0 0 1px rgba(99,102,241,0.28), 0 0 22px rgba(99,102,241,0.1)',
  b: '0 0 0 1px rgba(190,18,60,0.28), 0 0 22px rgba(190,18,60,0.1)',
};

const GHOST_ICON_BG: Record<'a' | 'b', string> = {
  a: '#1e1b4b',
  b: '#4a0522',
};

const LOCK_BORDER: Record<'a' | 'b', string> = {
  a: 'rgba(99,102,241,0.35)',
  b: 'rgba(190,18,60,0.35)',
};

export function LockedCard({ deck, condition, width = 160, height = 240, style }: LockedCardProps) {
  const iconSize = width * 0.3;
  const lineH = Math.max(6, height * 0.028);
  const lockSize = width * 0.22;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 14,
        background: BG[deck],
        boxShadow: GLOW[deck],
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Contenu fantôme — flou 8px pour créer la frustration positive */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: height * 0.055,
          padding: `${height * 0.08}px ${width * 0.1}px`,
          filter: 'blur(8px)',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            background: GHOST_ICON_BG[deck],
          }}
        />
        <div style={{ width: '78%', height: lineH, borderRadius: 4, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ width: '55%', height: lineH, borderRadius: 4, background: 'rgba(255,255,255,0.25)' }} />
      </div>

      {/* Icône cadenas centré */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: lockSize,
            height: lockSize,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            border: `1px solid ${LOCK_BORDER[deck]}`,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={Math.round(width * 0.11)} color="rgba(255,255,255,0.85)" />
        </div>
      </div>

      {/* Badge condition */}
      <div
        style={{
          position: 'absolute',
          bottom: height * 0.05,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRadius: 999,
          padding: `${Math.max(3, height * 0.02)}px ${Math.max(8, width * 0.1)}px`,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <span
          style={{
            fontSize: Math.max(8, width * 0.065),
            fontWeight: 800,
            color: 'rgba(255,255,255,0.78)',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}
        >
          {condition}
        </span>
      </div>
    </div>
  );
}
