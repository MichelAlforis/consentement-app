'use client';

import { useEffect, useRef } from 'react';
import AutoGrowTextarea from './AutoGrowTextarea';
import type { useNotreCarte } from './useNotreCarte';

type Nc = ReturnType<typeof useNotreCarte>;

export default function EdgeSheetPage({ nc, edgeId }: { nc: Nc; edgeId: string }) {
  const { state, name, levels } = nc;
  const edge = state.edges.find((e) => e.id === edgeId);
  const possibleRef = useRef<HTMLTextAreaElement>(null);

  const a = edge ? state.nodes.find((n) => n.id === edge.from) : undefined;
  const b = edge ? state.nodes.find((n) => n.id === edge.to) : undefined;

  const canWrite = a ? state.me === a.owner : false;
  const fresh = canWrite && edge ? !edge.possible.trim() && !edge.donne.trim() : false;

  useEffect(() => {
    if (nc.focusEdgeRef.current === edgeId && fresh && possibleRef.current) {
      nc.focusEdgeRef.current = null;
      const t = setTimeout(() => possibleRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [edgeId, fresh, nc.focusEdgeRef]);

  if (!edge || !a || !b) return null;

  const pct = Math.round((levels[edge.from] ?? 0) * 100);
  const strengthText =
    pct < 12
      ? "Ce lien est éteint : la source n'est pas assez nourrie pour que quoi que ce soit passe."
      : `Ce lien passe à ${pct} % — c'est exactement ce que la source peut transmettre aujourd'hui.`;

  const oA = name(a.owner);
  const oB = name(b.owner);
  const de = (nm: string) => (/^[aeiouyéèêAEIOUYÉÈÊ]/.test(nm) ? `d'${nm}` : `de ${nm}`);
  const sheetOwner = a.owner === b.owner ? `Un maillon interne, chez ${oA}` : `Le passage ${de(oA)} à ${oB} — c'est ici que ça change de main`;
  const lockText = canWrite ? '' : `Ce lien part du besoin ${de(oA)} : c'est donc à ${oA} de dire ce que ça ouvre, et ce que ça permet de donner. Toi, tu peux le lire.`;

  const edgeHistory = nc.history((l) => l.n === edge.id);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14, animation: 'nc-enter .3s cubic-bezier(.2,1.1,.4,1) both' }}>
      <button type="button" onClick={nc.goMap} className="nc-hover-left" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        ← La carte
      </button>
      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#8b5cf6' }}>Fiche d&apos;un lien</span>
        <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 5 }}>{sheetOwner}</span>
      </div>
      <h1 className="nc-fiche-h1" style={{ margin: 0, fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.2 }}>{a.title} → {b.title}</h1>
      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{strengthText}</p>
      {lockText && (
        <p style={{ margin: 0, padding: '11px 13px', borderRadius: 12, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          {lockText}
        </p>
      )}
      {fresh && (
        <p style={{ margin: 0, padding: '12px 14px', borderRadius: 12, background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.35)', fontSize: 13, color: '#ddd6fe', lineHeight: 1.6, animation: 'nc-enter .35s cubic-bezier(.2,1.1,.4,1) both' }}>
          Cette flèche ne dit encore rien. Écris ce qu&apos;elle rend possible, et ce qu&apos;elle permet de donner.
        </p>
      )}

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.22)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#a78bfa' }}>Ce que ça rend possible</span>
        <AutoGrowTextarea
          ref={possibleRef}
          rows={3}
          value={edge.possible}
          onChange={(v) => nc.updateEdgeText(edge.id, 'possible', v, canWrite)}
          readOnly={!canWrite}
          placeholder="ex. je peux arrêter de surveiller, mon attention se libère"
          style={{ width: '100%', marginTop: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(139,92,246,.22)', borderRadius: 11, padding: 11, color: '#ddd6fe', fontSize: 16, lineHeight: 1.55 }}
        />
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(236,72,153,.06)', border: '1px solid rgba(236,72,153,.22)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#f472b6' }}>Ce que ça peut donner</span>
        <AutoGrowTextarea
          rows={3}
          value={edge.donne}
          onChange={(v) => nc.updateEdgeText(edge.id, 'donne', v, canWrite)}
          readOnly={!canWrite}
          placeholder="ex. je te demande ta journée, et j'écoute la réponse en entier"
          style={{ width: '100%', marginTop: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(236,72,153,.22)', borderRadius: 11, padding: 11, color: '#fbcfe8', fontSize: 16, lineHeight: 1.55 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>Les deux bouts</span>
        <button type="button" onClick={() => nc.goNode(a.id)} className="nc-hover-row" style={endBtnStyle}>
          <span style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b' }}>Ça part de</span>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#f8fafc', marginTop: 4, lineHeight: 1.3 }}>{a.title}</span>
          <span style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginTop: 5, lineHeight: 1.55 }}>{a.note}</span>
        </button>
        <span style={{ alignSelf: 'center', fontSize: 18, color: '#8b5cf6' }}>↓</span>
        <button type="button" onClick={() => nc.goNode(b.id)} className="nc-hover-row" style={endBtnStyle}>
          <span style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b' }}>Ça arrive sur</span>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#f8fafc', marginTop: 4, lineHeight: 1.3 }}>{b.title}</span>
          <span style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginTop: 5, lineHeight: 1.55 }}>{b.note}</span>
        </button>
      </div>

      <details style={{ border: '1px solid #2e1f46', borderRadius: 14, padding: 14, background: 'rgba(26,17,40,.4)' }}>
        <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
          <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Historique de ce lien</span>
            <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{edgeHistory.length ? edgeHistory.length + ' modifications' : 'Rien pour l’instant'}</span>
          </span>
        </summary>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {edgeHistory.map((h) => (
            <div key={h.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 9, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0, marginTop: 6 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 12, color: '#f8fafc' }}><strong>{h.who}</strong> a modifié {h.what}</span>
                <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>{h.value}</span>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 3 }}>{h.when}</span>
              </span>
            </div>
          ))}
        </div>
      </details>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        <button
          type="button"
          onClick={() => { nc.removeEdge(edge.id, a.id, b.title); nc.goMap(); }}
          className="nc-hover-scale-rot"
          style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6', borderRadius: 11, padding: '12px 15px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Enlever cette flèche
        </button>
      </div>
    </div>
  );
}

const endBtnStyle: React.CSSProperties = {
  width: '100%', textAlign: 'left', padding: 14, borderRadius: 13, background: 'rgba(26,17,40,.55)', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer',
};
