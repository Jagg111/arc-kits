// ============================================================================
// FILE: data/expedition.ts
// PURPOSE: Models the current expedition cycle — the ~8-week opt-in wipe loop
//          that serves as the global clock for the Looter feature. When the
//          window closes ("auto-departure"), the player loses Raider level,
//          stash inventory, blueprints, and skill tree in exchange for Skill
//          Points that persist. Past cycles aren't tracked — only what's live
//          right now matters for the Looter prioritizer.
// USED BY: looter feature (planned) — "days until next departure" drives risk
//          tolerance (cheaper loadouts as the window approaches).
// SOURCE: https://arcstatus.com/expedition and in-game timers. Update
//          CURRENT_EXPEDITION when a new cycle is announced.
// ============================================================================

export interface Expedition {
  number: number;
  codename?: string;
  // ISO 8601 datetimes (UTC). Treat all as UTC — players are global.
  departureWindowStart: string;
  // Auto-departure fires at this instant for everyone still in the cycle.
  departureWindowEnd: string;
}

// What the player loses vs keeps when they depart. Sourced from Embark's
// expedition primer — distinct from cosmetic/account progression which is
// unaffected by departure.
export const EXPEDITION_POLICY = {
  optIn: true as const,
  losesOnDeparture: [
    "raider_level",
    "stash_inventory",
    "blueprints",
    "skill_tree",
  ] as const,
  preservesOnDeparture: [
    "stash_size",
    "cosmetics",
    "skill_points",
    "account_rewards",
  ] as const,
};

// The cycle currently in progress. Update when Embark announces the next one.
// Detailed objective / SP threshold / cosmetic-reward data per cycle is
// intentionally out of scope here — the Looter only needs the window timing.
export const CURRENT_EXPEDITION: Expedition = {
  number: 4,
  // Codename TBA — Exp 4 details unannounced as of authoring (2026-05-15).
  // Window inferred from the active in-game Expedition Project timer (~37d).
  departureWindowStart: "2026-06-15T05:00:00Z", // approx — refine when Embark publishes
  departureWindowEnd: "2026-06-22T05:00:00Z",   // matches the Expedition Project endsAt
};

/**
 * True when `now` is inside the current cycle's departure window — the UI
 * surfaces this as a "decide whether to depart" banner.
 */
export function inDepartureWindow(now: Date = new Date()): boolean {
  const t = now.getTime();
  return (
    t >= Date.parse(CURRENT_EXPEDITION.departureWindowStart) &&
    t < Date.parse(CURRENT_EXPEDITION.departureWindowEnd)
  );
}

/**
 * Days remaining until auto-departure. Floors to whole days for clean UI
 * copy ("N days left"). Negative cycles (past end) return 0.
 */
export function daysUntilDeparture(now: Date = new Date()): number {
  const ms = Date.parse(CURRENT_EXPEDITION.departureWindowEnd) - now.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}
