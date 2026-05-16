// ============================================================================
// FILE: components/looter/types.ts
// PURPOSE: Shared types for the Looter feature page. Phase 3 keeps everything
//          in-memory; Phase 5 promotes the same shape into a persistence hook.
//
// Stage / line id schemes are stable contracts — Phase 4's aggregator and
// Phase 5's persistence layer key on these strings.
// ============================================================================

export type Bucket = "hi" | "soon" | "evt" | "skip";

export type StageKind = "items" | "task" | "value_by_category" | "event";

// Stage represents one entry on the priority board: a project stage, a bench
// tier, or an event. Generated from static data by the LooterPage.
export interface Stage {
  stageId: string;       // e.g. "proj:expedition:s2", "bench:gunsmith:t1", "event:miniature_voyages"
  goalId: string;        // e.g. "proj:expedition", "bench:gunsmith"
  goalName: string;      // e.g. "Expedition Project"
  goalKind: "project" | "bench" | "event";
  stageLabel: string;    // e.g. "Stage 2 · CORE SYSTEMS", "T1", "Ship Models"
  kind: StageKind;
  lines: StageLine[];
}

export type StageLine =
  | { lineId: string; kind: "item"; itemId: string; itemName: string; qty: number }
  | { lineId: string; kind: "task"; label: string; mapId?: string }
  | { lineId: string; kind: "bucket"; label: string; coins: number };

// Hunt list — output shape of the (mocked for Phase 3) material-demand
// aggregator. Phase 4 replaces the mock with the real engine; the shape stays.
export interface HuntListLine {
  itemId: string;
  itemName: string;
  total: number;
  breakdown: { bucket: Exclude<Bucket, "skip">; source: string; qty: number }[];
  dropPOIs?: string[];
}

// Phase 4 + #4 will populate this. In Phase 3 it stays empty — the runner-up
// map block and "switch primary" link render as deferred-feature placeholders.
export interface RankedMap {
  mapId: string;
  name: string;
  condition?: string;
  focusPOIs?: string[];
}

export interface HuntList {
  // Placeholder primary map shown in the Hunt Brief header. Phase 4 produces
  // this from the aggregator + #4 (live map-conditions pipeline). Phase 3 ships
  // a static mock so the layout has something to render.
  primaryMap?: RankedMap;
  recommendedMaps: RankedMap[]; // reserved for Phase 4 + #4 — empty in Phase 3
  materials: HuntListLine[];
}
