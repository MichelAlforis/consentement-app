/**
 * Chiffrement AES-GCM 256 côté client.
 * Les données sensibles (profils, safeword) sont chiffrées AVANT d'être envoyées à PocketBase.
 * Le serveur stocke des blobs opaques — un dump de la base ne révèle rien.
 *
 * Clé profile  : PBKDF2(deviceId, "ouiclair:profile:v1") — seul le device peut déchiffrer
 * Clé duo      : PBKDF2(code,     "ouiclair:duo:v1")     — les deux partenaires connaissent le code
 */

const PBKDF2_ITERATIONS = 100_000;

// Cache session pour éviter de recalculer PBKDF2 (~100ms) à chaque champ
const keyCache = new Map<string, CryptoKey>();

function appSalt(label: string): Uint8Array<ArrayBuffer> {
  const src = `ouiclair:${label}:v1`;
  const out = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) out[i] = src.charCodeAt(i);
  return out;
}

function utf8Buffer(value: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(value);
  return encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength,
  ) as ArrayBuffer;
}

export async function deriveKey(secret: string, label: string): Promise<CryptoKey> {
  const cacheKey = `${label}:${secret}`;
  const cached = keyCache.get(cacheKey);
  if (cached) return cached;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    utf8Buffer(secret),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: appSalt(label), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
  keyCache.set(cacheKey, key);
  return key;
}

export async function encryptJSON(data: object, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

  // Emballer : iv (12 octets) || ciphertext → base64
  const packed = new Uint8Array(12 + ciphertext.byteLength);
  packed.set(iv);
  packed.set(new Uint8Array(ciphertext), 12);

  let binary = '';
  for (let i = 0; i < packed.byteLength; i++) binary += String.fromCharCode(packed[i]);
  return btoa(binary);
}

export async function decryptJSON<T = object>(encoded: string, key: CryptoKey): Promise<T> {
  const packed = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const iv = packed.slice(0, 12);
  const ciphertext = packed.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

export function deriveProfileKey(deviceId: string): Promise<CryptoKey> {
  return deriveKey(deviceId, 'profile');
}

export function deriveDuoKey(code: string): Promise<CryptoKey> {
  return deriveKey(code.toUpperCase(), 'duo');
}
