import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createDuoSession,
  joinDuoSession,
  subscribeToSession,
  updateSessionStep,
} from './duoSync';
import type { PersonalProfile } from '../../types';

// ─── Mock PocketBase ───────────────────────────────────────────────────────────

const mockCreate      = vi.hoisted(() => vi.fn());
const mockUpdate      = vi.hoisted(() => vi.fn());
const mockGetFirst    = vi.hoisted(() => vi.fn());
const mockSubscribe   = vi.hoisted(() => vi.fn());
const mockUnsubscribe = vi.hoisted(() => vi.fn());

vi.mock('../pb', () => ({
  pb: {
    collection: vi.fn(() => ({
      create:             mockCreate,
      update:             mockUpdate,
      getFirstListItem:   mockGetFirst,
      subscribe:          mockSubscribe,
      unsubscribe:        mockUnsubscribe,
    })),
  },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = 'user-abc123';

const PROFILE: PersonalProfile = {
  tenderness: { kisses: 3 },
  intensity:  { bondage: 1 },
  trust:      { openness: 2 },
  safeword:   'ananas',
};

const PARTNER_SNAPSHOT = {
  tenderness: { kisses: 2 },
  intensity:  { bondage: 3 },
  trust:      { openness: 1 },
};

// ─── createDuoSession ─────────────────────────────────────────────────────────

describe('createDuoSession', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne un code 6 caractères et un sessionId', async () => {
    mockCreate.mockResolvedValue({ id: 'session-001' });

    const { code, sessionId } = await createDuoSession(PROFILE, USER_ID);

    expect(code).toHaveLength(6);
    expect(sessionId).toBe('session-001');
  });

  it('le code est en majuscules', async () => {
    mockCreate.mockResolvedValue({ id: 'session-001' });

    const { code } = await createDuoSession(PROFILE, USER_ID);

    expect(code).toBe(code.toUpperCase());
  });

  it('envoie le bon payload à create', async () => {
    mockCreate.mockResolvedValue({ id: 'session-001' });

    await createDuoSession(PROFILE, USER_ID);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        initiator: USER_ID,
        initiator_profile: {
          tenderness: PROFILE.tenderness,
          intensity:  PROFILE.intensity,
          trust:      PROFILE.trust,
        },
        step: 'waiting_partner',
      }),
    );
  });

  it("expires_at est à ~24h dans le futur (±60s)", async () => {
    mockCreate.mockResolvedValue({ id: 'session-001' });
    const before = Date.now();

    await createDuoSession(PROFILE, USER_ID);

    const payload = mockCreate.mock.calls[0][0] as { expires_at: string };
    const expiresAt = new Date(payload.expires_at).getTime();
    const expectedMs = before + 24 * 60 * 60 * 1000;

    expect(expiresAt).toBeGreaterThanOrEqual(expectedMs - 60_000);
    expect(expiresAt).toBeLessThanOrEqual(expectedMs + 60_000);
  });
});

// ─── joinDuoSession ───────────────────────────────────────────────────────────

describe('joinDuoSession', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne sessionId et initiatorProfile depuis le record', async () => {
    mockGetFirst.mockResolvedValue({
      id: 'session-002',
      initiator_profile: PARTNER_SNAPSHOT,
    });
    mockUpdate.mockResolvedValue({});

    const result = await joinDuoSession('abc123', PROFILE, USER_ID);

    expect(result.sessionId).toBe('session-002');
    expect(result.initiatorProfile).toEqual(PARTNER_SNAPSHOT);
  });

  it('convertit le code en majuscules avant la recherche', async () => {
    mockGetFirst.mockResolvedValue({ id: 's', initiator_profile: PARTNER_SNAPSHOT });
    mockUpdate.mockResolvedValue({});

    await joinDuoSession('abc123', PROFILE, USER_ID);

    expect(mockGetFirst).toHaveBeenCalledWith('code="ABC123"');
  });

  it('met à jour le record avec le profil partenaire et le step', async () => {
    mockGetFirst.mockResolvedValue({ id: 'session-002', initiator_profile: PARTNER_SNAPSHOT });
    mockUpdate.mockResolvedValue({});

    await joinDuoSession('XYZ999', PROFILE, USER_ID);

    expect(mockUpdate).toHaveBeenCalledWith(
      'session-002',
      expect.objectContaining({
        partner: USER_ID,
        partner_profile: {
          tenderness: PROFILE.tenderness,
          intensity:  PROFILE.intensity,
          trust:      PROFILE.trust,
        },
        step: 'connected',
      }),
    );
  });
});

// ─── subscribeToSession ───────────────────────────────────────────────────────

describe('subscribeToSession', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle onChange uniquement pour les events "update"', () => {
    let capturedCb: ((e: { action: string; record: unknown }) => void) | null = null;
    mockSubscribe.mockImplementation((_id: string, cb: typeof capturedCb) => {
      capturedCb = cb;
    });

    const onChange = vi.fn();
    subscribeToSession('session-003', onChange);

    capturedCb!({ action: 'update', record: PARTNER_SNAPSHOT });
    capturedCb!({ action: 'create', record: PARTNER_SNAPSHOT });
    capturedCb!({ action: 'delete', record: PARTNER_SNAPSHOT });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(PARTNER_SNAPSHOT);
  });

  it('retourne une fonction de désabonnement qui appelle unsubscribe', () => {
    mockSubscribe.mockImplementation(() => {});

    const unsubscribe = subscribeToSession('session-003', vi.fn());
    unsubscribe();

    expect(mockUnsubscribe).toHaveBeenCalledWith('session-003');
  });
});

// ─── updateSessionStep ────────────────────────────────────────────────────────

describe('updateSessionStep', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appelle update avec le bon sessionId et step', async () => {
    mockUpdate.mockResolvedValue({});

    await updateSessionStep('session-004', 'pact');

    expect(mockUpdate).toHaveBeenCalledWith('session-004', { step: 'pact' });
  });

  it.each(['waiting_partner', 'connected', 'pact', 'filling', 'ready', 'complete'])(
    'accepte le step "%s"',
    async (step) => {
      mockUpdate.mockResolvedValue({});
      await expect(updateSessionStep('s', step)).resolves.toBeUndefined();
    },
  );
});
