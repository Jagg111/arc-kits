// ============================================================================
// FILE: src/advisor/engine/shuffle.ts
// PURPOSE: Return the next visible recommendation batch while respecting:
// - tie-bucket grouping
// - no repeats until cycle is exhausted
// - wrap-around behavior
// ============================================================================

import type { PairRecommendation, ShuffleState } from "../../types";

export interface ShuffleBatchResult {
  batch: PairRecommendation[];
  state: ShuffleState;
}

// Group results by tie bucket so shuffle can exhaust one bucket before moving on.
function groupByTieBucket(recommendations: PairRecommendation[]): Record<string, PairRecommendation[]> {
  const grouped: Record<string, PairRecommendation[]> = {};
  for (const rec of recommendations) {
    grouped[rec.tieBucketId] = grouped[rec.tieBucketId] ?? [];
    grouped[rec.tieBucketId].push(rec);
  }
  return grouped;
}

// Default first-run shuffle cursor.
function defaultState(): ShuffleState {
  return {
    bucketIndex: 0,
    seenPairKeys: [],
    cycle: 0,
  };
}

export function getShuffleBatch(
  recommendations: PairRecommendation[],
  currentState?: ShuffleState,
  batchSize = 2,
): ShuffleBatchResult {
  // Nothing to do for empty input.
  if (recommendations.length === 0) {
    return { batch: [], state: currentState ?? defaultState() };
  }

  const state = currentState ?? defaultState();
  const grouped = groupByTieBucket(recommendations);
  const bucketIds = Object.keys(grouped);
  // Defensive return for malformed input.
  if (bucketIds.length === 0) {
    return { batch: [], state };
  }

  const seen = new Set(state.seenPairKeys);
  let bucketIndex = Math.min(state.bucketIndex, bucketIds.length - 1);
  const batch: PairRecommendation[] = [];
  let inspected = 0;
  let cycle = state.cycle;

  // Fill batch by walking buckets in order.
  while (batch.length < batchSize && inspected < bucketIds.length) {
    const bucketId = bucketIds[bucketIndex];
    const bucket = grouped[bucketId];
    const unseen = bucket.filter((rec) => !seen.has(rec.pairKey));

    if (unseen.length > 0) {
      const needed = batchSize - batch.length;
      const take = unseen.slice(0, needed);
      for (const rec of take) {
        batch.push(rec);
        seen.add(rec.pairKey);
      }

      // If we consumed all unseen pairs from this bucket, move forward.
      if (take.length === unseen.length) {
        bucketIndex = (bucketIndex + 1) % bucketIds.length;
        inspected += 1;
      }
    } else {
      // Bucket exhausted, skip to the next one.
      bucketIndex = (bucketIndex + 1) % bucketIds.length;
      inspected += 1;
    }
  }

  // Full cycle complete: clear seen history and increment cycle counter.
  if (seen.size >= recommendations.length) {
    seen.clear();
    bucketIndex = 0;
    cycle += 1;
  }

  // Last-resort fallback if selection somehow returns nothing.
  if (batch.length === 0) {
    const fallback = recommendations.slice(0, Math.min(batchSize, recommendations.length));
    return {
      batch: fallback,
      state: {
        bucketIndex: 0,
        seenPairKeys: fallback.map((entry) => entry.pairKey),
        cycle,
      },
    };
  }

  return {
    batch,
    state: {
      bucketIndex,
      seenPairKeys: Array.from(seen),
      cycle,
    },
  };
}
