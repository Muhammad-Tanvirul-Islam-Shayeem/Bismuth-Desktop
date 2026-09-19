import { registerTweaks, getAllTweaks } from "../registry";
import { createRestorePoint } from "../execution";
import { useSafetyStore } from "@/stores/safety";
import { useConsoleStore } from "@/stores";

const MODULE = "safety" as const;

export function registerSafetyModule() {
  registerTweaks([
    {
      id: "safety:restorepoint",
      title: "Create System Restore Point",
      description:
        "Creates a Windows System Restore Point before applying system tweaks.",
      keywords: ["restore", "point", "backup", "safety", "create", "checkpoint"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: true,
      apply: async () => {
        const ok = await createRestorePoint("Bismuth created restore point");
        if (ok) {
          useSafetyStore.getState().addRestorePoint(`Bismuth ${new Date().toLocaleString()}`);
          return { success: true, message: "Restore point created successfully." };
        }
        return {
          success: false,
          message:
            "Restore point could not be created. Ensure System Protection is enabled.",
        };
      },
      revert: async () => ({ success: true, message: "Restore points cannot be reverted." }),
    },
    {
      id: "safety:revertall",
      title: "Revert All Applied Tweaks",
      description:
        "Runs the revert action of every tweak Bismuth has applied, restoring defaults.",
      keywords: ["revert", "all", "restore", "default", "reset", "rollback"],
      module: MODULE,
      risk: "advanced",
      requiresAdmin: true,
      apply: async (ctx) => {
        const addLog = useConsoleStore.getState().addLog;
        const { appliedTweaks, removeTracked, clearHistory } = useSafetyStore.getState();
        let failed = 0;

        for (const applied of appliedTweaks) {
          const tweak = getAllTweaks().find((t) => t.id === applied.id);
          if (!tweak) continue;
          addLog("info", `Reverting: ${applied.title}`, MODULE);
          const result = await tweak.revert({ module: MODULE, elevated: ctx.elevated });
          if (result.success) removeTracked(applied.id);
          else failed++;
        }

        clearHistory();
        return {
          success: failed === 0,
          message:
            failed === 0
              ? "All tweaks reverted to defaults."
              : `${failed} tweak(s) failed to revert. Check the console.`,
        };
      },
      revert: async () => ({ success: true, message: "No further action." }),
    },
    {
      id: "safety:clearlog",
      title: "Clear Tweaks History",
      description: "Clears the list of applied tweaks from Bismuth's history.",
      keywords: ["clear", "history", "log", "tweaks", "reset"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () => {
        useSafetyStore.getState().clearHistory();
        useConsoleStore.getState().addLog("info", "Tweak history cleared", MODULE);
        return { success: true, message: "History cleared." };
      },
      revert: async () => ({ success: true, message: "Clearing history is irreversible." }),
    },
  ]);
}