'use client';

import AutoGrowTextarea from './AutoGrowTextarea';
import { RemovableRow, dashedBtnStyle } from './MapView';
import type { useNotreCarte } from './useNotreCarte';
import type { Owner } from './types';

type Nc = ReturnType<typeof useNotreCarte>;

export default function PersonPage({ nc, who }: { nc: Nc; who: Owner }) {
  const { state, name, elide } = nc;
  const isMe = state.me === who;
  const nom = name(who);
  const other: Owner = who === 'A' ? 'B' : 'A';

  const engKey = who === 'A' ? 'engA' : 'engB';
  const travKey = who === 'A' ? 'travailA' : 'travailB';
  const profKey = who === 'A' ? 'profilA' : 'profilB';
  const signKey = who === 'A' ? 'signA' : 'signB';

  const mine = state.nodes.filter((n) => n.owner === who);
  const pHistory = nc.history((l) => l.w === who).slice(0, 40);

  const kicker = isMe ? 'Ta page' : 'La page ' + elide(nom);
  const needsLabel = isMe ? 'Tes besoins' : 'Les besoins ' + elide(nom);
  const travailLabel = isMe ? 'Ce que tu as à travailler seul' : `Ce que ${nom} a à travailler seul`;
  const engLabel = isMe ? 'Ce à quoi tu t’engages' : `Ce à quoi ${nom} s’engage`;
  const histoLabel = isMe ? 'Ce que tu as écrit' : `Ce que ${nom} a écrit`;
  const profilPlaceholder = isMe ? 'La lecture que vous faites de toi' : 'La lecture que vous faites ' + elide(nom);

  const travailItems = nc.listItems(travKey, false);
  const engItems = nc.listItems(engKey, !isMe);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, animation: 'nc-enter .3s cubic-bezier(.2,1.1,.4,1) both' }}>
      <button type="button" onClick={nc.goMap} className="nc-hover-left" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        ← La carte
      </button>

      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#8b5cf6' }}>{kicker}</span>
        <h1 className="nc-fiche-h1" style={{ margin: '6px 0 0', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.1 }}>{nom}</h1>
      </div>

      {mine.length > 0 && (
        <div>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>{needsLabel}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {mine.map((n) => (
              <button key={n.id} type="button" onClick={() => nc.goNode(n.id)} className="nc-hover-row" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 12, background: 'rgba(26,17,40,.55)', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer' }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{n.title}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    perçu {nc.satHidden(n) ? '••' : (n.sat || 0) + '%'} · envoi déclaré {n.sent == null ? '—' : n.sent + '%'}
                  </span>
                </span>
                <span style={{ fontSize: 11, color: '#8b5cf6' }}>▶</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(26,17,40,.55)', border: '1px solid #2e1f46' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>{travailLabel}</span>
        <AutoGrowTextarea
          rows={2}
          value={state[profKey]}
          onChange={(v) => nc.set({ [profKey]: v } as Partial<typeof state>)}
          placeholder={profilPlaceholder}
          style={{ width: '100%', marginTop: 12, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: 10, color: '#a78bfa', fontSize: 16, lineHeight: 1.55 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {travailItems.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: 'rgba(139,92,246,.14)', color: '#a78bfa' }}>→</span>
              <RemovableRow value={it.text} onChange={it.onChange} onRemove={it.onRemove} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => nc.addListItem(travKey)} className="nc-hover-dashed nc-hover-dashed-violet" style={dashedBtnStyle}>
          + Ajouter
        </button>
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(26,17,40,.55)', border: '1px solid #2e1f46' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>{engLabel}</span>
        {!isMe && (
          <p style={{ margin: '10px 0 0', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>
            {nom} est la seule personne à écrire ses engagements. Tu peux les lire.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {engItems.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: 'rgba(139,92,246,.14)', color: '#a78bfa' }}>✓</span>
              <RemovableRow value={it.text} onChange={it.onChange} onRemove={it.onRemove} />
            </div>
          ))}
        </div>
        {state[engKey].length === 0 && (
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Rien ici pour l&apos;instant. Cette liste s&apos;écrit d&apos;elle-même, quand elle voudra.</p>
        )}
        {isMe && (
          <button type="button" onClick={() => nc.addListItem(engKey)} className="nc-hover-dashed nc-hover-dashed-violet" style={dashedBtnStyle}>
            + Ajouter un engagement
          </button>
        )}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 12, color: state[signKey] ? '#a78bfa' : '#64748b', fontWeight: state[signKey] ? 700 : 400 }}>
            {state[signKey] ? 'Signé le ' + state[signKey] : 'Pas encore signé'}
          </span>
          {isMe && (
            <button type="button" onClick={() => nc.sign(who)} className="nc-hover-scale-rot" style={{ background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.4)', color: '#a78bfa', borderRadius: 9999, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {state[signKey] ? 'Retirer' : 'Signer'}
            </button>
          )}
        </div>
      </div>

      <details style={{ border: '1px solid #2e1f46', borderRadius: 14, padding: 14, background: 'rgba(26,17,40,.4)' }}>
        <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
          <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{histoLabel}</span>
            <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{pHistory.length ? pHistory.length + ' écritures' : 'Rien pour l’instant'}</span>
          </span>
        </summary>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {pHistory.map((h) => (
            <div key={h.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 9, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0, marginTop: 6 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 12, color: '#f8fafc' }}>a modifié {h.what}</span>
                <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>{h.value}</span>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 3 }}>{h.when}</span>
              </span>
            </div>
          ))}
        </div>
      </details>

      <button type="button" onClick={() => nc.goPerson(other)} className="nc-hover-right" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8', borderRadius: 11, padding: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        Voir la page {name(other)} →
      </button>
    </div>
  );
}
