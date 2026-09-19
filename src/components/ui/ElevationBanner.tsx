import { useElevationStore } from "@/stores";
import { requestElevation } from "@/bridge";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConsoleStore } from "@/stores";

export function ElevationBanner() {
  const { isElevated } = useElevationStore();
  const addLog = useConsoleStore((s) => s.addLog);

  if (isElevated) return null;

  async function handleElevate() {
    addLog("info", "Requesting administrator elevation via UAC...");
    try {
      const result = await requestElevation();
      if (result) {
        addLog("success", "Elevation approved. New process will launch.");
      }
    } catch (err) {
      addLog("warn", "Elevation was declined. Some tweaks require admin access.");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="border-b border-bismuth-caution/20 bg-bismuth-caution/5"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-bismuth-caution">
            <ShieldAlert className="w-4 h-4" />
            <span>
              Running without administrator privileges. Some tweaks are unavailable.
            </span>
          </div>
          <button
            onClick={handleElevate}
            className="px-3 py-1 text-xs rounded-md bg-bismuth-caution/10 text-bismuth-caution hover:bg-bismuth-caution/20 border border-bismuth-caution/30 transition-colors"
          >
            Elevate
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}