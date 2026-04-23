'use client';
import { useState } from 'react';
import { BoardGrid, Legend } from '../components/screens/GooseGameScreen/components/Board';

export default function PlateauTestPage() {
  const [pos0, setPos0] = useState(0);
  const [pos1, setPos1] = useState(5);
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  function step(player: 0 | 1) {
    if (player === 0) setPos0(p => Math.min(p + 1, 23));
    else setPos1(p => Math.min(p + 1, 23));
    setActive(player === 0 ? pos0 + 1 : pos1 + 1);
  }

  function flash() {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0 40px',
      gap: 16,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
        PLATEAU TEST
      </p>

      <BoardGrid
        displayPos0={pos0}
        displayPos1={pos1}
        p0Emoji="🦊"
        p1Emoji="🐻"
        p0Color="#fb923c"
        p1Color="#38bdf8"
        activeSquare={active}
        isAnimating={animating}
        animatingPos={animating ? active : null}
      />

      <Legend />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px' }}>
        <button onClick={() => step(0)} style={btn('#7c3aed')}>🦊 +1</button>
        <button onClick={() => step(1)} style={btn('#0891b2')}>🐻 +1</button>
        <button onClick={flash} style={btn('#166534')}>⚡ Flash</button>
        <button onClick={() => { setPos0(0); setPos1(5); setActive(0); }} style={btn('#374151')}>↺ Reset</button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
        🦊 case {pos0} · 🐻 case {pos1}
      </p>
    </div>
  );
}

function btn(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  };
}
