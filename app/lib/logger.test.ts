import { describe, it, expect, beforeEach } from 'vitest';
import { logger } from './logger';
import type { LogEntry, LogTransport } from './logger.types';

// Le singleton persiste entre tests — on flush la queue avant chaque cas
beforeEach(() => {
  logger.memory.flush();
  logger.resetContext();
});

// ─── MemoryTransport ─────────────────────────────────────────────────────────

describe('MemoryTransport', () => {
  it('stocke les entrées warn/error/fatal/info', () => {
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    logger.info('i');
    expect(logger.memory.flush()).toHaveLength(4);
  });

  it('ignore les entrées debug', () => {
    logger.debug('d');
    expect(logger.memory.flush()).toHaveLength(0);
  });

  it('flush vide la queue', () => {
    logger.error('e');
    logger.memory.flush();
    expect(logger.memory.flush()).toHaveLength(0);
  });

  it('plafonne à 50 entrées (queue circulaire)', () => {
    for (let i = 0; i < 60; i++) logger.error(`e${i}`);
    const entries = logger.memory.flush();
    expect(entries).toHaveLength(50);
    // Les 10 premières ont été évincées — on a les 50 dernières
    expect(entries[0].message).toBe('e10');
    expect(entries[49].message).toBe('e59');
  });
});

// ─── Niveaux ─────────────────────────────────────────────────────────────────

describe('niveaux de log', () => {
  it('enregistre le bon level', () => {
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    logger.info('i');
    const [w, e, f, i] = logger.memory.flush();
    expect(w.level).toBe('warn');
    expect(e.level).toBe('error');
    expect(f.level).toBe('fatal');
    expect(i.level).toBe('info');
  });

  it('inclut un timestamp', () => {
    const before = Date.now();
    logger.error('e');
    const [entry] = logger.memory.flush();
    expect(entry.timestamp).toBeGreaterThanOrEqual(before);
  });

  it('stocke le message', () => {
    logger.error('message précis');
    const [entry] = logger.memory.flush();
    expect(entry.message).toBe('message précis');
  });

  it('stocke l\'objet Error', () => {
    const err = new Error('boom');
    logger.error('e', err);
    const [entry] = logger.memory.flush();
    expect(entry.error).toBe(err);
  });
});

// ─── Contexte ─────────────────────────────────────────────────────────────────

describe('setContext', () => {
  it('injecte le contexte global dans chaque entrée', () => {
    logger.setContext({ screen: 'home', platform: 'ios' });
    logger.error('e');
    const [entry] = logger.memory.flush();
    expect(entry.context?.screen).toBe('home');
    expect(entry.context?.platform).toBe('ios');
  });

  it('merge sans écraser les champs non modifiés', () => {
    logger.setContext({ screen: 'home' });
    logger.setContext({ platform: 'android' });
    logger.error('e');
    const [entry] = logger.memory.flush();
    expect(entry.context?.screen).toBe('home');
    expect(entry.context?.platform).toBe('android');
  });

  it('le contexte local fusionne par-dessus le contexte global', () => {
    logger.setContext({ screen: 'home' });
    logger.error('e', undefined, { screen: 'settings', extra: { key: 'val' } });
    const [entry] = logger.memory.flush();
    expect(entry.context?.screen).toBe('settings');
    expect(entry.context?.extra).toEqual({ key: 'val' });
  });

  it('resetContext() efface le contexte global', () => {
    logger.setContext({ screen: 'home' });
    logger.resetContext();
    logger.error('e');
    const [entry] = logger.memory.flush();
    expect(entry.context?.screen).toBeUndefined();
  });
});

// ─── Transport custom ─────────────────────────────────────────────────────────

describe('addTransport', () => {
  it('envoie les entrées au transport ajouté', () => {
    const received: LogEntry[] = [];
    const spy: LogTransport = { send: (e) => received.push(e) };
    logger.addTransport(spy);

    logger.error('via spy');
    expect(received).toHaveLength(1);
    expect(received[0].message).toBe('via spy');

    // Nettoyage : on ne peut pas retirer le transport du singleton,
    // mais flush garantit que les prochains tests partent propres
    logger.memory.flush();
  });
});
