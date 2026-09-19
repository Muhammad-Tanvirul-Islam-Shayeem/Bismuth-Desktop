import { create } from "zustand";
import type { Theme } from "@/types";

interface ElevationStore {
  isElevated: boolean;
  processArch: string;
  osVersion: string;
  osBuild: string;
  osEdition: string;
  setElevation: (elevated: boolean, arch: string) => void;
  setOsInfo: (version: string, build: string, edition: string) => void;
}

export const useElevationStore = create<ElevationStore>((set) => ({
  isElevated: false,
  processArch: "x86_64",
  osVersion: "",
  osBuild: "",
  osEdition: "",
  setElevation: (isElevated, processArch) => set({ isElevated, processArch }),
  setOsInfo: (osVersion, osBuild, osEdition) => set({ osVersion, osBuild, osEdition }),
}));

interface UIStore {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  consoleOpen: boolean;
  activeModule: string | null;
  currentTheme: Theme;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  toggleConsole: () => void;
  setActiveModule: (module: string | null) => void;
  setTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  id: "oled-black",
  name: "OLED Black",
  dark: true,
  colors: {
    "--bg-primary": "#000000",
    "--bg-surface": "#0a0a0a",
    "--bg-surface-hover": "#141414",
    "--border-default": "#1e1e1e",
    "--border-focus": "#3b82f6",
    "--text-primary": "#e5e5e5",
    "--text-secondary": "#a3a3a3",
    "--text-muted": "#525252",
    "--accent-primary": "#3b82f6",
    "--accent-hover": "#60a5fa",
  },
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  consoleOpen: false,
  activeModule: null,
  currentTheme: defaultTheme,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  toggleConsole: () => set((s) => ({ consoleOpen: !s.consoleOpen })),
  setActiveModule: (activeModule) => set({ activeModule }),
  setTheme: (theme) => set({ currentTheme: theme }),
}));

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  module?: string;
}

interface ConsoleStore {
  logs: LogEntry[];
  addLog: (level: LogEntry["level"], message: string, module?: string) => void;
  clearLogs: () => void;
}

let logId = 0;

export const useConsoleStore = create<ConsoleStore>((set) => ({
  logs: [],
  addLog: (level, message, module) =>
    set((s) => ({
      logs: [
        ...s.logs,
        {
          id: ++logId,
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
          module,
        },
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));