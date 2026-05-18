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
// - Skip bucket excludes a stage from demand; use it per-tier for bench goals.
// ============================================================================

import { ITEMS } from "../../data/items";
import type { Bucket, HuntListLine, Stage } from "../../components/looter/types";

export interface AggregateInput {
  stages: Stage[];
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
}

interface Pending {
  total: number;
  breakdown: HuntListLine["breakdown"];
}

export function aggregateDemand(input: AggregateInput): HuntListLine[] {
  const { stages, stageBucket, lineDone } = input;
  const byItem = new Map<string, Pending>();

  for (const stage of stages) {
    const bucket = stageBucket[stage.stageId] ?? "skip";
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
