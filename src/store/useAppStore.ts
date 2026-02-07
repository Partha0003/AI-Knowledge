import { create } from "zustand";
import type { DomainRole } from "@/types";

interface AppState {
  role: DomainRole | null;
  setRole: (role: DomainRole | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));
