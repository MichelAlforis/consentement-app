# Plan d'implémentation — Logger d'erreurs

## Contexte

La codebase ne dispose d'aucune infrastructure centralisée de logging. Les erreurs sont
soit silencieusement ignorées (comportement intentionnel pour les plugins Capacitor optionnels),
soit perdues après le démontage du composant. Aucun moyen de diagnostiquer des régressions
en production ou de corréler des erreurs discrètes entre elles.

---

## Audit de l'existant

### Points sains

| Élément | Emplacement | Statut |
|---|---|---|
| `ErrorBoundary` React | `app/components/ui/ErrorBoundary.tsx` | ✅ Couvre les erreurs de rendu |
| Silent swallow plugins | `useHaptics`, `QRFallback`, `usePersist` | ✅ Intentionnel, documenté |
| `console.error` dev-only | `ErrorBoundary.tsx:25` | ✅ Pas de fuite en prod |
| Zustand hydration guards | Stores | ✅ Dégradation propre |

### Risques identifiés

| Pattern | Emplacement | Priorité |
|---|---|---|
| Promise sans `.catch()` | `page.tsx:90` — back button Capacitor | 🔴 Haute |
| Promise sans `.catch()` | `DiceRenderer.tsx:104` — animation chain | 🟡 Moyenne |
| Zéro logger centralisé | — | 🔴 Haute |
| Zéro handler global | Rejections async, erreurs hors React | 🔴 Haute |
| Pas de stratégie API | Supabase pas encore intégré | 🟡 Moyenne |
| localStorage silencieux | `usePersist.ts`, `goose-game.ts` | 🟡 Moyenne |

---

## Architecture cible

```
app/lib/logger.ts          ← singleton principal (à créer)
app/lib/logger.types.ts    ← types + interfaces (à créer)
app/components/ui/ErrorBoundary.tsx  ← intégrer logger.error() (modifier)
app/page.tsx               ← global handlers + fix .catch() (modifier)
```

Pas de dépendance externe en V2. L'interface est conçue pour accueillir Sentry ou
Crashlytics en V3 sans toucher les call-sites.

---

## Interfaces TypeScript

```typescript
// app/lib/logger.types.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  screen?: string;          // écran actif au moment de l'erreur
  component?: string;       // label du composant (ErrorBoundary.label)
  platform?: 'web' | 'ios' | 'android';
  variant?: string;         // appVariant (normal/adult)
  userId?: string;          // quand auth Supabase disponible (V3)
  extra?: Record<string, unknown>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  context?: LogContext;
  timestamp: number;
}

export interface LogTransport {
  send(entry: LogEntry): void;
}
```

---

## Architecture du logger

```typescript
// app/lib/logger.ts  — structure cible

class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private isDev = process.env.NODE_ENV === 'development';

  // Singleton
  static getInstance(): Logger { ... }

  // Transports pluggables
  addTransport(t: LogTransport): void { ... }

  // API publique
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, error?: Error, context?: LogContext): void
  error(message: string, error?: Error, context?: LogContext): void
  fatal(message: string, error?: Error, context?: LogContext): void

  // Méthode interne
  private log(entry: LogEntry): void { ... }
}

export const logger = Logger.getInstance();
```

### Transport dev (console)

```typescript
class ConsoleTransport implements LogTransport {
  send(entry: LogEntry) {
    const prefix = `[${entry.level.toUpperCase()}]`;
    const ctx = entry.context ? JSON.stringify(entry.context, null, 2) : '';
    switch (entry.level) {
      case 'error':
      case 'fatal':
        console.error(prefix, entry.message, entry.error ?? '', ctx);
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.error ?? '', ctx);
        break;
      default:
        console.log(prefix, entry.message, ctx);
    }
  }
}
```

### Transport prod (queue en mémoire — prêt pour Sentry V3)

```typescript
class MemoryTransport implements LogTransport {
  private queue: LogEntry[] = [];
  private readonly MAX = 50;   // LRU circulaire

  send(entry: LogEntry) {
    if (entry.level === 'debug') return;   // pas de debug en prod
    if (this.queue.length >= this.MAX) this.queue.shift();
    this.queue.push(entry);
  }

  flush(): LogEntry[] {
    const snapshot = [...this.queue];
    this.queue = [];
    return snapshot;
  }
}
```

---

## Plan d'implémentation

### Phase 1 — Fondations (1 session)

**Objectif** : logger fonctionnel + handlers globaux

#### 1. Créer `app/lib/logger.types.ts`
Types uniquement, aucune logique.

#### 2. Créer `app/lib/logger.ts`
- Singleton `Logger`
- `ConsoleTransport` activé en dev
- `MemoryTransport` activé en prod
- Export `logger` (instance unique)

#### 3. `app/page.tsx` — handlers globaux + fix promise

Ajouter dans le `useEffect` principal :

```typescript
// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason, {
    screen: currentScreenRef.current,
  });
});

// Erreurs JS globales (hors React)
window.addEventListener('error', (event) => {
  logger.error('Global JS error', event.error, {
    screen: currentScreenRef.current,
  });
});
```

Fix back button (ligne ~90) :

```typescript
// AVANT
import('@capacitor/app').then(({ App }) => {
  App.addListener('backButton', ...).then(...);
});

// APRÈS
import('@capacitor/app')
  .then(({ App }) => App.addListener('backButton', (info) => {
    if (!noBack.includes(currentScreen)) goBackRef.current();
  }))
  .then((handle) => { cleanup = () => handle.remove(); })
  .catch((err) => logger.warn('Capacitor back button unavailable', err));
```

#### 4. `app/components/ui/ErrorBoundary.tsx` — intégrer logger

```typescript
// AVANT
if (process.env.NODE_ENV === 'development') {
  console.error(`[ErrorBoundary:${this.props.label}]`, error, errorInfo);
}

// APRÈS
import { logger } from '@/lib/logger';

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  logger.error(`React render error`, error, {
    component: this.props.label,
    extra: { componentStack: errorInfo.componentStack },
  });
}
```

---

### Phase 2 — Enrichissement contexte (1 session)

**Objectif** : ajouter le contexte automatique à chaque log

#### 1. `LogContext` auto-populé

Exposer un setter depuis `page.tsx` pour que le logger connaisse l'écran actif :

```typescript
// app/lib/logger.ts
setContext(partial: Partial<LogContext>): void {
  this.globalContext = { ...this.globalContext, ...partial };
}
```

```typescript
// app/page.tsx — dans le useEffect de navigation
useEffect(() => {
  logger.setContext({ screen: currentScreen });
}, [currentScreen]);
```

#### 2. Platform au bootstrap

```typescript
// app/page.tsx ou app/lib/logger.ts init
import { isCapacitor, getCapacitorPlatform } from '@/lib/platform';
logger.setContext({ platform: getCapacitorPlatform() });
```

#### 3. usePersist — log silencieux optionnel

```typescript
// AVANT
} catch {}

// APRÈS
} catch (err) {
  logger.warn('localStorage.setItem failed', err instanceof Error ? err : undefined, {
    extra: { key },
  });
}
```

---

### Phase 3 — Préparation Sentry / Crashlytics (quand V3 backend)

**Objectif** : brancher un transport externe sans modifier les call-sites

#### Transport Sentry (exemple)

```typescript
import * as Sentry from '@sentry/capacitor';

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

// Ajout au bootstrap (une ligne)
logger.addTransport(new SentryTransport());
```

---

## Usage dans le code applicatif

```typescript
import { logger } from '@/lib/logger';

// Erreur avec objet Error
try {
  await supabase.from('profiles').select();
} catch (err) {
  logger.error('Supabase fetch failed', err as Error, { screen: 'ProfileScreen' });
}

// Warning sans Error object
logger.warn('Clipboard API non disponible', undefined, { screen: 'DuoSpace' });

// Info trace de navigation
logger.info('Screen changed', { screen: nextScreen });

// Fatal — erreur irrécouvrable
logger.fatal('Store hydration failed', err);
```

---

## Ce que le logger ne doit PAS faire

- **Ne pas re-logger les silent swallows intentionnels** (haptics, clipboard, WebGL detection)
  → Ces blocs `catch {}` documentés restent tels quels, ils représentent une dégradation gracieuse.
- **Ne pas afficher de toast automatique** — le logger trace, la UI décide d'afficher ou non.
- **Ne pas bloquer le thread** — tous les transports sont fire-and-forget.
- **Ne pas logguer en boucle** — les handlers globaux `window.error` doivent ignorer leurs propres erreurs.

---

## Récapitulatif des fichiers

| Fichier | Action | Phase |
|---|---|---|
| `app/lib/logger.types.ts` | Créer | 1 |
| `app/lib/logger.ts` | Créer | 1 |
| `app/page.tsx` | Modifier — global handlers + fix `.catch()` | 1 |
| `app/components/ui/ErrorBoundary.tsx` | Modifier — remplacer `console.error` | 1 |
| `app/lib/logger.ts` | Modifier — `setContext()` | 2 |
| `app/page.tsx` | Modifier — sync screen → logger | 2 |
| `app/game-engine/shared/usePersist.ts` | Modifier — warn sur échec localStorage | 2 |
| `app/lib/logger.ts` | Modifier — transport Sentry | 3 |
