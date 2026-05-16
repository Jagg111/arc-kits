// ============================================================================
// FILE: data/items.ts
// PURPOSE: Master index of in-game items (materials, recyclables, trinkets,
//          nature, quick-use). Excludes mods/weapons/keys/augments/shields/ammo
//          which live in their own data files.
// USED BY: builder/CostPill via the MATERIAL_INFO shim in constants.ts;
//          looter feature (planned) for material/zone prioritization.
// IMPORTS FROM: types/index.ts
// SOURCE: https://arcraiders.wiki/wiki/Loot — every row's hash/file/sell/stack/
//          rarity/recyclesTo is pulled directly from the wiki's Loot table.
// ============================================================================

import type { Rarity } from "../types";

// Categories mirror the wiki's own taxonomy verbatim so the data stays easy to
// reconcile against the source. Workshop/mod-craft consumption is intentionally
// NOT modeled here — that lives at the consumer side (workbench tiers, quest
// objectives, project objectives) once those data files land.
export type ItemCategory =
  | "basic"
  | "topside"
  | "refined"
  | "nature"
  | "trinket"
  | "recyclable"
  | "quick_use";

export interface RecycleOutput {
  id: string;
  qty: number;
}

export interface ItemImg {
  file: string;  // URL-encoded filename, e.g. "Lance%27s_Mixtape_%285th_Edition%29.png"
  hash: string;  // MediaWiki 2-segment MD5 prefix, e.g. "8/89" — NOT derivable from filename
}

export interface ItemEntry {
  id: string;
  name: string;            // user-facing display name (preserves wiki capitalization)
  rarity: Rarity;
  category: ItemCategory;
  stack: number | null;    // null for integrated/loaner items with no inventory semantics
  sell: number;            // credits; 0 for integrated items
  recyclesTo: RecycleOutput[];  // empty array = "Cannot be recycled" on wiki
  img: ItemImg;
}

// Build the wiki thumbnail URL for an item's icon.
// Default 96px matches the existing MATERIAL_INFO URL pattern used by CostPill.
export function itemImgUrl(img: ItemImg, size = 96): string {
  return `https://arcraiders.wiki/w/images/thumb/${img.hash}/${img.file}/${size}px-${img.file}.webp`;
}

export const ITEMS: Record<string, ItemEntry> = {
  // ── basic ──
  "chemicals": { id: "chemicals", name: "Chemicals", rarity: "Common", category: "basic", stack: 50, sell: 50, recyclesTo: [], img: { file: "Chemicals.png", hash: "9/92" } },
  "fabric": { id: "fabric", name: "Fabric", rarity: "Common", category: "basic", stack: 50, sell: 50, recyclesTo: [], img: { file: "Fabric.png", hash: "2/2b" } },
  "metal_parts": { id: "metal_parts", name: "Metal Parts", rarity: "Common", category: "basic", stack: 50, sell: 75, recyclesTo: [], img: { file: "Metal_Parts.png", hash: "8/89" } },
  "plastic_parts": { id: "plastic_parts", name: "Plastic Parts", rarity: "Common", category: "basic", stack: 50, sell: 60, recyclesTo: [], img: { file: "Plastic_Parts.png", hash: "c/c9" } },
  "rubber_parts": { id: "rubber_parts", name: "Rubber Parts", rarity: "Common", category: "basic", stack: 50, sell: 50, recyclesTo: [], img: { file: "Rubber_Parts.png", hash: "9/93" } },

  // ── topside ──
  "advanced_arc_powercell": { id: "advanced_arc_powercell", name: "Advanced ARC Powercell", rarity: "Rare", category: "topside", stack: 5, sell: 640, recyclesTo: [{ id: "arc_powercell", qty: 2 }], img: { file: "Advanced_ARC_Powercell.png", hash: "3/31" } },
  "arc_alloy": { id: "arc_alloy", name: "ARC Alloy", rarity: "Uncommon", category: "topside", stack: 15, sell: 200, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "ARC_Alloy.png", hash: "a/a6" } },
  "arc_circuitry": { id: "arc_circuitry", name: "ARC Circuitry", rarity: "Rare", category: "topside", stack: 5, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 2 }], img: { file: "ARC_Circuitry.png", hash: "d/dc" } },
  "arc_motion_core": { id: "arc_motion_core", name: "ARC Motion Core", rarity: "Rare", category: "topside", stack: 5, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 2 }], img: { file: "ARC_Motion_Core.png", hash: "a/ad" } },
  "arc_powercell": { id: "arc_powercell", name: "ARC Powercell", rarity: "Common", category: "topside", stack: 5, sell: 270, recyclesTo: [], img: { file: "ARC_Powercell.png", hash: "d/df" } },
  "battery": { id: "battery", name: "Battery", rarity: "Uncommon", category: "topside", stack: 15, sell: 250, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "Battery.png", hash: "6/6d" } },
  "canister": { id: "canister", name: "Canister", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "plastic_parts", qty: 3 }], img: { file: "Canister.png", hash: "5/5f" } },
  "complex_gun_parts": { id: "complex_gun_parts", name: "Complex Gun Parts", rarity: "Epic", category: "topside", stack: 3, sell: 3000, recyclesTo: [{ id: "simple_gun_parts", qty: 3 }], img: { file: "Complex_Gun_Parts.png", hash: "3/3d" } },
  "duct_tape": { id: "duct_tape", name: "Duct Tape", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "fabric", qty: 3 }], img: { file: "Duct_Tape.png", hash: "4/4e" } },
  "exodus_modules": { id: "exodus_modules", name: "Exodus Modules", rarity: "Epic", category: "topside", stack: 3, sell: 2750, recyclesTo: [{ id: "magnet", qty: 2 }, { id: "processor", qty: 2 }], img: { file: "Exodus_Modules.png", hash: "1/1b" } },
  "great_mullein": { id: "great_mullein", name: "Great Mullein", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "assorted_seeds", qty: 2 }], img: { file: "Great_Mullein.png", hash: "0/0d" } },
  "heavy_gun_parts": { id: "heavy_gun_parts", name: "Heavy Gun Parts", rarity: "Rare", category: "topside", stack: 5, sell: 700, recyclesTo: [{ id: "simple_gun_parts", qty: 2 }], img: { file: "Heavy_Gun_Parts.png", hash: "3/33" } },
  "light_gun_parts": { id: "light_gun_parts", name: "Light Gun Parts", rarity: "Rare", category: "topside", stack: 5, sell: 700, recyclesTo: [{ id: "simple_gun_parts", qty: 2 }], img: { file: "Light_Gun_Parts.png", hash: "c/c9" } },
  "magnet": { id: "magnet", name: "Magnet", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "Magnet.png", hash: "8/8c" } },
  "medium_gun_parts": { id: "medium_gun_parts", name: "Medium Gun Parts", rarity: "Rare", category: "topside", stack: 5, sell: 700, recyclesTo: [{ id: "simple_gun_parts", qty: 2 }], img: { file: "Medium_Gun_Parts.png", hash: "9/9a" } },
  "moss": { id: "moss", name: "Moss", rarity: "Rare", category: "topside", stack: 10, sell: 500, recyclesTo: [{ id: "assorted_seeds", qty: 3 }], img: { file: "Moss.png", hash: "6/64" } },
  "oil": { id: "oil", name: "Oil", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "chemicals", qty: 3 }], img: { file: "Oil.png", hash: "0/06" } },
  "processor": { id: "processor", name: "Processor", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "plastic_parts", qty: 1 }, { id: "wires", qty: 1 }], img: { file: "Processor.png", hash: "4/4e" } },
  "rope": { id: "rope", name: "Rope", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "fabric", qty: 5 }], img: { file: "Rope.png", hash: "b/b4" } },
  "sensors": { id: "sensors", name: "Sensors", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "metal_parts", qty: 1 }, { id: "wires", qty: 1 }], img: { file: "Sensors.png", hash: "9/9c" } },
  "simple_gun_parts": { id: "simple_gun_parts", name: "Simple Gun Parts", rarity: "Uncommon", category: "topside", stack: 10, sell: 330, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "Simple_Gun_Parts.png", hash: "d/da" } },
  "speaker_component": { id: "speaker_component", name: "Speaker Component", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "plastic_parts", qty: 2 }, { id: "rubber_parts", qty: 3 }], img: { file: "Speaker_Component.png", hash: "e/ee" } },
  "steel_spring": { id: "steel_spring", name: "Steel Spring", rarity: "Uncommon", category: "topside", stack: 15, sell: 300, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "Steel_Spring.png", hash: "d/db" } },
  "synthesized_fuel": { id: "synthesized_fuel", name: "Synthesized Fuel", rarity: "Rare", category: "topside", stack: 5, sell: 700, recyclesTo: [{ id: "oil", qty: 1 }, { id: "plastic_parts", qty: 1 }], img: { file: "Synthesized_Fuel.png", hash: "8/8e" } },
  "syringe": { id: "syringe", name: "Syringe", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "chemicals", qty: 2 }, { id: "plastic_parts", qty: 3 }], img: { file: "Syringe.png", hash: "1/17" } },
  "voltage_converter": { id: "voltage_converter", name: "Voltage Converter", rarity: "Rare", category: "topside", stack: 5, sell: 500, recyclesTo: [{ id: "rubber_parts", qty: 1 }, { id: "wires", qty: 1 }], img: { file: "Voltage_Converter.png", hash: "c/c7" } },
  "wires": { id: "wires", name: "Wires", rarity: "Uncommon", category: "topside", stack: 15, sell: 200, recyclesTo: [{ id: "rubber_parts", qty: 2 }], img: { file: "Wires.png", hash: "3/39" } },

  // ── refined ──
  "advanced_electrical_components": { id: "advanced_electrical_components", name: "Advanced Electrical Components", rarity: "Rare", category: "refined", stack: 5, sell: 1750, recyclesTo: [{ id: "electrical_components", qty: 1 }, { id: "wires", qty: 1 }], img: { file: "Advanced_Electrical_Components.png", hash: "9/9b" } },
  "advanced_mechanical_components": { id: "advanced_mechanical_components", name: "Advanced Mechanical Components", rarity: "Rare", category: "refined", stack: 5, sell: 1750, recyclesTo: [{ id: "mechanical_components", qty: 1 }, { id: "steel_spring", qty: 1 }], img: { file: "Advanced_Mechanical_Components.png", hash: "2/25" } },
  "antiseptic": { id: "antiseptic", name: "Antiseptic", rarity: "Rare", category: "refined", stack: 5, sell: 1000, recyclesTo: [{ id: "chemicals", qty: 10 }], img: { file: "Antiseptic.png", hash: "f/f5" } },
  "crude_explosives": { id: "crude_explosives", name: "Crude Explosives", rarity: "Uncommon", category: "refined", stack: 10, sell: 270, recyclesTo: [{ id: "chemicals", qty: 3 }], img: { file: "Crude_Explosives.png", hash: "f/fc" } },
  "durable_cloth": { id: "durable_cloth", name: "Durable Cloth", rarity: "Uncommon", category: "refined", stack: 10, sell: 640, recyclesTo: [{ id: "fabric", qty: 6 }], img: { file: "Durable_Cloth.png", hash: "2/25" } },
  "electrical_components": { id: "electrical_components", name: "Electrical Components", rarity: "Uncommon", category: "refined", stack: 10, sell: 640, recyclesTo: [{ id: "plastic_parts", qty: 3 }, { id: "rubber_parts", qty: 3 }], img: { file: "Electrical_Components.png", hash: "0/06" } },
  "explosive_compound": { id: "explosive_compound", name: "Explosive Compound", rarity: "Rare", category: "refined", stack: 5, sell: 1000, recyclesTo: [{ id: "crude_explosives", qty: 2 }], img: { file: "Explosive_Compound.png", hash: "1/11" } },
  "magnetic_accelerator": { id: "magnetic_accelerator", name: "Magnetic Accelerator", rarity: "Epic", category: "refined", stack: 3, sell: 5500, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "arc_motion_core", qty: 1 }], img: { file: "Magnetic_Accelerator.png", hash: "5/5e" } },
  "mechanical_components": { id: "mechanical_components", name: "Mechanical Components", rarity: "Uncommon", category: "refined", stack: 10, sell: 640, recyclesTo: [{ id: "rubber_parts", qty: 2 }, { id: "metal_parts", qty: 3 }], img: { file: "Mechanical_Components.png", hash: "9/94" } },
  "mod_components": { id: "mod_components", name: "Mod Components", rarity: "Rare", category: "refined", stack: 5, sell: 1750, recyclesTo: [{ id: "mechanical_components", qty: 1 }, { id: "steel_spring", qty: 1 }], img: { file: "Mod_Components.png", hash: "0/0f" } },
  "power_rod": { id: "power_rod", name: "Power Rod", rarity: "Epic", category: "refined", stack: 3, sell: 5000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "arc_circuitry", qty: 1 }], img: { file: "Power_Rod.png", hash: "3/31" } },

  // ── nature ──
  "agave": { id: "agave", name: "Agave", rarity: "Uncommon", category: "nature", stack: 10, sell: 1000, recyclesTo: [{ id: "assorted_seeds", qty: 3 }], img: { file: "Agave.png", hash: "4/47" } },
  "apricot": { id: "apricot", name: "Apricot", rarity: "Uncommon", category: "nature", stack: 10, sell: 640, recyclesTo: [{ id: "assorted_seeds", qty: 3 }], img: { file: "Apricot.png", hash: "f/fc" } },
  "assorted_seeds": { id: "assorted_seeds", name: "Assorted Seeds", rarity: "Common", category: "nature", stack: 100, sell: 100, recyclesTo: [], img: { file: "Assorted_Seeds.png", hash: "5/51" } },
  "candleberries": { id: "candleberries", name: "Candleberries", rarity: "Rare", category: "nature", stack: 10, sell: 460, recyclesTo: [{ id: "assorted_seeds", qty: 2 }], img: { file: "Candleberries.png", hash: "9/9e" } },
  "fertilizer": { id: "fertilizer", name: "Fertilizer", rarity: "Uncommon", category: "nature", stack: 5, sell: 1000, recyclesTo: [{ id: "assorted_seeds", qty: 2 }], img: { file: "Fertilizer.png", hash: "2/25" } },
  "fossilized_lightning": { id: "fossilized_lightning", name: "Fossilized Lightning", rarity: "Epic", category: "nature", stack: 1, sell: 4000, recyclesTo: [{ id: "explosive_compound", qty: 3 }], img: { file: "Fossilized_Lightning.png", hash: "8/81" } },
  "lemon": { id: "lemon", name: "Lemon", rarity: "Uncommon", category: "nature", stack: 10, sell: 640, recyclesTo: [{ id: "assorted_seeds", qty: 3 }], img: { file: "Lemon.png", hash: "3/35" } },
  "mushroom": { id: "mushroom", name: "Mushroom", rarity: "Uncommon", category: "nature", stack: 10, sell: 1000, recyclesTo: [], img: { file: "Mushroom.png", hash: "8/8c" } },
  "olives": { id: "olives", name: "Olives", rarity: "Uncommon", category: "nature", stack: 10, sell: 640, recyclesTo: [{ id: "assorted_seeds", qty: 2 }], img: { file: "Olives.png", hash: "f/f3" } },
  "prickly_pear": { id: "prickly_pear", name: "Prickly Pear", rarity: "Uncommon", category: "nature", stack: 10, sell: 640, recyclesTo: [{ id: "assorted_seeds", qty: 3 }], img: { file: "Prickly_Pear.png", hash: "8/80" } },
  "resin": { id: "resin", name: "Resin", rarity: "Common", category: "nature", stack: 10, sell: 1000, recyclesTo: [], img: { file: "Resin.png", hash: "2/2c" } },
  "roots": { id: "roots", name: "Roots", rarity: "Uncommon", category: "nature", stack: 10, sell: 640, recyclesTo: [{ id: "assorted_seeds", qty: 1 }], img: { file: "Roots.png", hash: "5/57" } },
  "snowball": { id: "snowball", name: "Snowball", rarity: "Common", category: "nature", stack: 5, sell: 10, recyclesTo: [], img: { file: "Snowball.png", hash: "0/04" } },

  // ── trinket ──
  "leviathans_crown_ship_model": { id: "leviathans_crown_ship_model", name: "\"Leviathan's Crown\" Ship Model", rarity: "Legendary", category: "trinket", stack: 1, sell: 10000, recyclesTo: [], img: { file: "Leviathan%27s_Crown_Ship_Model.png", hash: "7/71" } },
  "sirena_dorata_ship_model": { id: "sirena_dorata_ship_model", name: "\"Sirena Dorata\" Ship Model", rarity: "Epic", category: "trinket", stack: 1, sell: 7000, recyclesTo: [], img: { file: "Sirena_Dorata_Ship_Model.png", hash: "1/1e" } },
  "twilight_compass_ship_model": { id: "twilight_compass_ship_model", name: "\"Twilight Compass\" Ship Model", rarity: "Uncommon", category: "trinket", stack: 1, sell: 1000, recyclesTo: [], img: { file: "Twilight_Compass_Ship_Model.png", hash: "1/18" } },
  "velocity_ship_model": { id: "velocity_ship_model", name: "\"Velocity\" Ship Model", rarity: "Rare", category: "trinket", stack: 1, sell: 3000, recyclesTo: [], img: { file: "Velocity_Ship_Model.png", hash: "c/c4" } },
  "wind_sprite_ship_model": { id: "wind_sprite_ship_model", name: "\"Wind Sprite\" Ship Model", rarity: "Common", category: "trinket", stack: 1, sell: 1000, recyclesTo: [], img: { file: "Wind_Sprite_Ship_Model.png", hash: "9/95" } },
  "air_freshener": { id: "air_freshener", name: "Air Freshener", rarity: "Uncommon", category: "trinket", stack: 5, sell: 2000, recyclesTo: [], img: { file: "Air_Freshener.png", hash: "0/03" } },
  "alien_duck": { id: "alien_duck", name: "Alien Duck", rarity: "Uncommon", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Alien_Duck.png", hash: "3/3e" } },
  "bloated_tuna_can": { id: "bloated_tuna_can", name: "Bloated Tuna Can", rarity: "Common", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Bloated_Tuna_Can.png", hash: "0/01" } },
  "breathtaking_snow_globe": { id: "breathtaking_snow_globe", name: "Breathtaking Snow Globe", rarity: "Epic", category: "trinket", stack: 1, sell: 7000, recyclesTo: [], img: { file: "Breathtaking_Snow_Globe.png", hash: "6/63" } },
  "burnt_out_candles": { id: "burnt_out_candles", name: "Burnt-Out Candles", rarity: "Common", category: "trinket", stack: 15, sell: 640, recyclesTo: [], img: { file: "Burnt-Out_Candles.png", hash: "0/0a" } },
  "cat_bed": { id: "cat_bed", name: "Cat Bed", rarity: "Uncommon", category: "trinket", stack: 3, sell: 1000, recyclesTo: [], img: { file: "Cat_Bed.png", hash: "8/82" } },
  "coffee_pot": { id: "coffee_pot", name: "Coffee Pot", rarity: "Common", category: "trinket", stack: 3, sell: 1000, recyclesTo: [], img: { file: "Coffee_Pot.png", hash: "3/33" } },
  "dart_board": { id: "dart_board", name: "Dart Board", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Dart_Board.png", hash: "4/4d" } },
  "doodly_duck": { id: "doodly_duck", name: "Doodly Duck", rarity: "Rare", category: "trinket", stack: 15, sell: 3000, recyclesTo: [], img: { file: "Doodly_Duck.png", hash: "9/91" } },
  "empty_wine_bottle": { id: "empty_wine_bottle", name: "Empty Wine Bottle", rarity: "Common", category: "trinket", stack: 5, sell: 1000, recyclesTo: [], img: { file: "Empty_Wine_Bottle.png", hash: "e/e1" } },
  "expired_pasta": { id: "expired_pasta", name: "Expired Pasta", rarity: "Common", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Expired_Pasta.png", hash: "9/91" } },
  "faded_photograph": { id: "faded_photograph", name: "Faded Photograph", rarity: "Common", category: "trinket", stack: 15, sell: 640, recyclesTo: [], img: { file: "Faded_Photograph.png", hash: "0/0c" } },
  "familiar_duck": { id: "familiar_duck", name: "Familiar Duck", rarity: "Epic", category: "trinket", stack: 15, sell: 7000, recyclesTo: [], img: { file: "Familiar_Duck.png", hash: "4/4f" } },
  "film_reel": { id: "film_reel", name: "Film Reel", rarity: "Rare", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Film_Reel.png", hash: "4/44" } },
  "fine_wristwatch": { id: "fine_wristwatch", name: "Fine Wristwatch", rarity: "Rare", category: "trinket", stack: 3, sell: 3000, recyclesTo: [], img: { file: "Fine_Wristwatch.png", hash: "9/94" } },
  "flashy_duck": { id: "flashy_duck", name: "Flashy Duck", rarity: "Rare", category: "trinket", stack: 15, sell: 3000, recyclesTo: [], img: { file: "Flashy_Duck.png", hash: "f/f1" } },
  "gentle_duck": { id: "gentle_duck", name: "Gentle Duck", rarity: "Uncommon", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Gentle_Duck.png", hash: "c/c4" } },
  "lances_mixtape_5th_edition": { id: "lances_mixtape_5th_edition", name: "Lance's Mixtape (5th Edition)", rarity: "Epic", category: "trinket", stack: 3, sell: 10000, recyclesTo: [], img: { file: "Lance%27s_Mixtape_%285th_Edition%29.png", hash: "1/15" } },
  "light_bulb": { id: "light_bulb", name: "Light Bulb", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Light_Bulb.png", hash: "2/2c" } },
  "music_album": { id: "music_album", name: "Music Album", rarity: "Rare", category: "trinket", stack: 3, sell: 3000, recyclesTo: [], img: { file: "Music_Album.png", hash: "9/90" } },
  "music_box": { id: "music_box", name: "Music Box", rarity: "Rare", category: "trinket", stack: 3, sell: 5000, recyclesTo: [], img: { file: "Music_Box.png", hash: "7/74" } },
  "painted_box": { id: "painted_box", name: "Painted Box", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Painted_Box.png", hash: "5/53" } },
  "playing_cards": { id: "playing_cards", name: "Playing Cards", rarity: "Rare", category: "trinket", stack: 3, sell: 5000, recyclesTo: [], img: { file: "Playing_Cards.png", hash: "e/e2" } },
  "poster_of_natural_wonders": { id: "poster_of_natural_wonders", name: "Poster Of Natural Wonders", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Poster_Of_Natural_Wonders.png", hash: "2/2b" } },
  "pottery": { id: "pottery", name: "Pottery", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Pottery.png", hash: "c/c0" } },
  "red_coral_jewelry": { id: "red_coral_jewelry", name: "Red Coral Jewelry", rarity: "Rare", category: "trinket", stack: 3, sell: 5000, recyclesTo: [], img: { file: "Red_Coral_Jewelry.png", hash: "1/1a" } },
  "rosary": { id: "rosary", name: "Rosary", rarity: "Rare", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Rosary.png", hash: "7/77" } },
  "rubber_duck": { id: "rubber_duck", name: "Rubber Duck", rarity: "Common", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Rubber_Duck.png", hash: "d/df" } },
  "silver_teaspoon_set": { id: "silver_teaspoon_set", name: "Silver Teaspoon Set", rarity: "Rare", category: "trinket", stack: 3, sell: 3000, recyclesTo: [], img: { file: "Silver_Teaspoon_Set.png", hash: "9/90" } },
  "statuette": { id: "statuette", name: "Statuette", rarity: "Rare", category: "trinket", stack: 3, sell: 3000, recyclesTo: [], img: { file: "Statuette.png", hash: "8/8a" } },
  "torn_book": { id: "torn_book", name: "Torn Book", rarity: "Common", category: "trinket", stack: 5, sell: 1000, recyclesTo: [], img: { file: "Torn_Book.png", hash: "c/cc" } },
  "tropical_duck": { id: "tropical_duck", name: "Tropical Duck", rarity: "Uncommon", category: "trinket", stack: 15, sell: 1000, recyclesTo: [], img: { file: "Tropical_Duck.png", hash: "c/cc" } },
  "vase": { id: "vase", name: "Vase", rarity: "Rare", category: "trinket", stack: 3, sell: 3000, recyclesTo: [], img: { file: "Vase.png", hash: "6/6e" } },
  "very_comfortable_pillow": { id: "very_comfortable_pillow", name: "Very Comfortable Pillow", rarity: "Uncommon", category: "trinket", stack: 3, sell: 2000, recyclesTo: [], img: { file: "Very_Comfortable_Pillow.png", hash: "a/a4" } },

  // ── recyclable ──
  "alarm_clock": { id: "alarm_clock", name: "Alarm Clock", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "processor", qty: 1 }, { id: "plastic_parts", qty: 6 }], img: { file: "Alarm_Clock.png", hash: "9/95" } },
  "arc_coolant": { id: "arc_coolant", name: "ARC Coolant", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "chemicals", qty: 16 }], img: { file: "ARC_Coolant.png", hash: "e/e9" } },
  "arc_flex_rubber": { id: "arc_flex_rubber", name: "ARC Flex Rubber", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "rubber_parts", qty: 16 }], img: { file: "ARC_Flex_Rubber.png", hash: "2/29" } },
  "arc_performance_steel": { id: "arc_performance_steel", name: "ARC Performance Steel", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "metal_parts", qty: 12 }], img: { file: "ARC_Performance_Steel.png", hash: "0/02" } },
  "arc_synthetic_resin": { id: "arc_synthetic_resin", name: "ARC Synthetic Resin", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "plastic_parts", qty: 14 }], img: { file: "ARC_Synthetic_Resin.png", hash: "7/72" } },
  "arc_thermo_lining": { id: "arc_thermo_lining", name: "ARC Thermo Lining", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "fabric", qty: 16 }], img: { file: "ARC_Thermo_Lining.png", hash: "0/0f" } },
  "assessor_matrix": { id: "assessor_matrix", name: "Assessor Matrix", rarity: "Epic", category: "recyclable", stack: 1, sell: 5000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "advanced_arc_powercell", qty: 3 }], img: { file: "Assessor_Matrix.png", hash: "1/18" } },
  "bastion_cell": { id: "bastion_cell", name: "Bastion Cell", rarity: "Epic", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "arc_alloy", qty: 3 }], img: { file: "Bastion_Cell.png", hash: "0/06" } },
  "bicycle_pump": { id: "bicycle_pump", name: "Bicycle Pump", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "metal_parts", qty: 10 }, { id: "canister", qty: 4 }], img: { file: "Bicycle_Pump.png", hash: "f/fa" } },
  "bombardier_cell": { id: "bombardier_cell", name: "Bombardier Cell", rarity: "Epic", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "arc_alloy", qty: 3 }], img: { file: "Bombardier_Cell.png", hash: "4/46" } },
  "broken_flashlight": { id: "broken_flashlight", name: "Broken Flashlight", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "battery", qty: 2 }, { id: "metal_parts", qty: 6 }], img: { file: "Broken_Flashlight.png", hash: "1/17" } },
  "broken_guidance_system": { id: "broken_guidance_system", name: "Broken Guidance System", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "processor", qty: 4 }], img: { file: "Broken_Guidance_System.png", hash: "9/93" } },
  "broken_handheld_radio": { id: "broken_handheld_radio", name: "Broken Handheld Radio", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "wires", qty: 2 }, { id: "sensors", qty: 3 }], img: { file: "Broken_Handheld_Radio.png", hash: "3/3b" } },
  "broken_taser": { id: "broken_taser", name: "Broken Taser", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "battery", qty: 2 }, { id: "wires", qty: 2 }], img: { file: "Broken_Taser.png", hash: "1/18" } },
  "burned_arc_circuitry": { id: "burned_arc_circuitry", name: "Burned ARC Circuitry", rarity: "Uncommon", category: "recyclable", stack: 5, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 2 }], img: { file: "Burned_ARC_Circuitry.png", hash: "3/35" } },
  "camera_lens": { id: "camera_lens", name: "Camera Lens", rarity: "Uncommon", category: "recyclable", stack: 5, sell: 640, recyclesTo: [{ id: "plastic_parts", qty: 8 }], img: { file: "Camera_Lens.png", hash: "a/a6" } },
  "candle_holder": { id: "candle_holder", name: "Candle Holder", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Candle_Holder.png", hash: "5/58" } },
  "comet_igniter": { id: "comet_igniter", name: "Comet Igniter", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 2 }, { id: "crude_explosives", qty: 2 }], img: { file: "Comet_Igniter.png", hash: "c/c8" } },
  "coolant": { id: "coolant", name: "Coolant", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "oil", qty: 2 }, { id: "chemicals", qty: 5 }], img: { file: "Coolant.png", hash: "4/40" } },
  "cooling_coil": { id: "cooling_coil", name: "Cooling Coil", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "steel_spring", qty: 2 }, { id: "chemicals", qty: 6 }], img: { file: "Cooling_Coil.png", hash: "7/7f" } },
  "cooling_fan": { id: "cooling_fan", name: "Cooling Fan", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "plastic_parts", qty: 14 }, { id: "wires", qty: 4 }], img: { file: "Cooling_Fan.png", hash: "1/13" } },
  "cracked_bioscanner": { id: "cracked_bioscanner", name: "Cracked Bioscanner", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "battery", qty: 3 }, { id: "rubber_parts", qty: 3 }], img: { file: "Cracked_Bioscanner.png", hash: "9/9a" } },
  "crumpled_plastic_bottle": { id: "crumpled_plastic_bottle", name: "Crumpled Plastic Bottle", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 270, recyclesTo: [{ id: "plastic_parts", qty: 4 }], img: { file: "Crumpled_Plastic_Bottle.png", hash: "8/8e" } },
  "damaged_arc_motion_core": { id: "damaged_arc_motion_core", name: "Damaged ARC Motion Core", rarity: "Uncommon", category: "recyclable", stack: 5, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 2 }], img: { file: "Damaged_ARC_Motion_Core.png", hash: "9/9e" } },
  "damaged_arc_powercell": { id: "damaged_arc_powercell", name: "Damaged ARC Powercell", rarity: "Common", category: "recyclable", stack: 5, sell: 293, recyclesTo: [{ id: "arc_alloy", qty: 1 }], img: { file: "Damaged_ARC_Powercell.png", hash: "5/58" } },
  "damaged_fireball_burner": { id: "damaged_fireball_burner", name: "Damaged Fireball Burner", rarity: "Common", category: "recyclable", stack: 3, sell: 270, recyclesTo: [{ id: "arc_alloy", qty: 1 }], img: { file: "Damaged_Fireball_Burner.png", hash: "d/d8" } },
  "damaged_heat_sink": { id: "damaged_heat_sink", name: "Damaged Heat Sink", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "wires", qty: 2 }, { id: "metal_parts", qty: 6 }], img: { file: "Damaged_Heat_Sink.png", hash: "1/1f" } },
  "damaged_hornet_driver": { id: "damaged_hornet_driver", name: "Damaged Hornet Driver", rarity: "Common", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 2 }], img: { file: "Damaged_Hornet_Driver.png", hash: "9/96" } },
  "damaged_leaper_pulse_unit": { id: "damaged_leaper_pulse_unit", name: "Damaged Leaper Pulse Unit", rarity: "Common", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 3 }], img: { file: "Damaged_Leaper_Pulse_Unit.png", hash: "0/0a" } },
  "damaged_rocketeer_driver": { id: "damaged_rocketeer_driver", name: "Damaged Rocketeer Driver", rarity: "Common", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 3 }], img: { file: "Damaged_Rocketeer_Driver.png", hash: "3/3a" } },
  "damaged_snitch_scanner": { id: "damaged_snitch_scanner", name: "Damaged Snitch Scanner", rarity: "Common", category: "recyclable", stack: 3, sell: 659, recyclesTo: [], img: { file: "Damaged_Snitch_Scanner.png", hash: "8/83" } },
  "damaged_tick_pod": { id: "damaged_tick_pod", name: "Damaged Tick Pod", rarity: "Common", category: "recyclable", stack: 3, sell: 270, recyclesTo: [{ id: "arc_alloy", qty: 1 }], img: { file: "Damaged_Tick_Pod.png", hash: "d/d6" } },
  "damaged_wasp_driver": { id: "damaged_wasp_driver", name: "Damaged Wasp Driver", rarity: "Common", category: "recyclable", stack: 3, sell: 270, recyclesTo: [{ id: "arc_alloy", qty: 1 }], img: { file: "Damaged_Wasp_Driver.png", hash: "e/e6" } },
  "deflated_football": { id: "deflated_football", name: "Deflated Football", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "fabric", qty: 9 }, { id: "rubber_parts", qty: 9 }], img: { file: "Deflated_Football.png", hash: "7/7c" } },
  "degraded_arc_rubber": { id: "degraded_arc_rubber", name: "Degraded ARC Rubber", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "rubber_parts", qty: 11 }], img: { file: "Degraded_ARC_Rubber.png", hash: "3/37" } },
  "diving_goggles": { id: "diving_goggles", name: "Diving Goggles", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "rubber_parts", qty: 12 }], img: { file: "Diving_Goggles.png", hash: "1/1a" } },
  "dog_collar": { id: "dog_collar", name: "Dog Collar", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 1 }, { id: "fabric", qty: 8 }], img: { file: "Dog_Collar.png", hash: "c/c5" } },
  "dried_out_arc_resin": { id: "dried_out_arc_resin", name: "Dried-Out ARC Resin", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "plastic_parts", qty: 9 }], img: { file: "Dried-Out_ARC_Resin.png", hash: "0/0b" } },
  "expired_respirator": { id: "expired_respirator", name: "Expired Respirator", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "fabric", qty: 4 }, { id: "rubber_parts", qty: 8 }], img: { file: "Expired_Respirator.png", hash: "b/ba" } },
  "fireball_burner": { id: "fireball_burner", name: "Fireball Burner", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "crude_explosives", qty: 1 }], img: { file: "Fireball_Burner.png", hash: "8/8b" } },
  "firefly_burner": { id: "firefly_burner", name: "Firefly Burner", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 2 }, { id: "crude_explosives", qty: 2 }], img: { file: "Firefly_Burner.png", hash: "0/04" } },
  "flow_controller": { id: "flow_controller", name: "Flow Controller", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "sensors", qty: 1 }], img: { file: "Flow_Controller.png", hash: "b/b6" } },
  "frequency_modulation_box": { id: "frequency_modulation_box", name: "Frequency Modulation Box", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "speaker_component", qty: 1 }], img: { file: "Frequency_Modulation_Box.png", hash: "3/36" } },
  "fried_motherboard": { id: "fried_motherboard", name: "Fried Motherboard", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "electrical_components", qty: 2 }, { id: "plastic_parts", qty: 5 }], img: { file: "Fried_Motherboard.png", hash: "2/29" } },
  "frying_pan": { id: "frying_pan", name: "Frying Pan", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Frying_Pan.png", hash: "7/74" } },
  "garlic_press": { id: "garlic_press", name: "Garlic Press", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "metal_parts", qty: 12 }], img: { file: "Garlic_Press.png", hash: "8/88" } },
  "geiger_counter": { id: "geiger_counter", name: "Geiger Counter", rarity: "Epic", category: "recyclable", stack: 3, sell: 3500, recyclesTo: [{ id: "exodus_modules", qty: 1 }, { id: "battery", qty: 3 }], img: { file: "Geiger_Counter.png", hash: "3/37" } },
  "headphones": { id: "headphones", name: "Headphones", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "speaker_component", qty: 1 }, { id: "rubber_parts", qty: 7 }], img: { file: "Headphones.png", hash: "0/0f" } },
  "hornet_driver": { id: "hornet_driver", name: "Hornet Driver", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "electrical_components", qty: 1 }], img: { file: "Hornet_Driver.png", hash: "b/bb" } },
  "household_cleaner": { id: "household_cleaner", name: "Household Cleaner", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "chemicals", qty: 11 }], img: { file: "Household_Cleaner.png", hash: "3/36" } },
  "humidifier": { id: "humidifier", name: "Humidifier", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "canister", qty: 2 }, { id: "wires", qty: 2 }], img: { file: "Humidifier.png", hash: "4/4b" } },
  "ice_cream_scooper": { id: "ice_cream_scooper", name: "Ice Cream Scooper", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 7 }], img: { file: "Ice_Cream_Scooper.png", hash: "c/c9" } },
  "impure_arc_coolant": { id: "impure_arc_coolant", name: "Impure ARC Coolant", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "chemicals", qty: 12 }], img: { file: "Impure_ARC_Coolant.png", hash: "a/a0" } },
  "industrial_battery": { id: "industrial_battery", name: "Industrial Battery", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "battery", qty: 2 }, { id: "chemicals", qty: 7 }], img: { file: "Industrial_Battery.png", hash: "c/c9" } },
  "industrial_charger": { id: "industrial_charger", name: "Industrial Charger", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "voltage_converter", qty: 1 }, { id: "metal_parts", qty: 5 }], img: { file: "Industrial_Charger.png", hash: "6/66" } },
  "industrial_magnet": { id: "industrial_magnet", name: "Industrial Magnet", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "magnet", qty: 2 }, { id: "metal_parts", qty: 4 }], img: { file: "Industrial_Magnet.png", hash: "3/38" } },
  "ion_sputter": { id: "ion_sputter", name: "Ion Sputter", rarity: "Epic", category: "recyclable", stack: 3, sell: 6000, recyclesTo: [{ id: "exodus_modules", qty: 1 }, { id: "voltage_converter", qty: 4 }], img: { file: "Ion_Sputter.png", hash: "e/e7" } },
  "laboratory_reagents": { id: "laboratory_reagents", name: "Laboratory Reagents", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "chemicals", qty: 16 }, { id: "crude_explosives", qty: 3 }], img: { file: "Laboratory_Reagents.png", hash: "e/e5" } },
  "leaper_pulse_unit": { id: "leaper_pulse_unit", name: "Leaper Pulse Unit", rarity: "Epic", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "arc_alloy", qty: 3 }], img: { file: "Leaper_Pulse_Unit.png", hash: "a/a0" } },
  "magnetron": { id: "magnetron", name: "Magnetron", rarity: "Epic", category: "recyclable", stack: 3, sell: 6000, recyclesTo: [{ id: "magnetic_accelerator", qty: 1 }, { id: "steel_spring", qty: 1 }], img: { file: "Magnetron.png", hash: "a/a2" } },
  "matriarch_reactor": { id: "matriarch_reactor", name: "Matriarch Reactor", rarity: "Legendary", category: "recyclable", stack: 1, sell: 11000, recyclesTo: [{ id: "magnetic_accelerator", qty: 1 }, { id: "power_rod", qty: 1 }], img: { file: "Matriarch_Reactor.png", hash: "2/24" } },
  "metal_brackets": { id: "metal_brackets", name: "Metal Brackets", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Metal_Brackets.png", hash: "6/62" } },
  "microscope": { id: "microscope", name: "Microscope", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "magnet", qty: 3 }], img: { file: "Microscope.png", hash: "2/2c" } },
  "mini_centrifuge": { id: "mini_centrifuge", name: "Mini Centrifuge", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_mechanical_components", qty: 1 }, { id: "canister", qty: 2 }], img: { file: "Mini_Centrifuge.png", hash: "9/9f" } },
  "motor": { id: "motor", name: "Motor", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "mechanical_components", qty: 2 }, { id: "oil", qty: 2 }], img: { file: "Motor.png", hash: "0/0f" } },
  "number_plate": { id: "number_plate", name: "Number Plate", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 270, recyclesTo: [{ id: "metal_parts", qty: 3 }], img: { file: "Number_Plate.png", hash: "5/51" } },
  "polluted_air_filter": { id: "polluted_air_filter", name: "Polluted Air Filter", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "oil", qty: 2 }, { id: "fabric", qty: 6 }], img: { file: "Polluted_Air_Filter.png", hash: "6/6e" } },
  "pop_trigger": { id: "pop_trigger", name: "Pop Trigger", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "crude_explosives", qty: 1 }], img: { file: "Pop_Trigger.png", hash: "c/c6" } },
  "portable_tv": { id: "portable_tv", name: "Portable TV", rarity: "Rare", category: "recyclable", stack: 1, sell: 2000, recyclesTo: [{ id: "battery", qty: 2 }, { id: "wires", qty: 6 }], img: { file: "Portable_TV.png", hash: "5/5f" } },
  "power_bank": { id: "power_bank", name: "Power Bank", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "battery", qty: 2 }, { id: "wires", qty: 2 }], img: { file: "Power_Bank.png", hash: "7/77" } },
  "power_cable": { id: "power_cable", name: "Power Cable", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "wires", qty: 4 }], img: { file: "Power_Cable.png", hash: "f/f8" } },
  "projector": { id: "projector", name: "Projector", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "processor", qty: 1 }, { id: "wires", qty: 2 }], img: { file: "Projector.png", hash: "0/04" } },
  "queen_reactor": { id: "queen_reactor", name: "Queen Reactor", rarity: "Legendary", category: "recyclable", stack: 1, sell: 11000, recyclesTo: [{ id: "magnetic_accelerator", qty: 1 }, { id: "power_rod", qty: 1 }], img: { file: "Queen_Reactor.png", hash: "6/6b" } },
  "radio": { id: "radio", name: "Radio", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "sensors", qty: 1 }, { id: "speaker_component", qty: 1 }], img: { file: "Radio.png", hash: "3/31" } },
  "radio_relay": { id: "radio_relay", name: "Radio Relay", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "sensors", qty: 2 }, { id: "speaker_component", qty: 2 }], img: { file: "Radio_Relay.png", hash: "b/b6" } },
  "remote_control": { id: "remote_control", name: "Remote Control", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "sensors", qty: 1 }, { id: "plastic_parts", qty: 7 }], img: { file: "Remote_Control.png", hash: "f/f4" } },
  "ripped_safety_vest": { id: "ripped_safety_vest", name: "Ripped Safety Vest", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "durable_cloth", qty: 1 }, { id: "magnet", qty: 1 }], img: { file: "Ripped_Safety_Vest.png", hash: "a/a8" } },
  "rocket_thruster": { id: "rocket_thruster", name: "Rocket Thruster", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "synthesized_fuel", qty: 2 }, { id: "metal_parts", qty: 6 }], img: { file: "Rocket_Thruster.png", hash: "8/8a" } },
  "rocketeer_driver": { id: "rocketeer_driver", name: "Rocketeer Driver", rarity: "Epic", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_electrical_components", qty: 2 }, { id: "arc_alloy", qty: 3 }], img: { file: "Rocketeer_Driver.png", hash: "e/ef" } },
  "rotary_encoder": { id: "rotary_encoder", name: "Rotary Encoder", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "electrical_components", qty: 2 }, { id: "processor", qty: 2 }], img: { file: "Rotary_Encoder.png", hash: "e/e4" } },
  "rubber_pad": { id: "rubber_pad", name: "Rubber Pad", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "rubber_parts", qty: 18 }], img: { file: "Rubber_Pad.png", hash: "1/1a" } },
  "ruined_accordion": { id: "ruined_accordion", name: "Ruined Accordion", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "rubber_parts", qty: 18 }, { id: "steel_spring", qty: 3 }], img: { file: "Ruined_Accordion.png", hash: "a/a6" } },
  "ruined_augment": { id: "ruined_augment", name: "Ruined Augment", rarity: "Common", category: "recyclable", stack: 1, sell: 270, recyclesTo: [{ id: "plastic_parts", qty: 2 }, { id: "rubber_parts", qty: 2 }], img: { file: "Ruined_Augment.png", hash: "a/aa" } },
  "ruined_baton": { id: "ruined_baton", name: "Ruined Baton", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "rubber_parts", qty: 3 }, { id: "metal_parts", qty: 6 }], img: { file: "Ruined_Baton.png", hash: "e/ee" } },
  "ruined_handcuffs": { id: "ruined_handcuffs", name: "Ruined Handcuffs", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Ruined_Handcuffs.png", hash: "7/7c" } },
  "ruined_parachute": { id: "ruined_parachute", name: "Ruined Parachute", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "fabric", qty: 10 }], img: { file: "Ruined_Parachute.png", hash: "5/5c" } },
  "ruined_riot_shield": { id: "ruined_riot_shield", name: "Ruined Riot Shield", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "plastic_parts", qty: 10 }, { id: "rubber_parts", qty: 6 }], img: { file: "Ruined_Riot_Shield.png", hash: "c/cb" } },
  "ruined_tactical_vest": { id: "ruined_tactical_vest", name: "Ruined Tactical Vest", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "magnet", qty: 1 }, { id: "fabric", qty: 5 }], img: { file: "Ruined_Tactical_Vest.png", hash: "c/c2" } },
  "rusted_bolts": { id: "rusted_bolts", name: "Rusted Bolts", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Rusted_Bolts.png", hash: "b/bf" } },
  "rusted_gear": { id: "rusted_gear", name: "Rusted Gear", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "mechanical_components", qty: 2 }, { id: "metal_parts", qty: 4 }], img: { file: "Rusted_Gear.png", hash: "c/cf" } },
  "rusted_shut_medical_kit": { id: "rusted_shut_medical_kit", name: "Rusted Shut Medical Kit", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "antiseptic", qty: 1 }, { id: "syringe", qty: 2 }], img: { file: "Rusted_Shut_Medical_Kit.png", hash: "1/1a" } },
  "rusted_tools": { id: "rusted_tools", name: "Rusted Tools", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "steel_spring", qty: 1 }, { id: "metal_parts", qty: 8 }], img: { file: "Rusted_Tools.png", hash: "3/30" } },
  "rusty_arc_steel": { id: "rusty_arc_steel", name: "Rusty ARC Steel", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 8 }], img: { file: "Rusty_ARC_Steel.png", hash: "3/33" } },
  "sample_cleaner": { id: "sample_cleaner", name: "Sample Cleaner", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "assorted_seeds", qty: 14 }, { id: "electrical_components", qty: 2 }], img: { file: "Sample_Cleaner.png", hash: "d/d8" } },
  "sentinel_firing_core": { id: "sentinel_firing_core", name: "Sentinel Firing Core", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "arc_alloy", qty: 2 }, { id: "mechanical_components", qty: 2 }], img: { file: "Sentinel_Firing_Core.png", hash: "9/91" } },
  "shredder_gyro": { id: "shredder_gyro", name: "Shredder Gyro", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "arc_alloy", qty: 2 }, { id: "mechanical_components", qty: 2 }], img: { file: "Shredder_Gyro.png", hash: "9/96" } },
  "signal_amplifier": { id: "signal_amplifier", name: "Signal Amplifier", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "electrical_components", qty: 2 }, { id: "voltage_converter", qty: 2 }], img: { file: "Signal_Amplifier.png", hash: "d/de" } },
  "snitch_scanner": { id: "snitch_scanner", name: "Snitch Scanner", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "electrical_components", qty: 1 }], img: { file: "Snitch_Scanner.png", hash: "e/e5" } },
  "spectrometer": { id: "spectrometer", name: "Spectrometer", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "sensors", qty: 1 }], img: { file: "Spectrometer.png", hash: "0/0e" } },
  "spectrum_analyzer": { id: "spectrum_analyzer", name: "Spectrum Analyzer", rarity: "Epic", category: "recyclable", stack: 3, sell: 3500, recyclesTo: [{ id: "exodus_modules", qty: 1 }, { id: "sensors", qty: 1 }], img: { file: "Spectrum_Analyzer.png", hash: "0/0a" } },
  "spotter_relay": { id: "spotter_relay", name: "Spotter Relay", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "electrical_components", qty: 1 }], img: { file: "Spotter_Relay.png", hash: "5/58" } },
  "spring_cushion": { id: "spring_cushion", name: "Spring Cushion", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "durable_cloth", qty: 2 }, { id: "steel_spring", qty: 2 }], img: { file: "Spring_Cushion.png", hash: "2/26" } },
  "surveyor_vault": { id: "surveyor_vault", name: "Surveyor Vault", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "mechanical_components", qty: 1 }], img: { file: "Surveyor_Vault.png", hash: "a/a9" } },
  "tattered_arc_lining": { id: "tattered_arc_lining", name: "Tattered ARC Lining", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "fabric", qty: 12 }], img: { file: "Tattered_ARC_Lining.png", hash: "3/35" } },
  "tattered_clothes": { id: "tattered_clothes", name: "Tattered Clothes", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "fabric", qty: 11 }], img: { file: "Tattered_Clothes.png", hash: "c/c4" } },
  "telemetry_transceiver": { id: "telemetry_transceiver", name: "Telemetry Transceiver", rarity: "Rare", category: "recyclable", stack: 3, sell: 3000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "processor", qty: 1 }], img: { file: "Telemetry_Transceiver.png", hash: "a/a8" } },
  "thermostat": { id: "thermostat", name: "Thermostat", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "sensors", qty: 1 }, { id: "rubber_parts", qty: 7 }], img: { file: "Thermostat.png", hash: "9/9a" } },
  "tick_pod": { id: "tick_pod", name: "Tick Pod", rarity: "Uncommon", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 2 }, { id: "chemicals", qty: 2 }], img: { file: "Tick_Pod.png", hash: "9/95" } },
  "toaster": { id: "toaster", name: "Toaster", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "wires", qty: 3 }, { id: "plastic_parts", qty: 5 }], img: { file: "Toaster.png", hash: "5/50" } },
  "torn_blanket": { id: "torn_blanket", name: "Torn Blanket", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "fabric", qty: 12 }], img: { file: "Torn_Blanket.png", hash: "a/af" } },
  "turbine_compressor": { id: "turbine_compressor", name: "Turbine Compressor", rarity: "Epic", category: "recyclable", stack: 3, sell: 5000, recyclesTo: [{ id: "arc_circuitry", qty: 1 }, { id: "arc_motion_core", qty: 1 }], img: { file: "Turbine_Compressor.png", hash: "d/d4" } },
  "turbo_pump": { id: "turbo_pump", name: "Turbo Pump", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "mechanical_components", qty: 1 }, { id: "oil", qty: 3 }], img: { file: "Turbo_Pump.png", hash: "f/f1" } },
  "unusable_weapon": { id: "unusable_weapon", name: "Unusable Weapon", rarity: "Rare", category: "recyclable", stack: 3, sell: 2000, recyclesTo: [{ id: "metal_parts", qty: 4 }, { id: "simple_gun_parts", qty: 5 }], img: { file: "Unusable_Weapon.png", hash: "3/37" } },
  "vaporizer_regulator": { id: "vaporizer_regulator", name: "Vaporizer Regulator", rarity: "Epic", category: "recyclable", stack: 3, sell: 6000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "arc_circuitry", qty: 2 }], img: { file: "Vaporizer_Regulator.png", hash: "b/b8" } },
  "wasp_driver": { id: "wasp_driver", name: "Wasp Driver", rarity: "Rare", category: "recyclable", stack: 3, sell: 640, recyclesTo: [{ id: "arc_alloy", qty: 1 }, { id: "electrical_components", qty: 1 }], img: { file: "Wasp_Driver.png", hash: "3/30" } },
  "water_filter": { id: "water_filter", name: "Water Filter", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "rubber_parts", qty: 2 }, { id: "canister", qty: 3 }], img: { file: "Water_Filter.png", hash: "4/48" } },
  "water_pump": { id: "water_pump", name: "Water Pump", rarity: "Rare", category: "recyclable", stack: 3, sell: 1000, recyclesTo: [{ id: "oil", qty: 2 }, { id: "metal_parts", qty: 4 }], img: { file: "Water_Pump.png", hash: "2/28" } },

  // ── quick_use ──
  "acoustic_guitar": { id: "acoustic_guitar", name: "Acoustic Guitar", rarity: "Legendary", category: "quick_use", stack: 1, sell: 7000, recyclesTo: [{ id: "metal_parts", qty: 4 }, { id: "wires", qty: 6 }], img: { file: "Acoustic_Guitar.png", hash: "5/50" } },
  "adrenaline_shot": { id: "adrenaline_shot", name: "Adrenaline Shot", rarity: "Common", category: "quick_use", stack: 5, sell: 300, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "plastic_parts", qty: 1 }], img: { file: "Adrenaline_Shot.png", hash: "1/1b" } },
  "agave_juice": { id: "agave_juice", name: "Agave Juice", rarity: "Common", category: "quick_use", stack: 5, sell: 1800, recyclesTo: [], img: { file: "Agave_Juice.png", hash: "a/a8" } },
  "bandage": { id: "bandage", name: "Bandage", rarity: "Common", category: "quick_use", stack: 5, sell: 250, recyclesTo: [{ id: "fabric", qty: 2 }], img: { file: "Bandage.png", hash: "0/0c" } },
  "barricade_kit": { id: "barricade_kit", name: "Barricade Kit", rarity: "Uncommon", category: "quick_use", stack: 3, sell: 640, recyclesTo: [{ id: "metal_parts", qty: 4 }], img: { file: "Barricade_Kit.png", hash: "c/cb" } },
  "binoculars": { id: "binoculars", name: "Binoculars", rarity: "Common", category: "quick_use", stack: 1, sell: 640, recyclesTo: [{ id: "rubber_parts", qty: 2 }, { id: "plastic_parts", qty: 4 }], img: { file: "Binoculars.png", hash: "7/74" } },
  "blaze_grenade": { id: "blaze_grenade", name: "Blaze Grenade", rarity: "Rare", category: "quick_use", stack: 5, sell: 1600, recyclesTo: [{ id: "oil", qty: 2 }, { id: "metal_parts", qty: 4 }], img: { file: "Blaze_Grenade.png", hash: "2/24" } },
  "blaze_grenade_trap": { id: "blaze_grenade_trap", name: "Blaze Grenade Trap", rarity: "Rare", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [], img: { file: "Blaze_Grenade_Trap.png", hash: "a/af" } },
  "blue_light_stick": { id: "blue_light_stick", name: "Blue Light Stick", rarity: "Common", category: "quick_use", stack: 5, sell: 150, recyclesTo: [{ id: "chemicals", qty: 1 }], img: { file: "Blue_Light_Stick.png", hash: "c/cc" } },
  "crash_mat": { id: "crash_mat", name: "Crash Mat", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 1200, recyclesTo: [{ id: "plastic_parts", qty: 3 }, { id: "fabric", qty: 6 }], img: { file: "Crash_Mat.png", hash: "7/75" } },
  "deadline": { id: "deadline", name: "Deadline", rarity: "Epic", category: "quick_use", stack: 1, sell: 6000, recyclesTo: [{ id: "arc_circuitry", qty: 1 }, { id: "explosive_compound", qty: 1 }], img: { file: "Deadline.png", hash: "c/c7" } },
  "defibrillator": { id: "defibrillator", name: "Defibrillator", rarity: "Rare", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [{ id: "moss", qty: 1 }, { id: "plastic_parts", qty: 1 }], img: { file: "Defibrillator.png", hash: "5/5f" } },
  "dockmasters_detector": { id: "dockmasters_detector", name: "Dockmaster's Detector", rarity: "Uncommon", category: "quick_use", stack: null, sell: 1000, recyclesTo: [], img: { file: "Dockmaster%27s_Detector.png", hash: "4/41" } },
  "door_blocker": { id: "door_blocker", name: "Door Blocker", rarity: "Common", category: "quick_use", stack: 3, sell: 270, recyclesTo: [{ id: "metal_parts", qty: 2 }], img: { file: "Door_Blocker.png", hash: "6/68" } },
  "explosive_mine": { id: "explosive_mine", name: "Explosive Mine", rarity: "Rare", category: "quick_use", stack: 3, sell: 1500, recyclesTo: [{ id: "sensors", qty: 1 }, { id: "oil", qty: 2 }], img: { file: "Explosive_Mine.png", hash: "2/22" } },
  "firecracker": { id: "firecracker", name: "Firecracker", rarity: "Common", category: "quick_use", stack: 5, sell: 270, recyclesTo: [{ id: "plastic_parts", qty: 3 }], img: { file: "Firecracker.png", hash: "8/86" } },
  "fireworks_box": { id: "fireworks_box", name: "Fireworks Box", rarity: "Rare", category: "quick_use", stack: 1, sell: 2000, recyclesTo: [{ id: "explosive_compound", qty: 1 }], img: { file: "Fireworks_Box.png", hash: "0/0f" } },
  "flame_spray": { id: "flame_spray", name: "Flame Spray", rarity: "Uncommon", category: "quick_use", stack: 1, sell: 2000, recyclesTo: [{ id: "canister", qty: 1 }, { id: "fireball_burner", qty: 1 }], img: { file: "Flame_Spray.png", hash: "7/73" } },
  "fruit_mix": { id: "fruit_mix", name: "Fruit Mix", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 1800, recyclesTo: [], img: { file: "Fruit_Mix.png", hash: "5/5a" } },
  "gas_grenade": { id: "gas_grenade", name: "Gas Grenade", rarity: "Common", category: "quick_use", stack: 3, sell: 270, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "rubber_parts", qty: 1 }], img: { file: "Gas_Grenade.png", hash: "f/fe" } },
  "gas_grenade_trap": { id: "gas_grenade_trap", name: "Gas Grenade Trap", rarity: "Common", category: "quick_use", stack: 3, sell: 300, recyclesTo: [], img: { file: "Gas_Grenade_Trap.png", hash: "3/33" } },
  "gas_mine": { id: "gas_mine", name: "Gas Mine", rarity: "Common", category: "quick_use", stack: 3, sell: 270, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "rubber_parts", qty: 1 }], img: { file: "Gas_Mine.png", hash: "c/ce" } },
  "green_light_stick": { id: "green_light_stick", name: "Green Light Stick", rarity: "Common", category: "quick_use", stack: 5, sell: 150, recyclesTo: [{ id: "chemicals", qty: 1 }], img: { file: "Green_Light_Stick.png", hash: "2/27" } },
  "heavy_fuze_grenade": { id: "heavy_fuze_grenade", name: "Heavy Fuze Grenade", rarity: "Rare", category: "quick_use", stack: 3, sell: 1600, recyclesTo: [{ id: "oil", qty: 1 }, { id: "rubber_parts", qty: 2 }], img: { file: "Heavy_Fuze_Grenade.png", hash: "e/ea" } },
  "herbal_bandage": { id: "herbal_bandage", name: "Herbal Bandage", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 900, recyclesTo: [{ id: "assorted_seeds", qty: 2 }, { id: "fabric", qty: 5 }], img: { file: "Herbal_Bandage.png", hash: "c/c5" } },
  "integrated_binoculars": { id: "integrated_binoculars", name: "Integrated Binoculars", rarity: "Common", category: "quick_use", stack: null, sell: 0, recyclesTo: [], img: { file: "Binoculars.png", hash: "7/74" } },
  "integrated_defibrillator": { id: "integrated_defibrillator", name: "Integrated Defibrillator", rarity: "Rare", category: "quick_use", stack: 1, sell: 0, recyclesTo: [], img: { file: "Defibrillator.png", hash: "5/5f" } },
  "integrated_shield_recharger": { id: "integrated_shield_recharger", name: "Integrated Shield Recharger", rarity: "Common", category: "quick_use", stack: null, sell: 0, recyclesTo: [], img: { file: "Integrated_Shield_Recharger.png", hash: "a/a7" } },
  "jolt_mine": { id: "jolt_mine", name: "Jolt Mine", rarity: "Rare", category: "quick_use", stack: 3, sell: 850, recyclesTo: [{ id: "battery", qty: 1 }, { id: "plastic_parts", qty: 2 }], img: { file: "Jolt_Mine.png", hash: "5/5a" } },
  "lil_smoke_grenade": { id: "lil_smoke_grenade", name: "Li'l Smoke Grenade", rarity: "Common", category: "quick_use", stack: 5, sell: 300, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "plastic_parts", qty: 1 }], img: { file: "Li%27l_Smoke_Grenade.png", hash: "0/0d" } },
  "light_impact_grenade": { id: "light_impact_grenade", name: "Light Impact Grenade", rarity: "Common", category: "quick_use", stack: 5, sell: 270, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "plastic_parts", qty: 1 }], img: { file: "Light_Impact_Grenade.png", hash: "4/4c" } },
  "lure_grenade": { id: "lure_grenade", name: "Lure Grenade", rarity: "Uncommon", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [{ id: "speaker_component", qty: 1 }], img: { file: "Lure_Grenade.png", hash: "7/77" } },
  "lure_grenade_trap": { id: "lure_grenade_trap", name: "Lure Grenade Trap", rarity: "Uncommon", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [], img: { file: "Lure_Grenade_Trap.png", hash: "9/92" } },
  "noisemaker": { id: "noisemaker", name: "Noisemaker", rarity: "Common", category: "quick_use", stack: 3, sell: 640, recyclesTo: [{ id: "speaker_component", qty: 1 }], img: { file: "Noisemaker.png", hash: "5/5c" } },
  "photoelectric_cloak": { id: "photoelectric_cloak", name: "Photoelectric Cloak", rarity: "Epic", category: "quick_use", stack: 1, sell: 5000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "speaker_component", qty: 1 }], img: { file: "Photoelectric_Cloak.png", hash: "0/06" } },
  "powered_descender": { id: "powered_descender", name: "Powered Descender", rarity: "Epic", category: "quick_use", stack: 1, sell: 10000, recyclesTo: [{ id: "advanced_electrical_components", qty: 1 }, { id: "arc_circuitry", qty: 1 }], img: { file: "Powered_Descender.png", hash: "2/21" } },
  "pulse_mine": { id: "pulse_mine", name: "Pulse Mine", rarity: "Uncommon", category: "quick_use", stack: 3, sell: 470, recyclesTo: [{ id: "chemicals", qty: 6 }], img: { file: "Pulse_Mine.png", hash: "a/af" } },
  "recorder": { id: "recorder", name: "Recorder", rarity: "Uncommon", category: "quick_use", stack: 1, sell: 1000, recyclesTo: [{ id: "plastic_parts", qty: 10 }], img: { file: "Recorder.png", hash: "6/6d" } },
  "red_light_stick": { id: "red_light_stick", name: "Red Light Stick", rarity: "Common", category: "quick_use", stack: 5, sell: 150, recyclesTo: [{ id: "chemicals", qty: 1 }], img: { file: "Red_Light_Stick.png", hash: "9/93" } },
  "remote_raider_flare": { id: "remote_raider_flare", name: "Remote Raider Flare", rarity: "Common", category: "quick_use", stack: 3, sell: 270, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "rubber_parts", qty: 1 }], img: { file: "Remote_Raider_Flare.png", hash: "f/ff" } },
  "seeker_grenade": { id: "seeker_grenade", name: "Seeker Grenade", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 640, recyclesTo: [{ id: "crude_explosives", qty: 1 }], img: { file: "Seeker_Grenade.png", hash: "3/35" } },
  "shaker": { id: "shaker", name: "Shaker", rarity: "Uncommon", category: "quick_use", stack: 1, sell: 1000, recyclesTo: [{ id: "plastic_parts", qty: 10 }], img: { file: "Shaker.png", hash: "2/22" } },
  "shield_recharger": { id: "shield_recharger", name: "Shield Recharger", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 520, recyclesTo: [{ id: "rubber_parts", qty: 4 }], img: { file: "Shield_Recharger.png", hash: "4/44" } },
  "showstopper": { id: "showstopper", name: "Showstopper", rarity: "Rare", category: "quick_use", stack: 5, sell: 2100, recyclesTo: [{ id: "electrical_components", qty: 1 }, { id: "voltage_converter", qty: 1 }], img: { file: "Showstopper.png", hash: "1/18" } },
  "shrapnel_grenade": { id: "shrapnel_grenade", name: "Shrapnel Grenade", rarity: "Uncommon", category: "quick_use", stack: 5, sell: 800, recyclesTo: [{ id: "crude_explosives", qty: 1 }, { id: "metal_parts", qty: 1 }], img: { file: "Shrapnel_Grenade.png", hash: "5/5f" } },
  "smoke_grenade": { id: "smoke_grenade", name: "Smoke Grenade", rarity: "Rare", category: "quick_use", stack: 5, sell: 1000, recyclesTo: [{ id: "canister", qty: 1 }, { id: "chemicals", qty: 2 }], img: { file: "Smoke_Grenade.png", hash: "d/d5" } },
  "smoke_grenade_trap": { id: "smoke_grenade_trap", name: "Smoke Grenade Trap", rarity: "Rare", category: "quick_use", stack: 3, sell: 640, recyclesTo: [], img: { file: "Smoke_Grenade_Trap.png", hash: "a/ac" } },
  "snap_blast_grenade": { id: "snap_blast_grenade", name: "Snap Blast Grenade", rarity: "Uncommon", category: "quick_use", stack: 3, sell: 800, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "magnet", qty: 1 }], img: { file: "Snap_Blast_Grenade.png", hash: "7/77" } },
  "snap_hook": { id: "snap_hook", name: "Snap Hook", rarity: "Legendary", category: "quick_use", stack: 1, sell: 14000, recyclesTo: [{ id: "power_rod", qty: 1 }, { id: "rope", qty: 3 }], img: { file: "Snap_Hook.png", hash: "5/56" } },
  "sterilized_bandage": { id: "sterilized_bandage", name: "Sterilized Bandage", rarity: "Rare", category: "quick_use", stack: 3, sell: 2000, recyclesTo: [{ id: "antiseptic", qty: 1 }, { id: "fabric", qty: 1 }], img: { file: "Sterilized_Bandage.png", hash: "9/99" } },
  "surge_coil": { id: "surge_coil", name: "Surge Coil", rarity: "Rare", category: "quick_use", stack: 3, sell: 2100, recyclesTo: [{ id: "electrical_components", qty: 1 }, { id: "sensors", qty: 1 }], img: { file: "Surge_Coil.png", hash: "5/5b" } },
  "surge_shield_recharger": { id: "surge_shield_recharger", name: "Surge Shield Recharger", rarity: "Rare", category: "quick_use", stack: 5, sell: 1200, recyclesTo: [{ id: "electrical_components", qty: 1 }], img: { file: "Surge_Shield_Recharger.png", hash: "c/c9" } },
  "tagging_grenade": { id: "tagging_grenade", name: "Tagging Grenade", rarity: "Rare", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [{ id: "plastic_parts", qty: 1 }, { id: "sensors", qty: 1 }], img: { file: "Tagging_Grenade.png", hash: "e/e5" } },
  "trailblazer": { id: "trailblazer", name: "Trailblazer", rarity: "Rare", category: "quick_use", stack: 3, sell: 2200, recyclesTo: [{ id: "crude_explosives", qty: 2 }], img: { file: "Trailblazer.png", hash: "8/89" } },
  "trigger_nade": { id: "trigger_nade", name: "Trigger 'Nade", rarity: "Rare", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [{ id: "chemicals", qty: 1 }, { id: "processor", qty: 1 }], img: { file: "Trigger_%27Nade.png", hash: "c/cc" } },
  "vita_shot": { id: "vita_shot", name: "Vita Shot", rarity: "Rare", category: "quick_use", stack: 3, sell: 2200, recyclesTo: [{ id: "syringe", qty: 1 }, { id: "chemicals", qty: 4 }], img: { file: "Vita_Shot.png", hash: "7/7d" } },
  "vita_spray": { id: "vita_spray", name: "Vita Spray", rarity: "Epic", category: "quick_use", stack: 1, sell: 3400, recyclesTo: [{ id: "antiseptic", qty: 1 }, { id: "canister", qty: 1 }], img: { file: "Vita_Spray.png", hash: "1/1d" } },
  "white_flag": { id: "white_flag", name: "White Flag", rarity: "Common", category: "quick_use", stack: 5, sell: 640, recyclesTo: [{ id: "plastic_parts", qty: 1 }, { id: "fabric", qty: 5 }], img: { file: "White_Flag.png", hash: "4/43" } },
  "wolfpack": { id: "wolfpack", name: "Wolfpack", rarity: "Epic", category: "quick_use", stack: 1, sell: 6000, recyclesTo: [{ id: "arc_motion_core", qty: 1 }, { id: "explosive_compound", qty: 1 }], img: { file: "Wolfpack.png", hash: "2/24" } },
  "yellow_light_stick": { id: "yellow_light_stick", name: "Yellow Light Stick", rarity: "Common", category: "quick_use", stack: 5, sell: 150, recyclesTo: [{ id: "chemicals", qty: 1 }], img: { file: "Yellow_Light_Stick.png", hash: "1/1f" } },
  "zipline": { id: "zipline", name: "Zipline", rarity: "Rare", category: "quick_use", stack: 3, sell: 1000, recyclesTo: [{ id: "metal_parts", qty: 1 }, { id: "rope", qty: 1 }], img: { file: "Zipline.png", hash: "f/f9" } },
};
