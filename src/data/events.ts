// ============================================================================
// FILE: data/events.ts
// PURPOSE: Live time-windowed events — distinct from Projects (which are
//          multi-stage commit builds). Events progress passively while playing:
//          extract with specific loot, earn merits, redeem on a reward track.
//          For V1 of the Looter we track them minimally — just enough to tell
//          the prioritizer what to hold onto while an event is live. Per-tier
//          merit progress is intentionally NOT modeled here; player completion
//          state is a boolean and lives in the Looter's persistence hook.
//
//          Events can share an `umbrella` season name with a Project (e.g.
//          Miniature Voyages + Avian Alarm both under "Last Resort").
//
// SOURCE: In-game screenshots and https://arcraiders.com/news patch notes.
//          Replace CURRENT_EVENT when a new event drops.
// ============================================================================

import { ITEMS } from "./items";

export interface LiveEvent {
  id: string;
  name: string;              // display name, e.g. "Miniature Voyages"
  umbrella?: string;         // optional season grouping, e.g. "Last Resort"
  description: string;       // 1-2 sentence flavor / how-to-earn-merits
  endsAt: string;            // ISO 8601 UTC
  // Item ids to highlight while this event is live. The Looter uses these as
  // a "don't recycle / hold for extraction" signal. References must resolve in
  // ITEMS — a dev-time guard at module load throws on typos.
  prioritizeItemIds: string[];
}

// The event currently in progress. Set to null between events.
export const CURRENT_EVENT: LiveEvent | null = {
  id: "miniature_voyages",
  name: "Miniature Voyages",
  umbrella: "Last Resort",
  description:
    "Earn Merits by extracting with Ship Models or by earning XP. Ship Models drop around Riven Tides.",
  endsAt: "2026-05-26T04:00:00Z", // shares the Last Resort umbrella timer with Avian Alarm
  prioritizeItemIds: [
    "wind_sprite_ship_model",
    "twilight_compass_ship_model",
    "velocity_ship_model",
    "sirena_dorata_ship_model",
    "leviathans_crown_ship_model",
  ],
};

/**
 * Days remaining until the current event ends. Returns null if no event is
 * active. Floored to whole days for clean UI copy.
 */
export function daysUntilEventEnd(now: Date = new Date()): number | null {
  if (!CURRENT_EVENT) return null;
  const ms = Date.parse(CURRENT_EVENT.endsAt) - now.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/** True if an event is currently active (CURRENT_EVENT is set and not expired). */
export function isEventActive(now: Date = new Date()): boolean {
  if (!CURRENT_EVENT) return false;
  return now.getTime() < Date.parse(CURRENT_EVENT.endsAt);
}

// Dev-time sanity check: every prioritized item must exist in ITEMS.
if (import.meta.env?.DEV && CURRENT_EVENT) {
  for (const id of CURRENT_EVENT.prioritizeItemIds) {
    if (!ITEMS[id]) {
      throw new Error(
        `CURRENT_EVENT: prioritizeItemIds references unknown item "${id}"`,
      );
    }
  }
}
