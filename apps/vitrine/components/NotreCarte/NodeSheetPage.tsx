'use client';

import { useState } from 'react';
import { COLORS } from './constants';
import AutoGrowTextarea from './AutoGrowTextarea';
import type { useNotreCarte } from './useNotreCarte';
import type { CarteNode } from './types';

type Nc = ReturnType<typeof useNotreCarte>;

export default function NodeSheetPage({ nc, node }: { nc: Nc; node: CarteNode }) {
  const { state, name, elide, startsWithVowel, incoming, trendFor } = nc;
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const who = name(node.owner);
  const other = name(node.owner === 'A' ? 'B' : 'A');
  const iAmOwner = state.me === node.owner;

  const idx = state.nodes.findIndex((n) => n.id === node.id);
  const prev = idx > 0 ? state.nodes[idx - 1] : state.nodes[state.nodes.length - 1];
  const next = idx >= 0 && idx < state.nodes.length - 1 ? state.nodes[idx + 1] : state.nodes[0];

  const manque = state.manques[node.id] || { casse: '', plus: '' };
  const draft = state.drafts[node.id] || '';
  const sentSet = node.sent != null;
  const sent = sentSet ? node.sent! : 0;
  const gap = sent - (node.sat || 0);

  const gapText =
    gap > 30
      ? `${other} se donne du mal et ${who} n'en perçoit presque rien. Ce n'est pas un manque d'effort : c'est le besoin qui a été mal compris. La question à poser n'est pas « est-ce que j'en fais assez » mais « qu'est-ce qui compterait vraiment pour toi ».`
      : gap > 12
        ? `${other} pense en envoyer plus que ce que ${who} perçoit. L'effort existe, mais il ne tombe pas au bon endroit — à reprendre ensemble : qu'est-ce qui compterait, concrètement.`
        : gap < -12
          ? `${who} perçoit plus que ce que ${other} croit envoyer. Autant le dire à voix haute : ça se sait rarement tout seul.`
          : "Ce qui est envoyé et ce qui est perçu concordent. C'est là que la chaîne tient.";

  const received = Math.round((incoming[node.id] || 0) * 100);
  const chainText = received >= 12 ? `La chaîne alimente ce besoin à ${received} %.` : "La chaîne n'alimente presque plus ce besoin.";
  const trend = trendFor(node.id, node.sat || 0);

  const sheetEdges = state.edges
    .filter((e) => e.from === node.id)
    .map((e) => {
      const target = state.nodes.find((n) => n.id === e.to);
      return { id: e.id, label: target ? target.title : '?', onOpen: () => nc.goEdge(e.id), onRemove: () => nc.removeEdge(e.id, node.id, target ? target.title : '') };
    });

  const nodeHistory = nc.history((l) => l.n === node.id);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, animation: 'nc-enter .3s cubic-bezier(.2,1.1,.4,1) both' }}>
      <button type="button" onClick={nc.goMap} className="nc-hover-left" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        ← La carte
      </button>

      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: COLORS[node.owner] }}>Besoin</span>
        <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 5 }}>Besoin {elide(who)}</span>
      </div>

      <input
        value={node.title}
        onChange={(e) => iAmOwner && nc.patchNode(node.id, { title: e.target.value }, 'titre')}
        readOnly={!iAmOwner}
        className="nc-fiche-h1"
        style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #2e1f46', padding: '0 0 10px', color: '#f8fafc', fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.15 }}
      />
      <AutoGrowTextarea
        rows={3}
        value={node.note}
        onChange={(v) => iAmOwner && nc.patchNode(node.id, { note: v }, 'note')}
        readOnly={!iAmOwner}
        placeholder="Précise. Un exemple concret vaut mieux qu'une intention."
        style={{ width: '100%', background: 'rgba(26,17,40,.55)', border: '1px solid #2e1f46', borderRadius: 14, padding: 14, color: '#94a3b8', fontSize: 16, lineHeight: 1.65 }}
      />

      {!iAmOwner && (
        <p style={{ margin: 0, padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>
          {who} est la seule personne à pouvoir reformuler ce besoin. À toi de dire ce que tu crois envoyer, et ce que tu en penses plus bas.
        </p>
      )}

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{startsWithVowel(who) ? `Ce qu'${who}` : `Ce que ${who}`} perçoit</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{node.sat}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={node.sat}
            onChange={(e) => iAmOwner && nc.patchNode(node.id, { sat: Number(e.target.value) }, 'sat')}
            disabled={!iAmOwner}
            style={{ width: '100%', accentColor: '#8b5cf6' }}
          />
          {!iAmOwner && <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>C&apos;est à {who} de régler cette barre.</span>}
        </div>
        <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.08)', opacity: 0.85 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{other} pense envoyer (indicatif)</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8' }}>{sentSet ? sent + '%' : '—'}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={sent}
            onChange={(e) => !iAmOwner && nc.patchNode(node.id, { sent: Number(e.target.value) }, 'sent')}
            disabled={iAmOwner}
            style={{ width: '100%', accentColor: '#ec4899' }}
          />
          {iAmOwner && <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>C&apos;est à {other} de régler cette barre.</span>}
        </div>
        {sentSet ? (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 12 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#a78bfa' }}>
              {gap > 0 ? gap + ' points d’écart' : gap < 0 ? Math.abs(gap) + ' points d’écart' : 'Aucun écart'}
            </span>
            <p style={{ margin: '7px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{gapText}</p>
            <p style={{ margin: '7px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{chainText}</p>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 12 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b' }}>Écart inconnu</span>
            <p style={{ margin: '7px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              {other} n&apos;a pas encore répondu. Tant que cette barre est vide, il n&apos;y a pas d&apos;écart à lire : il n&apos;y a qu&apos;une moitié de la réponse.
            </p>
            <p style={{ margin: '7px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{chainText}</p>
          </div>
        )}
        {trend.has && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 12 }}>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#a78bfa' }}>Comment ça évolue</span>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: 54, marginTop: 10, overflow: 'visible' }}>
              <polyline points={trend.curve} fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{trend.line}</p>
          </div>
        )}
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(244,63,94,.05)', border: '1px solid rgba(244,63,94,.2)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#fb7185' }}>Quand il manque</span>
        <AutoGrowTextarea
          rows={2}
          value={manque.casse}
          onChange={(v) => nc.patchManque(node.id, 'casse', v)}
          placeholder="Ce que ça casse chez celui qui manque"
          style={{ width: '100%', marginTop: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 11, padding: 11, color: '#fda4af', fontSize: 16, lineHeight: 1.55 }}
        />
        <AutoGrowTextarea
          rows={2}
          value={manque.plus}
          onChange={(v) => nc.patchManque(node.id, 'plus', v)}
          placeholder="Ce qu'il n'arrive plus à donner à l'autre"
          style={{ width: '100%', marginTop: 9, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 11, padding: 11, color: '#94a3b8', fontSize: 16, lineHeight: 1.55 }}
        />
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(139,92,246,.05)', border: '1px solid rgba(139,92,246,.2)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#a78bfa' }}>Ce que l&apos;autre en dit</span>
        {manque.ditLock ? (
          <>
            <p style={{ margin: '12px 0 0', paddingLeft: 12, borderLeft: '2px solid rgba(139,92,246,.5)', fontSize: 16, color: '#ddd6fe', lineHeight: 1.6, fontStyle: 'italic', animation: 'nc-stamp .55s cubic-bezier(.2,1.5,.4,1) both' }}>
              {manque.dit}
            </p>
            <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 8 }}>{manque.ditBy} · écrit une fois, ne s&apos;efface pas</span>
          </>
        ) : (
          <>
            {iAmOwner && <p style={{ margin: '10px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>C&apos;est à {other} d&apos;écrire ici.</p>}
            <AutoGrowTextarea
              rows={3}
              value={draft}
              onChange={(v) => nc.setDraft(node.id, v)}
              readOnly={iAmOwner}
              placeholder="À toi. Ce que tu ressens sur ce besoin, avec tes mots."
              style={{ width: '100%', marginTop: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(139,92,246,.22)', borderRadius: 11, padding: 11, color: '#ddd6fe', fontSize: 16, lineHeight: 1.55 }}
            />
            {!iAmOwner && (
              <button type="button" onClick={() => nc.lockDit(node, draft)} className="nc-hover-scale-rot" style={{ marginTop: 10, background: 'rgba(139,92,246,.14)', border: '1px solid rgba(139,92,246,.4)', color: '#a78bfa', borderRadius: 9999, padding: '11px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Écrire — définitif
              </button>
            )}
          </>
        )}
      </div>

      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>Ce qui part de là</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {sheetEdges.map((x) => (
            <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" onClick={x.onOpen} className="nc-hover-right" style={{ flex: 1, textAlign: 'left', background: 'rgba(26,17,40,.55)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, padding: '13px 14px', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                → {x.label}
              </button>
              <button type="button" onClick={x.onRemove} className="nc-hover-remove nc-icon-btn" title="Enlever cette flèche" style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.25)', color: '#f472b6', borderRadius: 9, fontSize: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                ×
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {iAmOwner && (
            <button type="button" onClick={() => { nc.goMap(); nc.set({ linking: node.id }); nc.burst("Touche le nœud d'arrivée"); }} className="nc-hover-scale" style={actionBtnStyle}>
              Tirer une flèche depuis ce nœud
            </button>
          )}
          <button type="button" onClick={() => nc.patchNode(node.id, { owner: node.owner === 'A' ? 'B' : 'A' }, 'owner')} className="nc-hover-scale" style={actionBtnStyle}>
            Basculer sur l&apos;autre
          </button>
          {confirmingDelete ? (
            <>
              <button type="button" onClick={() => nc.deleteNode(node.id, node.title)} style={{ ...actionBtnStyle, background: 'rgba(236,72,153,.2)', border: '1px solid rgba(236,72,153,.5)', color: '#f472b6' }}>
                Confirmer la suppression
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)} style={actionBtnStyle}>Annuler</button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmingDelete(true)} className="nc-hover-scale-rot" style={{ ...actionBtnStyle, background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6' }}>
              Supprimer ce nœud
            </button>
          )}
        </div>
      </div>

      <details style={{ border: '1px solid #2e1f46', borderRadius: 14, padding: 14, background: 'rgba(26,17,40,.4)' }}>
        <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
          <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Historique de cette fiche</span>
            <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{nodeHistory.length ? nodeHistory.length + ' modifications' : 'Rien pour l’instant'}</span>
          </span>
        </summary>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {nodeHistory.map((h) => (
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

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', borderTop: '1px solid #2e1f46', paddingTop: 16, marginTop: 6 }}>
        <button type="button" onClick={() => prev && nc.goNode(prev.id)} className="nc-hover-left" style={{ flex: 1, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8', borderRadius: 11, padding: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          ← {prev ? prev.title : ''}
        </button>
        <button type="button" onClick={() => next && nc.goNode(next.id)} className="nc-hover-right" style={{ flex: 1, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8', borderRadius: 11, padding: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {next ? next.title : ''} →
        </button>
      </div>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8',
  borderRadius: 11, padding: '12px 15px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
};
