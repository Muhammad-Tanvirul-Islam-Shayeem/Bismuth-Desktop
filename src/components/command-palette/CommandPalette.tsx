import { useUIStore, useConsoleStore } from "@/stores";
import { useSafetyStore } from "@/stores/safety";
import { THEMES, applyTheme } from "@/themes";
import { getAllTweaks } from "@/modules/registry";
import { cn } from "@/utils";
import { Search, CornerDownLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function CommandPalette() {
  const { commandPaletteOpen, toggleCommandPalette, setActiveModule, setTheme } =
    useUIStore();
  const addLog = useConsoleStore((s) => s.addLog);
  const trackApply = useSafetyStore((s) => s.trackApply);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const themeItems = THEMES.map((theme) => ({
    id: `theme:${theme.id}`,
    title: `Switch theme — ${theme.name}`,
    description: `Applies the ${theme.name} color scheme`,
    keywords: ["theme", "appearance", theme.id, theme.name],
    risk: undefined as "safe" | "caution" | "advanced" | undefined,
    module: undefined as string | undefined,
    run: () => {
      setTheme(theme);
      applyTheme(theme);
      addLog("success", `Applied theme: ${theme.name}`);
    },
  }));

  const tweakItems = getAllTweaks().map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    risk: t.risk,
    module: t.module,
    run: async () => {
      if (!t.requiresAdmin) {
        const result = await t.apply({ module: t.module, elevated: false });
        addLog(result.success ? "success" : "error", result.message, t.module);
        if (result.success) trackApply({ id: t.id, title: t.title, module: t.module, risk: t.risk });
        return;
      }
      addLog("info", `${t.title} requires administrator: launching elevated app flow.`, t.module);
      setActiveModule(t.module);
    },
  }));

  const results = [...themeItems, ...tweakItems]
    .filter((item) => {
      const q = query.toLowerCase();
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    })
    .slice(0, 12);

  useEffect(() => {
    if (selectedIndex >= results.length && results.length > 0) setSelectedIndex(0);
  }, [results.length, selectedIndex]);

  if (!commandPaletteOpen) return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      toggleCommandPalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" && results[selectedIndex]) {
      const item = results[selectedIndex];
      if (item.module) setActiveModule(item.module);
      item.run();
      toggleCommandPalette();
    }
  }

  async function handleSelect(item: (typeof results)[number]) {
    if (busyIds.has(item.id)) return;
    if (item.module) setActiveModule(item.module);
    setBusyIds((s) => new Set(s).add(item.id));
    try {
      await item.run();
    } finally {
      setBusyIds((s) => {
        const next = new Set(s);
        next.delete(item.id);
        return next;
      });
    }
    toggleCommandPalette();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-[18vh]"
      onClick={toggleCommandPalette}
    >
      <motion.div
        initial={{ scale: 0.97, y: -6, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: -6, opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-bismuth-border bg-bismuth-surface shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-bismuth-border h-12">
          <Search className="w-4 h-4 text-bismuth-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a tweak, theme, or command..."
            className="flex-1 bg-transparent text-sm text-bismuth-text outline-none placeholder:text-bismuth-text-muted"
          />
          <kbd className="text-2xs bg-bismuth-surface-hover px-1.5 py-0.5 rounded border border-bismuth-border text-bismuth-text-muted">
            Esc
          </kbd>
        </div>

        <div className="max-h-[320px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-bismuth-text-muted">
              No results for "{query}"
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => handleSelect(item)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                  i === selectedIndex
                    ? "bg-bismuth-surface-hover text-bismuth-text"
                    : "text-bismuth-text-secondary"
                )}
              >
                <div className="min-w-0">
                  <div className="truncate">{item.title}</div>
                  {item.description && (
                    <div className="truncate text-xs text-bismuth-text-muted">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {item.risk && (
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        item.risk === "safe" && "bg-bismuth-safe",
                        item.risk === "caution" && "bg-bismuth-caution",
                        item.risk === "advanced" && "bg-bismuth-danger"
                      )}
                    />
                  )}
                  {i === selectedIndex && (
                    <CornerDownLeft className="w-3 h-3 text-bismuth-text-muted" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}