'use client';

import { useState } from 'react';
import { COLORS } from './constants';
import { ownerName } from './pb';
import type { Owner } from './types';

export default function IdentityGate({ onPick }: { onPick: (owner: Owner) => Promise<void> }) {
  const [pending, setPending] = useState<Owner | null>(null);
  const [error, setError] = useState('');

  const pick = async (owner: Owner) => {
    setPending(owner);
    setError('');
    try {
      await onPick(owner);
    } catch {
      setError('Connexion impossible. Vérifie que tu es sur le wifi de la maison.');
    } finally {
      setPending(null);
    }
  };

  return (
    <div style={{ minHeight: '80vh', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, animation: 'nc-enter .35s cubic-bezier(.2,1.1,.4,1) both' }}>
      <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#8b5cf6' }}>Avant d&apos;entrer</span>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.025em' }}>
        Qui écrit,
        <br />
        <span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>là, maintenant ?</span>
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>
        Chaque changement gardera ton prénom et l&apos;heure, pour qu&apos;on sache qui a écrit quoi.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(['A', 'B'] as Owner[]).map((owner) => (
          <button
            key={owner}
            type="button"
            onClick={() => pick(owner)}
            disabled={pending !== null}
            className="nc-hover-lift"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 18,
              borderRadius: 16,
              background: `linear-gradient(145deg, ${COLORS[owner]}1f, #1a1128 70%)`,
              border: `1px solid ${COLORS[owner]}59`,
              color: '#f8fafc',
              fontSize: 17,
              fontWeight: 800,
              cursor: 'pointer',
              opacity: pending && pending !== owner ? 0.5 : 1,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 4, background: COLORS[owner] }} />
            {pending === owner ? 'Connexion…' : ownerName(owner)}
          </button>
        ))}
      </div>
      {error && <p style={{ margin: 0, fontSize: 12, color: '#fb7185' }}>{error}</p>}
      <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>Ce choix reste sur cet appareil. Tu peux en changer à tout moment, en haut de la carte.</p>
    </div>
  );
}
