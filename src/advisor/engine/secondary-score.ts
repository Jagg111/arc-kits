// ============================================================================
// FILE: src/advisor/engine/secondary-score.ts
// PURPOSE: Score how well a weapon complements a chosen primary weapon.
// 3 components: qualityFloor (standalone quality), ammoDiversity, rangeDiversity.
// ============================================================================

import {
  AMMO_DIVERSITY_DIFFERENT,
  AMMO_DIVERSITY_SAME,
  RANGE_DIVERSITY_ADJACENT,
  RANGE_DIVERSITY_DIFFERENT,
  RANGE_DIVERSITY_SAME,
  WEIGHT_AMMO_DIVERSITY,
  WEIGHT_QUALITY_FLOOR,
  WEIGHT_RANGE_DIVERSITY,
} from "../../data/advisor_config";
import type { AdvisorComplementBreakdown, Weapon } from "../../types";
import { bandDistance, clamp } from "./utils";

export function scoreSecondaryComplement(
  primary: Weapon,
  secondary: Weapon,
  secondaryBaseScore: number,
): AdvisorComplementBreakdown {
  // Ammo diversity: different ammo type = good, same = penalized.
  const ammoDiversity = primary.ammoType === secondary.ammoType
    ? AMMO_DIVERSITY_SAME
    : AMMO_DIVERSITY_DIFFERENT;

  // Range diversity: use minimum band distance between the two weapons' range sets.
  const dist = bandDistance(primary.rangeBands, secondary.rangeBands);
  let rangeDiversity: number;
  if (dist === 0) {
    rangeDiversity = RANGE_DIVERSITY_SAME;      // shared band
  } else if (dist === 2) {
    rangeDiversity = RANGE_DIVERSITY_DIFFERENT; // close↔long max spread
  } else {
    rangeDiversity = RANGE_DIVERSITY_ADJACENT;  // adjacent bands
  }

  // Weighted blend for final secondary complement score.
  const weightedTotal = clamp(
    secondaryBaseScore * WEIGHT_QUALITY_FLOOR +
    ammoDiversity * WEIGHT_AMMO_DIVERSITY +
    rangeDiversity * WEIGHT_RANGE_DIVERSITY,
  );

  return {
    qualityFloor: secondaryBaseScore,
    ammoDiversity,
    rangeDiversity,
    weightedTotal,
  };
}
