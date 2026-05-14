import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pushProfile, pullProfile } from './profileSync';
import type { PersonalProfile } from '../../types';

// ─── Mock PocketBase ───────────────────────────────────────────────────────────

const mockCreate = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockGetFirstListItem = vi.hoisted(() => vi.fn());

vi.mock('../pb', () => ({
  pb: {
    collection: vi.fn(() => ({
      create: mockCreate,
      update: mockUpdate,
      getFirstListItem: mockGetFirstListItem,
    })),
  },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = 'user-abc123';

const PROFILE: PersonalProfile = {
  tenderness: { kisses: 3, cuddles: 2 },
  intensity: { bondage: 1, power: 0 },
  trust: { openness: 2 },
  safeword: 'rouge',
};

const EXISTING_RECORD = { id: 'rec-xyz', user: USER_ID, ...PROFILE };

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('pushProfile — profil existant', () => {
  it('appelle update (et non create) quand le profil existe', async () => {
    mockGetFirstListItem.mockResolvedValue(EXISTING_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID);

    expect(mockUpdate).toHaveBeenCalledOnce();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('passe le bon recordId à update', async () => {
    mockGetFirstListItem.mockResolvedValue(EXISTING_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID);

    expect(mockUpdate).toHaveBeenCalledWith('rec-xyz', expect.any(Object));
  });

  it('inclut tous les champs dans le payload', async () => {
    mockGetFirstListItem.mockResolvedValue(EXISTING_RECORD);
    mockUpdate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        user: USER_ID,
        tenderness: PROFILE.tenderness,
        intensity: PROFILE.intensity,
        trust: PROFILE.trust,
        safeword: PROFILE.safeword,
      }),
    );
  });
});

describe('pushProfile — profil inexistant', () => {
  it('appelle create quand getFirstListItem lève une erreur', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));
    mockCreate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID);

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('passe le bon payload à create', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));
    mockCreate.mockResolvedValue({});

    await pushProfile(PROFILE, USER_ID);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        user: USER_ID,
        tenderness: PROFILE.tenderness,
        intensity: PROFILE.intensity,
        trust: PROFILE.trust,
        safeword: PROFILE.safeword,
      }),
    );
  });
});

describe('pullProfile — succès', () => {
  it('retourne un PersonalProfile correctement formé', async () => {
    mockGetFirstListItem.mockResolvedValue({
      id: 'rec-xyz',
      tenderness: PROFILE.tenderness,
      intensity: PROFILE.intensity,
      trust: PROFILE.trust,
      safeword: PROFILE.safeword,
    });

    const result = await pullProfile(USER_ID);

    expect(result).toEqual(PROFILE);
  });

  it('retourne un safeword vide si absent du record', async () => {
    mockGetFirstListItem.mockResolvedValue({
      id: 'rec-xyz',
      tenderness: {},
      intensity: {},
      trust: {},
      safeword: undefined,
    });

    const result = await pullProfile(USER_ID);

    expect(result?.safeword).toBe('');
  });
});

describe('pullProfile — erreur / offline', () => {
  it('retourne null si le profil est introuvable', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Not found'));

    const result = await pullProfile(USER_ID);

    expect(result).toBeNull();
  });

  it('retourne null si le réseau est indisponible', async () => {
    mockGetFirstListItem.mockRejectedValue(new Error('Network Error'));

    const result = await pullProfile(USER_ID);

    expect(result).toBeNull();
  });
});
