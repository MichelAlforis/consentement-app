import type { LogContext, LogEntry, LogLevel, LogTransport } from './logger.types';

// ─── Transports ──────────────────────────────────────────────────────────────

class ConsoleTransport implements LogTransport {
  send(entry: LogEntry) {
    const prefix = `[${entry.level.toUpperCase()}]`;
    const ctx = entry.context ? entry.context : undefined;
    if (entry.level === 'error' || entry.level === 'fatal') {
      console.error(prefix, entry.message, entry.error ?? '', ctx ?? '');
    } else if (entry.level === 'warn') {
      console.warn(prefix, entry.message, entry.error ?? '', ctx ?? '');
    } else {
      console.log(prefix, entry.message, ctx ?? '');
    }
  }
}

// Queue circulaire pour prod — prête à être flushée vers Sentry en V3
class MemoryTransport implements LogTransport {
  private queue: LogEntry[] = [];
  private readonly MAX = 50;

  send(entry: LogEntry) {
    if (entry.level === 'debug') return;
    if (this.queue.length >= this.MAX) this.queue.shift();
    this.queue.push(entry);
  }

  flush(): LogEntry[] {
    const snapshot = [...this.queue];
    this.queue = [];
    return snapshot;
  }
}

// ─── Logger ──────────────────────────────────────────────────────────────────

class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private globalContext: LogContext = {};
  private readonly isDev = process.env.NODE_ENV === 'development';
  readonly memory = new MemoryTransport();

  private constructor() {
    if (this.isDev) this.transports.push(new ConsoleTransport());
    this.transports.push(this.memory);
  }

  static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  addTransport(t: LogTransport) {
    this.transports.push(t);
  }

  setContext(partial: Partial<LogContext>) {
    this.globalContext = { ...this.globalContext, ...partial };
  }

  resetContext() {
    this.globalContext = {};
  }

  private log(level: LogLevel, message: string, error?: Error, context?: LogContext) {
    const entry: LogEntry = {
      level,
      message,
      error,
      context: { ...this.globalContext, ...context },
      timestamp: Date.now(),
    };
    for (const t of this.transports) t.send(entry);
  }

  debug(message: string, context?: LogContext) { this.log('debug', message, undefined, context); }
  info(message: string, context?: LogContext) { this.log('info', message, undefined, context); }
  warn(message: string, error?: Error, context?: LogContext) { this.log('warn', message, error, context); }
  error(message: string, error?: Error, context?: LogContext) { this.log('error', message, error, context); }
  fatal(message: string, error?: Error, context?: LogContext) { this.log('fatal', message, error, context); }
}

export const logger = Logger.getInstance();
