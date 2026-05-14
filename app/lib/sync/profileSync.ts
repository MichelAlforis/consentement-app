import { pb } from '../pb';
import { deriveProfileKey, encryptJSON, decryptJSON } from '../crypto';
import type { PersonalProfile } from '../../types';

interface EncryptedProfileRecord {
  id: string;
  tenderness: { _enc: string };
  intensity:  { _enc: string };
  trust:      { _enc: string };
  safeword:   string; // base64 chiffré
}

export async function pushProfile(
  profile: PersonalProfile,
  pbUserId: string,
  deviceId: string,
): Promise<void> {
  const key = await deriveProfileKey(deviceId);

  const payload = {
    user:       pbUserId,
    tenderness: { _enc: await encryptJSON(profile.tenderness, key) },
    intensity:  { _enc: await encryptJSON(profile.intensity,  key) },
    trust:      { _enc: await encryptJSON(profile.trust,      key) },
    safeword:   await encryptJSON({ v: profile.safeword }, key),
  };

  const existing = await pb
    .collection('profiles')
    .getFirstListItem(`user="${pbUserId}"`)
    .catch(() => null);

  if (existing) {
    await pb.collection('profiles').update(existing.id, payload);
  } else {
    await pb.collection('profiles').create(payload);
  }
}

export async function pullProfile(
  pbUserId: string,
  deviceId: string,
): Promise<PersonalProfile | null> {
  try {
    const record = await pb
      .collection('profiles')
      .getFirstListItem<EncryptedProfileRecord>(`user="${pbUserId}"`);

    const key = await deriveProfileKey(deviceId);

    return {
      tenderness: await decryptJSON<Record<string, number>>(record.tenderness._enc, key),
      intensity:  await decryptJSON<Record<string, number>>(record.intensity._enc,  key),
      trust:      await decryptJSON<Record<string, number>>(record.trust._enc,      key),
      safeword:   (await decryptJSON<{ v: string }>(record.safeword, key)).v,
    };
  } catch {
    return null;
  }
}
