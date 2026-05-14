import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pushProfile, pullProfile } from './profileSync';
import type { PersonalProfile } from '../../types';

// ─── Mock PocketBase ───────────────────────────────────────────────────────────

const mockCreate           = vi.hoisted(() => vi.fn());
const mockUpdate           = vi.hoisted(() => vi.fn());
const mockGetFirstListItem = vi.hoisted(() => vi.fn());

vi.mock('../pb', () => ({
  pb: {
    collection: vi.fn(() => ({
      create:           mockCreate,
      update:           mockUpdate,
      getFirstListItem: mockGetFirstListItem,
    })),
  },
}));

// ─── Mock crypto (évite 100ms PBKDF2 par test) ────────────────────────────────
// encryptJSON : "ENC:" + JSON.stringify(data)
// decryptJSON : inverse déterministe

vi.mock('../crypto', () => ({
  deriveProfileKey: vi.fn().mockResolvedValue('mock-key'),
  encryptJSON: vi.fn().mockImplementation((data: object) =>
    Promise.resolve('ENC:' + JSON.stringify(data)),
  ),
  decryptJSON: vi.fn().mockImplementation((encoded: string) =>
    Promise.resolve(JSON.parse(encoded.replace(/^ENC:/, ''))),
  ),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID  = 'user-abc123';
const DEVICE_ID = 'device-uuid-001';

const PROFILE: PersonalProfile = {
  tenderness: { kisses: 3, cuddles: 2 },
  intensity:  { bondage: 1, power: 0 },
  trust:      { openness: 2 },
  safeword:   'rouge',
};

// Représentation "chiffrée" telle que stockée dans PocketBase (via notre mock)
const ENCRYPTED_RECORD = {
  id:         'rec-xyz',
  tenderness: { _enc: 'ENC:' + JSON.stringify(PROFILE.tenderness) },
  intensity:  { _enc: 'ENC:' + JSON.stringify(PROFILE.intensity)  },
  trust:      { _enc: 'ENC:' + JSON.stringify(PROFILE.trust)      },
  safeword:   'ENC:' + JSON.stringify({ v: PROFILE.safeword }),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => vi.clearAllMocks());

describe('pushProfile — profil existant', () => {
  it('appelle update (et non create) quand le profil existe', async () => {
    mockGetFirstListItem.mockResolvedValue(ENCRYPTED_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    expect(mockUpdate).toHaveBeenCalledOnce();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('passe le bon recordId à update', async () => {
    mockGetFirstListItem.mockResolvedValue(ENCRYPTED_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    expect(mockUpdate).toHaveBeenCalledWith('rec-xyz', expect.any(Object));
  });

  it('le payload contient les champs chiffrés (sentinel _enc)', async () => {
    mockGetFirstListItem.mockResolvedValue(ENCRYPTED_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    const [, payload] = mockUpdate.mock.calls[0] as [string, Record<string, unknown>];
    expect((payload.tenderness as { _enc: string })._enc).toBeDefined();
    expect((payload.intensity  as { _enc: string })._enc).toBeDefined();
    expect((payload.trust      as { _enc: string })._enc).toBeDefined();
    expect(typeof payload.safeword).toBe('string');
  });

  it("le payload n'expose jamais les valeurs en clair", async () => {
    mockGetFirstListItem.mockResolvedValue(ENCRYPTED_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    const [, payload] = mockUpdate.mock.calls[0] as [string, Record<string, unknown>];
    // Aucune valeur numérique brute dans tenderness/intensity/trust
    expect(payload.tenderness).not.toEqual(PROFILE.tenderness);
    expect(payload.safeword).not.toBe(PROFILE.safeword);
  });
});

describe('pushProfile — profil inexistant', () => {
  it('appelle create quand getFirstListItem lève une erreur', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));
    mockCreate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('le payload de create inclut user + champs chiffrés', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));
    mockCreate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID, DEVICE_ID);

    const [payload] = mockCreate.mock.calls[0] as [Record<string, unknown>];
    expect(payload.user).toBe(USER_ID);
    expect((payload.tenderness as { _enc: string })._enc).toBeDefined();
  });
});

describe('pullProfile — succès', () => {
  it('déchiffre et retourne un PersonalProfile correctement formé', async () => {
    mockGetFirstListItem.mockResolvedValue(ENCRYPTED_RECORD);

    const result = await pullProfile(USER_ID, DEVICE_ID);

    expect(result).toEqual(PROFILE);
  });

  it('retourne un safeword vide si absent', async () => {
    mockGetFirstListItem.mockResolvedValue({
      ...ENCRYPTED_RECORD,
      safeword: 'ENC:' + JSON.stringify({ v: '' }),
    });

    const result = await pullProfile(USER_ID, DEVICE_ID);

    expect(result?.safeword).toBe('');
  });
});

describe('pullProfile — erreur / offline', () => {
  it('retourne null si le profil est introuvable', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));
    expect(await pullProfile(USER_ID, DEVICE_ID)).toBeNull();
  });

  it('retourne null si le réseau est indisponible', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Network Error'));
    expect(await pullProfile(USER_ID, DEVICE_ID)).toBeNull();
  });
});
