// ============================================================================
// FILE: src/advisor/engine/primary-score.ts
// PURPOSE: Compute the "standalone" score for a weapon as primary.
// Each component is a normalized [0..1] score, then weighted into one total.
// ============================================================================

import {
  ADVISOR_FOCUS_BLEND,
  ADVISOR_LOCATION_PROFILES,
  ADVISOR_PRIMARY_WEIGHTS,
} from "../../data/advisor_config";
import type { AdvisorInputs, AdvisorScoreBreakdown, Weapon } from "../../types";
import { clamp, gradeToScore, rangeFitFromNumeric } from "./utils";

// How well the weapon fits the chosen map profile.
function scoreLocationFit(weapon: Weapon, inputs: AdvisorInputs): number {
  const profile = ADVISOR_LOCATION_PROFILES[inputs.location];
  const classFit = profile.classWeights[weapon.weaponClass] ?? 0.55;
  const preferredRangeFit = profile.preferredRanges[inputs.preferredRange] ?? 0.65;
  const locationThreatBlend =
    profile.arcBias * gradeToScore(weapon.arc) * 0.55 +
    profile.pvpBias * gradeToScore(weapon.pvp) * 0.45;
  return clamp(classFit * 0.5 + preferredRangeFit * 0.15 + locationThreatBlend * 0.35);
}

// Blend PVP/ARC grades based on focus (pvp, pve, mixed).
function scoreFocusFit(weapon: Weapon, inputs: AdvisorInputs): number {
  const blend = ADVISOR_FOCUS_BLEND[inputs.focus];
  return clamp(gradeToScore(weapon.pvp) * blend.pvp + gradeToScore(weapon.arc) * blend.arc);
}

// Light heuristic for solo vs squad fit.
function scoreSoloSquadFit(weapon: Weapon, inputs: AdvisorInputs): number {
  if (inputs.squad === "solo") {
    if (weapon.weaponClass === "LMG") return 0.45;
    if (weapon.weaponClass === "Special" && weapon.ammoType === "Special") return 0.5;
    if (weapon.weaponClass === "SMG" || weapon.weaponClass === "AR" || weapon.weaponClass === "Pistol") return 0.9;
    return 0.72;
  }

  if (weapon.weaponClass === "LMG") return 0.88;
  if (weapon.weaponClass === "Special" && weapon.ammoType === "Special") return 0.8;
  return 0.74;
}

// When stealth is a hard filter, this component becomes neutral.
// Otherwise it slightly favors naturally quiet/stealth-flavored descriptions.
function scoreStealthPreferenceFit(weapon: Weapon, inputs: AdvisorInputs): number {
  if (inputs.stealthImportant) return 1;
  const hasNaturalStealthProfile = /silencer|quiet|stealth/i.test(weapon.desc);
  return hasNaturalStealthProfile ? 0.78 : 0.55;
}

// Public scorer used by the pair-ranking stage.
export function scorePrimary(weapon: Weapon, inputs: AdvisorInputs): AdvisorScoreBreakdown {
  const locationFit = scoreLocationFit(weapon, inputs);
  const focusFit = scoreFocusFit(weapon, inputs);
  const rangeFit = rangeFitFromNumeric(weapon.range, inputs.preferredRange);
  const soloSquadFit = scoreSoloSquadFit(weapon, inputs);
  const stealthPreferenceFit = scoreStealthPreferenceFit(weapon, inputs);

  const weightedTotal = clamp(
    locationFit * ADVISOR_PRIMARY_WEIGHTS.locationFit +
      focusFit * ADVISOR_PRIMARY_WEIGHTS.focusFit +
      rangeFit * ADVISOR_PRIMARY_WEIGHTS.rangeFit +
      soloSquadFit * ADVISOR_PRIMARY_WEIGHTS.soloSquadFit +
      stealthPreferenceFit * ADVISOR_PRIMARY_WEIGHTS.stealthPreferenceFit,
  );

  return {
    locationFit,
    focusFit,
    rangeFit,
    soloSquadFit,
    stealthPreferenceFit,
    weightedTotal,
  };
}
