// ============================================================================
// FILE: src/data/advisor_golden_cases.ts
// PURPOSE: Executable scenario matrix for harness validation.
// These scenarios act as regression checks while tuning scoring behavior.
//
// HOW TO USE:
// - Run `node scripts/advisor/run-matrix.mjs` to validate all scenarios.
// - Anchor scenarios (G01, G03, G08) require exact top pair matches.
// - Flexible scenarios check pool membership and invariants only.
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
    allowedWeaponRarities: [...ADVISOR_ALL_RARITIES],
    ...overrides,
  };
}

// Reusable filter sets across scenarios.
const COMMON_UNCOMMON: Rarity[] = ["Common", "Uncommon"];

// Main matrix used by the CLI harness.
export const ADVISOR_GOLDEN_CASES: GoldenScenarioCase[] = [
  {
    id: "G01",
    title: "Spaceport, Solo, PvP, Long, All Rarities",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
    }),
    exactExpectedPairKey: "renegade__anvil",
    expectedPrimaryPool: ["renegade", "osprey", "tempest"],
    expectedSecondaryPool: ["anvil", "venator", "ferro", "vulcano"],
  },
  {
    id: "G02",
    title: "Stella Montis, Squad, PvP, Close, All Rarities",
    inputs: baseInputs({
      location: "stella_montis",
      squad: "squad",
      focus: "pvp",
      preferredRange: "close",
    }),
    expectedPrimaryPool: ["vulcano", "bobcat", "stitcher", "anvil"],
    expectedSecondaryPool: ["bobcat", "anvil", "venator", "tempest"],
  },
  {
    id: "G03",
    title: "Blue Gate, Solo, PvE, Long, All Rarities",
    inputs: baseInputs({
      location: "blue_gate",
      squad: "solo",
      focus: "pve",
      preferredRange: "long",
    }),
    // Equalizer and Jupiter tie at identical scores; both are ARC:S and
    // community-recommended for Blue Gate. Alphabetical tiebreak picks Equalizer.
    exactExpectedPairKey: "equalizer__ferro",
    expectedPrimaryPool: ["equalizer", "jupiter", "hullcracker", "aphelion"],
    expectedSecondaryPool: ["ferro", "anvil", "renegade", "tempest"],
  },
  {
    id: "G04",
    title: "Dam, Squad, Mixed, Any, All Rarities",
    inputs: baseInputs({
      location: "dam",
      squad: "squad",
      focus: "mixed",
      preferredRange: "any",
    }),
    // Renegade wins primary for Dam due to strong BR class fit + good grades.
    // Tempest is a close runner-up.
    expectedPrimaryPool: ["renegade", "tempest", "anvil"],
    expectedSecondaryPool: ["vulcano", "anvil", "ferro", "stitcher"],
  },
  {
    id: "G05",
    title: "Buried City, Solo, Mixed, Close, Common + Uncommon",
    inputs: baseInputs({
      location: "buried_city",
      squad: "solo",
      focus: "mixed",
      preferredRange: "close",
      allowedWeaponRarities: COMMON_UNCOMMON,
    }),
    expectedPrimaryPool: ["anvil", "stitcher", "ferro", "iltoro"],
    expectedSecondaryPool: ["iltoro", "stitcher", "ferro", "anvil"],
  },
  {
    id: "G06",
    title: "Dam, Squad, Mixed, Mid, Common + Uncommon",
    inputs: baseInputs({
      location: "dam",
      squad: "squad",
      focus: "mixed",
      preferredRange: "mid",
      allowedWeaponRarities: COMMON_UNCOMMON,
    }),
    expectedPrimaryPool: ["anvil", "ferro", "rattler"],
    expectedSecondaryPool: ["iltoro", "stitcher", "rattler"],
  },
  {
    id: "G07",
    title: "Buried City, Solo, Mixed, Close, Uncommon Only",
    inputs: baseInputs({
      location: "buried_city",
      squad: "solo",
      focus: "mixed",
      preferredRange: "close",
      allowedWeaponRarities: ["Uncommon"],
    }),
    expectedPrimaryPool: ["anvil", "iltoro"],
  },
  {
    id: "G08",
    title: "Blue Gate, Squad, PvE, Long, Legendaries Only",
    inputs: baseInputs({
      location: "blue_gate",
      squad: "squad",
      focus: "pve",
      preferredRange: "long",
      allowedWeaponRarities: ["Legendary"],
    }),
    // Equalizer and Jupiter tie at identical primary scores.
    // Alphabetical tiebreak makes equalizer the primary.
    exactExpectedPairKey: "equalizer__jupiter",
  },
  {
    id: "G09",
    title: "Spaceport, Solo, PvP, Long, Legendaries Only",
    inputs: baseInputs({
      location: "spaceport",
      squad: "solo",
      focus: "pvp",
      preferredRange: "long",
      allowedWeaponRarities: ["Legendary"],
    }),
    // Without stealth filter (V1), all 3 legendaries are available.
    // Aphelion has best PvP grade of the 3 legendaries (PvP:C vs F).
    // Results are mediocre but valid pairings.
    expectedPrimaryPool: ["aphelion", "jupiter", "equalizer"],
  },
  {
    id: "G10",
    title: "Stella Montis, Solo, PvP, Close, Common + Uncommon",
    inputs: baseInputs({
      location: "stella_montis",
      squad: "solo",
      focus: "pvp",
      preferredRange: "close",
      allowedWeaponRarities: COMMON_UNCOMMON,
    }),
    // Anvil dominates due to PvP:A grade even though HC is not ideal CQC class.
    expectedPrimaryPool: ["anvil", "stitcher", "iltoro"],
    expectedSecondaryPool: ["iltoro", "stitcher", "ferro", "anvil"],
  },
];

// Subset where top pair is intentionally locked as an exact expected key.
export const ADVISOR_CRITICAL_EXACT_CASE_IDS = new Set(["G01", "G03", "G08"]);
