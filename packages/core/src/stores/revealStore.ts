import { create } from 'zustand';

interface RevealStore {
  pendingIds: string[];
  setPending: (ids: string[]) => void;
  clearPending: () => void;
}

export const useRevealStore = create<RevealStore>()((set) => ({
  pendingIds: [],
  setPending: (ids) => set({ pendingIds: ids }),
  clearPending: () => set({ pendingIds: [] }),
}));
