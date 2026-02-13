// ============================================================================
// FILE: hooks/useBuildCost.ts
// PURPOSE: Computes total crafting material costs from all equipped mods,
//          sorted by rarity (Legendary → Common) then alphabetically,
//          with Mechanical Components prioritized within Uncommon (craftable at refiner)
// USED BY: App.tsx (passes result to WeaponBuilder and StatsSummaryBar for display)
// IMPORTS FROM: mods.ts (to look up crafting cost strings per mod tier),
//              constants.ts (MATERIAL_INFO for rarity lookup, RARITY_ORDER for sorting)
//
// HOW IT WORKS:
// Each mod tier has a `cr` (crafting cost) string like "6x Metal Parts, 1x Wires".
// This hook splits those strings, parses each "Nx Material" part with a regex,
// and sums up all materials across all equipped mods into a single totals object.
// ============================================================================

import { useMemo } from "react";
import type { EquippedState } from "../types";
import { MOD_FAMILIES } from "../data/mods";
import { MATERIAL_INFO, RARITY_ORDER } from "../data/constants";

export function useBuildCost(equipped: EquippedState): Record<string, number> {
  return useMemo(() => {
    const materials: Record<string, number> = {};
    // Flatten all mod families from every slot into one array for easy lookup
    const allFams = Object.values(MOD_FAMILIES).flat();

    for (const { fam: famName, tier } of Object.values(equipped)) {
      const famObj = allFams.find((f) => f.fam === famName);
      const tierData = famObj?.tiers[tier];
      if (!tierData?.cr) continue; // Some tiers (e.g. Legendary) have no crafting cost (free)

      // Parse the cost string: split by comma, then extract "Nx MaterialName" from each part
      for (const part of tierData.cr.split(",")) {
        const match = part.trim().match(/(\d+)x\s+(.+)/);
        if (match) {
          materials[match[2]] = (materials[match[2]] ?? 0) + parseInt(match[1]);
        }
      }
    }

    // Sort materials by rarity (Legendary first → Common last), then alphabetically within each tier.
    // Mechanical Components is prioritized within Uncommon since it's craftable at the refiner.
    const sorted = Object.entries(materials).sort(([a], [b]) => {
      const ra = RARITY_ORDER[MATERIAL_INFO[a]?.rarity ?? "Common"];
      const rb = RARITY_ORDER[MATERIAL_INFO[b]?.rarity ?? "Common"];
      if (ra !== rb) return rb - ra;
      if (a === "Mechanical Components") return -1;
      if (b === "Mechanical Components") return 1;
      return a.localeCompare(b);
    });

    return Object.fromEntries(sorted);
  }, [equipped]);
}
