import { useUIStore, useConsoleStore } from "@/stores";
import { cn } from "@/utils";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_STYLES = {
  info: "text-bismuth-text-secondary",
  warn: "text-bismuth-caution",
  error: "text-bismuth-danger",
  success: "text-bismuth-safe",
};

export function ConsoleDrawer() {
  const { consoleOpen, toggleConsole } = useUIStore();
  const { logs, clearLogs } = useConsoleStore();

  return (
    <AnimatePresence>
      {consoleOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 240, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-bismuth-border bg-bismuth-surface flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 h-9 border-b border-bismuth-border shrink-0">
            <span className="text-xs font-medium text-bismuth-text-muted uppercase tracking-wider">
              Console
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={clearLogs}
                className="p-1 rounded hover:bg-bismuth-surface-hover text-bismuth-text-muted hover:text-bismuth-text transition-colors"
                title="Clear logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <button
                onClick={toggleConsole}
                className="p-1 rounded hover:bg-bismuth-surface-hover text-bismuth-text-muted hover:text-bismuth-text transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-xs px-4 py-2 space-y-0.5">
            {logs.length === 0 ? (
              <div className="text-bismuth-text-muted py-4 text-center">
                No activity yet. Tweaks will log output here.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-bismuth-text-muted shrink-0 w-[72px]">
                    {log.timestamp}
                  </span>
                  <span
                    className={cn("shrink-0 font-medium uppercase", LEVEL_STYLES[log.level])}
                  >
                    {log.level}
                  </span>
                  {log.module && (
                    <span className="text-bismuth-accent shrink-0">[{log.module}]</span>
                  )}
                  <span className="text-bismuth-text-secondary">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}