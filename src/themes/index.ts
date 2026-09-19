import type { Theme } from "@/types";

export const THEMES: Theme[] = [
  {
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
  },
  {
    id: "nord",
    name: "Nord",
    dark: true,
    colors: {
      "--bg-primary": "#2e3440",
      "--bg-surface": "#3b4252",
      "--bg-surface-hover": "#434c5e",
      "--border-default": "#4c566a",
      "--border-focus": "#88c0d0",
      "--text-primary": "#eceff4",
      "--text-secondary": "#d8dee9",
      "--text-muted": "#7b88a1",
      "--accent-primary": "#88c0d0",
      "--accent-hover": "#8fbcbb",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    dark: true,
    colors: {
      "--bg-primary": "#1e1f29",
      "--bg-surface": "#282a36",
      "--bg-surface-hover": "#343746",
      "--border-default": "#44475a",
      "--border-focus": "#bd93f9",
      "--text-primary": "#f8f8f2",
      "--text-secondary": "#ccc",
      "--text-muted": "#6272a4",
      "--accent-primary": "#bd93f9",
      "--accent-hover": "#ff79c6",
    },
  },
  {
    id: "light",
    name: "Light",
    dark: false,
    colors: {
      "--bg-primary": "#ffffff",
      "--bg-surface": "#f5f5f5",
      "--bg-surface-hover": "#ececec",
      "--border-default": "#e0e0e0",
      "--border-focus": "#2563eb",
      "--text-primary": "#1a1a1a",
      "--text-secondary": "#555555",
      "--text-muted": "#999999",
      "--accent-primary": "#2563eb",
      "--accent-hover": "#1d4ed8",
    },
  },
  {
    id: "system-sync",
    name: "System Sync",
    dark: true,
    colors: {
      "--bg-primary": "#111111",
      "--bg-surface": "#1a1a1a",
      "--bg-surface-hover": "#242424",
      "--border-default": "#2e2e2e",
      "--border-focus": "#0078d4",
      "--text-primary": "#ffffff",
      "--text-secondary": "#cccccc",
      "--text-muted": "#666666",
      "--accent-primary": "#0078d4",
      "--accent-hover": "#1a8cff",
    },
  },
];

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  if (theme.dark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function loadCustomTheme(path: string): Promise<Theme> {
  return fetch(path).then((res) => res.json());
}
