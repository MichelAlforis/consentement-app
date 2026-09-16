'use client';

import type { useNotreCarte } from './useNotreCarte';

type Nc = ReturnType<typeof useNotreCarte>;

export default function EdgeSheetPage({ nc, index }: { nc: Nc; index: number }) {
  const { state, name, levels } = nc;
  const edge = state.edges[index];
  const a = state.nodes.find((n) => n.id === edge.from);
  const b = state.nodes.find((n) => n.id === edge.to);
  if (!a || !b) return null;

  const pct = Math.round((levels[edge.from] ?? 0) * 100);
  const strengthText =
    pct < 12
      ? "Ce lien est éteint : la source n'est pas assez nourrie pour que quoi que ce soit passe."
      : `Ce lien passe à ${pct} % — c'est exactement ce que la source peut transmettre aujourd'hui.`;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14, animation: 'nc-enter .3s cubic-bezier(.2,1.1,.4,1) both' }}>
      <button type="button" onClick={nc.goMap} className="nc-hover-left" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        ← La carte
      </button>
      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#8b5cf6' }}>Un lien</span>
        <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 5 }}>{name(a.owner)} → {name(b.owner)}</span>
      </div>
      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(26,17,40,.55)', border: '1px solid rgba(255,255,255,.07)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>Ce qui part</span>
        <span style={{ display: 'block', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginTop: 8, lineHeight: 1.25 }}>{a.title}</span>
        <span style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>{a.note}</span>
      </div>
      <span style={{ alignSelf: 'center', fontSize: 22, color: '#8b5cf6' }}>↓</span>
      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.22)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#a78bfa' }}>Ce que ça permet</span>
        <span style={{ display: 'block', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginTop: 8, lineHeight: 1.25 }}>{b.title}</span>
        <span style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>{b.note}</span>
      </div>
      <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{strengthText}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        <button type="button" onClick={() => nc.goNode(a.id)} className="nc-hover-scale" style={actionBtnStyle}>Page du départ</button>
        <button type="button" onClick={() => nc.goNode(b.id)} className="nc-hover-scale" style={actionBtnStyle}>Page d&apos;arrivée</button>
        <button
          type="button"
          onClick={() => {
            nc.removeEdgeAt(index, a.id, b.title);
            nc.goMap();
          }}
          className="nc-hover-scale-rot"
          style={{ ...actionBtnStyle, background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6' }}
        >
          Enlever cette flèche
        </button>
      </div>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(255,255,255,.1)',
  color: '#94a3b8',
  borderRadius: 11,
  padding: '12px 15px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};
