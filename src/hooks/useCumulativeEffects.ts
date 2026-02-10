import { useMemo } from "react";
import type { EquippedState, CumulativeEffect } from "../types";
import { MOD_FAMILIES } from "../data/mods";

const STAT_PATTERNS: { stat: string; pattern: RegExp; unit: string }[] = [
  { stat: "Recoil", pattern: /(\d+)%\s+Reduced\s+(?:H-|V-)?Recoil/i, unit: "%" },
  { stat: "Dispersion", pattern: /(\d+)%\s+Reduced\s+(?:Per-Shot\s+)?Dispersion/i, unit: "%" },
  { stat: "Recoil/Dispersion", pattern: /(\d+)%\s+Reduced\s+Recoil\/Dispersion/i, unit: "%" },
  { stat: "Noise", pattern: /(\d+)%\s+Reduced\s+Noise/i, unit: "%" },
  { stat: "Magazine Size", pattern: /\+(\d+)\s+Magazine\s+Size/i, unit: "" },
  { stat: "Recovery", pattern: /(\d+)%\s+Recovery/i, unit: "%" },
  { stat: "Bullet Velocity", pattern: /\+(\d+)%\s+Bullet\s+Velocity/i, unit: "%" },
  { stat: "ADS Speed", pattern: /\+(\d+)%\s+ADS\s+Speed/i, unit: "%" },
  { stat: "Fire Rate", pattern: /\+(\d+)%\s+Fire\s+Rate/i, unit: "%" },
  { stat: "Projectiles", pattern: /\+(\d+)\s+Projectiles/i, unit: "" },
];

export function useCumulativeEffects(equipped: EquippedState): CumulativeEffect[] {
  return useMemo(() => {
    const allFams = Object.values(MOD_FAMILIES).flat();
    const statMap = new Map<string, CumulativeEffect>();

    for (const [, { fam: famName, tier }] of Object.entries(equipped)) {
      const famObj = allFams.find((f) => f.fam === famName);
      const tierData = famObj?.tiers[tier];
      if (!tierData) continue;

      const effect = tierData.e;

      for (const { stat, pattern, unit } of STAT_PATTERNS) {
        const match = effect.match(pattern);
        if (!match) continue;

        const value = parseInt(match[1]);
        if (!statMap.has(stat)) {
          statMap.set(stat, { stat, mods: [], total: 0, unit });
        }
        const entry = statMap.get(stat)!;
        entry.mods.push({ name: famName, effect, value });
        entry.total += value;
        break;
      }
    }

    return Array.from(statMap.values()).filter((e) => e.mods.length > 0);
  }, [equipped]);
}
