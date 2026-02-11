import { useState, useMemo, useCallback } from "react";
import type { EquippedState, Rarity } from "../types";
import { WEAPONS } from "../data/weapons";
import { GOAL_PRESETS } from "../data/presets";

export function useWeaponBuilder() {
  const [gun, setGun] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [equipped, setEquipped] = useState<EquippedState>({});

  const gunObj = useMemo(
    () => WEAPONS.find((w) => w.id === gun) ?? null,
    [gun],
  );

  const selectWeapon = useCallback((id: string) => {
    setGun(id);
    setSelectedGoal(null);
    setEquipped({});
  }, []);

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

  const equipMod = useCallback(
    (slot: string, fam: string, tier: Rarity) => {
      setEquipped((prev) => ({ ...prev, [slot]: { fam, tier } }));
    },
    [],
  );

  const removeMod = useCallback((slot: string) => {
    setEquipped((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEquipped({});
    setSelectedGoal(null);
  }, []);

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
