import { useMemo } from "react";
import type { EquippedState, CumulativeEffect } from "../types";
import { MOD_FAMILIES } from "../data/mods";

const STAT_PATTERNS: { stat: string; pattern: RegExp; unit: string }[] = [
  { stat: "Horizontal Recoil", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+Horizontal\s+Recoil/i, unit: "%" },
  { stat: "Vertical Recoil", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+Vertical\s+Recoil(?!\s+Recovery)/i, unit: "%" },
  { stat: "Per-Shot Dispersion", pattern: /(\d+)%\s+Reduced\s+Per-Shot\s+Dispersion/i, unit: "%" },
  { stat: "Max Shot Dispersion", pattern: /(\d+)%\s+Reduced\s+Max\s+Shot\s+Dispersion/i, unit: "%" },
  { stat: "Base Dispersion", pattern: /(\d+)%\s+Reduced\s+Base\s+Dispersion/i, unit: "%" },
  { stat: "Noise", pattern: /(\d+)%\s+Reduced\s+Noise/i, unit: "%" },
  { stat: "Magazine Size", pattern: /\+(\d+)\s+Magazine\s+Size/i, unit: "" },
  { stat: "Recoil Recovery", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+Recoil\s+Recovery\s+(?:Duration|Time)/i, unit: "%" },
  { stat: "Dispersion Recovery", pattern: /(\d+)%\s+Reduced\s+Dispersion\s+Recovery\s+Time/i, unit: "%" },
  { stat: "Bullet Velocity", pattern: /(\d+)%\s+Increased\s+Bullet\s+Velocity/i, unit: "%" },
  { stat: "ADS Speed", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+ADS\s+Speed/i, unit: "%" },
  { stat: "Equip Time", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+Equip\s+Time/i, unit: "%" },
  { stat: "Unequip Time", pattern: /(\d+)%\s+(?:Reduced|Increased)\s+Unequip\s+Time/i, unit: "%" },
  { stat: "Fire Rate", pattern: /(\d+)%\s+Increased\s+Fire\s+Rate/i, unit: "%" },
  { stat: "Durability Burn Rate", pattern: /(\d+)%\s+Increased\s+Durability\s+Burn\s+Rate/i, unit: "%" },
  { stat: "Projectiles", pattern: /\+(\d+)\s+Projectiles/i, unit: "" },
  { stat: "Projectile Damage", pattern: /(\d+)%\s+Reduced\s+Projectile\s+Damage/i, unit: "%" },
];

export function useCumulativeEffects(equipped: EquippedState): CumulativeEffect[] {
  return useMemo(() => {
    const allFams = Object.values(MOD_FAMILIES).flat();
    const statMap = new Map<string, CumulativeEffect>();

    for (const [, { fam: famName, tier }] of Object.entries(equipped)) {
      const famObj = allFams.find((f) => f.fam === famName);
      const tierData = famObj?.tiers[tier];
      if (!tierData) continue;

      for (const effect of tierData.e) {
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
    }

    return Array.from(statMap.values()).filter((e) => e.mods.length > 0);
  }, [equipped]);
}
