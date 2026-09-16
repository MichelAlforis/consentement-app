'use client';

import './notre-carte.css';
import IdentityGate from './IdentityGate';
import MapView from './MapView';
import NodeSheetPage from './NodeSheetPage';
import EdgeSheetPage from './EdgeSheetPage';
import PersonPage from './PersonPage';
import HelpPage from './HelpPage';
import SyncStatus from './SyncStatus';
import { useNotreCarte } from './useNotreCarte';

export default function NotreCarteApp() {
  const nc = useNotreCarte();
  const { state, loaded } = nc;

  return (
    <div className="nc-root nc-page">
      {!state.me && <IdentityGate onPick={nc.pickIdentity} />}

      {state.me && !loaded && (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>
          Chargement de la carte…
        </div>
      )}

      {state.me && loaded && <CurrentView nc={nc} />}

      {state.me && loaded && <SyncStatus syncStatus={state.syncStatus} fx={state.fx} saveMsg={state.saveMsg} />}
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
    return state.edges.some((e) => e.id === view.id) ? <EdgeSheetPage nc={nc} edgeId={view.id} /> : <MapView nc={nc} />;
  }

  if (view.kind === 'person') {
    return <PersonPage nc={nc} who={view.who} />;
  }

  if (view.kind === 'help') {
    return <HelpPage nc={nc} />;
  }

  return <MapView nc={nc} />;
}
