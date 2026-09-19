import type { ModuleId, RiskLevel } from "@/types";
import type { PSResult } from "./execution";
import { exec } from "./execution";

export interface TweakContext {
  module: ModuleId;
  elevated: boolean;
}

export interface TweakResult {
  success: boolean;
  message: string;
  stdout?: string;
  stderr?: string;
}

export interface TweakDefinition {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  module: ModuleId;
  risk: RiskLevel;
  requiresAdmin?: boolean;
  /** Called when the user clicks "Apply" */
  apply: (ctx: TweakContext) => Promise<TweakResult>;
  /** Called when the user clicks "Revert" */
  revert: (ctx: TweakContext) => Promise<TweakResult>;
}

/**
 * Runs a PowerShell command and normalizes the result into a TweakResult.
 */
async function runTweakPS(
  command: string,
  opts: { module: ModuleId; elevated?: boolean; label: string }
): Promise<TweakResult> {
  const result: PSResult = await exec(command, {
    module: opts.module,
    elevated: opts.elevated ?? false,
    label: opts.label,
  });

  return {
    success: result.success,
    message: result.success
      ? `${opts.label}: completed`
      : `${opts.label}: ${result.stderr || "unknown error"}`,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

export { runTweakPS };

const registry = new Map<string, TweakDefinition>();

export function registerTweak(tweak: TweakDefinition): void {
  registry.set(tweak.id, tweak);
}

export function registerTweaks(tweaks: TweakDefinition[]): void {
  tweaks.forEach(registerTweak);
}

export function getTweak(id: string): TweakDefinition | undefined {
  return registry.get(id);
}

export function getTweaksByModule(module: ModuleId): TweakDefinition[] {
  return Array.from(registry.values()).filter((t) => t.module === module);
}

export function getAllTweaks(): TweakDefinition[] {
  return Array.from(registry.values());
}