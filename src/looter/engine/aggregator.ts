// ============================================================================
// FILE: src/looter/engine/aggregator.ts
// PURPOSE: Pure material-demand aggregator. Walks every stage, drops those
//          that are skipped / off-goal / over-tier, and sums un-ticked item
//          lines into a HuntList keyed by itemId.
//
// Design contracts (Phase 2):
// - Priority is per-stage and bucketed. Each contribution is tagged with its
//   originating stage's bucket so downstream ranking can weight High > Soon > Eventual.
// - Stage completion is derived from lineDone — not stored separately.
// - benchTargetTier: bench stages with tier > target are excluded entirely.
//   "Skip" buckets exclude a single stage; target-tier excludes a whole tail.
// ============================================================================

import { ITEMS } from "../../data/items";
import type { Bucket, HuntListLine, Stage } from "../../components/looter/types";

export interface AggregateInput {
  stages: Stage[];
  stageBucket: Record<string, Bucket>;
  goalOn: Record<string, boolean>;
  lineDone: Set<string>;
  benchTargetTier: Record<string, number>;
}

interface Pending {
  total: number;
  breakdown: HuntListLine["breakdown"];
}

/** Parse the tier level off a bench stageId like "bench:gunsmith:t2". Returns
 *  null if the id doesn't match the bench-stage shape. */
function benchTierLevel(stageId: string): number | null {
  const m = stageId.match(/^bench:[^:]+:t(\d+)$/);
  return m ? Number(m[1]) : null;
}

/** Parse the bench id off a bench goalId like "bench:gunsmith". */
function benchIdFromGoal(goalId: string): string | null {
  const m = goalId.match(/^bench:(.+)$/);
  return m ? m[1] : null;
}

export function aggregateDemand(input: AggregateInput): HuntListLine[] {
  const { stages, stageBucket, goalOn, lineDone, benchTargetTier } = input;
  const byItem = new Map<string, Pending>();

  for (const stage of stages) {
    if (!goalOn[stage.goalId]) continue;

    // Bench tail exclusion: tiers above the target tier are not demanded.
    if (stage.goalKind === "bench") {
      const benchId = benchIdFromGoal(stage.goalId);
      const tier = benchTierLevel(stage.stageId);
      if (benchId && tier !== null) {
        const target = benchTargetTier[benchId];
        if (typeof target === "number" && tier > target) continue;
      }
    }

    const bucket = stageBucket[stage.stageId] ?? "soon";
    if (bucket === "skip") continue;

    const sourceLabel = `${stage.goalName} ${stage.stageLabel
      .replace(/^Stage /, "S")
      .replace(/ · .+$/, "")}`;

    for (const line of stage.lines) {
      if (line.kind !== "item") continue;
      if (lineDone.has(line.lineId)) continue;
      const entry = byItem.get(line.itemId) ?? { total: 0, breakdown: [] };
      entry.total += line.qty;
      entry.breakdown.push({
        bucket: bucket as Exclude<Bucket, "skip">,
        source: sourceLabel,
        qty: line.qty,
      });
      byItem.set(line.itemId, entry);
    }
  }

  const bucketRank = (bs: HuntListLine["breakdown"]) =>
    bs.some((b) => b.bucket === "hi") ? 0 : bs.some((b) => b.bucket === "soon") ? 1 : 2;

  return [...byItem.entries()]
    .map<HuntListLine>(([itemId, v]) => ({
      itemId,
      itemName: ITEMS[itemId]?.name ?? itemId,
      total: v.total,
      breakdown: v.breakdown,
    }))
    .sort((a, b) => {
      const ra = bucketRank(a.breakdown);
      const rb = bucketRank(b.breakdown);
      if (ra !== rb) return ra - rb;
      if (b.total !== a.total) return b.total - a.total;
      return a.itemId.localeCompare(b.itemId);
    });
}
