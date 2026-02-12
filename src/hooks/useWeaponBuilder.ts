// ============================================================================
// FILE: hooks/useWeaponBuilder.ts
// PURPOSE: Core state hook — single source of truth for the entire app's state
// USED BY: App.tsx (the only consumer — destructures the return value and passes pieces as props)
// IMPORTS FROM: weapons.ts (weapon lookup), presets.ts (goal preset data)
//
// This hook manages three pieces of state:
//   1. `gun` — which weapon is selected (null = weapon picker screen)
//   2. `selectedGoal` — which goal preset is active (null = none)
//   3. `equipped` — which mods are equipped in which slots
// ============================================================================

import { useState, useMemo, useCallback } from "react";
import type { EquippedState, Rarity } from "../types";
import { WEAPONS } from "../data/weapons";
import { GOAL_PRESETS } from "../data/presets";

export function useWeaponBuilder() {
  const [gun, setGun] = useState<string | null>(null);           // Selected weapon ID (e.g. "tempest")
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null); // Active goal key (e.g. "fix")
  const [equipped, setEquipped] = useState<EquippedState>({});   // Slot→mod mapping

  // Look up the full Weapon object from the ID. Returns null if no weapon selected.
  const gunObj = useMemo(
    () => WEAPONS.find((w) => w.id === gun) ?? null,
    [gun],
  );

  // Called when user picks a weapon — resets all mods and goals
  const selectWeapon = useCallback((id: string) => {
    setGun(id);
    setSelectedGoal(null);
    setEquipped({});
  }, []);

  // Applies a goal preset build — replaces all equipped mods with the preset's loadout
  const applyGoalBuild = useCallback(
    (goalKey: string) => {
      if (!gun) return;
      const goal = GOAL_PRESETS[goalKey];
      if (goal?.builds[gun]) {
        setEquipped(goal.builds[gun].slots);
        setSelectedGoal(goalKey);
      }
    },
    [gun],
  );

  // Equips a single mod in a slot (or replaces the existing one)
  const equipMod = useCallback(
    (slot: string, fam: string, tier: Rarity) => {
      setEquipped((prev) => ({ ...prev, [slot]: { fam, tier } }));
    },
    [],
  );

  // Removes the mod from a single slot
  const removeMod = useCallback((slot: string) => {
    setEquipped((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  // Clears all equipped mods and deselects the active goal
  const clearAll = useCallback(() => {
    setEquipped({});
    setSelectedGoal(null);
  }, []);

  // Full reset — goes back to the weapon picker screen
  const resetSelection = useCallback(() => {
    setGun(null);
    setSelectedGoal(null);
    setEquipped({});
  }, []);

  return {
    gun,
    gunObj,
    selectedGoal,
    equipped,
    selectWeapon,
    applyGoalBuild,
    equipMod,
    removeMod,
    clearAll,
    resetSelection,
  };
}
