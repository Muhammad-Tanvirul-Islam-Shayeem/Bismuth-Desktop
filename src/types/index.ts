export type RiskLevel = "safe" | "caution" | "advanced";

export interface Tweak {
  id: string;
  name: string;
  description: string;
  risk: RiskLevel;
  module: ModuleId;
  current?: boolean;
}

export type ModuleId =
  | "performance"
  | "power"
  | "display"
  | "ui-customization"
  | "safety";

export interface TweakCategory {
  id: string;
  label: string;
  module: ModuleId;
  risk: RiskLevel;
}

export interface ThemeColors {
  "--bg-primary": string;
  "--bg-surface": string;
  "--bg-surface-hover": string;
  "--border-default": string;
  "--border-focus": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--text-muted": string;
  "--accent-primary": string;
  "--accent-hover": string;
}

export interface Theme {
  id: string;
  name: string;
  dark: boolean;
  colors: ThemeColors;
}

export interface PowerPlan {
  name: string;
  guid: string;
  active: boolean;
}

export interface RestorePoint {
  id: string;
  description: string;
  timestamp: string;
}