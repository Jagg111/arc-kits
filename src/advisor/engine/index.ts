// ============================================================================
// FILE: src/advisor/engine/index.ts
// PURPOSE: Main entry point for the advisor engine.
// WHAT THIS FILE DOES:
// - Normalizes raw user inputs
// - Filters invalid weapon candidates (hard constraints)
// - Scores weapons and builds primary/secondary pair rankings
// - Applies tie-bucket-aware shuffle batching
// ============================================================================

import type { AdvisorInputs, AdvisorResult, PairRecommendation, ShuffleState } from "../../types";
import { buildWeaponFeatureMap } from "./feature-map";
import {
  buildInsufficientWeaponsEmptyState,
  buildNoPairsEmptyState,
  filterCandidateFeatures,
  normalizeInputs,
} from "./filters";
import { rankPairCandidates, type ScoredWeaponCandidate } from "./pair-ranker";
import { scorePrimary } from "./primary-score";
import { getShuffleBatch } from "./shuffle";

export interface RecommendOptions {
  batchSize?: number;
  shuffleState?: ShuffleState;
  forceDebug?: boolean;
}

export interface RankedRecommendationResult {
  inputs: AdvisorInputs;
  ranked: PairRecommendation[];
  emptyState?: AdvisorResult["emptyState"];
}

// Build the full ranked list (not just the visible top 2 cards).
// This is useful for shuffle behavior and matrix validation.
export function buildRankedRecommendations(
  rawInputs: Partial<AdvisorInputs>,
  includeDebugOverride?: boolean,
): RankedRecommendationResult {
  // 1) Fill in defaults for any missing questionnaire values.
  const inputs = normalizeInputs(rawInputs);
  // 2) Build reusable per-weapon features (range band, stealth eligibility, etc.).
  const featureMap = buildWeaponFeatureMap();
  // 3) Apply hard constraints (rarity, stealth requirement).
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

  // Allow caller to force debug mode even if input.debug is false.
  const includeDebug = includeDebugOverride ?? inputs.debug;
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

// Main API used by future UI/hook integration.
// Returns only the current visible batch (default 2), plus shuffle state.
export function recommendLoadouts(rawInputs: Partial<AdvisorInputs>, options: RecommendOptions = {}): AdvisorResult {
  const includeDebug = options.forceDebug ?? rawInputs.debug ?? false;
  const { ranked, emptyState } = buildRankedRecommendations(rawInputs, includeDebug);
  if (emptyState || ranked.length === 0) {
    return {
      recommendations: [],
      emptyState: emptyState ?? buildNoPairsEmptyState(),
      shuffleState: options.shuffleState ?? { bucketIndex: 0, seenPairKeys: [], cycle: 0 },
    };
  }

  // Hide debug internals unless debug mode is explicitly enabled.
  const pool = includeDebug ? ranked : ranked.map(({ debug, ...rest }) => rest);
  // Pick the next batch using tie-bucket cycle rules.
  const shuffled = getShuffleBatch(pool, options.shuffleState, options.batchSize ?? 2);

  return {
    recommendations: shuffled.batch,
    shuffleState: shuffled.state,
  };
}

export { parseAdvisorQuery, serializeAdvisorQuery } from "./url-state";
export { getShuffleBatch } from "./shuffle";
