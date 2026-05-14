import { pb } from '../pb';
import type { PersonalProfile, PartnerProfile } from '../../types';

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export interface DuoSessionRecord {
  id: string;
  code: string;
  initiator: string;
  partner: string | null;
  initiator_profile: PartnerProfile;
  partner_profile: PartnerProfile | null;
  step: string;
  expires_at: string;
}

export async function createDuoSession(
  profile: PersonalProfile,
  pbUserId: string,
): Promise<{ code: string; sessionId: string }> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const snapshot: PartnerProfile = {
    tenderness: profile.tenderness,
    intensity: profile.intensity,
    trust: profile.trust,
  };

  const record = await pb.collection('duo_sessions').create({
    code,
    initiator: pbUserId,
    initiator_profile: snapshot,
    step: 'waiting_partner',
    expires_at: expiresAt,
  });

  return { code, sessionId: record.id };
}

export async function joinDuoSession(
  code: string,
  profile: PersonalProfile,
  pbUserId: string,
): Promise<{ sessionId: string; initiatorProfile: PartnerProfile }> {
  const record = await pb
    .collection('duo_sessions')
    .getFirstListItem<DuoSessionRecord>(`code="${code.toUpperCase()}"`);

  const snapshot: PartnerProfile = {
    tenderness: profile.tenderness,
    intensity: profile.intensity,
    trust: profile.trust,
  };

  await pb.collection('duo_sessions').update(record.id, {
    partner: pbUserId,
    partner_profile: snapshot,
    step: 'connected',
  });

  return {
    sessionId: record.id,
    initiatorProfile: record.initiator_profile,
  };
}

export function subscribeToSession(
  sessionId: string,
  onChange: (record: DuoSessionRecord) => void,
): () => void {
  pb.collection('duo_sessions').subscribe<DuoSessionRecord>(sessionId, (e) => {
    if (e.action === 'update') onChange(e.record);
  });
  return () => pb.collection('duo_sessions').unsubscribe(sessionId);
}

export async function updateSessionStep(sessionId: string, step: string): Promise<void> {
  await pb.collection('duo_sessions').update(sessionId, { step });
}
