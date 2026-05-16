// ============================================================================
// FILE: data/workbenches.ts
// PURPOSE: Workshop bench definitions and per-tier material recipes. Includes
//          Scrappy (the rooster pet in Speranza) modeled as a 5-tier bench with
//          `isScrappy: true`. The base "Workbench" is implicit — it unlocks via
//          playing 1 round rather than materials and isn't represented here.
// USED BY: looter feature (planned) — bench-upgrade goals drive the material
//          prioritizer.
// IMPORTS FROM: items.ts (recipe `itemId` refs must exist in `ITEMS`)
// SOURCE: items.ts `uses` field on the wiki Loot page, inverted to bench-side
//          ownership. Re-derive via `.claude/tmp/gen_workbenches.cjs`.
// ============================================================================

import { ITEMS } from "./items";

export interface RecipeCost {
  itemId: string;  // key into ITEMS
  qty: number;
}

export interface WorkbenchTier {
  level: number;        // 1-indexed; Scrappy starts at level 2 (tier 1 is its default state)
  cost: RecipeCost[];
}

export interface Workbench {
  id: string;
  name: string;          // display name
  isScrappy?: boolean;   // Scrappy uses nature/trinket inputs, not crafting materials
  maxTier: number;
  tiers: WorkbenchTier[];
}

export const WORKBENCHES: Record<string, Workbench> = {
  // ── Gunsmith ──
  "gunsmith": {
    id: "gunsmith",
    name: "Gunsmith",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "metal_parts", qty: 20 }, { itemId: "rubber_parts", qty: 30 }, { itemId: "wasp_driver", qty: 8 }] },
      { level: 2, cost: [{ itemId: "mechanical_components", qty: 5 }, { itemId: "rusted_tools", qty: 3 }] },
      { level: 3, cost: [{ itemId: "advanced_mechanical_components", qty: 5 }, { itemId: "rusted_gear", qty: 3 }, { itemId: "sentinel_firing_core", qty: 4 }] },
    ],
  },

  // ── Gear Bench ──
  "gear_bench": {
    id: "gear_bench",
    name: "Gear Bench",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "fabric", qty: 30 }, { itemId: "plastic_parts", qty: 25 }] },
      { level: 2, cost: [{ itemId: "electrical_components", qty: 5 }, { itemId: "hornet_driver", qty: 5 }, { itemId: "power_cable", qty: 3 }] },
      { level: 3, cost: [{ itemId: "advanced_electrical_components", qty: 5 }, { itemId: "bastion_cell", qty: 6 }, { itemId: "industrial_battery", qty: 3 }] },
    ],
  },

  // ── Medical Lab ──
  "medical_lab": {
    id: "medical_lab",
    name: "Medical Lab",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "arc_alloy", qty: 6 }, { itemId: "fabric", qty: 50 }] },
      { level: 2, cost: [{ itemId: "cracked_bioscanner", qty: 2 }, { itemId: "durable_cloth", qty: 5 }, { itemId: "tick_pod", qty: 8 }] },
      { level: 3, cost: [{ itemId: "antiseptic", qty: 8 }, { itemId: "rusted_shut_medical_kit", qty: 3 }, { itemId: "surveyor_vault", qty: 5 }] },
    ],
  },

  // ── Explosives Station ──
  "explosives_station": {
    id: "explosives_station",
    name: "Explosives Station",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "arc_alloy", qty: 6 }, { itemId: "chemicals", qty: 50 }] },
      { level: 2, cost: [{ itemId: "crude_explosives", qty: 5 }, { itemId: "pop_trigger", qty: 5 }, { itemId: "synthesized_fuel", qty: 3 }] },
      { level: 3, cost: [{ itemId: "explosive_compound", qty: 5 }, { itemId: "laboratory_reagents", qty: 3 }, { itemId: "rocketeer_driver", qty: 3 }] },
    ],
  },

  // ── Utility Station ──
  "utility_station": {
    id: "utility_station",
    name: "Utility Station",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "arc_alloy", qty: 6 }, { itemId: "plastic_parts", qty: 50 }] },
      { level: 2, cost: [{ itemId: "damaged_heat_sink", qty: 2 }, { itemId: "electrical_components", qty: 5 }, { itemId: "snitch_scanner", qty: 6 }] },
      { level: 3, cost: [{ itemId: "advanced_electrical_components", qty: 5 }, { itemId: "fried_motherboard", qty: 3 }, { itemId: "leaper_pulse_unit", qty: 4 }] },
    ],
  },

  // ── Refiner ──
  "refiner": {
    id: "refiner",
    name: "Refiner",
    maxTier: 3,
    tiers: [
      { level: 1, cost: [{ itemId: "arc_powercell", qty: 5 }, { itemId: "metal_parts", qty: 60 }] },
      { level: 2, cost: [{ itemId: "arc_motion_core", qty: 5 }, { itemId: "fireball_burner", qty: 8 }, { itemId: "toaster", qty: 3 }] },
      { level: 3, cost: [{ itemId: "arc_circuitry", qty: 10 }, { itemId: "bombardier_cell", qty: 6 }, { itemId: "motor", qty: 3 }] },
    ],
  },

  // ── Scrappy ──
  "scrappy": {
    id: "scrappy",
    name: "Scrappy",
    isScrappy: true,
    maxTier: 5,
    tiers: [
      { level: 2, cost: [{ itemId: "dog_collar", qty: 1 }] },
      { level: 3, cost: [{ itemId: "apricot", qty: 3 }, { itemId: "lemon", qty: 3 }] },
      { level: 4, cost: [{ itemId: "cat_bed", qty: 1 }, { itemId: "olives", qty: 6 }, { itemId: "prickly_pear", qty: 6 }] },
      { level: 5, cost: [{ itemId: "apricot", qty: 12 }, { itemId: "mushroom", qty: 12 }, { itemId: "very_comfortable_pillow", qty: 3 }] },
    ],
  },
};

// Display order for the Looter UI / bench picker.
export const WORKBENCH_ORDER: string[] = [
  "gunsmith",
  "gear_bench",
  "medical_lab",
  "explosives_station",
  "utility_station",
  "refiner",
  "scrappy",
];

// Dev-time sanity check: every recipe itemId must exist in ITEMS.
// Throws at module load if a typo or rename breaks a reference.
if (import.meta.env?.DEV) {
  for (const bench of Object.values(WORKBENCHES)) {
    for (const tier of bench.tiers) {
      for (const c of tier.cost) {
        if (!ITEMS[c.itemId]) {
          throw new Error(`WORKBENCHES: ${bench.id} tier ${tier.level} references unknown item "${c.itemId}"`);
        }
      }
    }
  }
}
