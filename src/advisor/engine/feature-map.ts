// ============================================================================
// FILE: src/advisor/engine/feature-map.ts
// PURPOSE: Build reusable per-weapon features used by scoring and filters.
// This prevents recomputing the same derived properties in multiple modules.
// ============================================================================

import { ADVISOR_CLASS_ROLE_SCORE } from "../../data/advisor_config";
import { MOD_FAMILIES } from "../../data/mods";
import { WEAPONS } from "../../data/weapons";
import type { Weapon } from "../../types";
import { isBurstFireMode, isSustainedFireMode, pickRangeBand, type RangeBand } from "./utils";

export interface WeaponFeatures {
  weapon: Weapon;
  rangeBand: RangeBand;
  burstCapable: boolean;
  sustainedCapable: boolean;
  roleScore: number;
  stealthEligible: boolean;
  noSlots: boolean;
}

// Intentional exclusions requested for stealth mode.
const STEALTH_EXCLUSIONS = new Set(["hairpin", "iltoro", "vulcano"]);

// Build stealth-eligible weapon IDs:
// - Start with explicit "osprey"
// - Add weapons that can equip regular Muzzle/Silencer
// - Remove intentional exclusions
export function buildStealthEligibleSet(): Set<string> {
  const result = new Set<string>(["osprey"]);
  const silencer = MOD_FAMILIES.Muzzle.find((family) => family.fam === "Silencer");
  if (silencer) {
    for (const weaponId of silencer.w) {
      if (!STEALTH_EXCLUSIONS.has(weaponId)) result.add(weaponId);
    }
  }
  return result;
}

// Create a lookup map for every weapon with useful derived facts.
export function buildWeaponFeatureMap(): Record<string, WeaponFeatures> {
  const featureMap: Record<string, WeaponFeatures> = {};
  const stealthEligible = buildStealthEligibleSet();

  for (const weapon of WEAPONS) {
    featureMap[weapon.id] = {
      weapon,
      rangeBand: pickRangeBand(weapon.range),
      burstCapable: isBurstFireMode(weapon.fireMode),
      sustainedCapable: isSustainedFireMode(weapon.fireMode),
      roleScore: ADVISOR_CLASS_ROLE_SCORE[weapon.weaponClass],
      stealthEligible: stealthEligible.has(weapon.id),
      noSlots: weapon.slots.length === 0,
    };
  }

  return featureMap;
}
