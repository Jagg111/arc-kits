// ============================================================================
// FILE: src/advisor/engine/pair-ranker.ts
// PURPOSE: Turn scored weapon candidates into ranked primary+secondary pairs.
// Also attaches human-readable reasons and optional debug breakdown details.
// ============================================================================

import { ADVISOR_PAIR_WEIGHTS, ADVISOR_TOP_PRIMARY_CAP } from "../../data/advisor_config";
import type {
  AdvisorInputs,
  AdvisorScoreBreakdown,
  PairRecommendation,
  Weapon,
} from "../../types";
import { scoreSecondaryComplement } from "./secondary-score";
import { clamp, pairKey, pickRangeBand, roundTo } from "./utils";

export interface ScoredWeaponCandidate {
  weapon: Weapon;
  primaryScore: number;
  primaryBreakdown: AdvisorScoreBreakdown;
}

interface WorkingPair {
  pairKey: string;
  primary: ScoredWeaponCandidate;
  secondary: ScoredWeaponCandidate;
  secondaryScore: number;
  pairScore: number;
  reasons: string[];
  complementBreakdown: ReturnType<typeof scoreSecondaryComplement>;
}

// Build short explanation text for UI cards.
function buildReasons(
  primary: ScoredWeaponCandidate,
  secondary: ScoredWeaponCandidate,
  inputs: AdvisorInputs,
): string[] {
  const rangeText = inputs.preferredRange === "any" ? "mixed ranges" : `${inputs.preferredRange}-range fights`;
  const primaryReason = `${primary.weapon.name} is the best primary fit for ${inputs.location.replace("_", " ")} and ${rangeText}.`;
  const ammoNote =
    primary.weapon.ammoType === secondary.weapon.ammoType
      ? "shares ammo reserves with your primary."
      : "covers you with a different ammo type.";
  const bandPrimary = pickRangeBand(primary.weapon.range);
  const bandSecondary = pickRangeBand(secondary.weapon.range);
  const rangeNote =
    bandPrimary === bandSecondary
      ? `${secondary.weapon.name} reinforces the same fight profile and ${ammoNote}`
      : `${secondary.weapon.name} complements your ${bandPrimary} primary with ${bandSecondary} coverage and ${ammoNote}`;

  return [primaryReason, rangeNote];
}

// Main pair builder:
// 1) sort primary candidates
// 2) expand ordered pairs (primary != secondary)
// 3) score + sort deterministically
export function rankPairCandidates(
  candidates: ScoredWeaponCandidate[],
  inputs: AdvisorInputs,
  includeDebug: boolean,
): PairRecommendation[] {
  // Keep deterministic ordering for same-score candidates.
  const sortedPrimary = [...candidates].sort((a, b) => {
    if (b.primaryScore !== a.primaryScore) return b.primaryScore - a.primaryScore;
    return a.weapon.id.localeCompare(b.weapon.id);
  });

  const primaryPool = sortedPrimary.slice(0, Math.min(ADVISOR_TOP_PRIMARY_CAP, sortedPrimary.length));
  const allPairs: WorkingPair[] = [];

  // Ordered pairs are intentional:
  // A->B is different from B->A because primary role is different.
  for (const primary of primaryPool) {
    for (const secondary of candidates) {
      if (secondary.weapon.id === primary.weapon.id) continue;
      const complementBreakdown = scoreSecondaryComplement(
        primary.weapon,
        secondary.weapon,
        secondary.primaryScore,
        inputs,
      );

      const secondaryScore = complementBreakdown.weightedTotal;
      // Final pair score prioritizes primary fit over secondary complement.
      const pairScore = clamp(
        primary.primaryScore * ADVISOR_PAIR_WEIGHTS.primaryWeight +
          secondaryScore * ADVISOR_PAIR_WEIGHTS.secondaryWeight,
      );

      allPairs.push({
        pairKey: pairKey(primary.weapon.id, secondary.weapon.id),
        primary,
        secondary,
        secondaryScore,
        pairScore,
        reasons: buildReasons(primary, secondary, inputs),
        complementBreakdown,
      });
    }
  }

  // Deterministic final sort order:
  // pair score, then primary score, then secondary score, then lexical key.
  allPairs.sort((a, b) => {
    if (b.pairScore !== a.pairScore) return b.pairScore - a.pairScore;
    if (b.primary.primaryScore !== a.primary.primaryScore) return b.primary.primaryScore - a.primary.primaryScore;
    if (b.secondaryScore !== a.secondaryScore) return b.secondaryScore - a.secondaryScore;
    return a.pairKey.localeCompare(b.pairKey);
  });

  return allPairs.map((pair, index) => {
    const recommendation: PairRecommendation = {
      rank: index + 1,
      pairKey: pair.pairKey,
      primaryWeaponId: pair.primary.weapon.id,
      secondaryWeaponId: pair.secondary.weapon.id,
      primaryScore: roundTo(pair.primary.primaryScore, 6),
      secondaryScore: roundTo(pair.secondaryScore, 6),
      pairScore: roundTo(pair.pairScore, 6),
      tieBucketId: `score_${roundTo(pair.pairScore).toFixed(4)}`,
      reasons: pair.reasons,
    };

    // Debug payload is intentionally optional so production UI can hide it.
    if (includeDebug) {
      recommendation.debug = {
        primaryBreakdown: pair.primary.primaryBreakdown,
        secondaryBreakdown: pair.secondary.primaryBreakdown,
        complementBreakdown: pair.complementBreakdown,
      };
    }

    return recommendation;
  });
}
