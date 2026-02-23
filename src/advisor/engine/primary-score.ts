// ============================================================================
// FILE: src/advisor/engine/primary-score.ts
// PURPOSE: Compute the "standalone" score for a weapon as primary.
// 3 components (mapFit, roleFit, rangeFit), each normalized [0..1], then
// weighted into one total.
// ============================================================================

import {
  ADVISOR_FOCUS_BLEND,
  LOCATION_CLASS_TIERS,
  LOCATION_TIER_SCORES,
  WEIGHT_MAP_FIT,
  WEIGHT_ROLE_FIT,
  WEIGHT_RANGE_FIT,
} from "../../data/advisor_config";
import type { AdvisorInputs, AdvisorScoreBreakdown, Weapon } from "../../types";
import { clamp, gradeToScore, rangeFitFromNumeric } from "./utils";

// How well the weapon's class fits the chosen map.
// Uses 3-tier bucketing: strong/okay/weak per location.
function scoreMapFit(weapon: Weapon, inputs: AdvisorInputs): number {
  const tiers = LOCATION_CLASS_TIERS[inputs.location];
  if (tiers.strong.includes(weapon.weaponClass)) return LOCATION_TIER_SCORES.strong;
  if (tiers.okay.includes(weapon.weaponClass)) return LOCATION_TIER_SCORES.okay;
  return LOCATION_TIER_SCORES.weak;
}

// Blend PVP/ARC grades based on focus (pvp, pve, mixed).
// Reuses the proven scoreFocusFit logic from the previous engine.
function scoreRoleFit(weapon: Weapon, inputs: AdvisorInputs): number {
  const blend = ADVISOR_FOCUS_BLEND[inputs.focus];
  return clamp(gradeToScore(weapon.pvp) * blend.pvp + gradeToScore(weapon.arc) * blend.arc);
}

// Public scorer used by the pair-ranking stage.
export function scorePrimary(weapon: Weapon, inputs: AdvisorInputs): AdvisorScoreBreakdown {
  const mapFit = scoreMapFit(weapon, inputs);
  const roleFit = scoreRoleFit(weapon, inputs);
  const rangeFit = rangeFitFromNumeric(weapon.range, inputs.preferredRange);

  const weightedTotal = clamp(
    mapFit * WEIGHT_MAP_FIT +
    roleFit * WEIGHT_ROLE_FIT +
    rangeFit * WEIGHT_RANGE_FIT,
  );

  return { mapFit, roleFit, rangeFit, weightedTotal };
}
