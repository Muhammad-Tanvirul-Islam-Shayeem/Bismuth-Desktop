import { runPowerShell } from "@/bridge";
import { useConsoleStore } from "@/stores";

export interface PSResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

/**
 * Executes a PowerShell command through the Rust bridge and
 * logs the outcome to the live activity console.
 */
export async function exec(
  command: string,
  opts: { elevated?: boolean; module?: string; label?: string } = {}
): Promise<PSResult> {
  const addLog = useConsoleStore.getState().addLog;

  addLog("info", `${opts.label ?? "Executing"}: ${command}`, opts.module);

  try {
    const result = await runPowerShell(command, opts.elevated ?? false);

    if (result.stdout.trim()) {
      addLog("info", result.stdout.trim(), opts.module);
    }
    if (result.stderr.trim()) {
      addLog("warn", result.stderr.trim(), opts.module);
    }
    if (result.success) {
      addLog("success", `${opts.label ?? "Command"} completed`, opts.module);
    } else {
      addLog("error", `${opts.label ?? "Command"} failed`, opts.module);
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    addLog("error", message, opts.module);
    return { stdout: "", stderr: message, success: false };
  }
}

/**
 * Reads a registry value, capturing its original state for later revert.
 */
export async function readRegistry(
  hive: "HKLM" | "HKCU",
  path: string,
  name: string,
  _module: string
): Promise<string | null> {
  const result = await runPowerShell(
    `Get-ItemProperty -Path '${hive}:\\${path}' -Name '${name}' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty '${name}'`,
    false
  );
  if (!result.success) return null;
  const trimmed = result.stdout.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Creates a System Restore Point. Requires admin.
 */
export async function createRestorePoint(description: string): Promise<boolean> {
  const result = await runPowerShell(
    `Checkpoint-Computer -Description '${description.replace(
      /'/g,
      "''"
    )}' -RestorePointType MODIFY_SETTINGS -ErrorAction SilentlyContinue`,
    true
  );
  return result.success;
}