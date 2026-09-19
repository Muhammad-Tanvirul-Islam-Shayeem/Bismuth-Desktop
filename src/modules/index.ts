import { registerPerformanceModule } from "./performance";
import { registerPowerModule } from "./power";
import { registerDisplayModule } from "./display";
import { registerUiCustomizationModule } from "./ui-customization";
import { registerSafetyModule } from "./safety";

let registered = false;

/**
 * Registers all module tweaks. Safe to call multiple times.
 */
export function registerAllModules(): void {
  if (registered) return;
  registered = true;

  registerPerformanceModule();
  registerPowerModule();
  registerDisplayModule();
  registerUiCustomizationModule();
  registerSafetyModule();
}