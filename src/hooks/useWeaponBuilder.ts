// ============================================================================
// FILE: hooks/useWeaponBuilder.ts
// PURPOSE: Core state hook — single source of truth for builder state
// USED BY: App.tsx (the only consumer — destructures and passes pieces as props)
// IMPORTS FROM: weapons.ts (weapon lookup), guides.ts (per-weapon attachment guides)
//
// This hook manages:
//   1. gun — which weapon is selected (null = weapon picker screen)
//   2. equipped — which mods are equipped in which slots
//
// There is no persistent "active build" tracking. Applying a guide build just
// sets equipped state; the build list vs customizer view is local UI state
// in WeaponBuilder (showBuildList).
// ============================================================================

import { useState, useMemo, useCallback } from "react";
import type { EquippedState, Rarity, WeaponGuide } from "../types";
import { WEAPONS } from "../data/weapons";
import { WEAPON_GUIDES } from "../data/guides";

export function useWeaponBuilder() {
  const [gun, setGun] = useState<string | null>(null);
  const [equipped, setEquipped] = useState<EquippedState>({});

  /** Full weapon object for the selected ID, or null if none selected. */
  const gunObj = useMemo(
    () => WEAPONS.find((w) => w.id === gun) ?? null,
    [gun],
  );

  /** Guide for the current weapon, or null if none (e.g. Jupiter, Equalizer, Hairpin). */
  const guide = useMemo<WeaponGuide | null>(
    () => (gun ? WEAPON_GUIDES[gun] ?? null : null),
    [gun],
  );

  /** Select a weapon; resets equipped mods. */
  const selectWeapon = useCallback((id: string) => {
    setGun(id);
    setEquipped({});
  }, []);

  /**
   * Open the builder with a specific weapon and attachment set (e.g. from Advisor "Customize →").
   * Sets both gun and equipped in one update so the URL sync hook can write ?w=...&m=...
   * and the Builder loads with those attachments pre-equipped.
   */
  const openBuilderWithBuild = useCallback((weaponId: string, slots: EquippedState) => {
    setGun(weaponId);
    setEquipped(slots);
  }, []);

  /**
   * Apply a guide build by index. Reads from WEAPON_GUIDES for the current weapon.
   * No-op if no weapon selected or index out of range.
   */
  const applyGuideBuild = useCallback(
    (buildIndex: number) => {
      if (!gun) return;
      const g = WEAPON_GUIDES[gun];
      if (!g?.builds[buildIndex]) return;
      setEquipped(g.builds[buildIndex].slots);
    },
    [gun],
  );

  /** Equip a single mod in a slot (or replace existing). */
  const equipMod = useCallback(
    (slot: string, fam: string, tier: Rarity) => {
      setEquipped((prev) => ({ ...prev, [slot]: { fam, tier } }));
    },
    [],
  );

  /** Remove the mod from a single slot. */
  const removeMod = useCallback((slot: string) => {
    setEquipped((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  /** Clear all equipped mods. */
  const clearAll = useCallback(() => {
    setEquipped({});
  }, []);

  /**
   * Clear equipped and signal "return to build list" from the caller's perspective.
   * The actual view switch (showBuildList) is handled in WeaponBuilder when it
   * calls this callback (e.g. "Back to builds" link).
   */
  const resetToBuilds = useCallback(() => {
    setEquipped({});
  }, []);

  /** Full reset — return to weapon picker, clear weapon and mods. */
  const resetSelection = useCallback(() => {
    setGun(null);
    setEquipped({});
  }, []);

  return {
    gun,
    gunObj,
    guide,
    equipped,
    selectWeapon,
    openBuilderWithBuild,
    applyGuideBuild,
    equipMod,
    removeMod,
    clearAll,
    resetToBuilds,
    resetSelection,
  };
}
