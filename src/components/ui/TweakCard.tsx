import { cn } from "@/utils";
import { useSafetyStore } from "@/stores/safety";
import { useElevationStore, useConsoleStore } from "@/stores";
import { createRestorePoint } from "@/modules/execution";
import type { TweakDefinition } from "@/modules/registry";
import { Check, RotateCcw, Play, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const RISK_BADGE = {
  safe: { label: "Safe", icon: ShieldCheck, class: "text-bismuth-safe bg-bismuth-safe/10 border-bismuth-safe/20" },
  caution: { label: "Caution", icon: ShieldAlert, class: "text-bismuth-caution bg-bismuth-caution/10 border-bismuth-caution/20" },
  advanced: { label: "Advanced", icon: Shield, class: "text-bismuth-danger bg-bismuth-danger/10 border-bismuth-danger/20" },
};

export function TweakCard({ tweak }: { tweak: TweakDefinition }) {
  const { isElevated } = useElevationStore();
  const trackApply = useSafetyStore((s) => s.trackApply);
  const removeTracked = useSafetyStore((s) => s.removeTracked);
  const applied = useSafetyStore((s) => s.appliedTweaks.some((t) => t.id === tweak.id));
  const addLog = useConsoleStore((s) => s.addLog);
  const [busy, setBusy] = useState<"apply" | "revert" | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const badge = RISK_BADGE[tweak.risk];
  const needsElevation = tweak.requiresAdmin && !isElevated;

  async function handleApply() {
    if (busy) return;

    if (needsElevation) {
      addLog("warn", `${tweak.title} requires administrator privileges.`, tweak.module);
      setResultMsg("Requires Administrator — press the Elevate button above.");
      return;
    }

    setBusy("apply");
    setResultMsg(null);

    // Safety: create a restore point for caution/advanced tweaks
    if (tweak.risk === "advanced" || tweak.risk === "caution") {
      addLog("info", "Creating restore point before applying...", tweak.module);
      const ok = await createRestorePoint(`Bismuth: ${tweak.title}`);
      if (ok) {
        useSafetyStore.getState().addRestorePoint(`Before "${tweak.title}"`);
      } else {
        addLog("warn", "Restore point unavailable (System Protection may be off).", tweak.module);
      }
    }

    try {
      const result = await tweak.apply({ module: tweak.module, elevated: isElevated });
      setResultMsg(result.message);
      if (result.success) {
        trackApply({
          id: tweak.id,
          title: tweak.title,
          module: tweak.module,
          risk: tweak.risk,
        });
      }
    } catch (err) {
      addLog("error", String(err), tweak.module);
      setResultMsg(String(err));
    } finally {
      setBusy(null);
    }
  }

  async function handleRevert() {
    if (busy) return;
    setBusy("revert");
    setResultMsg(null);
    try {
      const result = await tweak.revert({ module: tweak.module, elevated: isElevated });
      setResultMsg(result.message);
      if (result.success) removeTracked(tweak.id);
    } catch (err) {
      setResultMsg(String(err));
    } finally {
      setBusy(null);
    }
  }

  const Icon = badge.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group rounded-xl border bg-bismuth-surface p-4 transition-colors",
        applied ? "border-bismuth-accent/50" : "border-bismuth-border hover:border-bismuth-border-focus/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-bismuth-text truncate">
              {tweak.title}
            </h3>
            {applied && (
              <span className="flex items-center gap-1 text-2xs text-bismuth-safe shrink-0">
                <Check className="w-3 h-3" /> Applied
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-bismuth-text-secondary leading-relaxed">
            {tweak.description}
          </p>
        </div>

        <span
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full border text-2xs font-medium shrink-0",
            badge.class
          )}
          title={`Risk: ${badge.label}`}
        >
          <Icon className="w-3 h-3" />
          {badge.label}
        </span>
      </div>

      {resultMsg && (
        <p className="mt-2 text-xs text-bismuth-text-secondary border-t border-bismuth-border pt-2">
          {resultMsg}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-2xs text-bismuth-text-muted">
          {needsElevation
            ? "Requires Administrator"
            : tweak.requiresAdmin
              ? "Administrator"
              : "User-level"}
        </span>
        <div className="flex items-center gap-2">
          {applied && (
            <button
              onClick={handleRevert}
              disabled={busy !== null}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-bismuth-border text-bismuth-text-muted hover:border-bismuth-danger/50 hover:text-bismuth-danger transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3" />
              {busy === "revert" ? "Reverting..." : "Revert"}
            </button>
          )}
          <button
            onClick={handleApply}
            disabled={busy !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: needsElevation ? "rgba(234,179,8,0.1)" : "var(--accent-primary)",
              color: needsElevation ? "var(--text-secondary)" : "#ffffff",
            }}
          >
            <Play className="w-3 h-3" />
            {busy === "apply" ? "Applying..." : applied ? "Re-apply" : "Apply"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}