// ============================================================================
// FILE: src/data/advisor_config.ts
// PURPOSE: Main calibration surface for weapon advisor behavior.
// All tunable values live here so engine modules stay logic-only.
//
// HOW TO TUNE:
// 1. Change a value below (each has a plain-English comment and safe range).
// 2. Run `node scripts/advisor/run-matrix.mjs` to see how golden cases shift.
// 3. If an anchor scenario breaks, decide whether the new behavior is better
//    and update the golden case, or revert the config change.
//
// IMPORTANT:
// - Changing values in this file can change top pairs and golden-case outcomes.
// - Use this file to tune behavior intentionally, then verify with the matrix.
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


// ── Display Labels ──
// Human-readable labels for advisor filter pills. Keyed by type-safe enum values.
// Iterate via ADVISOR_INPUT_ENUMS arrays below, look up display text here.

export const ADVISOR_LOCATION_LABELS: Record<AdvisorLocationId, string> = {
  buried_city: "Buried City",
  spaceport: "Spaceport",
  dam: "Dam",
  blue_gate: "Blue Gate",
  stella_montis: "Stella M.",
};

export const ADVISOR_SQUAD_LABELS: Record<AdvisorSquadMode, string> = {
  solo: "Solo",
  squad: "Squad",
};

export const ADVISOR_FOCUS_LABELS: Record<AdvisorFocus, string> = {
  pve: "PVE",
  pvp: "PVP",
  mixed: "Mixed",
};

export const ADVISOR_RANGE_LABELS: Record<AdvisorPreferredRange, string> = {
  close: "Close",
  mid: "Mid",
  long: "Long",
  any: "Any",
};

export const ADVISOR_RARITY_SHORT: Record<Rarity, string> = {
  Common: "C",
  Uncommon: "U",
  Rare: "R",
  Epic: "E",
  Legendary: "L",
};


// ── Grade Normalization ──
// Converts letter grades (S/A/B/C/D/F) to 0-1 scores for math.
// Wider gaps between grades = rankings more sensitive to grade differences.
// Narrower gaps = more ties, more weapons compete for the same slots.
export const ADVISOR_GRADE_TO_SCORE: Record<string, number> = {
  S: 1,
  A: 5 / 6,
  B: 4 / 6,
  C: 3 / 6,
  D: 2 / 6,
  F: 1 / 6,
};


// ── Primary Scoring Weights ──
// These control how much each factor matters when ranking a weapon as a
// potential primary. They must sum to 1.0.

// How much the map/location matters vs other factors.
// Higher = recommendations shift MORE between locations.
// Lower = same weapons show up everywhere.
// Safe range: 0.20 – 0.40
export const WEIGHT_MAP_FIT = 0.30;

// How much PvE vs PvP focus matters (actual combat grades).
// This is the most important factor — a PvP:A weapon should beat a PvP:C
// weapon even if the PvP:C weapon is the "right class" for the map.
// Higher = PvE and PvP give very different results.
// Lower = focus selection has subtle effect.
// Safe range: 0.35 – 0.55
export const WEIGHT_ROLE_FIT = 0.45;

// How much range preference matters.
// Higher = "close" and "long" give dramatically different results.
// Lower = range is a light nudge.
// Safe range: 0.15 – 0.30
export const WEIGHT_RANGE_FIT = 0.25;


// ── Pair Scoring Weights ──
// Controls how the final pair score blends primary quality vs secondary complement.

// How much the primary weapon's individual score matters in the pair.
// Higher = "best single weapon" dominates pair ranking.
// Lower = complement synergy has more influence on which pair wins.
// Safe range: 0.50 – 0.70
export const WEIGHT_PAIR_PRIMARY = 0.60;

// How much the secondary complement score matters in the pair.
// This is automatically 1 - WEIGHT_PAIR_PRIMARY.
export const WEIGHT_PAIR_COMPLEMENT = 1 - WEIGHT_PAIR_PRIMARY;


// ── Secondary Complement Weights ──
// Controls how the secondary weapon's complement score is computed.
// These must sum to 1.0.

// How much the secondary's standalone quality matters (its own primary score).
// Higher = secondary must also be a strong weapon on its own.
// Lower = a mediocre weapon that complements well can still win.
// Safe range: 0.40 – 0.60
export const WEIGHT_QUALITY_FLOOR = 0.50;

// How much ammo type diversity matters.
// Higher = same-ammo pairs are strongly penalized.
// Lower = same-ammo pairs are more acceptable.
// Safe range: 0.15 – 0.35
export const WEIGHT_AMMO_DIVERSITY = 0.25;

// How much range band diversity matters.
// Higher = pairs that cover different ranges are strongly preferred.
// Lower = range overlap is more acceptable.
// Safe range: 0.15 – 0.35
export const WEIGHT_RANGE_DIVERSITY = 0.25;


// ── Squad Mode Bonus ──
// Extra pair score when squad members specialize into different range bands.
// Only applies in squad mode (solo gets no bonus).
// Higher = squad mode produces more specialized pairings.
// Lower = squad and solo produce similar results.
// Safe range: 0.03 – 0.08
export const SQUAD_RANGE_BONUS = 0.05;


// ── Tier & Output Thresholds ──

// Score gap threshold for showing a 3rd result card.
// If the 3rd-ranked pair scores within this gap of the top pair, it's shown.
// Higher = more likely to show 3 results (looser quality bar).
// Lower = 3rd result must be very close to top to appear.
// Safe range: 0.04 – 0.10
export const TOP_GAP = 0.06;


// ── Location Class Tiers ──
// Which weapon classes perform well on each map?
// 'strong' = naturally fits this map (score: 1.0)
// 'okay'   = usable but not ideal (score: 0.7)
// 'weak'   = poor fit for this map (score: 0.4)
//
// To adjust: move a weapon class between tiers and re-run the matrix harness.
// Seeded from community meta analysis, reviewed by PM.
export const LOCATION_CLASS_TIERS: Record<AdvisorLocationId, {
  strong: WeaponClass[];
  okay: WeaponClass[];
  weak: WeaponClass[];
}> = {
  // Buried City: Tight spaces and packed buildings favor CQC weapons.
  buried_city: {
    strong: ["SMG", "SG", "Pistol", "HC"],
    okay: ["AR", "BR", "LMG"],
    weak: ["SR", "Special"],
  },
  // Spaceport: Long sightlines reward precision rifles and mid-to-long range.
  spaceport: {
    strong: ["SR", "BR", "AR"],
    okay: ["LMG", "HC", "Special"],
    weak: ["SMG", "SG", "Pistol"],
  },
  // Dam: Mixed lanes, mid-range is king, all-round weapons thrive.
  dam: {
    strong: ["AR", "BR", "LMG"],
    okay: ["SR", "HC", "SMG", "Pistol", "Special"],
    weak: ["SG"],
  },
  // Blue Gate: Open terrain, high ARC threat, long-range and ARC weapons shine.
  blue_gate: {
    strong: ["SR", "BR", "AR", "Special"],
    okay: ["HC", "LMG"],
    weak: ["SMG", "SG", "Pistol"],
  },
  // Stella Montis: Dense close-quarters chaos, aggressive short-range classes.
  stella_montis: {
    strong: ["SMG", "SG", "HC", "Pistol"],
    okay: ["AR"],
    weak: ["BR", "LMG", "SR", "Special"],
  },
};

// Score values for each tier (used by scoreMapFit).
export const LOCATION_TIER_SCORES = {
  strong: 1.0,
  okay: 0.7,
  weak: 0.4,
} as const;


// ── Max Primary Candidates ──
// How many top-scoring primary weapons to consider when generating pairs.
// Higher = broader search, potentially better pairs but more compute.
// Lower = tighter/faster search, may miss strong secondary synergies.
// Safe range: 6 – 12
export const ADVISOR_TOP_PRIMARY_CAP = 8;


// ── Ammo Diversity Scores ──
// Used in secondary complement scoring.
// Different ammo type between primary and secondary = good (ammo split).
// Same ammo type = penalized (both drain same pool).
export const AMMO_DIVERSITY_DIFFERENT = 1.0;
export const AMMO_DIVERSITY_SAME = 0.2;


// ── Range Diversity Scores ──
// Used in secondary complement scoring.
// Different range band = best (covers different engagement distances).
// Adjacent bands (e.g., close+mid) = decent.
// Same band = worst (redundant range coverage).
export const RANGE_DIVERSITY_DIFFERENT = 1.0;
export const RANGE_DIVERSITY_ADJACENT = 0.65;
export const RANGE_DIVERSITY_SAME = 0.3;


// ── Kept from previous config (still needed by engine) ──

// Rarity ordering for deterministic rarity progression.
export const ADVISOR_RARITY_RANK: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

// Canonical rarity list used by defaults and filter parsing.
export const ADVISOR_ALL_RARITIES: Rarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

// Numeric range windows used by preferred-range scoring.
// Windows intentionally overlap to avoid hard cliffs between close/mid/long.
// Widen a window = more weapons count as "good enough" for that range.
// Narrow a window = sharper specialization, fewer weapons qualify.
export const ADVISOR_RANGE_TARGETS: Record<AdvisorPreferredRange, { min: number; max: number }> = {
  close: { min: 0, max: 38 },
  mid: { min: 35, max: 62 },
  long: { min: 58, max: 100 },
  any: { min: 0, max: 100 },
};

// How focus choice blends PvP grade and ARC grade.
// Higher pvp share = focus leans harder into PvP performance.
// Higher arc share = focus leans harder into ARC performance.
export const ADVISOR_FOCUS_BLEND: Record<AdvisorFocus, { pvp: number; arc: number }> = {
  pve: { pvp: 0.2, arc: 0.8 },
  pvp: { pvp: 0.8, arc: 0.2 },
  mixed: { pvp: 0.5, arc: 0.5 },
};

// Default advisor form state (V1: no location selected = idle state).
export const ADVISOR_DEFAULT_INPUTS: AdvisorInputs = {
  location: "spaceport",
  squad: "solo",
  focus: "mixed",
  preferredRange: "any",
  allowedWeaponRarities: [...ADVISOR_ALL_RARITIES],
};

// Enum allowlists used by URL parser and input normalization.
export const ADVISOR_INPUT_ENUMS = {
  locations: ["buried_city", "spaceport", "dam", "blue_gate", "stella_montis"] as AdvisorLocationId[],
  squadModes: ["solo", "squad"] as AdvisorSquadMode[],
  focuses: ["pve", "pvp", "mixed"] as AdvisorFocus[],
  ranges: ["close", "mid", "long", "any"] as AdvisorPreferredRange[],
};
