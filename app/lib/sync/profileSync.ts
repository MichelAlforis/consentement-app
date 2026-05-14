import { pb } from '../pb';
import type { PersonalProfile } from '../../types';

export async function pushProfile(
  profile: PersonalProfile,
  pbUserId: string,
): Promise<void> {
  const payload = {
    user: pbUserId,
    tenderness: profile.tenderness,
    intensity: profile.intensity,
    trust: profile.trust,
    safeword: profile.safeword,
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

export async function pullProfile(pbUserId: string): Promise<PersonalProfile | null> {
  try {
    const record = await pb
      .collection('profiles')
      .getFirstListItem(`user="${pbUserId}"`);
    return {
      tenderness: record['tenderness'] as Record<string, number>,
      intensity: record['intensity'] as Record<string, number>,
      trust: record['trust'] as Record<string, number>,
      safeword: (record['safeword'] as string) ?? '',
    };
  } catch {
    return null;
  }
}
