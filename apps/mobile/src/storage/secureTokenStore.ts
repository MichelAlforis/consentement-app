import * as SecureStore from 'expo-secure-store';

const KEY = 'pb_auth_token';

export const secureTokenStore = {
  async save(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEY, token);
    } catch {
      // SecureStore unavailable (passcode disabled, simulator without keychain, etc.)
    }
  },
  async load(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEY);
    } catch {
      return null;
    }
  },
  async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEY);
    } catch {
      // Best-effort clear
    }
  },
};
