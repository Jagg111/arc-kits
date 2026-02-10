import { useState, useMemo, useCallback } from "react";
import type { EquippedState, TierKey, ViewMode } from "../types";
import { WEAPONS } from "../data/weapons";
import { GOAL_PRESETS } from "../data/presets";

export function useWeaponBuilder() {
  const [gun, setGun] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [equipped, setEquipped] = useState<EquippedState>({});
  const [viewMode, setViewMode] = useState<ViewMode>("goals");

  const gunObj = useMemo(
    () => WEAPONS.find((w) => w.id === gun) ?? null,
    [gun],
  );

  const selectWeapon = useCallback((id: string) => {
    setGun(id);
    setSelectedGoal(null);
    setEquipped({});
    setViewMode("goals");
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
    (slot: string, fam: string, tier: TierKey) => {
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
    setViewMode("goals");
  }, []);

  const goToCustom = useCallback(() => setViewMode("custom"), []);
  const goToGoals = useCallback(() => setViewMode("goals"), []);

  return {
    gun,
    gunObj,
    selectedGoal,
    equipped,
    viewMode,
    selectWeapon,
    applyGoalBuild,
    equipMod,
    removeMod,
    clearAll,
    resetSelection,
    goToCustom,
    goToGoals,
  };
}
