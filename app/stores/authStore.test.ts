import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

// ─── Mock PocketBase ───────────────────────────────────────────────────────────

const mockAuthWithPassword = vi.hoisted(() => vi.fn());
const mockCreate           = vi.hoisted(() => vi.fn());

vi.mock('../lib/pb', () => ({
  pb: {
    collection: vi.fn(() => ({
      authWithPassword: mockAuthWithPassword,
      create:           mockCreate,
    })),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const store = () => useAuthStore.getState();

function resetStore() {
  useAuthStore.setState({
    pbUserId: null,
    pbToken:  null,
  });
  vi.clearAllMocks();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(resetStore);

describe('authenticateWithPocketBase — login réussi', () => {
  it('met à jour pbUserId et pbToken', async () => {
    mockAuthWithPassword.mockResolvedValue({
      record: { id: 'pb-user-001' },
      token:  'tok-abc',
    });

    await store().authenticateWithPocketBase();

    expect(store().pbUserId).toBe('pb-user-001');
    expect(store().pbToken).toBe('tok-abc');
  });

  it('ne tente pas de créer un compte si le login réussit', async () => {
    mockAuthWithPassword.mockResolvedValue({ record: { id: 'u' }, token: 't' });

    await store().authenticateWithPocketBase();

    expect(mockCreate).not.toHaveBeenCalled();
  });
});

describe('authenticateWithPocketBase — premier lancement (compte inexistant)', () => {
  it('crée le compte puis authentifie', async () => {
    mockAuthWithPassword
      .mockRejectedValueOnce(new Error('Not found'))   // 1er essai login échoue
      .mockResolvedValueOnce({ record: { id: 'pb-user-002' }, token: 'tok-new' }); // après création

    mockCreate.mockResolvedValue({});

    await store().authenticateWithPocketBase();

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(store().pbUserId).toBe('pb-user-002');
    expect(store().pbToken).toBe('tok-new');
  });

  it('passe email/password basés sur le deviceId', async () => {
    const { deviceId } = store();
    mockAuthWithPassword.mockResolvedValue({ record: { id: 'u' }, token: 't' });

    await store().authenticateWithPocketBase();

    expect(mockAuthWithPassword).toHaveBeenCalledWith(
      `${deviceId}@device.local`,
      deviceId,
    );
  });

  it('create reçoit le bon email/password/passwordConfirm', async () => {
    const { deviceId } = store();
    mockAuthWithPassword
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ record: { id: 'u' }, token: 't' });
    mockCreate.mockResolvedValue({});

    await store().authenticateWithPocketBase();

    expect(mockCreate).toHaveBeenCalledWith({
      email:           `${deviceId}@device.local`,
      password:         deviceId,
      passwordConfirm:  deviceId,
    });
  });
});

describe('authenticateWithPocketBase — offline / erreur serveur', () => {
  it('ne lève pas d\'exception si le serveur est inaccessible', async () => {
    mockAuthWithPassword.mockRejectedValue(new Error('Network Error'));
    mockCreate.mockRejectedValue(new Error('Network Error'));

    await expect(store().authenticateWithPocketBase()).resolves.toBeUndefined();
  });

  it('laisse pbUserId et pbToken à null si tout échoue', async () => {
    mockAuthWithPassword.mockRejectedValue(new Error('fail'));
    mockCreate.mockRejectedValue(new Error('fail'));

    await store().authenticateWithPocketBase();

    expect(store().pbUserId).toBeNull();
    expect(store().pbToken).toBeNull();
  });
});

describe('deviceId', () => {
  it('est un UUID v4 valide', () => {
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(store().deviceId).toMatch(uuidV4);
  });

  it('est stable (ne change pas après réhydratation)', () => {
    const { deviceId } = store();
    // Simuler une réhydratation partielle sans toucher au deviceId
    useAuthStore.setState({ pbToken: 'x' });
    expect(store().deviceId).toBe(deviceId);
  });
});
