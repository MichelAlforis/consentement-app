export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  screen?: string;
  component?: string;
  platform?: 'web' | 'ios' | 'android';
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
