/**
 * Tests d'intégration backend — chiffrement bout en bout
 *
 * Ces tests utilisent le VRAI crypto.subtle (pas de mock) et un PocketBase
 * en mémoire pour vérifier que :
 *   1. Le chiffrement/déchiffrement de profil est sans perte
 *   2. Le flux duo complet fonctionne (Alice crée, Bob rejoint)
 *   3. Les blobs stockés sont opaques (aucune valeur en clair dans PocketBase)
 *   4. Un mauvais code/deviceId ne peut pas déchiffrer les données
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createDuoSession,
  joinDuoSession,
  subscribeToSession,
} from './duoSync';
import { pushProfile, pullProfile } from './profileSync';
import { deriveProfileKey, deriveDuoKey, encryptJSON, decryptJSON } from '../crypto';
import type { PersonalProfile, PartnerProfile } from '../../types';

// ─── PocketBase en mémoire (stateful) ─────────────────────────────────────────

const mockCreate      = vi.hoisted(() => vi.fn());
const mockUpdate      = vi.hoisted(() => vi.fn());
const mockGetFirst    = vi.hoisted(() => vi.fn());
const mockSubscribe   = vi.hoisted(() => vi.fn());
const mockUnsubscribe = vi.hoisted(() => vi.fn());

vi.mock('../pb', () => ({
  pb: {
    collection: vi.fn(() => ({
      create:           mockCreate,
      update:           mockUpdate,
      getFirstListItem: mockGetFirst,
      subscribe:        mockSubscribe,
      unsubscribe:      mockUnsubscribe,
    })),
  },
}));

// Base de données en mémoire — réinitialisée à chaque test
let memDb: Record<string, Record<string, unknown>> = {};

beforeEach(() => {
  memDb = {};
  vi.clearAllMocks();

  mockCreate.mockImplementation(async (data: Record<string, unknown>) => {
    const record = { id: `rec-${Math.random().toString(36).slice(2, 8)}`, ...data };
    memDb[record.id] = record;
    return record;
  });

  mockGetFirst.mockImplementation(async () => {
    const records = Object.values(memDb);
    if (records.length === 0) throw new Error('Not found');
    return records[0];
  });

  mockUpdate.mockImplementation(async (id: string, data: Record<string, unknown>) => {
    memDb[id] = { ...memDb[id], ...data };
    return memDb[id];
  });

  mockSubscribe.mockImplementation(() => {});
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ALICE_DEVICE  = 'alice-device-uuid-00000001';
const BOB_DEVICE    = 'bob-device-uuid-00000002';

const ALICE_PROFILE: PersonalProfile = {
  tenderness: { kisses: 4, cuddles: 3 },
  intensity:  { bondage: 1, power: 0 },
  trust:      { openness: 3 },
  safeword:   'ananas',
};

const BOB_PROFILE: PersonalProfile = {
  tenderness: { kisses: 2, cuddles: 4 },
  intensity:  { bondage: 3, power: 2 },
  trust:      { openness: 1 },
  safeword:   'rouge',
};

const ALICE_PREFS: Record<string, string> = { q1: 'soft', q2: 'yes' };
const BOB_PREFS:   Record<string, string> = { q1: 'hard', q2: 'no'  };

// ─── 1. Chiffrement primitif ──────────────────────────────────────────────────

describe('Crypto primitif — round-trip AES-GCM', () => {
  it('chiffre et déchiffre un objet sans perte', async () => {
    const key = await deriveProfileKey(ALICE_DEVICE);
    const enc = await encryptJSON(ALICE_PROFILE.tenderness, key);
    const dec = await decryptJSON<Record<string, number>>(enc, key);
    expect(dec).toEqual(ALICE_PROFILE.tenderness);
  });

  it('deux chiffrements du même objet produisent des blobs différents (IV aléatoire)', async () => {
    const key = await deriveProfileKey(ALICE_DEVICE);
    const enc1 = await encryptJSON(ALICE_PROFILE.tenderness, key);
    const enc2 = await encryptJSON(ALICE_PROFILE.tenderness, key);
    expect(enc1).not.toBe(enc2);
  });

  it('même clé dérivée deux fois à partir du même deviceId (cache)', async () => {
    const k1 = await deriveProfileKey(ALICE_DEVICE);
    const k2 = await deriveProfileKey(ALICE_DEVICE);
    // Même objet CryptoKey grâce au cache
    expect(k1).toBe(k2);
  });

  it('deux deviceIds différents → deux clés différentes → déchiffrement impossible', async () => {
    const keyA = await deriveProfileKey(ALICE_DEVICE);
    const keyB = await deriveProfileKey(BOB_DEVICE);
    const enc  = await encryptJSON(ALICE_PROFILE.tenderness, keyA);
    await expect(decryptJSON(enc, keyB)).rejects.toThrow();
  });

  it('clés duo identiques à partir du même code (partagées par les deux partenaires)', async () => {
    const k1 = await deriveDuoKey('ABC123');
    const k2 = await deriveDuoKey('ABC123');
    expect(k1).toBe(k2); // même objet → cache OK
  });

  it('codes différents → clés différentes → déchiffrement impossible', async () => {
    const keyGood  = await deriveDuoKey('ABC123');
    const keyWrong = await deriveDuoKey('XYZ999');
    const enc = await encryptJSON(ALICE_PROFILE.tenderness, keyGood);
    await expect(decryptJSON(enc, keyWrong)).rejects.toThrow();
  });
});

// ─── 2. profileSync round-trip ────────────────────────────────────────────────

describe('profileSync — push / pull chiffré', () => {
  it('pushProfile stocke des données opaques (pas de valeurs en clair)', async () => {
    mockGetFirst.mockRejectedValueOnce(new Error('Not found')); // pas d'enregistrement existant
    mockCreate.mockImplementation(async (data: Record<string, unknown>) => {
      const record = { id: 'rec-profile', ...data };
      memDb['rec-profile'] = record;
      return record;
    });

    await pushProfile(ALICE_PROFILE, 'alice-pb-id', ALICE_DEVICE);

    const stored = JSON.stringify(memDb['rec-profile']);
    // Aucune valeur brute ne doit apparaître
    expect(stored).not.toContain('"kisses":4');
    expect(stored).not.toContain('"ananas"');
    // Marqueur de chiffrement présent
    expect(stored).toContain('_enc');
  });

  it('pullProfile après pushProfile retourne le profil identique', async () => {
    // push (création)
    mockGetFirst
      .mockRejectedValueOnce(new Error('Not found')) // premier appel dans pushProfile → create
      .mockImplementation(async () => Object.values(memDb)[0]); // appel dans pullProfile

    mockCreate.mockImplementation(async (data: Record<string, unknown>) => {
      const record = { id: 'rec-profile', ...data };
      memDb['rec-profile'] = record;
      return record;
    });

    await pushProfile(ALICE_PROFILE, 'alice-pb-id', ALICE_DEVICE);
    const pulled = await pullProfile('alice-pb-id', ALICE_DEVICE);

    expect(pulled).toEqual(ALICE_PROFILE);
  });

  it('Bob ne peut pas lire le profil chiffré avec le deviceId d\'Alice', async () => {
    mockGetFirst
      .mockRejectedValueOnce(new Error('Not found'))
      .mockImplementation(async () => Object.values(memDb)[0]);

    mockCreate.mockImplementation(async (data: Record<string, unknown>) => {
      const record = { id: 'rec-profile', ...data };
      memDb['rec-profile'] = record;
      return record;
    });

    await pushProfile(ALICE_PROFILE, 'alice-pb-id', ALICE_DEVICE);
    // Bob tente de lire avec son deviceId → déchiffrement échoue → pullProfile retourne null
    const result = await pullProfile('alice-pb-id', BOB_DEVICE);
    expect(result).toBeNull();
  });
});

// ─── 3. Flux duo complet ──────────────────────────────────────────────────────

describe('Flux duo complet — Alice crée, Bob rejoint', () => {
  it('Bob récupère le profil exact d\'Alice après déchiffrement', async () => {
    const { code } = await createDuoSession(ALICE_PROFILE, 'alice-pb-id', ALICE_PREFS);
    const { initiatorProfile } = await joinDuoSession(code, BOB_PROFILE, 'bob-pb-id', BOB_PREFS);

    expect(initiatorProfile.tenderness).toEqual(ALICE_PROFILE.tenderness);
    expect(initiatorProfile.intensity).toEqual(ALICE_PROFILE.intensity);
    expect(initiatorProfile.trust).toEqual(ALICE_PROFILE.trust);
  });

  it('les préférences d\'Alice sont incluses dans le snapshot', async () => {
    const { code } = await createDuoSession(ALICE_PROFILE, 'alice-pb-id', ALICE_PREFS);
    const { initiatorProfile } = await joinDuoSession(code, BOB_PROFILE, 'bob-pb-id');

    expect((initiatorProfile as PartnerProfile & { preferences: Record<string, string> }).preferences)
      .toEqual(ALICE_PREFS);
  });

  it('les blobs stockés dans PocketBase sont opaques', async () => {
    const { code } = await createDuoSession(ALICE_PROFILE, 'alice-pb-id', ALICE_PREFS);
    await joinDuoSession(code, BOB_PROFILE, 'bob-pb-id', BOB_PREFS);

    const stored = JSON.stringify(Object.values(memDb)[0]);
    // Aucune valeur de confort brute
    expect(stored).not.toContain('"kisses":4');
    expect(stored).not.toContain('"ananas"');
    expect(stored).not.toContain('"soft"');
    // Structure chiffrée présente
    expect(stored).toContain('"_enc"');
  });

  it('un mauvais code ne peut pas déchiffrer le profil d\'Alice', async () => {
    // Crée la session (stocke le blob chiffré avec le vrai code)
    await createDuoSession(ALICE_PROFILE, 'alice-pb-id');

    // Bob essaie avec un mauvais code — le mock retourne quand même le record,
    // mais le déchiffrement avec la mauvaise clé doit échouer
    await expect(
      joinDuoSession('XXXXXX', BOB_PROFILE, 'bob-pb-id'),
    ).rejects.toThrow();
  });
});

// ─── 4. subscribeToSession — déchiffrement temps réel ─────────────────────────

describe('subscribeToSession — déchiffrement à la réception', () => {
  it('le callback reçoit le profil de Bob déchiffré', async () => {
    const code = 'LIVE01';
    const key  = await deriveDuoKey(code);

    // Simuler le blob chiffré de Bob tel que PocketBase l'enverrait via SSE
    const bobBlob = { _enc: await encryptJSON(
      { tenderness: BOB_PROFILE.tenderness, intensity: BOB_PROFILE.intensity, trust: BOB_PROFILE.trust },
      key,
    )};

    let capturedCb: ((e: { action: string; record: unknown }) => Promise<void>) | null = null;
    mockSubscribe.mockImplementation((_id: string, cb: typeof capturedCb) => { capturedCb = cb; });

    const onChange = vi.fn();
    subscribeToSession('session-live', code, onChange);

    await capturedCb!({ action: 'update', record: { partner_profile: bobBlob } });

    expect(onChange).toHaveBeenCalledOnce();
    const received = onChange.mock.calls[0][0] as { partner_profile: PartnerProfile };
    expect(received.partner_profile?.tenderness).toEqual(BOB_PROFILE.tenderness);
    expect(received.partner_profile?.intensity).toEqual(BOB_PROFILE.intensity);
  });

  it('un event "create" ne déclenche pas le callback', async () => {
    let capturedCb: ((e: { action: string; record: unknown }) => Promise<void>) | null = null;
    mockSubscribe.mockImplementation((_id: string, cb: typeof capturedCb) => { capturedCb = cb; });

    const onChange = vi.fn();
    subscribeToSession('session-live', 'ABCDEF', onChange);

    await capturedCb!({ action: 'create', record: {} });
    expect(onChange).not.toHaveBeenCalled();
  });
});
