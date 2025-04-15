import { create } from "zustand";

type MemoryStore = {
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  clearRefetch: () => void;
};

export const useMemoryStore = create<MemoryStore>((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  clearRefetch: () => set({ shouldRefetch: false }),
}));
