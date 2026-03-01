// ============================================================================
// FILE: src/advisor/engine/index.ts
// PURPOSE: Main entry point for the advisor engine.
// WHAT THIS FILE DOES:
// - Normalizes raw user inputs
// - Filters invalid weapon candidates (hard constraints)
// - Scores weapons and builds primary/secondary pair rankings
// - Returns 2-3 deterministic results with tier labels and synergy tags
// ============================================================================

import type { AdvisorInputs, AdvisorResult, PairRecommendation } from "../../types";
import { buildWeaponFeatureMap } from "./feature-map";
import {
  buildInsufficientWeaponsEmptyState,
  buildNoPairsEmptyState,
  filterCandidateFeatures,
  normalizeInputs,
} from "./filters";
import { rankPairCandidates, type ScoredWeaponCandidate } from "./pair-ranker";
import { scorePrimary } from "./primary-score";

export interface RankedRecommendationResult {
  inputs: AdvisorInputs;
  ranked: PairRecommendation[];
  emptyState?: AdvisorResult["emptyState"];
}

// Build the full ranked list (used by matrix validation and the main API).
export function buildRankedRecommendations(
  rawInputs: Partial<AdvisorInputs>,
  includeDebug = false,
): RankedRecommendationResult {
  // 1) Fill in defaults for any missing questionnaire values.
  const inputs = normalizeInputs(rawInputs);
  // 2) Build reusable per-weapon features (range band, stealth eligibility, etc.).
  const featureMap = buildWeaponFeatureMap();
  // 3) Apply hard constraints (rarity filter).
  const filtered = filterCandidateFeatures(featureMap, inputs);

  // Hard-stop when we cannot build a primary + secondary pair.
  if (filtered.length < 2) {
    return {
      inputs,
      ranked: [],
      emptyState: buildInsufficientWeaponsEmptyState(),
    };
  }

  // Build candidate entries with primary score breakdowns.
  const candidates: ScoredWeaponCandidate[] = filtered.map((feature) => {
    const primaryBreakdown = scorePrimary(feature.weapon, inputs);
    return {
      weapon: feature.weapon,
      primaryScore: primaryBreakdown.weightedTotal,
      primaryBreakdown,
    };
  });

  const ranked = rankPairCandidates(candidates, inputs, includeDebug);

  // Defensive fallback: if pairing logic returns no pairs, return explicit empty state.
  if (ranked.length === 0) {
    return {
      inputs,
      ranked: [],
      emptyState: buildNoPairsEmptyState(),
    };
  }

  return { inputs, ranked };
}

// Main API for UI/hook integration.
// Returns 2-3 deterministic results with tiers and synergy tags.
export function recommendLoadouts(
  rawInputs: Partial<AdvisorInputs>,
  includeDebug = false,
): AdvisorResult {
  const { ranked, emptyState } = buildRankedRecommendations(rawInputs, includeDebug);

  if (emptyState || ranked.length === 0) {
    return {
      status: "empty",
      recommendations: [],
      emptyState: emptyState ?? buildNoPairsEmptyState(),
    };
  }

  // Hide debug internals unless explicitly requested.
  const recommendations = includeDebug
    ? ranked
    : ranked.map(({ debug, ...rest }) => rest);

  return {
    status: "results",
    recommendations,
  };
}

export { parseAdvisorQuery, serializeAdvisorQuery } from "./url-state";
export { selectBuildForAdvisor } from "./attachment-selection";
