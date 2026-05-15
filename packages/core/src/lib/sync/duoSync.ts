import { pb } from '../pb';
import { deriveDuoKey, encryptJSON, decryptJSON } from '../crypto';
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

interface EncryptedDuoRecord extends Omit<DuoSessionRecord, 'initiator_profile' | 'partner_profile'> {
  initiator_profile: { _enc: string } | null;
  partner_profile:   { _enc: string } | null;
}

function snapshot(
  profile: PersonalProfile,
  preferences?: Record<string, string>,
): PartnerProfile {
  return {
    tenderness: profile.tenderness,
    intensity:  profile.intensity,
    trust:      profile.trust,
    ...(preferences && Object.keys(preferences).length > 0 && { preferences }),
  };
}

const BUMP_SLOT_MS = 30_000;

interface BumpSignalRecord {
  id: string;
  session_id: string;
  bump_code: string;
  created: string;
}

export function generateBumpCode(): string {
  return Math.floor(Date.now() / BUMP_SLOT_MS).toString(36).toUpperCase().padStart(6, '0').slice(-6);
}

function getBumpCodes(): string[] {
  const current = Math.floor(Date.now() / BUMP_SLOT_MS);
  return [current, current - 1, current + 1].map((slot) =>
    slot.toString(36).toUpperCase().padStart(6, '0').slice(-6),
  );
}

export async function uploadBumpSignal(sessionId: string, bumpCode: string): Promise<void> {
  await pb.collection('bump_signals').create({
    session_id: sessionId,
    bump_code:  bumpCode,
  });
}

export async function findBumpSession(excludeSessionId?: string): Promise<string | null> {
  const cutoff = new Date(Date.now() - 60_000).toISOString();

  for (const bumpCode of getBumpCodes()) {
    const signals = await pb.collection('bump_signals').getList<BumpSignalRecord>(1, 10, {
      filter: `bump_code="${bumpCode}" && created >= "${cutoff}"`,
      sort:   '-created',
    });

    for (const signal of signals.items) {
      if (signal.session_id === excludeSessionId) continue;

      const session = await pb.collection('duo_sessions').getOne<EncryptedDuoRecord>(signal.session_id);
      if (!session.partner && new Date(session.expires_at).getTime() > Date.now()) {
        return signal.session_id;
      }
    }
  }

  return null;
}

export async function getSessionCode(sessionId: string): Promise<string> {
  const session = await pb.collection('duo_sessions').getOne<EncryptedDuoRecord>(sessionId);
  return session.code;
}

export async function createDuoSession(
  profile: PersonalProfile,
  pbUserId: string,
  preferences?: Record<string, string>,
): Promise<{ code: string; sessionId: string }> {
  const code = generateCode();
  const key = await deriveDuoKey(code);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const record = await pb.collection('duo_sessions').create({
    code,
    initiator:         pbUserId,
    initiator_profile: { _enc: await encryptJSON(snapshot(profile, preferences), key) },
    step:              'waiting_partner',
    expires_at:        expiresAt,
  });

  return { code, sessionId: record.id };
}

export async function joinDuoSession(
  code: string,
  profile: PersonalProfile,
  pbUserId: string,
  preferences?: Record<string, string>,
): Promise<{ sessionId: string; initiatorProfile: PartnerProfile }> {
  const upperCode = code.toUpperCase();
  const record = await pb
    .collection('duo_sessions')
    .getFirstListItem<EncryptedDuoRecord>(`code="${upperCode}"`);

  const key = await deriveDuoKey(upperCode);

  const initiatorProfile = await decryptJSON<PartnerProfile>(
    record.initiator_profile!._enc,
    key,
  );

  await pb.collection('duo_sessions').update(record.id, {
    partner:         pbUserId,
    partner_profile: { _enc: await encryptJSON(snapshot(profile, preferences), key) },
    step:            'connected',
  });

  return { sessionId: record.id, initiatorProfile };
}

export function subscribeToSession(
  sessionId: string,
  code: string,
  onChange: (record: DuoSessionRecord) => void,
): () => void {
  pb.collection('duo_sessions').subscribe<EncryptedDuoRecord>(sessionId, async (e) => {
    if (e.action !== 'update') return;

    const raw = e.record;
    let partnerProfile: PartnerProfile | null = null;

    if (raw.partner_profile?._enc) {
      const key = await deriveDuoKey(code);
      partnerProfile = await decryptJSON<PartnerProfile>(raw.partner_profile._enc, key);
    }

    onChange({ ...raw, partner_profile: partnerProfile } as unknown as DuoSessionRecord);
  });

  return () => pb.collection('duo_sessions').unsubscribe(sessionId);
}

export async function updateSessionStep(sessionId: string, step: string): Promise<void> {
  await pb.collection('duo_sessions').update(sessionId, { step });
}
