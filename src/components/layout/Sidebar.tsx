import { useUIStore } from "@/stores";
import { cn } from "@/utils";
import {
  Gauge,
  Battery,
  Monitor,
  Palette,
  Shield,
  ChevronLeft,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "performance", label: "Performance & Gaming", icon: Gauge },
  { id: "power", label: "Power & Battery", icon: Battery },
  { id: "display", label: "Display & Audio", icon: Monitor },
  { id: "ui-customization", label: "UI Customization", icon: Palette },
  { id: "safety", label: "Safety & Rollback", icon: Shield },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeModule, setActiveModule } =
    useUIStore();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-bismuth-surface border-r border-bismuth-border transition-all duration-200 z-30 flex flex-col",
        sidebarCollapsed ? "w-14" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-3 h-14 border-b border-bismuth-border shrink-0">
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold tracking-wide text-bismuth-text">
            BISMUTH
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-bismuth-surface-hover text-bismuth-text-muted hover:text-bismuth-text transition-colors"
          title={sidebarCollapsed ? "Expand" : "Collapse"}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5",
                isActive
                  ? "bg-bismuth-accent/10 text-bismuth-accent"
                  : "text-bismuth-text-secondary hover:bg-bismuth-surface-hover hover:text-bismuth-text"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-bismuth-border p-1.5">
        <button
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-bismuth-text-secondary hover:bg-bismuth-surface-hover hover:text-bismuth-text transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}