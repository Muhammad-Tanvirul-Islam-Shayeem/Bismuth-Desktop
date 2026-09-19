import { registerTweaks, runTweakPS } from "../registry";

const MODULE = "performance" as const;

export function registerPerformanceModule() {
  registerTweaks([
    {
      id: "perf:gamebar",
      title: "Disable Game Bar & Game DVR",
      description:
        "Disables background recording and the Game Bar overlay for better FPS in games.",
      keywords: ["gamebar", "dvr", "recording", "overlay", "performance", "xbox"],
      module: MODULE,
      risk: "caution",
      requiresAdmin: false,
      apply: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR' -Name 'AppCaptureEnabled' -Value 0 -Type DWord -Force; " +
            "Set-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -Type DWord -Force; " +
            "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR' -Name 'AllowGameDVR' -Value 0 -Type DWord -Force",
          { module: ctx.module, elevated: true, label: "Disable Game Bar & DVR" }
        ),
      revert: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR' -Name 'AppCaptureEnabled' -Value 1 -Type DWord -Force; " +
            "Set-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name 'GameDVR_Enabled' -Value 1 -Type DWord -Force; " +
            "Remove-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR' -Name 'AllowGameDVR' -ErrorAction SilentlyContinue",
          { module: ctx.module, elevated: true, label: "Re-enable Game Bar & DVR" }
        ),
    },
    {
      id: "perf:telemetry",
      title: "Block Windows Telemetry",
      description:
        "Disables Microsoft data collection, telemetry tasks, and the DiagTrack service.",
      keywords: ["telemetry", "privacy", "tracking", "diagnostics", "data", "diagtrack"],
      module: MODULE,
      risk: "advanced",
      requiresAdmin: true,
      apply: async (ctx) =>
        runTweakPS(
          "New-Item -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Force | Out-Null; " +
            "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force; " +
            "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name 'MaxTelemetryAllowed' -Value 0 -Type DWord -Force; " +
            "sc.exe config DiagTrack start= disabled; " +
            "sc.exe stop DiagTrack 2>$null; " +
            "sc.exe config dmwappushservice start= disabled",
          { module: ctx.module, elevated: true, label: "Block Windows Telemetry" }
        ),
      revert: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name 'AllowTelemetry' -Value 1 -Type DWord -Force; " +
            "sc.exe config DiagTrack start= demand; " +
            "sc.exe config dmwappushservice start= demand",
          { module: ctx.module, elevated: true, label: "Restore telemetry" }
        ),
    },
    {
      id: "perf:workingset",
      title: "Clean Working Set Memory",
      description:
        "Trims all processes' working sets to free RAM instantly. Safe, non-destructive.",
      keywords: ["ram", "memory", "workingset", "working set", "cache", "free", "clean"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async (ctx) =>
        runTweakPS(
          "Add-Type -Namespace WinAPI -Name Mem -MemberDefinition '[DllImport(\"psapi.dll\")] public static extern bool EmptyWorkingSet(IntPtr hProcess);'; " +
            "Get-Process | ForEach-Object { try { [WinAPI.Mem]::EmptyWorkingSet($_.Handle) | Out-Null } catch {} }; " +
            "[math]::Round(((Get-Counter '\\Memory\\Available MBytes').CounterSamples[0].CookedValue), 0) + ' MB available'",
          { module: ctx.module, label: "Clean working set" }
        ),
      revert: async () => ({ success: true, message: "Nothing to revert via registry; RAM frees itself." }),
    },
    {
      id: "perf:backgroundapps",
      title: "Disable Background Apps",
      description:
        "Stops Windows and store apps from running in the background to save resources.",
      keywords: ["background", "apps", "store", "resources", "startup", "performance"],
      module: MODULE,
      risk: "caution",
      requiresAdmin: false,
      apply: async (ctx) =>
        runTweakPS(
          "setx Environment_DisableBackgroundTasks 1 2>$null; " +
            "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications' -Name 'GlobalUserDisabled' -Value 1 -Type DWord -Force",
          { module: ctx.module, label: "Disable background apps" }
        ),
      revert: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications' -Name 'GlobalUserDisabled' -Value 0 -Type DWord -Force",
          { module: ctx.module, label: "Enable background apps" }
        ),
    },
    {
      id: "perf:powerthrottling",
      title: "Disable Power Throttling",
      description:
        "Prevents Windows from throttling background processes, improving sustained performance.",
      keywords: ["throttle", "power throttling", "fps", "performance", "cpu"],
      module: MODULE,
      risk: "caution",
      requiresAdmin: true,
      apply: async (ctx) => {
        await runTweakPS(
          "New-Item -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power' -Name 'PowerThrottling' -Force | Out-Null",
          { module: ctx.module, elevated: true, label: "Prepare power throttling key" }
        );
        return runTweakPS(
          "Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling' -Name 'PowerThrottlingOff' -Value 1 -Type DWord -Force",
          { module: ctx.module, elevated: true, label: "Disable power throttling" }
        );
      },
      revert: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling' -Name 'PowerThrottlingOff' -Value 0 -Type DWord -Force",
          { module: ctx.module, elevated: true, label: "Re-enable power throttling" }
        ),
    },
    {
      id: "perf:gamefullscreen",
      title: "Disable Fullscreen Optimizations",
      description:
        "Reverts the Fullscreen Optimizations registry flag for better frame pacing in games.",
      keywords: ["fullscreen", "optimization", "game", "fps", "borderless"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async (ctx) =>
        runTweakPS(
          "New-Item -Path 'HKCU:\\System\\GameConfigStore' -Name 'Children' -Force | Out-Null; " +
            "Set-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name 'GameDVR_Enabled' -Value 1 -Type DWord -Force",
          { module: ctx.module, label: "Adjust game config store" }
        ),
      revert: async (ctx) =>
        runTweakPS(
          "Set-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -Type DWord -Force",
          { module: ctx.module, label: "Restore game config store" }
        ),
    },
  ]);
}