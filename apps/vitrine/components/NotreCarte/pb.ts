import PocketBase from 'pocketbase';
import type { CarteDoc, Owner } from './types';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL ?? 'https://carte-api.ouiclair.com';

export const pb = new PocketBase(PB_URL);

const NAMES: Record<Owner, string> = { A: 'Michel', B: 'Ekaterina' };
const EMAILS: Record<Owner, string> = { A: 'michel@carte.local', B: 'ekaterina@carte.local' };
const PASSWORDS: Record<Owner, string> = { A: 'michel', B: 'ekaterina' };

export function ownerName(owner: Owner): string {
  return NAMES[owner];
}

export async function loginAs(owner: Owner): Promise<void> {
  await pb.collection('carte_users').authWithPassword(EMAILS[owner], PASSWORDS[owner]);
}

export function currentOwner(): Owner | null {
  const record = pb.authStore.record;
  if (!record) return null;
  if (record.email === EMAILS.A) return 'A';
  if (record.email === EMAILS.B) return 'B';
  return null;
}

export function logout(): void {
  pb.authStore.clear();
}

const DOC_ID_KEY = 'ouiclair-notre-carte-doc-id';

function cachedDocId(): string | null {
  try {
    return window.localStorage.getItem(DOC_ID_KEY);
  } catch {
    return null;
  }
}

function setCachedDocId(id: string) {
  try {
    window.localStorage.setItem(DOC_ID_KEY, id);
  } catch {
    // ignoré
  }
}

/** Il n'existe qu'un seul document partagé pour le couple. */
export async function fetchDoc(): Promise<{ id: string; doc: CarteDoc } | null> {
  const cachedId = cachedDocId();
  if (cachedId) {
    try {
      const record = await pb.collection('notre_carte_docs').getOne(cachedId);
      return { id: record.id, doc: record.doc as CarteDoc };
    } catch {
      // le cache est invalide, on retombe sur la liste ci-dessous
    }
  }
  const list = await pb.collection('notre_carte_docs').getList(1, 1);
  const record = list.items[0];
  if (!record) return null;
  setCachedDocId(record.id);
  return { id: record.id, doc: record.doc as CarteDoc };
}

export async function saveDoc(id: string, doc: CarteDoc): Promise<void> {
  await pb.collection('notre_carte_docs').update(id, { doc });
}
