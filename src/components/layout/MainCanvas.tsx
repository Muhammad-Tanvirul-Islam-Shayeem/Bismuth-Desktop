import { useUIStore } from "@/stores";
import { Shield, Gauge, Battery, Monitor, Palette } from "lucide-react";
import { getTweaksByModule } from "@/modules/registry";
import { TweakCard } from "@/components/ui/TweakCard";
import type { ModuleId } from "@/types";

const MODULE_LABELS: Record<string, { title: string; icon: React.ElementType; description: string }> = {
  performance: { title: "Performance & Gaming", icon: Gauge, description: "Optimize system performance for gaming and productivity" },
  power: { title: "Power & Battery", icon: Battery, description: "Manage power plans, battery health, and energy settings" },
  display: { title: "Display & Audio", icon: Monitor, description: "Control display, audio, and monitor settings" },
  "ui-customization": { title: "UI Customization", icon: Palette, description: "Customize Windows UI elements and appearance" },
  safety: { title: "Safety & Rollback", icon: Shield, description: "Restore points, rollback history, and safety settings" },
};

export function MainCanvas() {
  const { activeModule } = useUIStore();

  if (!activeModule) {
    return (
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <h1 className="text-2xl font-semibold text-bismuth-text mb-3">
            Welcome to Bismuth
          </h1>
          <p className="text-bismuth-text-secondary text-sm leading-relaxed mb-8">
            A modern, minimalist Windows customization tool.
            <br />
            Select a module from the sidebar or press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-bismuth-border text-2xs bg-bismuth-surface">
              Ctrl+K
            </kbd>{" "}
            to search and execute tweaks instantly.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {Object.entries(MODULE_LABELS).map(([id, mod]) => {
              const Icon = mod.icon;
              return (
                <button
                  key={id}
                  onClick={() => useUIStore.getState().setActiveModule(id)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-bismuth-border bg-bismuth-surface hover:bg-bismuth-surface-hover hover:border-bismuth-border-focus transition-all text-left group"
                >
                  <Icon className="w-5 h-5 text-bismuth-text-muted group-hover:text-bismuth-accent transition-colors" />
                  <div>
                    <div className="text-sm text-bismuth-text font-medium">{mod.title}</div>
                    <div className="text-xs text-bismuth-text-muted">{mod.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  const mod = MODULE_LABELS[activeModule] || MODULE_LABELS.performance;
  const Icon = mod.icon;
  const tweaks = getTweaksByModule(activeModule as ModuleId);

  return (
    <main className="flex-1 overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-6 h-6 text-bismuth-accent" />
          <div>
            <h2 className="text-lg font-semibold text-bismuth-text">{mod.title}</h2>
            <p className="text-sm text-bismuth-text-muted">{mod.description}</p>
          </div>
        </div>

        {tweaks.length === 0 ? (
          <div className="rounded-xl border border-bismuth-border bg-bismuth-surface p-8 text-center text-bismuth-text-muted text-sm">
            No tweaks registered for this module yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {tweaks.map((tweak) => (
              <TweakCard key={tweak.id} tweak={tweak} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}