import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleId } from "@/types";

export interface AppliedTweak {
  id: string;
  title: string;
  module: ModuleId;
  risk: "safe" | "caution" | "advanced";
  appliedAt: string;
  originalState?: unknown;
  /** Snapshot of registry values touched, for revert */
  registryBackup?: Record<string, string | number | null>;
}

export interface RestorePointEntry {
  id: string;
  description: string;
  createdAt: string;
}

interface SafetyStore {
  appliedTweaks: AppliedTweak[];
  restorePoints: RestorePointEntry[];
  trackApply: (tweak: Omit<AppliedTweak, "appliedAt">) => void;
  removeTracked: (id: string) => void;
  addRestorePoint: (description: string) => void;
  clearHistory: () => void;
}

export const useSafetyStore = create<SafetyStore>()(
  persist(
    (set) => ({
      appliedTweaks: [],
      restorePoints: [],
      trackApply: (tweak) =>
        set((s) => ({
          appliedTweaks: [
            { ...tweak, appliedAt: new Date().toISOString() },
            ...s.appliedTweaks,
          ],
        })),
      removeTracked: (id) =>
        set((s) => ({
          appliedTweaks: s.appliedTweaks.filter((t) => t.id !== id),
        })),
      addRestorePoint: (description) =>
        set((s) => ({
          restorePoints: [
            {
              id: `${Date.now()}`,
              description,
              createdAt: new Date().toISOString(),
            },
            ...s.restorePoints,
          ],
        })),
      clearHistory: () => set({ appliedTweaks: [], restorePoints: [] }),
    }),
    { name: "bismuth-safety" }
  )
);

export function isTweakApplied(id: string): boolean {
  return useSafetyStore.getState().appliedTweaks.some((t) => t.id === id);
}