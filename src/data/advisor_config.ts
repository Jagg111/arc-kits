// ============================================================================
// FILE: src/data/advisor_config.ts
// PURPOSE: Central config/constants for advisor scoring and parsing behavior.
// Keep tuning changes here so scoring modules remain mostly logic-only.
// ============================================================================

import type {
  AdvisorFocus,
  AdvisorInputs,
  AdvisorLocationId,
  AdvisorPreferredRange,
  AdvisorSquadMode,
  Rarity,
  WeaponClass,
} from "../types";

// Grade conversion requested in design docs.
export const ADVISOR_GRADE_TO_SCORE: Record<string, number> = {
  S: 1,
  A: 5 / 6,
  B: 4 / 6,
  C: 3 / 6,
  D: 2 / 6,
  F: 1 / 6,
};

// Weights for primary weapon scoring components.
export const ADVISOR_PRIMARY_WEIGHTS = {
  locationFit: 0.3,
  focusFit: 0.27,
  rangeFit: 0.23,
  soloSquadFit: 0.11,
  stealthPreferenceFit: 0.09,
} as const;

// Weights for pair scoring and complement sub-components.
export const ADVISOR_PAIR_WEIGHTS = {
  primaryWeight: 0.65,
  secondaryWeight: 0.35,
  baseSecondaryFit: 0.55,
  ammoComplement: 0.2,
  rangeComplement: 0.15,
  roleComplement: 0.1,
} as const;

// Tie score rounding precision and ranking expansion cap.
export const ADVISOR_TIE_PRECISION = 4;
export const ADVISOR_TOP_PRIMARY_CAP = 8;

export const ADVISOR_RARITY_RANK: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

// Canonical rarity set.
export const ADVISOR_ALL_RARITIES: Rarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

// Per-location heuristics for class/range/threat fit.
export interface AdvisorLocationProfile {
  classWeights: Partial<Record<WeaponClass, number>>;
  preferredRanges: Partial<Record<AdvisorPreferredRange, number>>;
  arcBias: number;
  pvpBias: number;
}

export const ADVISOR_LOCATION_PROFILES: Record<AdvisorLocationId, AdvisorLocationProfile> = {
  buried_city: {
    classWeights: { SMG: 1, SG: 1, Pistol: 0.9, HC: 0.9, AR: 0.7, BR: 0.55, SR: 0.25, Special: 0.45, LMG: 0.5 },
    preferredRanges: { close: 1, mid: 0.75, long: 0.25, any: 0.7 },
    arcBias: 0.55,
    pvpBias: 0.6,
  },
  spaceport: {
    classWeights: { SR: 1, BR: 0.92, AR: 0.85, LMG: 0.65, HC: 0.58, Pistol: 0.45, SMG: 0.42, SG: 0.2, Special: 0.7 },
    preferredRanges: { close: 0.3, mid: 0.75, long: 1, any: 0.7 },
    arcBias: 0.6,
    pvpBias: 0.65,
  },
  dam: {
    classWeights: { AR: 1, BR: 0.82, LMG: 0.76, SR: 0.72, HC: 0.7, SMG: 0.65, SG: 0.58, Pistol: 0.62, Special: 0.65 },
    preferredRanges: { close: 0.62, mid: 1, long: 0.68, any: 0.92 },
    arcBias: 0.62,
    pvpBias: 0.62,
  },
  blue_gate: {
    classWeights: { SR: 0.95, BR: 0.9, AR: 0.86, HC: 0.72, LMG: 0.68, Special: 0.8, SMG: 0.48, SG: 0.35, Pistol: 0.52 },
    preferredRanges: { close: 0.45, mid: 0.75, long: 1, any: 0.8 },
    arcBias: 0.82,
    pvpBias: 0.58,
  },
  stella_montis: {
    classWeights: { SMG: 1, SG: 0.98, HC: 0.88, Pistol: 0.8, AR: 0.74, BR: 0.58, LMG: 0.52, SR: 0.22, Special: 0.48 },
    preferredRanges: { close: 1, mid: 0.72, long: 0.2, any: 0.68 },
    arcBias: 0.72,
    pvpBias: 0.88,
  },
};

// Numeric range windows used by preferred range fit.
export const ADVISOR_RANGE_TARGETS: Record<AdvisorPreferredRange, { min: number; max: number }> = {
  close: { min: 0, max: 38 },
  mid: { min: 35, max: 62 },
  long: { min: 58, max: 100 },
  any: { min: 0, max: 100 },
};

// How focus mode blends pvp/arc grade.
export const ADVISOR_FOCUS_BLEND: Record<AdvisorFocus, { pvp: number; arc: number }> = {
  pve: { pvp: 0.2, arc: 0.8 },
  pvp: { pvp: 0.8, arc: 0.2 },
  mixed: { pvp: 0.5, arc: 0.5 },
};

// Optional class-level role baseline.
export const ADVISOR_CLASS_ROLE_SCORE: Record<WeaponClass, number> = {
  AR: 0.8,
  BR: 0.82,
  SMG: 0.72,
  SG: 0.63,
  Pistol: 0.6,
  HC: 0.72,
  LMG: 0.62,
  SR: 0.7,
  Special: 0.64,
};

// Default advisor input state.
export const ADVISOR_DEFAULT_INPUTS: AdvisorInputs = {
  location: "spaceport",
  squad: "solo",
  focus: "mixed",
  preferredRange: "any",
  stealthImportant: false,
  allowedWeaponRarities: [...ADVISOR_ALL_RARITIES],
  debug: false,
};

// Enum sets used by URL parser validation.
export const ADVISOR_INPUT_ENUMS = {
  locations: ["buried_city", "spaceport", "dam", "blue_gate", "stella_montis"] as AdvisorLocationId[],
  squadModes: ["solo", "squad"] as AdvisorSquadMode[],
  focuses: ["pve", "pvp", "mixed"] as AdvisorFocus[],
  ranges: ["close", "mid", "long", "any"] as AdvisorPreferredRange[],
};
