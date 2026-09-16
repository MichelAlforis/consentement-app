'use client';

import './notre-carte.css';
import IdentityGate from './IdentityGate';
import MapView from './MapView';
import NodeSheetPage from './NodeSheetPage';
import EdgeSheetPage from './EdgeSheetPage';
import SaveBar from './SaveBar';
import { useNotreCarte } from './useNotreCarte';

export default function NotreCarteApp() {
  const nc = useNotreCarte();
  const { state, authChecked, loaded } = nc;

  if (!authChecked) {
    return <div className="nc-root" style={{ minHeight: '100vh' }} />;
  }

  return (
    <div className="nc-root nc-page">
      {!state.me && <IdentityGate onPick={nc.pickIdentity} />}

      {state.me && !loaded && (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>
          Chargement de la carte…
        </div>
      )}

      {state.me && loaded && <CurrentView nc={nc} />}

      {state.me && loaded && <SaveBar fx={state.fx} saveMsg={state.saveMsg} />}
    </div>
  );
}

function CurrentView({ nc }: { nc: ReturnType<typeof useNotreCarte> }) {
  const { state } = nc;
  const view = state.view;

  if (view.kind === 'node') {
    const node = state.nodes.find((n) => n.id === view.id);
    return node ? <NodeSheetPage nc={nc} node={node} /> : <MapView nc={nc} />;
  }

  if (view.kind === 'edge') {
    return state.edges[view.i] ? <EdgeSheetPage nc={nc} index={view.i} /> : <MapView nc={nc} />;
  }

  return <MapView nc={nc} />;
}
