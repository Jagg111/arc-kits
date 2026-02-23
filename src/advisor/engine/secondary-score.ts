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
import { clamp, pickRangeBand } from "./utils";

export function scoreSecondaryComplement(
  primary: Weapon,
  secondary: Weapon,
  secondaryBaseScore: number,
): AdvisorComplementBreakdown {
  // Ammo diversity: different ammo type = good, same = penalized.
  const ammoDiversity = primary.ammoType === secondary.ammoType
    ? AMMO_DIVERSITY_SAME
    : AMMO_DIVERSITY_DIFFERENT;

  // Range diversity: different bands = best, adjacent = decent, same = worst.
  const rangePrimary = pickRangeBand(primary.range);
  const rangeSecondary = pickRangeBand(secondary.range);
  let rangeDiversity: number;
  if (rangePrimary === rangeSecondary) {
    rangeDiversity = RANGE_DIVERSITY_SAME;
  } else if (
    (rangePrimary === "close" && rangeSecondary === "long") ||
    (rangePrimary === "long" && rangeSecondary === "close")
  ) {
    // Maximum spread (close↔long) — best possible range coverage
    rangeDiversity = RANGE_DIVERSITY_DIFFERENT;
  } else {
    // Adjacent bands (close↔mid or mid↔long) — decent but not max coverage
    rangeDiversity = RANGE_DIVERSITY_ADJACENT;
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
