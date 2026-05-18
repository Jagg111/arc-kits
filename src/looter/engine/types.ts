// ============================================================================
// FILE: src/looter/engine/types.ts
// PURPOSE: Engine-input shape. Re-exports HuntList/HuntListLine/Bucket/Stage
//          from components/looter/types so the engine and UI agree on output.
// ============================================================================

import type { Bucket, HuntList, HuntListLine, RankedMap, Stage } from "../../components/looter/types";

export type { Bucket, HuntList, HuntListLine, RankedMap, Stage };

// Engine input — the subset of useLooterState the aggregator reads.
export interface LooterEngineInput {
  stages: Stage[];
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
  /** Optional cap on how many hunt-list rows to return. Default 12. */
  maxRows?: number;
  /** Optional cap on dropPOIs per material. Default 4. */
  maxPOIsPerItem?: number;
}
