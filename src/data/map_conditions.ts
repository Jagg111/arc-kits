// ============================================================================
// FILE: data/map_conditions.ts
// PURPOSE: Catalog of all known ARC Raiders map conditions (a.k.a. map
//          modifiers) — time-windowed effects that rotate hourly per map and
//          influence what loot/hazards appear during a round. Distinct from
//          expedition cycles (wipe loop), events (merit seasons), and projects
//          (commit builds).
//
//          Phase 1 (here): the static catalog — every known condition, what it
//          does, what loot it boosts, which maps it can appear on.
//          Phase 3 (later): the GHA scraper that reads live
//          arcraiders.com/map-conditions and writes a JSON snapshot of which
//          conditions are active right now on each map.
//
// USED BY: looter prioritizer (planned) — overlays "what's active now" onto
//          the player's material goals to produce the "queue into X map for Y"
//          recommendation.
//
// SOURCE: https://arcraiders.com/map-conditions, Fextralife wiki, skycoach
//          dynamic-events guide, in-game observation. Update as Embark adds /
//          retires conditions.
// ============================================================================

import type { ItemCategory } from "./items";

export type ConditionClass = "major" | "minor";

// Map ids referenced below. These mirror the canonical map list that
// loot_zones.ts will own when it lands; for now they're just string literals
// so map_conditions.ts compiles standalone. Negative-constraint cases (e.g.
// Cold Snap = "all except Stella Montis") are encoded by enumerating the
// positive set explicitly in `maps`.
export const MAP_IDS = [
  "dam_battlegrounds",
  "buried_city",
  "spaceport",
  "blue_gate",
  "stella_montis",
  "riven_tides",
] as const;
export type MapId = (typeof MAP_IDS)[number];

export interface MapCondition {
  id: string;
  name: string;             // display name, verbatim from in-game
  class: ConditionClass;
  // Map applicability. "all" for global conditions; otherwise an explicit
  // subset (enumerate positively even when the rule is "all except X").
  maps: "all" | MapId[];
  effect: string;           // one-sentence summary of what it does
  hazard?: string;          // major-only typically — what threatens the player
  specialRules?: string;    // extract count changes, puzzles, objectives
  // What loot the condition elevates. Multiple fields can be set when a
  // condition boosts BOTH specific named items AND a broader category bucket.
  lootBoostItemIds?: string[];
  lootBoostCategories?: ItemCategory[];
  lootBoostNote?: string;   // free-text for vague or blueprint-style rewards
  // True when the condition REDUCES general loot quality (Close Scrutiny only,
  // currently). The Looter should de-prioritize maps under suppression unless
  // the player specifically wants the concentrated reward.
  suppressesLoot?: boolean;
  // True when source data was ambiguous and the row may need future correction.
  unconfirmed?: boolean;
}

export const MAP_CONDITIONS: Record<string, MapCondition> = {
  // ── Major ──────────────────────────────────────────────────────────────

  night_raid: {
    id: "night_raid",
    name: "Night Raid",
    class: "major",
    maps: "all",
    effect:
      "Nighttime visibility drop; increased ARC spawns including boss variants. Glow-in-the-dark apparel betrays your position.",
    hazard: "Boss ARCs in low visibility",
    specialRules: "No active raider hatches; fewer extracts; Trials points doubled.",
    lootBoostNote: "Broad rarity uplift; Tempest blueprint is condition-exclusive.",
  },

  electromagnetic_storm: {
    id: "electromagnetic_storm",
    name: "Electromagnetic Storm",
    class: "major",
    maps: "all",
    effect:
      "Thunder and rain mask audio; lightning strikes open areas; ARCs spawn unexpectedly.",
    hazard: "Lightning damages players outdoors — standing still raises strike chance",
    specialRules: "Interior shelter grants immunity; Trials points doubled; fewer extracts.",
    lootBoostCategories: ["basic", "refined"],
    lootBoostNote: "Fossilized Lightning sightings reported during storms.",
  },

  cold_snap: {
    id: "cold_snap",
    name: "Cold Snap",
    class: "major",
    // Stella Montis is already a snow map; Cold Snap doesn't rotate there.
    maps: ["dam_battlegrounds", "buried_city", "spaceport", "blue_gate", "riven_tides"],
    effect: "Freezing weather; sustained outdoor exposure drains health.",
    hazard: "Frostbite (armor-ignoring DOT) — shelter to reset.",
    specialRules:
      "Buried City has a 15-button warming puzzle. Walls and buildings reset the frost meter. Fewer extracts.",
    lootBoostNote: "Broad rarity uplift; candleberries reported during cold conditions.",
  },

  close_scrutiny: {
    id: "close_scrutiny",
    name: "Close Scrutiny",
    class: "major",
    maps: "all",
    effect:
      "Map-wide loot quality REDUCED; focus loot concentrated at a single Assessor beam location.",
    hazard: "Vaporizer boss ARCs guard the Assessor",
    specialRules:
      "Three ramps lead to the Assessor. Breach & Search required. Trials points doubled; fewer extracts.",
    suppressesLoot: true,
    lootBoostNote:
      "Loot is geographic, not categorical — concentrated near the Assessor. Dolabra blueprint condition-exclusive.",
  },

  hidden_bunker: {
    id: "hidden_bunker",
    name: "Hidden Bunker",
    class: "major",
    maps: ["spaceport"],
    effect:
      "Activate 4 antennas to unlock a hidden bunker, then download data from 8 consoles inside.",
    hazard: "Bastion and Bombardier ARCs guard the bunker",
    specialRules: "40-minute timer; Trials points doubled; fewer extracts.",
    lootBoostNote: "Broad rarity uplift inside the bunker; Vulcano blueprint condition-exclusive.",
  },

  locked_gate: {
    id: "locked_gate",
    name: "Locked Gate",
    class: "major",
    maps: ["blue_gate"],
    effect:
      "Find 4 Security Codes at Pilgrim's Peak, Raider's Refuge, Ancient Fort, and Reinforced Reception; enter at Gate Control Room.",
    hazard: "PvP over the codes",
    specialRules:
      "All 4 codes required; missing one means no bunker access. Fewer extracts.",
    lootBoostNote: "Broad rarity uplift behind the gate; Bobcat blueprint condition-exclusive.",
  },

  hurricane: {
    id: "hurricane",
    name: "Hurricane",
    class: "major",
    // Outdoor surface maps only — wiki Difficulty Changes table is authoritative.
    // Excludes Stella Montis (indoor) and Riven Tides.
    maps: ["dam_battlegrounds", "buried_city", "spaceport", "blue_gate"],
    effect:
      "High winds give tailwind speed and headwind slow; grenades and jumps drift; debris damages shields making you flicker-visible.",
    hazard: "Shield degrades from debris; ARCs ambush from low visibility",
    specialRules:
      "Shield-off trades survivability for stealth. Fewer extracts. First Wave Raider Caches spawn with relics/rare items.",
    lootBoostNote: "Cache-specific blueprint and trinket uplift; specific item ids unconfirmed.",
  },

  // ── Minor ──────────────────────────────────────────────────────────────

  lush_blooms: {
    id: "lush_blooms",
    name: "Lush Blooms",
    class: "minor",
    maps: "all",
    effect:
      'Nature "fruit baskets" spawn around the map. Raiders are especially hostile during the brief farming window.',
    specialRules: "~10-minute farming window before baskets are stripped.",
    lootBoostCategories: ["nature"],
    lootBoostNote: "Mushrooms, lemons, apricots, olives, prickly pears, agave all elevated.",
  },

  husk_graveyard: {
    id: "husk_graveyard",
    name: "Husk Graveyard",
    class: "minor",
    // Surface maps only per the wiki Difficulty Changes table. The earlier
    // "missing from scheduler" concern was a snapshot artifact (the live page
    // shows a finite forward window, not the full rotation pool).
    maps: ["dam_battlegrounds", "buried_city", "spaceport", "blue_gate"],
    effect:
      "Field fills with destroyed ARC husks containing powercells and parts. Some husks are electrified.",
    hazard: "Electrified husks stun (no damage)",
    lootBoostItemIds: [
      "bastion_cell",
      "bombardier_cell",
      "leaper_pulse_unit",
      "rocketeer_driver",
    ],
    lootBoostNote: 'Pairs well with the "Search the Husks" trial.',
  },

  prospecting_probes: {
    id: "prospecting_probes",
    name: "Prospecting Probes",
    class: "minor",
    maps: "all",
    effect: "ARC probes scattered across the map. Opening them is loud and alerts other players.",
    hazard: "Probe alarm draws PvP",
    lootBoostCategories: ["topside", "refined"],
    lootBoostNote: "ARC Alloy, ARC Circuitry, and mechanical components elevated.",
  },

  uncovered_caches: {
    id: "uncovered_caches",
    name: "Uncovered Caches",
    class: "minor",
    maps: "all",
    effect: "Audio-cued caches spawn containing grenades, ammo, healing items, and blueprints.",
    hazard: "Aggressive raiders contest cache spawns",
    lootBoostCategories: ["quick_use"],
    lootBoostNote: "Weapon and weapon-part blueprints. Buried City sees the highest density.",
  },

  launch_tower_loot: {
    id: "launch_tower_loot",
    name: "Launch Tower Loot",
    class: "minor",
    maps: ["spaceport"],
    effect: "Towers locked behind 2 Fuel Cells; unlock to reach high-end loot at the summit.",
    hazard: "Jolt mines, camped towers, ARC patrols",
    specialRules: "Strongly party-recommended.",
    lootBoostCategories: ["trinket"],
    lootBoostNote: "Broad rarity uplift; weapons, trinkets, rare materials at the top.",
  },

  harvester: {
    id: "harvester",
    name: "Harvester",
    class: "minor",
    maps: "all",
    effect: "Locate the Harvester unit, solve a puzzle, then fight the Queen ARC.",
    hazard: "Queen ARC boss fight",
    specialRules: "One-time per round.",
    lootBoostItemIds: ["queen_reactor"],
    lootBoostNote: "Drops Jupiter and Equalizer blueprints. Bring strong weapons.",
  },

  matriarch: {
    id: "matriarch",
    name: "Matriarch",
    class: "minor",
    maps: "all",
    effect: "Direct Matriarch ARC bossfight — no puzzle prerequisite.",
    hazard: "Dangerous boss",
    lootBoostItemIds: ["matriarch_reactor"],
    lootBoostNote: "Drops Aphelion blueprint. Used in Aphelion crafting.",
  },

  beachcombing: {
    id: "beachcombing",
    name: "Beachcombing",
    class: "minor",
    maps: ["riven_tides"],
    effect:
      "Buried valuables across the Seabed. Dockmaster's Detector spawns in containers and is required to find buried loot. Bird flocks alert ARCs and other players when disturbed.",
    hazard: "Bird flocks reveal you; exposed dig sites have no cover",
    specialRules: "Richer dig sites have worse cover — trade-off play.",
    lootBoostCategories: ["basic", "refined", "trinket"],
    lootBoostNote:
      "Buried suitcases hold crafting materials; raider caches and weapon cases also spawn. Ship Model trinkets drop here (feeds the Last Resort / Miniature Voyages event). Specific item ids not enumerated on the wiki.",
  },

  bird_city: {
    id: "bird_city",
    name: "Bird City",
    class: "minor",
    maps: ["buried_city"],
    effect:
      "Bird flocks blanket the map. Chimneys on rooftops become lootable. Disturbing flocks alerts everyone.",
    hazard: "Disturbed flocks act as an audio/visual beacon",
    specialRules: "Nearly every rooftop chimney is searchable.",
    // Six condition-exclusive duck trinkets per the wiki — these only appear
    // during Bird City and are the headline drops players hunt for.
    lootBoostItemIds: [
      "alien_duck",
      "doodly_duck",
      "familiar_duck",
      "flashy_duck",
      "gentle_duck",
      "tropical_duck",
    ],
    lootBoostCategories: ["trinket"],
    lootBoostNote:
      "Chimneys also drop common materials and fruit/nature items; third-party guides mention named trinkets (Lance's Mixtape, Snow Globe, Music Box) — wiki doesn't bind these to Bird City exclusively, so not encoded.",
  },
};

// Display order for UI rendering (majors first, then minors, alphabetical within).
export const MAP_CONDITION_ORDER: string[] = [
  // Majors
  "night_raid",
  "electromagnetic_storm",
  "cold_snap",
  "close_scrutiny",
  "hidden_bunker",
  "locked_gate",
  "hurricane",
  // Minors
  "lush_blooms",
  "husk_graveyard",
  "prospecting_probes",
  "uncovered_caches",
  "launch_tower_loot",
  "harvester",
  "matriarch",
  "beachcombing",
  "bird_city",
];

/** True if the condition can rotate onto the given map. */
export function appliesToMap(conditionId: string, mapId: MapId): boolean {
  const c = MAP_CONDITIONS[conditionId];
  if (!c) return false;
  return c.maps === "all" || c.maps.includes(mapId);
}
