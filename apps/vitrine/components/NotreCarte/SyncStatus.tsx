'use client';

const BURST_ANIMS = ['nc-b1', 'nc-b2', 'nc-b3', 'nc-b4', 'nc-b5', 'nc-b6', 'nc-b3', 'nc-b5'];
const BURST_COLORS = ['#a78bfa', '#ec4899', '#f8fafc', '#f472b6', '#8b5cf6', '#ddd6fe', '#a78bfa', '#f472b6'];
const BURST_SIZES = [7, 6, 5, 7, 6, 5, 4, 4];
const BURST_DURATIONS = [0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1.15, 1.15];
const BURST_DELAYS = [0, 0, 0, 0, 0, 0, 0.1, 0.1];

interface Props {
  syncStatus: 'idle' | 'dirty' | 'saving' | 'synced';
  fx: boolean;
  saveMsg: string;
  onSave: () => void;
}

export default function SyncStatus({ syncStatus, fx, saveMsg, onSave }: Props) {
  if (syncStatus === 'idle' && !saveMsg) return null;

  const isDirty = syncStatus === 'dirty';
  const isSaving = syncStatus === 'saving';

  return (
    <div className="nc-savebar" style={{ position: 'fixed', zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          pointerEvents: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: isDirty ? '6px 6px 6px 16px' : '6px 14px',
          borderRadius: 9999,
          background: 'rgba(13,7,20,.85)',
          border: '1px solid #2e1f46',
          backdropFilter: 'blur(8px)',
        }}
      >
        {isDirty && (
          <>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>Modifications non enregistrées</span>
            <button
              type="button"
              onClick={onSave}
              className="nc-hover-scale"
              style={{
                pointerEvents: 'auto',
                background: 'linear-gradient(90deg,#8b5cf6,#ec4899)',
                border: 'none',
                color: '#fff',
                borderRadius: 9999,
                padding: '9px 16px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Enregistrer
            </button>
          </>
        )}
        {(isSaving || syncStatus === 'synced') && (
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isSaving ? '#64748b' : '#8b5cf6',
                animation: isSaving ? 'nc-pulse-dot 1s ease-in-out infinite' : 'none',
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                animation: syncStatus === 'synced' ? 'nc-fade 1.8s ease forwards' : 'none',
              }}
            >
              {isSaving ? 'Enregistrement…' : 'Enregistré ✓'}
            </span>
          </span>
        )}
        {fx && (
          <div aria-hidden="true" style={{ position: 'relative', width: 0, height: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 2 }}>
              {BURST_ANIMS.map((anim, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    width: BURST_SIZES[i],
                    height: BURST_SIZES[i],
                    borderRadius: '50%',
                    background: BURST_COLORS[i],
                    animation: `${anim} ${BURST_DURATIONS[i]}s cubic-bezier(.2,.8,.3,1) ${BURST_DELAYS[i]}s forwards`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {saveMsg && (
          <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, whiteSpace: 'nowrap', animation: 'nc-fade 2.7s ease forwards' }}>
            {saveMsg}
          </span>
        )}
      </div>
    </div>
  );
}
