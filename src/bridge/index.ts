import { invoke } from "@tauri-apps/api/core";

export interface ElevationStatus {
  is_elevated: boolean;
  process_arch: string;
}

export interface OsInfo {
  version: string;
  build: string;
  edition: string;
  arch: string;
  computer_name: string;
}

function inTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

/**
 * Checks whether the current process is running with Administrator privileges.
 * Called once on app launch and whenever a privileged action is attempted.
 */
export async function checkElevation(): Promise<ElevationStatus> {
  if (!inTauri()) {
    return { is_elevated: false, process_arch: "browser" };
  }
  return invoke<ElevationStatus>("is_elevated");
}

/**
 * Re-launches the application elevated via UAC (User Account Control).
 */
export async function requestElevation(): Promise<boolean> {
  if (!inTauri()) return false;
  return invoke<boolean>("elevate_self");
}

/**
 * Retrieves OS version and build information for display and feature gating.
 */
export async function getOsInfo(): Promise<OsInfo> {
  if (!inTauri()) {
    return {
      version: "Windows",
      build: "dev",
      edition: "Development (Browser)",
      arch: "browser",
      computer_name: "localhost",
    };
  }
  return invoke<OsInfo>("get_os_info");
}

/**
 * Executes a PowerShell command and returns stdout/stderr.
 */
export async function runPowerShell(
  command: string,
  elevated: boolean = false
): Promise<{ stdout: string; stderr: string; success: boolean }> {
  if (!inTauri()) {
    console.info(
      `[browser-mode] would run PowerShell${elevated ? " (elevated)" : ""}: ${command}`
    );
    return { stdout: "Browser mode: command not executed.", stderr: "", success: true };
  }
  return invoke<{ stdout: string; stderr: string; success: boolean }>(
    "run_powershell",
    { command, elevated }
  );
}

export async function accessRegistry(params: {
  hive: "HKLM" | "HKCU";
  path: string;
  name?: string;
  value?: string | number;
  kind?: "String" | "Dword" | "Qword";
  action: "read" | "write" | "delete";
}): Promise<{ success: boolean; value?: string; error?: string }> {
  if (!inTauri()) {
    return { success: true, value: undefined };
  }
  return invoke("access_registry", params);
}