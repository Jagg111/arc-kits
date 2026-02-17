// ============================================================================
// FILE: src/advisor/engine/filters.ts
// PURPOSE: Input normalization + hard constraint filtering.
// HARD CONSTRAINTS here are strict pass/fail rules, not soft scoring.
// ============================================================================

import { ADVISOR_DEFAULT_INPUTS } from "../../data/advisor_config";
import type { AdvisorEmptyState, AdvisorInputs, Weapon } from "../../types";
import type { WeaponFeatures } from "./feature-map";

// Fill missing fields with defaults and dedupe array inputs.
// Important: an explicitly empty array should stay empty (hard constraint).
export function normalizeInputs(input: Partial<AdvisorInputs>): AdvisorInputs {
  return {
    location: input.location ?? ADVISOR_DEFAULT_INPUTS.location,
    squad: input.squad ?? ADVISOR_DEFAULT_INPUTS.squad,
    focus: input.focus ?? ADVISOR_DEFAULT_INPUTS.focus,
    preferredRange: input.preferredRange ?? ADVISOR_DEFAULT_INPUTS.preferredRange,
    stealthImportant: input.stealthImportant ?? ADVISOR_DEFAULT_INPUTS.stealthImportant,
    allowedWeaponRarities:
      input.allowedWeaponRarities !== undefined
        ? [...new Set(input.allowedWeaponRarities)]
        : [...ADVISOR_DEFAULT_INPUTS.allowedWeaponRarities],
    debug: input.debug ?? ADVISOR_DEFAULT_INPUTS.debug,
  };
}

// Returns true only if weapon satisfies all strict filter rules.
export function passWeaponHardConstraints(weapon: Weapon, features: WeaponFeatures, inputs: AdvisorInputs): boolean {
  if (!inputs.allowedWeaponRarities.includes(weapon.rarity)) return false;
  if (inputs.stealthImportant && !features.stealthEligible) return false;
  return true;
}

// Apply hard constraints to all feature rows.
export function filterCandidateFeatures(
  featureMap: Record<string, WeaponFeatures>,
  inputs: AdvisorInputs,
): WeaponFeatures[] {
  const candidates: WeaponFeatures[] = [];
  for (const feature of Object.values(featureMap)) {
    if (passWeaponHardConstraints(feature.weapon, feature, inputs)) {
      candidates.push(feature);
    }
  }
  return candidates;
}

// Shared empty-state payload when fewer than 2 candidate weapons survive filtering.
export function buildInsufficientWeaponsEmptyState(): AdvisorEmptyState {
  return {
    code: "INSUFFICIENT_VALID_WEAPONS",
    message: "Not enough valid weapons match your current filters to build a primary + secondary recommendation.",
  };
}

// Shared empty-state payload when candidates exist but no valid pairs are produced.
export function buildNoPairsEmptyState(): AdvisorEmptyState {
  return {
    code: "NO_VALID_PAIRS",
    message: "Valid weapons were found, but no complementary weapon pairs could be produced.",
  };
}
