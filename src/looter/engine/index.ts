// ============================================================================
// FILE: src/looter/engine/index.ts
// PURPOSE: Public API for the Looter material-demand engine. Pure functions —
//          no React, no DOM, no module-level mutable state.
//
// Mirrors the layout of src/advisor/engine/ so the two features stay legible
// as siblings: small entrypoint, dedicated submodules for each concern, no
// reaching into UI code.
//
// Phase 4 scope:
//   - Material-demand aggregation (replaces the inline mock in LooterPage)
//   - dropPOIs derivation per material (was previously the unused HuntListLine slot)
//
// The `recommendedMaps` slot on HuntList stays empty — that's #4 (live
// map-conditions pipeline). `primaryMap` is left undefined here; the page
// still renders the deferred-feature copy in HuntBrief when it's missing.
// ============================================================================

import type { HuntList, HuntListLine, LooterEngineInput } from "./types";
import { aggregateDemand } from "./aggregator";
import { dropPOIsForItem } from "./drop-pois";

export type { LooterEngineInput } from "./types";

export function buildHuntList(input: LooterEngineInput): HuntList {
  const maxRows = input.maxRows ?? 12;
  const maxPOIs = input.maxPOIsPerItem ?? 4;

  const ranked = aggregateDemand({
    stages: input.stages,
    stageBucket: input.stageBucket,
    lineDone: input.lineDone,
  });

  const materials: HuntListLine[] = ranked.slice(0, maxRows).map((line) => ({
    ...line,
    dropPOIs: dropPOIsForItem(line.itemId, maxPOIs),
  }));

  return {
    primaryMap: undefined,
    recommendedMaps: [],
    materials,
  };
}

export { aggregateDemand } from "./aggregator";
export { dropPOIsForItem } from "./drop-pois";
