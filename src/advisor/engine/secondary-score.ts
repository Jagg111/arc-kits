// ============================================================================
// FILE: src/advisor/engine/secondary-score.ts
// PURPOSE: Score how well a weapon complements a chosen primary weapon.
// This is not just "second best weapon"; it rewards coverage and diversity.
// ============================================================================

import { ADVISOR_PAIR_WEIGHTS } from "../../data/advisor_config";
import type { AdvisorComplementBreakdown, AdvisorInputs, Weapon } from "../../types";
import { clamp, pickRangeBand, roleDistance } from "./utils";

export function scoreSecondaryComplement(
  primary: Weapon,
  secondary: Weapon,
  secondaryBaseScore: number,
  _inputs: AdvisorInputs,
): AdvisorComplementBreakdown {
  // Ammo diversity matters: same-ammo pairs get a penalty.
  const ammoComplement = primary.ammoType === secondary.ammoType ? 0.2 : 1;

  // Prefer secondary weapons that cover a different distance band.
  const rangePrimary = pickRangeBand(primary.range);
  const rangeSecondary = pickRangeBand(secondary.range);
  let rangeComplement = 0.45;
  if (rangePrimary !== rangeSecondary) rangeComplement = 1;
  if ((rangePrimary === "close" && rangeSecondary === "long") || (rangePrimary === "long" && rangeSecondary === "close")) {
    rangeComplement = 0.95;
  }

  // Role distance is another diversity signal.
  const roleComplement = roleDistance(primary, secondary);

  // Weighted blend for final secondary complement score.
  const weightedTotal = clamp(
    secondaryBaseScore * ADVISOR_PAIR_WEIGHTS.baseSecondaryFit +
      ammoComplement * ADVISOR_PAIR_WEIGHTS.ammoComplement +
      rangeComplement * ADVISOR_PAIR_WEIGHTS.rangeComplement +
      roleComplement * ADVISOR_PAIR_WEIGHTS.roleComplement,
  );

  return {
    baseSecondaryFit: secondaryBaseScore,
    ammoComplement,
    rangeComplement,
    roleComplement,
    weightedTotal,
  };
}
