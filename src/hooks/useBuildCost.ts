import { useMemo } from "react";
import type { EquippedState } from "../types";
import { MOD_FAMILIES } from "../data/mods";

export function useBuildCost(equipped: EquippedState): Record<string, number> {
  return useMemo(() => {
    const materials: Record<string, number> = {};
    const allFams = Object.values(MOD_FAMILIES).flat();

    for (const { fam: famName, tier } of Object.values(equipped)) {
      const famObj = allFams.find((f) => f.fam === famName);
      const tierData = famObj?.tiers[tier];
      if (!tierData?.cr) continue;

      for (const part of tierData.cr.split(",")) {
        const match = part.trim().match(/(\d+)x\s+(.+)/);
        if (match) {
          materials[match[2]] = (materials[match[2]] ?? 0) + parseInt(match[1]);
        }
      }
    }

    return materials;
  }, [equipped]);
}
