# Logger d'erreurs — implémentation complète

## Contexte

La codebase ne disposait d'aucune infrastructure centralisée de logging. Les erreurs étaient
soit silencieusement ignorées (comportement intentionnel pour les plugins Capacitor optionnels),
soit perdues après le démontage du composant.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `app/lib/logger.types.ts` | Types : `LogLevel`, `LogContext`, `LogEntry`, `LogTransport` |
| `app/lib/logger.ts` | Singleton `logger` — transports, contexte global, API publique |
| `app/lib/logger.test.ts` | 13 tests unitaires |
| `app/components/ui/ErrorBoundary.tsx` | `componentDidCatch` → `logger.error` |
| `app/page.tsx` | Handlers globaux + sync `screen`/`platform` + fix `.catch()` |
| `app/game-engine/shared/usePersist.ts` | `warn` sur échec localStorage |
| `app/data/goose-game.ts` | `warn` sur `loadSavedGame`/`saveGame` |
| `app/game-engine/dice/DiceRenderer.tsx` | `.catch()` sur animation Framer Motion |

---

## API publique

```typescript
import { logger } from '../../lib/logger'; // chemin relatif depuis le fichier

logger.debug('message', context?)
logger.info('message', context?)
logger.warn('message', error?, context?)
logger.error('message', error?, context?)
logger.fatal('message', error?, context?)

logger.setContext(partial)   // merge dans le contexte global
logger.resetContext()        // efface le contexte global (tests, logout)
logger.addTransport(t)       // brancher Sentry, Crashlytics, etc.
logger.memory.flush()        // retourne + vide la queue prod
```

**Règle d'import** : chemin relatif uniquement — pas d'alias `@/`.

---

## Contexte automatique

Chaque log reçoit automatiquement les champs suivants sans que l'appelant n'ait à les préciser :

| Champ | Valeur | Mis à jour |
|---|---|---|
| `screen` | écran actif | À chaque navigation (`page.tsx`) |
| `platform` | `'web'` / `'ios'` / `'android'` | Au bootstrap (`AppShell` mount) |

---

## Transports actifs

| Transport | Activé | Comportement |
|---|---|---|
| `ConsoleTransport` | Dev uniquement | `console.error/warn/log` préfixé du niveau |
| `MemoryTransport` | Dev + Prod | Queue circulaire 50 entrées, niveaux ≥ `info` |

---

## Couverture

| Couche | Mécanisme |
|---|---|
| Erreurs React (rendu) | `ErrorBoundary.componentDidCatch` → `logger.error` |
| Promises non catchées | Handler `window.unhandledrejection` global |
| Erreurs JS globales | Handler `window.error` global |
| Back button Capacitor | `.catch()` → `logger.warn` |
| Animation Framer Motion | `.catch()` silencieux (interruption normale au démontage) |
| localStorage — `usePersist` | `logger.warn` avec clé |
| localStorage — jeu de l'oie | `logger.warn` avec clé |

**Silent swallows conservés intentionnellement** (dégradation gracieuse connue, pas des erreurs) :
`useHaptics`, `QRFallback` clipboard, `Board.tsx` détection WebGL.

---

## Règles

- Ne jamais utiliser `console.error/warn` directement — toujours passer par `logger`.
- Ne pas afficher de toast automatique depuis le logger — la UI décide.
- Ne pas re-logger les silent swallows intentionnels des plugins Capacitor.

---

## Phase suivante — Transport Sentry (conditionnel V3 backend)

Aucun call-site à modifier. Une seule ligne au bootstrap :

```typescript
// app/lib/logger.ts — ajouter la classe
class SentryTransport implements LogTransport {
  send(entry: LogEntry) {
    if (entry.level === 'debug' || entry.level === 'info') return;
    Sentry.withScope((scope) => {
      scope.setExtras(entry.context?.extra ?? {});
      scope.setTag('screen', entry.context?.screen ?? 'unknown');
      scope.setTag('platform', entry.context?.platform ?? 'web');
      if (entry.error) {
        Sentry.captureException(entry.error);
      } else {
        Sentry.captureMessage(entry.message, entry.level === 'fatal' ? 'fatal' : 'error');
      }
    });
  }
}

// app/page.tsx ou layout.tsx — au bootstrap
logger.addTransport(new SentryTransport());
```
