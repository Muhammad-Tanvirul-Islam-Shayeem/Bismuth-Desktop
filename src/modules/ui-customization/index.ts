import { registerTweaks, runTweakPS } from "../registry";

const MODULE = "ui-customization" as const;

const EXPLORER_KEY = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced";

export function registerUiCustomizationModule() {
  registerTweaks([
    {
      id: "ui:contextmenu",
      title: "Restore Classic Context Menu",
      description:
        "Re-enables the full Windows 10-style right-click context menu (Win11).",
      keywords: ["context", "menu", "right-click", "classic", "contextmenu", "win11"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "New-Item -Path 'HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32' -Force | Out-Null; " +
            "New-ItemProperty -Path 'HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32' -Name '(default)' -Value '' -PropertyType String -Force; " +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Restore classic context menu" }
        ),
      revert: async () =>
        runTweakPS(
          "Remove-Item -Path 'HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}' -Recurse -Force -ErrorAction SilentlyContinue; " +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Revert to new context menu" }
        ),
    },
    {
      id: "ui:taskbar-left",
      title: "Left-Align Taskbar",
      description: "Moves taskbar icons to the left corner (classic alignment).",
      keywords: ["taskbar", "alignment", "left", "corner", "position"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'TaskbarAl' -Value 0 -Type DWord -Force; ` +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Left-align taskbar" }
        ),
      revert: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'TaskbarAl' -Value 1 -Type DWord -Force; ` +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Center-align taskbar" }
        ),
    },
    {
      id: "ui:taskbar-transparent",
      title: "Taskbar Transparency",
      description: "Makes the taskbar transparent instead of frosted.",
      keywords: ["taskbar", "transparency", "transparent", "acrylic", "blur", "mica"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'TaskbarAcrylicOpacity' -Value 0 -Type DWord -Force; ` +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Enable taskbar transparency" }
        ),
      revert: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'TaskbarAcrylicOpacity' -Value 2 -Type DWord -Force; ` +
            "Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue",
          { module: MODULE, label: "Revert taskbar frosted effect" }
        ),
    },
    {
      id: "ui:fileextensions",
      title: "Show File Extensions",
      description: "Toggles visibility of file extensions in File Explorer.",
      keywords: ["file", "extension", "hidden", "explorer", "files", "show"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'HideFileExt' -Value 0 -Type DWord -Force`,
          { module: MODULE, label: "Show file extensions" }
        ),
      revert: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'HideFileExt' -Value 1 -Type DWord -Force`,
          { module: MODULE, label: "Hide file extensions" }
        ),
    },
    {
      id: "ui:hiddenfiles",
      title: "Show Hidden Files",
      description: "Shows hidden files and folders in File Explorer.",
      keywords: ["hidden", "files", "folders", "explorer", "show"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'Hidden' -Value 1 -Type DWord -Force; ` +
            "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -Name 'SuperHidden' -Value 1 -Type DWord -Force",
          { module: MODULE, label: "Show hidden files" }
        ),
      revert: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'Hidden' -Value 2 -Type DWord -Force; ` +
            "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -Name 'SuperHidden' -Value 0 -Type DWord -Force",
          { module: MODULE, label: "Hide hidden files" }
        ),
    },
    {
      id: "ui:snap",
      title: "Enable Snap Layouts",
      description: "Enables Windows 11 window snapping layouts and flyout.",
      keywords: ["snap", "layout", "window", "multi-task", "flyout"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'SnapAssist' -Value 1 -Type DWord -Force`,
          { module: MODULE, label: "Enable snap layouts" }
        ),
      revert: async () =>
        runTweakPS(
          `Set-ItemProperty -Path '${EXPLORER_KEY}' -Name 'SnapAssist' -Value 0 -Type DWord -Force`,
          { module: MODULE, label: "Disable snap layouts" }
        ),
    },
  ]);
}