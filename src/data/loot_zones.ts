// ============================================================================
// FILE: data/loot_zones.ts
// PURPOSE: Per-map catalog of named Points of Interest (zones) and the loot-
//          category taxonomy used by the in-game minimap legend. Owns MapId
//          alongside map_conditions.ts (re-exported here so consumers have one
//          import site for "all map data").
//
//          The Looter prioritizer reads this to translate a player's material
//          goal into a "queue into map X, head to zone Y" recommendation.
//
//          Phase 1 scope (this file): static catalog — every named POI we can
//          read from the in-game cartograph maps, plus per-map availableCategories
//          (the set of loot-icon types that appear anywhere on the map's legend).
//          POI-level `categories` are filled where confidently readable;
//          otherwise omitted for later enrichment from in-game observation.
//          A single zone can carry multiple themed icons (e.g. Scrap Yard is
//          mechanical + industrial) — the field is intentionally an array.
//
// USED BY: looter prioritizer (planned) — pairs ZoneCategory → ItemCategory[]
//          via ZONE_CATEGORY_TO_ITEM_CATEGORIES to translate material goals to
//          map+zone targets.
//
// SOURCE: Cartotect community cartograph maps (Feb 14 2026 snapshot) for every
//          surface map, plus Stella Montis upper/lower and Blue Gate Underground.
//          Where a POI label was ambiguous in the screenshot it is flagged with
//          `unconfirmed: true` and should be reconciled against in-game.
// ============================================================================

import type { ItemCategory } from "./items";
import { MAP_IDS, type MapId } from "./map_conditions";

export { MAP_IDS, type MapId };

// ── Taxonomy ─────────────────────────────────────────────────────────────────

/**
 * The themed loot icons that appear on the in-game minimap legend. Each named
 * zone on a map is tagged with one of these in the game's UI. The set is the
 * union across every map's legend — not every category appears on every map
 * (see MapZoneCatalog.availableCategories).
 */
export type ZoneCategory =
  | "industrial"
  | "electrical"
  | "medical"
  | "commercial"
  | "technological"
  | "security"
  | "mechanical"
  | "arc"
  | "nature"
  | "residential"
  | "old_world"
  | "exodus"
  | "deforester"
  | "field_depot";

/**
 * Non-category map markers. These are the special icons on the legend that
 * aren't tied to a loot theme — extracts, hatches, spawns, boss locations.
 * A single zone can carry multiple markers (e.g. a Field Depot that is also a
 * Patriarch spawn).
 */
export type LootMarkerKind =
  | "cargo_elevator"
  | "airshaft"
  | "metro_station"
  | "raider_hatch"
  | "player_spawn"
  | "field_depot"
  | "queen_spawn"
  | "matriarch_spawn"
  | "patriarch_spawn"
  | "sentinel_spawn"
  | "baron_husk";

/**
 * Multi-level maps (Stella Montis, Blue Gate) use this to disambiguate which
 * tile a zone belongs to. Single-level maps omit it.
 */
export type MapLevel = "surface" | "upper" | "lower" | "underground";

export interface LootZone {
  /** Slug — unique within a map+level. */
  id: string;
  /** Verbatim in-game label as it appears on the cartograph map. */
  name: string;
  mapId: MapId;
  level?: MapLevel;
  /** Loot icons attached to the zone in-game. A single zone often carries
   *  multiple themes (e.g. Scrap Yard = mechanical + industrial). Empty/omit
   *  when not yet confirmed. */
  categories?: ZoneCategory[];
  /** Special markers on this zone (extract, hatch, spawn, boss, depot). */
  markers?: LootMarkerKind[];
  /** Free-text — gameplay quirks, puzzle notes, blueprint drops, etc. */
  notes?: string;
  /** True when the label or categories were unclear in source and need review. */
  unconfirmed?: boolean;
}

export interface MapZoneCatalog {
  mapId: MapId;
  level?: MapLevel;
  /** Display name for the map+level pairing, used as a section header. */
  displayName: string;
  /** Categories the in-game legend lists for this map. Engine constrains its
   *  recommendations to these — don't recommend a map for a category not in
   *  this set even if a POI hasn't been individually tagged. */
  availableCategories: ZoneCategory[];
  zones: LootZone[];
}

// ── ZoneCategory → ItemCategory bridge ───────────────────────────────────────

/**
 * Best-effort mapping from a zone's themed icon to the ITEMS categories you'd
 * expect to find there. Multiple targets are intentional — most zones drop a
 * mix. The Looter engine consumes this to rank maps for a given material goal.
 *
 * Tune this as the engine matures and we get loot-distribution data. Initial
 * values are educated guesses from category names + in-game intuition.
 */
export const ZONE_CATEGORY_TO_ITEM_CATEGORIES: Record<ZoneCategory, ItemCategory[]> = {
  industrial: ["basic", "topside", "refined"],
  electrical: ["topside", "refined"],
  medical: ["quick_use", "refined"],
  commercial: ["basic", "trinket"],
  technological: ["topside", "refined"],
  security: ["topside", "refined", "quick_use"],
  mechanical: ["basic", "topside"],
  arc: ["topside", "refined"],
  nature: ["nature"],
  residential: ["basic", "trinket", "quick_use"],
  old_world: ["trinket"],
  exodus: ["topside", "refined"],
  deforester: ["nature", "basic"],
  field_depot: ["basic", "topside", "refined", "quick_use"],
};

// ── Catalog ──────────────────────────────────────────────────────────────────

export const LOOT_ZONES: MapZoneCatalog[] = [
  // ── Dam Battlegrounds ────────────────────────────────────────────────────
  {
    mapId: "dam_battlegrounds",
    displayName: "Dam Battlegrounds",
    availableCategories: [
      "mechanical",
      "industrial",
      "electrical",
      "medical",
      "commercial",
      "technological",
      "security",
      "arc",
      "nature",
      "field_depot",
    ],
    zones: [
      { id: "west_broken_bridge", name: "West Broken Bridge", mapId: "dam_battlegrounds", markers: ["player_spawn"] },
      { id: "east_broken_bridge", name: "East Broken Bridge", mapId: "dam_battlegrounds", markers: ["player_spawn"] },
      { id: "pattern_house", name: "Pattern House", mapId: "dam_battlegrounds", categories: ["commercial"] },
      { id: "ruby_residence", name: "Ruby Residence", mapId: "dam_battlegrounds", categories: ["commercial"] },
      { id: "pale_apartments", name: "Pale Apartments", mapId: "dam_battlegrounds", categories: ["commercial"] },
      { id: "generator_hall", name: "Generator Hall", mapId: "dam_battlegrounds", categories: ["electrical", "industrial"] },
      { id: "ben_walders_sunroof", name: "Ben Walder's Sunroof", mapId: "dam_battlegrounds", unconfirmed: true },
      { id: "arc_power_generation_complex", name: "ARC Power Generation Complex", mapId: "dam_battlegrounds", categories: ["arc"] },
      { id: "raider_outpost_east", name: "Raider Outpost East", mapId: "dam_battlegrounds", markers: ["raider_hatch"] },
      { id: "hydroponic_dome_complex", name: "Hydroponic Dome Complex", mapId: "dam_battlegrounds", categories: ["nature"] },
      { id: "controlled_access_zone", name: "Controlled Access Zone", mapId: "dam_battlegrounds", categories: ["electrical", "industrial"], notes: "Patch 1.17.0 high-value loot area; electrical-panel puzzle deposit (powercells, batteries, metal parts, wires, motors, drivers, performance steel)." },
      { id: "pipeline_tower", name: "Pipeline Tower", mapId: "dam_battlegrounds", categories: ["industrial"] },
      { id: "old_battleground", name: "Old Battleground", mapId: "dam_battlegrounds" },
      { id: "the_breach", name: "The Breach", mapId: "dam_battlegrounds" },
      { id: "floodgates", name: "Floodgates", mapId: "dam_battlegrounds", categories: ["mechanical", "industrial"] },
      { id: "south_swamp_outpost", name: "South Swamp Outpost", mapId: "dam_battlegrounds", markers: ["raider_hatch"] },
      { id: "water_treatment_control", name: "Water Treatment Control", mapId: "dam_battlegrounds", categories: ["industrial", "mechanical"] },
      { id: "primary_facility", name: "Primary Facility", mapId: "dam_battlegrounds", categories: ["industrial"] },
      { id: "control_tower", name: "Control Tower", mapId: "dam_battlegrounds", categories: ["technological", "security"] },
      { id: "research_administration", name: "Research & Administration", mapId: "dam_battlegrounds", categories: ["technological", "medical"] },
      { id: "red_lakes_balcony", name: "Red Lakes Balcony", mapId: "dam_battlegrounds" },
      { id: "dam_balcony", name: "Dam Balcony", mapId: "dam_battlegrounds" },
      { id: "electrical_substation", name: "Electrical Substation", mapId: "dam_battlegrounds", categories: ["electrical"] },
      { id: "small_creek", name: "Small Creek", mapId: "dam_battlegrounds" },
      { id: "testing_annex", name: "Testing Annex", mapId: "dam_battlegrounds", categories: ["technological", "medical"] },
      { id: "electrical_tower", name: "Electrical Tower", mapId: "dam_battlegrounds", categories: ["electrical"] },
      { id: "water_towers", name: "Water Towers", mapId: "dam_battlegrounds", categories: ["industrial"] },
      { id: "scrap_yard", name: "Scrap Yard", mapId: "dam_battlegrounds", categories: ["mechanical", "industrial"] },
      { id: "wreckage", name: "Wreckage", mapId: "dam_battlegrounds", categories: ["mechanical"] },
      { id: "foothold_outpost", name: "Foothold Outpost", mapId: "dam_battlegrounds", markers: ["raider_hatch"] },
    ],
  },

  // ── Buried City ──────────────────────────────────────────────────────────
  {
    mapId: "buried_city",
    displayName: "Buried City",
    availableCategories: [
      "mechanical",
      "commercial",
      "technological",
      "residential",
      "medical",
      "old_world",
      "nature",
      "field_depot",
    ],
    zones: [
      { id: "gas_station", name: "Gas Station", mapId: "buried_city", categories: ["commercial", "mechanical"] },
      { id: "dj_daniels_warehouses", name: "DJ Daniel's Warehouses", mapId: "buried_city", categories: ["commercial"], unconfirmed: true },
      { id: "market_ruins", name: "Market Ruins", mapId: "buried_city", categories: ["commercial"] },
      { id: "olives_hill", name: "Olive's Hill", mapId: "buried_city", categories: ["nature"], unconfirmed: true },
      { id: "parking_garages", name: "Parking Garages", mapId: "buried_city", categories: ["mechanical"] },
      { id: "maxwell_tower", name: "Maxwell Tower", mapId: "buried_city", categories: ["residential", "commercial"], unconfirmed: true },
      { id: "maxwell_park", name: "Maxwell Park", mapId: "buried_city", categories: ["nature"] },
      { id: "dance_tower", name: "Dance Tower", mapId: "buried_city", categories: ["commercial", "residential"], unconfirmed: true },
      { id: "town_hall", name: "Town Hall", mapId: "buried_city", categories: ["old_world", "commercial"] },
      { id: "ruined_apartments", name: "Ruined Apartments", mapId: "buried_city", categories: ["residential"] },
      { id: "scaredoll_apartments", name: "Scaredoll Apartments", mapId: "buried_city", categories: ["residential"], unconfirmed: true },
      { id: "plaza_rusina", name: "Plaza Rusina", mapId: "buried_city", categories: ["commercial"], unconfirmed: true },
      { id: "plaza_almena", name: "Plaza Almena", mapId: "buried_city", categories: ["commercial"], unconfirmed: true },
      { id: "plaza_rosa", name: "Plaza Rosa", mapId: "buried_city", categories: ["commercial"], unconfirmed: true },
      { id: "casa_de_vino", name: "Casa de Vino", mapId: "buried_city", categories: ["commercial", "residential"] },
      { id: "pizza_vincent", name: "Pizza Vincent", mapId: "buried_city", categories: ["commercial"], unconfirmed: true },
      { id: "mass_street", name: "Mass Street", mapId: "buried_city", categories: ["residential", "commercial"], unconfirmed: true },
      { id: "red_tower", name: "Red Tower", mapId: "buried_city", categories: ["residential"] },
      { id: "church_ruins", name: "Church Ruins", mapId: "buried_city", categories: ["old_world"] },
      { id: "abandoned_highway_camp", name: "Abandoned Highway Camp", mapId: "buried_city", markers: ["raider_hatch"] },
    ],
  },

  // ── Acerra Spaceport ─────────────────────────────────────────────────────
  {
    mapId: "spaceport",
    displayName: "Acerra Spaceport",
    availableCategories: [
      "exodus",
      "industrial",
      "mechanical",
      "electrical",
      "commercial",
      "technological",
      "security",
      "field_depot",
    ],
    zones: [
      { id: "fuel_depot", name: "Fuel Depot", mapId: "spaceport", categories: ["industrial"], markers: ["field_depot"] },
      { id: "jiangsu_warehouse", name: "Jiangsu Warehouse", mapId: "spaceport", categories: ["industrial", "commercial"], unconfirmed: true },
      { id: "west_hangar", name: "West Hangar", mapId: "spaceport", categories: ["industrial", "exodus"] },
      { id: "east_hangar", name: "East Hangar", mapId: "spaceport", categories: ["industrial", "exodus"] },
      { id: "little_hangar", name: "Little Hangar", mapId: "spaceport", categories: ["industrial", "exodus"] },
      { id: "maintenance_hangar", name: "Maintenance Hangar", mapId: "spaceport", categories: ["mechanical"] },
      { id: "shipping_warehouse", name: "Shipping Warehouse", mapId: "spaceport", categories: ["industrial", "commercial"] },
      { id: "west_container_yard", name: "West Container Yard", mapId: "spaceport", categories: ["industrial"] },
      { id: "east_container_yard", name: "East Container Yard", mapId: "spaceport", categories: ["industrial"] },
      { id: "container_storage", name: "Container Storage", mapId: "spaceport", categories: ["industrial"] },
      { id: "north_trench_tower", name: "North Trench Tower", mapId: "spaceport", categories: ["security"] },
      { id: "south_trench_tower", name: "South Trench Tower", mapId: "spaceport", categories: ["security"] },
      { id: "the_trench", name: "The Trench", mapId: "spaceport", categories: ["security"] },
      { id: "car_park", name: "Car Park", mapId: "spaceport", categories: ["mechanical"] },
      { id: "arrival_building", name: "Arrival Building", mapId: "spaceport", categories: ["commercial", "exodus"] },
      { id: "departure_building", name: "Departure Building", mapId: "spaceport", categories: ["commercial", "exodus"] },
      { id: "launch_towers", name: "Launch Towers", mapId: "spaceport", categories: ["exodus"], notes: "Locked behind 2 Fuel Cells during the Launch Tower Loot condition (see map_conditions.ts)." },
      { id: "rocket_assembly", name: "Rocket Assembly", mapId: "spaceport", categories: ["exodus"] },
      { id: "fuel_control", name: "Fuel Control", mapId: "spaceport", categories: ["industrial", "technological"] },
      { id: "fuel_lines", name: "Fuel Lines", mapId: "spaceport", categories: ["industrial"] },
      { id: "fuel_storage", name: "Fuel Storage", mapId: "spaceport", categories: ["industrial"] },
      { id: "control_tower", name: "Control Tower", mapId: "spaceport", categories: ["technological", "security"] },
      { id: "vehicle_maintenance", name: "Vehicle Maintenance", mapId: "spaceport", categories: ["mechanical"] },
      { id: "communications_tower", name: "Communications Tower", mapId: "spaceport", categories: ["technological"] },
      { id: "service_buildings", name: "Service Buildings", mapId: "spaceport", categories: ["commercial"] },
      { id: "staff_parking", name: "Staff Parking", mapId: "spaceport", categories: ["mechanical", "commercial"] },
      { id: "security_checkpoint", name: "Security Checkpoint", mapId: "spaceport", categories: ["security"] },
      { id: "electrical_substation", name: "Electrical Substation", mapId: "spaceport", categories: ["electrical"] },
      { id: "east_plains_warehouse", name: "East Plains Warehouse", mapId: "spaceport", categories: ["industrial"], unconfirmed: true },
      { id: "water_towers", name: "Water Towers", mapId: "spaceport", categories: ["industrial"] },
    ],
  },

  // ── The Blue Gate (surface) ──────────────────────────────────────────────
  {
    mapId: "blue_gate",
    level: "surface",
    displayName: "The Blue Gate",
    availableCategories: [
      "mechanical",
      "technological",
      "electrical",
      "nature",
      "residential",
      "commercial",
      "security",
      "old_world",
      "industrial",
      "arc",
      "deforester",
    ],
    zones: [
      { id: "barren_clearing", name: "Barren Clearing", mapId: "blue_gate", level: "surface", categories: ["nature", "deforester"] },
      { id: "reinforced_reception", name: "Reinforced Reception", mapId: "blue_gate", level: "surface", categories: ["security", "commercial"], notes: "One of four Security-Code spawn rooms during the Locked Gate condition." },
      { id: "data_vault", name: "Data Vault", mapId: "blue_gate", level: "surface", categories: ["technological"] },
      { id: "pilgrims_peak", name: "Pilgrim's Peak", mapId: "blue_gate", level: "surface", categories: ["old_world"], notes: "Security-Code spawn during Locked Gate." },
      { id: "raiders_refuge", name: "Raider's Refuge", mapId: "blue_gate", level: "surface", categories: ["security"], markers: ["raider_hatch"], notes: "Security-Code spawn during Locked Gate." },
      { id: "headhouse", name: "Headhouse", mapId: "blue_gate", level: "surface", categories: ["mechanical", "industrial"] },
      { id: "trappers_glade", name: "Trapper's Glade", mapId: "blue_gate", level: "surface", categories: ["nature"] },
      { id: "dune_gates", name: "Dune Gates", mapId: "blue_gate", level: "surface", categories: ["security"] },
      { id: "warehouse_complex", name: "Warehouse Complex", mapId: "blue_gate", level: "surface", categories: ["industrial"] },
      { id: "gate_control_room", name: "Gate Control Room", mapId: "blue_gate", level: "surface", categories: ["security", "technological"], notes: "Entry point for Locked Gate condition; requires all 4 Security Codes." },
      { id: "abandoned_housing_project", name: "Abandoned Housing Project", mapId: "blue_gate", level: "surface", categories: ["residential"] },
      { id: "checkpoint", name: "Checkpoint", mapId: "blue_gate", level: "surface", categories: ["security"] },
      { id: "maintenance_bunker", name: "Maintenance Bunker", mapId: "blue_gate", level: "surface", categories: ["mechanical"] },
      { id: "broken_earth", name: "Broken Earth", mapId: "blue_gate", level: "surface", categories: ["nature"] },
      { id: "ridgeline", name: "Ridgeline", mapId: "blue_gate", level: "surface", categories: ["nature"] },
      { id: "highway_collapse", name: "Highway Collapse", mapId: "blue_gate", level: "surface", categories: ["mechanical"] },
      { id: "olive_grove", name: "Olive Grove", mapId: "blue_gate", level: "surface", categories: ["nature"] },
      { id: "ruined_homestead", name: "Ruined Homestead", mapId: "blue_gate", level: "surface", categories: ["residential", "nature"] },
      { id: "ancient_fort", name: "Ancient Fort", mapId: "blue_gate", level: "surface", categories: ["old_world"], notes: "Security-Code spawn during Locked Gate." },
      { id: "adorned_wreckage", name: "Adorned Wreckage", mapId: "blue_gate", level: "surface", categories: ["mechanical"], unconfirmed: true },
    ],
  },

  // ── The Blue Gate (underground) ──────────────────────────────────────────
  {
    mapId: "blue_gate",
    level: "underground",
    displayName: "The Blue Gate — Underground",
    availableCategories: [
      "mechanical",
      "technological",
      "electrical",
      "nature",
      "residential",
      "commercial",
      "security",
      "old_world",
      "industrial",
      "arc",
    ],
    zones: [
      { id: "traffic_tunnel", name: "Traffic Tunnel", mapId: "blue_gate", level: "underground", categories: ["industrial", "mechanical"] },
      { id: "security_wing", name: "Security Wing", mapId: "blue_gate", level: "underground", categories: ["security"], notes: "Houses the Blue Gate Confiscation Room (key required)." },
      { id: "maintenance_wing", name: "Maintenance Wing", mapId: "blue_gate", level: "underground", categories: ["mechanical"] },
      { id: "lucky_hatch", name: "Lucky Hatch", mapId: "blue_gate", level: "underground", markers: ["raider_hatch"] },
      { id: "cliffside_airshaft", name: "Cliffside Airshaft", mapId: "blue_gate", level: "underground", markers: ["airshaft"] },
      { id: "warehouse_airshaft", name: "Warehouse Airshaft", mapId: "blue_gate", level: "underground", markers: ["airshaft"] },
      { id: "prefab_hatch", name: "Prefab Hatch", mapId: "blue_gate", level: "underground", markers: ["raider_hatch"] },
      { id: "reinforced_hatch", name: "Reinforced Hatch", mapId: "blue_gate", level: "underground", markers: ["raider_hatch"] },
      { id: "forest_airshaft", name: "Forest Airshaft", mapId: "blue_gate", level: "underground", markers: ["airshaft"] },
      { id: "overlook_airshaft", name: "Overlook Airshaft", mapId: "blue_gate", level: "underground", markers: ["airshaft"] },
      { id: "fragrant_hatch", name: "Fragrant Hatch", mapId: "blue_gate", level: "underground", markers: ["raider_hatch"] },
    ],
  },

  // ── Stella Montis (upper) ────────────────────────────────────────────────
  // POI labels on the Stella maps are dense and partially obscured at the
  // available source resolution. Entries below are the labels we could read
  // with confidence; remaining named rooms (storerooms, sub-labs, etc.) need
  // an in-game pass to enumerate. Set unconfirmed:true on ambiguous reads.
  {
    mapId: "stella_montis",
    level: "upper",
    displayName: "Stella Montis — Upper Level",
    availableCategories: [
      "exodus",
      "mechanical",
      "technological",
      "medical",
      "industrial",
      "electrical",
      "security",
      "commercial",
      "old_world",
      "nature",
    ],
    zones: [
      { id: "assembly_area", name: "Assembly Area", mapId: "stella_montis", level: "upper", categories: ["industrial"], unconfirmed: true },
      { id: "foundry", name: "Foundry", mapId: "stella_montis", level: "upper", categories: ["industrial"], unconfirmed: true },
      { id: "loading_bay", name: "Loading Bay", mapId: "stella_montis", level: "upper", categories: ["industrial"] },
      { id: "storage_room", name: "Storage Room", mapId: "stella_montis", level: "upper", categories: ["commercial"] },
      { id: "medical_storeroom", name: "Medical Storeroom", mapId: "stella_montis", level: "upper", categories: ["medical"], unconfirmed: true },
      { id: "viewing_deck", name: "Viewing Deck", mapId: "stella_montis", level: "upper", categories: ["commercial"] },
      { id: "cooling_chamber", name: "Cooling Chamber", mapId: "stella_montis", level: "upper", categories: ["mechanical", "technological"], unconfirmed: true },
      { id: "caustic_cavern", name: "Caustic Cavern", mapId: "stella_montis", level: "upper", unconfirmed: true },
    ],
  },

  // ── Stella Montis (lower) ────────────────────────────────────────────────
  {
    mapId: "stella_montis",
    level: "lower",
    displayName: "Stella Montis — Lower Level",
    availableCategories: [
      "exodus",
      "mechanical",
      "technological",
      "medical",
      "industrial",
      "electrical",
      "security",
      "commercial",
      "old_world",
      "nature",
    ],
    zones: [
      { id: "robotics_sandbox_a", name: "Robotics Sandbox A", mapId: "stella_montis", level: "lower", categories: ["technological"] },
      { id: "robotics_sandbox_b", name: "Robotics Sandbox B", mapId: "stella_montis", level: "lower", categories: ["technological"] },
      { id: "lantern_tunnel", name: "Lantern Tunnel", mapId: "stella_montis", level: "lower", categories: ["mechanical"], unconfirmed: true },
      { id: "excavator", name: "Excavator", mapId: "stella_montis", level: "lower", categories: ["mechanical"], unconfirmed: true },
      { id: "loading_bay_lower", name: "Loading Bay", mapId: "stella_montis", level: "lower", categories: ["industrial"] },
      { id: "reception", name: "Reception", mapId: "stella_montis", level: "lower", categories: ["commercial"], unconfirmed: true },
      { id: "mosquito_tunnel", name: "Mosquito Tunnel", mapId: "stella_montis", level: "lower", unconfirmed: true },
    ],
  },

  // ── Riven Tides ──────────────────────────────────────────────────────────
  {
    mapId: "riven_tides",
    displayName: "Riven Tides",
    availableCategories: [
      "industrial",
      "electrical",
      "commercial",
      "residential",
      "arc",
      "technological",
      "exodus",
      "mechanical",
      "nature",
    ],
    zones: [
      { id: "port_authority_building", name: "Port Authority Building", mapId: "riven_tides", categories: ["technological", "commercial"] },
      { id: "wreckage", name: "Wreckage", mapId: "riven_tides", categories: ["mechanical"] },
      { id: "stacking_yard", name: "Stacking Yard", mapId: "riven_tides", categories: ["industrial"] },
      { id: "beach_bar", name: "Beach Bar", mapId: "riven_tides", categories: ["commercial"], unconfirmed: true },
      { id: "hotel_panorama_acherra", name: "Hotel Panorama Acherra", mapId: "riven_tides", categories: ["residential"], unconfirmed: true },
      { id: "boatyard", name: "Boatyard", mapId: "riven_tides", categories: ["mechanical"] },
      { id: "transfer_depot", name: "Transfer Depot", mapId: "riven_tides", categories: ["industrial", "commercial"], markers: ["field_depot"] },
      { id: "weighing_checkpoint", name: "Weighing Checkpoint", mapId: "riven_tides", categories: ["industrial", "commercial"] },
      { id: "customs_house", name: "Customs House", mapId: "riven_tides", categories: ["commercial"] },
      { id: "special_handling_tunnel", name: "Special Handling Tunnel", mapId: "riven_tides", categories: ["industrial"], unconfirmed: true },
      { id: "harpoon_road", name: "Harpoon Road", mapId: "riven_tides", categories: ["mechanical"], unconfirmed: true },
      { id: "tennis_court", name: "Tennis Court", mapId: "riven_tides", categories: ["residential"] },
      { id: "seabed", name: "Seabed", mapId: "riven_tides", categories: ["nature"], notes: "Beachcombing condition activates buried-loot dig sites here." },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Flat view of every zone across every map+level. */
export function allZones(): LootZone[] {
  return LOOT_ZONES.flatMap((c) => c.zones);
}

/** Catalogs for a given map (one entry per level — usually 1, 2 for multi-level maps). */
export function catalogsForMap(mapId: MapId): MapZoneCatalog[] {
  return LOOT_ZONES.filter((c) => c.mapId === mapId);
}

/** True if any catalog on this map advertises the category in its legend. */
export function mapHasCategory(mapId: MapId, category: ZoneCategory): boolean {
  return catalogsForMap(mapId).some((c) => c.availableCategories.includes(category));
}

/** Maps that could plausibly drop the given ItemCategory via any zone category. */
export function mapsForItemCategory(itemCategory: ItemCategory): MapId[] {
  const matchingZoneCats = (Object.entries(ZONE_CATEGORY_TO_ITEM_CATEGORIES) as [
    ZoneCategory,
    ItemCategory[],
  ][])
    .filter(([, cats]) => cats.includes(itemCategory))
    .map(([zc]) => zc);
  const hits = new Set<MapId>();
  for (const cat of LOOT_ZONES) {
    if (cat.availableCategories.some((zc) => matchingZoneCats.includes(zc))) {
      hits.add(cat.mapId);
    }
  }
  return [...hits];
}

// ── Dev-time integrity guard ────────────────────────────────────────────────
// Matches the pattern used by projects.ts / workbenches.ts — runs at module
// load in dev so typos surface immediately, not at recommendation time.

if (import.meta.env?.DEV) {
  const seenIds = new Set<string>();
  for (const catalog of LOOT_ZONES) {
    if (!MAP_IDS.includes(catalog.mapId)) {
      throw new Error(`LOOT_ZONES: unknown mapId "${catalog.mapId}"`);
    }
    for (const zone of catalog.zones) {
      const key = `${zone.mapId}:${zone.level ?? "_"}:${zone.id}`;
      if (seenIds.has(key)) {
        throw new Error(`LOOT_ZONES: duplicate zone id "${zone.id}" on ${catalog.displayName}`);
      }
      seenIds.add(key);
      if (zone.mapId !== catalog.mapId) {
        throw new Error(
          `LOOT_ZONES: zone "${zone.id}" mapId "${zone.mapId}" does not match catalog "${catalog.mapId}"`,
        );
      }
      if (zone.level !== catalog.level) {
        throw new Error(
          `LOOT_ZONES: zone "${zone.id}" level "${zone.level}" does not match catalog "${catalog.level}"`,
        );
      }
      for (const c of zone.categories ?? []) {
        if (!catalog.availableCategories.includes(c)) {
          throw new Error(
            `LOOT_ZONES: zone "${zone.id}" has category "${c}" not declared in ${catalog.displayName} availableCategories`,
          );
        }
      }
    }
  }
}
