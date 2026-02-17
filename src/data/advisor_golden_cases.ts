// ============================================================================
// FILE: src/data/advisor_golden_cases.ts
// PURPOSE: Executable scenario matrix for harness validation.
// These scenarios act as regression checks while tuning scoring behavior.
// ============================================================================

import { ADVISOR_ALL_RARITIES } from "./advisor_config";
import type { AdvisorInputs, GoldenScenarioCase, Rarity } from "../types";

// Helper to define scenario inputs with sane defaults.
function baseInputs(overrides: Partial<AdvisorInputs>): AdvisorInputs {
  return {
    location: "spaceport",
    squad: "solo",
    focus: "mixed",
    preferredRange: "any",
    stealthImportant: false,
    allowedWeaponRarities: [...ADVISOR_ALL_RARITIES],
    debug: false,
    ...overrides,
  };
}

// Reusable filter sets across scenarios.
const COMMON_UNCOMMON_RARITIES: Rarity[] = ["Common", "Uncommon"];

// Main matrix used by the CLI harness.
export const ADVISOR_GOLDEN_CASES: GoldenScenarioCase[] = [
  {
    id: "S01",
    title: "Baseline Long-Range PVP",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
    }),
    requireDebug: false,
    expectedPrimaryPool: ["renegade", "osprey", "tempest"],
    expectedSecondaryPool: ["stitcher", "venator", "anvil", "vulcano"],
    exactExpectedPairKey: "renegade__anvil",
  },
  {
    id: "S02",
    title: "Indoor CQC PVP",
    inputs: baseInputs({
      location: "stella_montis",
      squad: "squad",
      focus: "pvp",
      preferredRange: "close",
    }),
    requireDebug: false,
    expectedPrimaryPool: ["bobcat", "vulcano", "stitcher", "anvil"],
    expectedSecondaryPool: ["renegade", "tempest", "venator", "ferro", "vulcano", "bobcat"],
  },
  {
    id: "S03",
    title: "ARC-Heavy Long-Range PvE",
    inputs: baseInputs({
      location: "blue_gate",
      squad: "solo",
      focus: "pve",
      preferredRange: "long",
    }),
    requireDebug: false,
    expectedPrimaryPool: ["equalizer", "jupiter", "aphelion", "hullcracker"],
    expectedSecondaryPool: ["anvil", "ferro", "tempest", "renegade"],
    exactExpectedPairKey: "jupiter__anvil",
  },
  {
    id: "S04",
    title: "Mixed Terrain Flexible Run",
    inputs: baseInputs({
      location: "dam",
      squad: "squad",
      focus: "mixed",
      preferredRange: "any",
    }),
    requireDebug: false,
    expectedPrimaryPool: ["tempest", "renegade", "rattler", "torrente"],
  },
  {
    id: "S05",
    title: "Common/Uncommon Economy Constraint",
    inputs: baseInputs({
      location: "buried_city",
      squad: "solo",
      focus: "mixed",
      preferredRange: "close",
      allowedWeaponRarities: COMMON_UNCOMMON_RARITIES,
    }),
    requireDebug: false,
    expectedPrimaryPool: ["stitcher", "anvil", "ferro", "iltoro"],
    expectedSecondaryPool: ["rattler", "burletta", "kettle", "iltoro"],
  },
  {
    id: "S06",
    title: "Stealth Required Wide Budget",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
      stealthImportant: true,
    }),
    requireDebug: false,
    expectedPrimaryPool: ["osprey", "renegade", "tempest", "arpeggio"],
    exactExpectedPairKey: "renegade__anvil",
  },
  {
    id: "S07",
    title: "Stealth + Legendary Only Empty",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
      stealthImportant: true,
      allowedWeaponRarities: ["Legendary"],
    }),
    requireDebug: false,
    expectEmpty: true,
  },
  {
    id: "S08",
    title: "Common/Uncommon Mid-Range Mixed",
    inputs: baseInputs({
      location: "dam",
      squad: "squad",
      focus: "mixed",
      preferredRange: "mid",
      allowedWeaponRarities: COMMON_UNCOMMON_RARITIES,
    }),
    requireDebug: false,
  },
  {
    id: "S09",
    title: "Uncommon Weapons Only",
    inputs: baseInputs({
      location: "buried_city",
      squad: "solo",
      focus: "mixed",
      preferredRange: "close",
      allowedWeaponRarities: ["Uncommon"],
    }),
    requireDebug: false,
    expectedPrimaryPool: ["anvil", "iltoro"],
  },
  {
    id: "S10",
    title: "No Slot Inclusion Legendary ARC",
    inputs: baseInputs({
      location: "blue_gate",
      squad: "squad",
      focus: "pve",
      preferredRange: "long",
      allowedWeaponRarities: ["Legendary"],
    }),
    requireDebug: false,
    exactExpectedPairKey: "jupiter__equalizer",
  },
  {
    id: "S11",
    title: "Tie Bucket Shuffle Cycle",
    inputs: baseInputs({
      location: "dam",
      squad: "squad",
      focus: "mixed",
      preferredRange: "any",
    }),
    requireDebug: false,
    requireTieCycling: true,
  },
  {
    id: "S12",
    title: "Stealth Exclusion Rules",
    inputs: baseInputs({
      location: "stella_montis",
      squad: "solo",
      focus: "mixed",
      preferredRange: "close",
      stealthImportant: true,
    }),
    requireDebug: false,
  },
  {
    id: "S13",
    title: "Same Ammo Penalty Check",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
    }),
    requireDebug: false,
  },
  {
    id: "S14",
    title: "URL Round Trip Shareability",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
    }),
    requireDebug: true,
    exactExpectedPairKey: "renegade__anvil",
    requireUrlRoundTrip: true,
  },
];

// Subset where top pair is intentionally locked as an exact expected key.
export const ADVISOR_CRITICAL_EXACT_CASE_IDS = new Set(["S01", "S03", "S06", "S07", "S10", "S14"]);
