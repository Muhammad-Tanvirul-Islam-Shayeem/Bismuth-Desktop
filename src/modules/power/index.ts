import { registerTweaks, runTweakPS } from "../registry";
import type { PSResult } from "../execution";
import { exec } from "../execution";

const MODULE = "power" as const;

const PLANS = {
  ultimate: "e9a42b02-d5df-448d-aa00-03f14749eb61", // Ultimate Performance
  balanced: "381b4222-f694-41f0-9685-ff5bb260df2e", // Balanced
  saver: "a1841308-3541-4fab-bc81-f71556f20b4a", // Power Saver
  high: "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c", // High Performance
};

async function setActivePlan(guid: string, label: string) {
  return runTweakPS(`powercfg /setactive ${guid}`, {
    module: MODULE,
    elevated: true,
    label,
  });
}

async function ensureUltimatePlan(): Promise<PSResult> {
  return exec(`powercfg /duplicatescheme ${PLANS.ultimate}`, {
    module: MODULE,
    elevated: true,
    label: "Ensure Ultimate Performance plan exists",
  });
}

export function registerPowerModule() {
  registerTweaks([
    {
      id: "power:ultimate",
      title: "Ultimate Performance Plan",
      description:
        "Unlocks and activates the Ultimate Performance power plan for maximum throughput.",
      keywords: ["power", "ultimate", "plan", "performance", "throughput"],
      module: MODULE,
      risk: "caution",
      requiresAdmin: true,
      apply: async (_ctx) => {
        await ensureUltimatePlan();
        return setActivePlan(PLANS.ultimate, "Activate Ultimate Performance");
      },
      revert: async (_ctx) => setActivePlan(PLANS.balanced, "Revert to Balanced plan"),
    },
    {
      id: "power:balanced",
      title: "Balanced Plan",
      description: "Activates the default Balanced power plan.",
      keywords: ["power", "balanced", "plan", "default"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: true,
      apply: async (_ctx) => setActivePlan(PLANS.balanced, "Activate Balanced plan"),
      revert: async (_ctx) => setActivePlan(PLANS.balanced, "Revert to Balanced plan"),
    },
    {
      id: "power:saver",
      title: "Power Saver Plan",
      description: "Activates the Power Saver plan to maximize battery life.",
      keywords: ["power", "saver", "battery", "plan", "save"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: true,
      apply: async (_ctx) => setActivePlan(PLANS.saver, "Activate Power Saver plan"),
      revert: async (_ctx) => setActivePlan(PLANS.balanced, "Revert to Balanced plan"),
    },
    {
      id: "power:high",
      title: "High Performance Plan",
      description: "Activates the High Performance power plan.",
      keywords: ["power", "high", "performance", "plan"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: true,
      apply: async (_ctx) => setActivePlan(PLANS.high, "Activate High Performance plan"),
      revert: async (_ctx) => setActivePlan(PLANS.balanced, "Revert to Balanced plan"),
    },
    {
      id: "power:battery",
      title: "Battery Health & Wear Report",
      description:
        "Generates a battery usage report and reads design vs full charge capacity to estimate wear.",
      keywords: ["battery", "health", "wear", "capacity", "report", "stats", "cycles"],
      module: MODULE,
      risk: "safe",
      requiresAdmin: false,
      apply: async () => {
        const script =
          "$reportPath = Join-Path $env:TEMP 'bismuth-battery-report.xml'; " +
          'powercfg /batteryreport /output "$reportPath" | Out-Null; ' +
          '[xml]$r = Get-Content -Path "$reportPath"; ' +
          "$cap = $r.BatteryReport.Batteries.Battery.BatteryCapacity; " +
          "if (-not $cap) { $cap = $r.BatteryReport.Batteries.Battery.Capacity; }; " +
          "$d = $cap.DesignCapacity; $f = $cap.FullChargeCapacity; " +
          "if ($d -and $f) { $wear = [math]::Round(($d - $f) / $d * 100, 1); " +
          '"Design $d mWh | Full $f mWh | Wear $wear%" } ' +
          'else { "Report not available on this device" }; ' +
          'Remove-Item -Path "$reportPath" -Force -ErrorAction SilentlyContinue';

        const result = await exec(script, {
          module: MODULE,
          label: "Read battery capacity",
        });

        return {
          success: result.success,
          message: result.stdout.trim() || "Could not determine battery capacity.",
          stdout: result.stdout,
        };
      },
      revert: async () => ({ success: true, message: "Read-only check; nothing to revert." }),
    },
  ]);
}