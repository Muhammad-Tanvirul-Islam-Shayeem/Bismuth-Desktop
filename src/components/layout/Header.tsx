import { useElevationStore, useUIStore } from "@/stores";
import { Search, Terminal, Shield, ShieldAlert } from "lucide-react";

export function Header() {
  const { isElevated, processArch, osEdition, osBuild } =
    useElevationStore();
  const { toggleCommandPalette, toggleConsole } = useUIStore();

  return (
    <header className="h-14 shrink-0 border-b border-bismuth-border bg-bismuth-surface/50 glass flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-bismuth-border bg-bismuth-bg hover:border-bismuth-border-focus transition-colors text-sm text-bismuth-text-muted"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search tweaks...</span>
          <kbd className="ml-4 text-2xs bg-bismuth-surface-hover px-1.5 py-0.5 rounded border border-bismuth-border text-bismuth-text-muted">
            Ctrl+K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {osEdition && (
          <span className="text-2xs text-bismuth-text-muted hidden md:block">
            {osEdition} (Build {osBuild}) · {processArch}
          </span>
        )}

        <div
          className="flex items-center gap-1.5 text-2xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: isElevated ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
            color: isElevated ? "var(--accent-primary)" : "var(--text-muted)",
          }}
        >
          {isElevated ? (
            <Shield className="w-3 h-3" />
          ) : (
            <ShieldAlert className="w-3 h-3" />
          )}
          <span>{isElevated ? "Admin" : "User"}</span>
        </div>

        <button
          onClick={toggleConsole}
          className="p-2 rounded-lg hover:bg-bismuth-surface-hover text-bismuth-text-muted hover:text-bismuth-text transition-colors"
          title="Toggle console"
        >
          <Terminal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}