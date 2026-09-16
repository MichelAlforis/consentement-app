'use client';

const BURST_ANIMS = ['nc-b1', 'nc-b2', 'nc-b3', 'nc-b4', 'nc-b5', 'nc-b6', 'nc-b3', 'nc-b5'];
const BURST_COLORS = ['#a78bfa', '#ec4899', '#f8fafc', '#f472b6', '#8b5cf6', '#ddd6fe', '#a78bfa', '#f472b6'];
const BURST_SIZES = [7, 6, 5, 7, 6, 5, 4, 4];
const BURST_DURATIONS = [0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1.15, 1.15];
const BURST_DELAYS = [0, 0, 0, 0, 0, 0, 0.1, 0.1];

export default function SaveBar({ fx, saveMsg }: { fx: boolean; saveMsg: string }) {
  return (
    <div className="nc-savebar" style={{ position: 'fixed', zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          pointerEvents: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 10px 8px 8px',
          borderRadius: 9999,
          background: 'rgba(13,7,20,.94)',
          border: '1px solid #2e1f46',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 40px rgba(0,0,0,.55)',
        }}
      >
        <div style={{ position: 'relative' }}>
          {fx && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 2 }}>
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
          )}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 44,
              background: 'linear-gradient(90deg,#8b5cf6,#ec4899)',
              color: '#fff',
              borderRadius: 9999,
              padding: '12px 26px',
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 0 30px rgba(139,92,246,.35)',
            }}
          >
            Sauvegardé automatiquement
          </span>
        </div>
        {saveMsg && (
          <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, whiteSpace: 'nowrap', paddingRight: 6, animation: 'nc-fade 2.7s ease forwards' }}>
            {saveMsg}
          </span>
        )}
      </div>
    </div>
  );
}
