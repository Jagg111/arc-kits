// ============================================================================
// FILE: src/advisor/engine/pair-ranker.ts
// PURPOSE: Turn scored weapon candidates into ranked primary+secondary pairs.
// Assigns tier labels, synergy tags, and handles 2-vs-3 output logic.
// ============================================================================

import {
  ADVISOR_TOP_PRIMARY_CAP,
  SQUAD_RANGE_BONUS,
  TOP_GAP,
  WEIGHT_PAIR_COMPLEMENT,
  WEIGHT_PAIR_PRIMARY,
} from "../../data/advisor_config";
import type {
  AdvisorInputs,
  AdvisorScoreBreakdown,
  PairRecommendation,
  SynergyTag,
  TierLabel,
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
  complementBreakdown: ReturnType<typeof scoreSecondaryComplement>;
}

// Derive synergy tags from weapon data — no curation, pure logic.
function deriveSynergyTags(primary: Weapon, secondary: Weapon): SynergyTag[] {
  const tags: SynergyTag[] = [];

  // Ammo diversity
  if (primary.ammoType !== secondary.ammoType) {
    tags.push({ type: "positive", label: "Ammo Split" });
  } else {
    tags.push({ type: "warning", label: "Same Ammo" });
  }

  // Range coverage
  const rangePrimary = pickRangeBand(primary.range);
  const rangeSecondary = pickRangeBand(secondary.range);
  if (rangePrimary !== rangeSecondary) {
    tags.push({ type: "positive", label: "Range Coverage" });
  } else {
    tags.push({ type: "warning", label: "Range Overlap" });
  }

  // Role split: one strong PvP (S/A) and other strong ARC (S/A)
  const pvpGrades = new Set(["S", "A"]);
  const arcGrades = new Set(["S", "A"]);
  const hasPvpStrong = pvpGrades.has(primary.pvp) || pvpGrades.has(secondary.pvp);
  const hasArcStrong = arcGrades.has(primary.arc) || arcGrades.has(secondary.arc);
  if (hasPvpStrong && hasArcStrong) {
    tags.push({ type: "positive", label: "Role Split" });
  }

  return tags;
}

// Main pair builder:
// 1) sort primary candidates
// 2) expand ordered pairs (primary != secondary)
// 3) score + sort deterministically
// 4) assign tiers and synergy tags
// 5) return top 2-3 results
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

  // Ordered pairs: A→B is different from B→A because primary role differs.
  for (const primary of primaryPool) {
    for (const secondary of candidates) {
      if (secondary.weapon.id === primary.weapon.id) continue;
      const complementBreakdown = scoreSecondaryComplement(
        primary.weapon,
        secondary.weapon,
        secondary.primaryScore,
      );

      const secondaryScore = complementBreakdown.weightedTotal;
      let pairScore = clamp(
        primary.primaryScore * WEIGHT_PAIR_PRIMARY +
        secondaryScore * WEIGHT_PAIR_COMPLEMENT,
      );

      // Squad mode bonus: reward pairs that specialize into different range bands.
      if (inputs.squad === "squad") {
        const bandPrimary = pickRangeBand(primary.weapon.range);
        const bandSecondary = pickRangeBand(secondary.weapon.range);
        if (bandPrimary !== bandSecondary) {
          pairScore = clamp(pairScore + SQUAD_RANGE_BONUS);
        }
      }

      allPairs.push({
        pairKey: pairKey(primary.weapon.id, secondary.weapon.id),
        primary,
        secondary,
        secondaryScore,
        pairScore,
        complementBreakdown,
      });
    }
  }

  // Deterministic final sort:
  // pair score → primary score → secondary score → lexical key.
  allPairs.sort((a, b) => {
    if (b.pairScore !== a.pairScore) return b.pairScore - a.pairScore;
    if (b.primary.primaryScore !== a.primary.primaryScore) return b.primary.primaryScore - a.primary.primaryScore;
    if (b.secondaryScore !== a.secondaryScore) return b.secondaryScore - a.secondaryScore;
    return a.pairKey.localeCompare(b.pairKey);
  });

  // Deduplicate mirror pairs: A→B and B→A are the same loadout.
  // Keep whichever orientation scored higher (already sorted by score).
  const seen = new Set<string>();
  const deduped = allPairs.filter((pair) => {
    const ids = [pair.primary.weapon.id, pair.secondary.weapon.id].sort();
    const unorderedKey = ids.join("__");
    if (seen.has(unorderedKey)) return false;
    seen.add(unorderedKey);
    return true;
  });

  // Determine how many results to show (2 or 3).
  const topScore = deduped.length > 0 ? deduped[0].pairScore : 0;
  let resultCount = Math.min(2, deduped.length);
  if (deduped.length >= 3 && deduped[2].pairScore >= topScore - TOP_GAP) {
    resultCount = 3;
  }

  const topPairs = deduped.slice(0, resultCount);

  return topPairs.map((pair, index) => {
    // Tier assignment: first pair = Top Pick, rest = Strong Option.
    const tier: TierLabel = index === 0 ? "top_pick" : "strong_option";
    const synergyTags = deriveSynergyTags(pair.primary.weapon, pair.secondary.weapon);

    const recommendation: PairRecommendation = {
      rank: index + 1,
      pairKey: pair.pairKey,
      primaryWeaponId: pair.primary.weapon.id,
      secondaryWeaponId: pair.secondary.weapon.id,
      primaryScore: roundTo(pair.primary.primaryScore, 6),
      secondaryScore: roundTo(pair.secondaryScore, 6),
      pairScore: roundTo(pair.pairScore, 6),
      tier,
      synergyTags,
    };

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
