import { registerTweaks, runTweakPS } from "../registry";

const MODULE = "display" as const;

export function registerDisplayModule() {
  registerTweaks([
    {
      id: "display:brightness",
      title: "Set Screen Brightness",
      description:
        "Applies a target brightness level to the main display monitor (0-100).",
      keywords: ["brightness", "display", "monitor", "screen", "light"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "try { $mon = Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBrightnessMethods; " +
            "$mon.WmiSetBrightness(1, 80) } catch { 'Brightness control not supported on this display' }",
          { module: MODULE, label: "Set brightness to 80%" }
        ),
      revert: async () =>
        runTweakPS(
          "try { $mon = Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBrightnessMethods; " +
            "$mon.WmiSetBrightness(1, 50) } catch { 'Brightness control not supported on this display' }",
          { module: MODULE, label: "Revert brightness to 50%" }
        ),
    },
    {
      id: "display:power50",
      title: "Set Screen Brightness to 50%",
      description: "Lower screen brightness to a comfortable mid level.",
      keywords: ["brightness", "display", "50", "dim", "screen"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "try { $mon = Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBrightnessMethods; " +
            "$mon.WmiSetBrightness(1, 50) } catch { 'Brightness control not supported' }",
          { module: MODULE, label: "Set brightness to 50%" }
        ),
      revert: async () =>
        runTweakPS(
          "try { $mon = Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBrightnessMethods; " +
            "$mon.WmiSetBrightness(1, 80) } catch { 'Brightness control not supported' }",
          { module: MODULE, label: "Revert brightness to 80%" }
        ),
    },
    {
      id: "display:refresh",
      title: "Report Display Refresh Rate",
      description:
        "Queries the current refresh rate of the primary display.",
      keywords: ["refresh", "hz", "rate", "display", "monitor", "report"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () => {
        const result = await runTweakPS(
          "(Get-CimInstance Win32_VideoController | Where-Object { $_.CurrentRefreshRate } | Select-Object -First 1).CurrentRefreshRate",
          { module: MODULE, label: "Query current refresh rate" }
        );
        const stdout = result.stdout ?? "";
        return {
          success: result.success,
          message: stdout.trim()
            ? `Current refresh rate: ${stdout.trim()} Hz`
            : "No refresh rate reported.",
          stdout,
        };
      },
      revert: async () => ({ success: true, message: "Read-only; nothing to revert." }),
    },
    {
      id: "display:volumeup",
      title: "Volume Up",
      description: "Raises the system master volume by one step.",
      keywords: ["volume", "audio", "sound", "up", "louder", "mixer"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAF, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Volume up" }
        ),
      revert: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAE, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Volume down (revert)" }
        ),
    },
    {
      id: "display:volumedown",
      title: "Volume Down",
      description: "Lowers the system master volume by one step.",
      keywords: ["volume", "audio", "sound", "down", "quieter", "mixer"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAE, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Volume down" }
        ),
      revert: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAF, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Volume up (revert)" }
        ),
    },
    {
      id: "display:mute",
      title: "Mute System Audio",
      description: "Mutes or unmutes the system volume.",
      keywords: ["volume", "audio", "sound", "mute", "quiet", "silence"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAD, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Toggle mute" }
        ),
      revert: async () =>
        runTweakPS(
          "Add-Type -Namespace AudioWrapper -Name Key -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extraInfo);'; " +
            "[AudioWrapper.Key]::keybd_event(0xAD, 0, 0, [System.UIntPtr]::Zero)",
          { module: MODULE, label: "Toggle mute (revert)" }
        ),
    },
    {
      id: "display:restartaudio",
      title: "Restart Audio Service",
      description:
        "Restarts Windows Audio to fix missing or broken sound output.",
      keywords: ["audio", "sound", "restart", "fix", "service", "crash"],
      module: MODULE,
      risk: "caution",
      requiresAdmin: true,
      apply: async (ctx) =>
        runTweakPS(
          "Restart-Service Audiosrv -Force; Get-Service Audiosrv | Select-Object Status, StartType | Format-List",
          { module: ctx.module, elevated: true, label: "Restart audio service" }
        ),
      revert: async () => ({ success: true, message: "Service restart is non-persistent." }),
    },
  ]);
}