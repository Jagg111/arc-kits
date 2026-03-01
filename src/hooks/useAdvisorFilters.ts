// ============================================================================
// FILE: hooks/useAdvisorFilters.ts
// PURPOSE: Manages advisor filter bar state (location, squad, focus, range, rarity, crafting)
// USED BY: AdvisorPage.tsx
// ============================================================================

import { useState, useCallback } from "react";
import type {
  AdvisorLocationId,
  AdvisorSquadMode,
  AdvisorFocus,
  AdvisorPreferredRange,
  Rarity,
  AdvisorCraftingFilters,
} from "../types";
import { ADVISOR_ALL_RARITIES } from "../data/advisor_config";

/** Default crafting toggles: Mech ON (covers Uncommon), others OFF. */
export const ADVISOR_DEFAULT_CRAFTING: AdvisorCraftingFilters = {
  mechanicalComponents: true,
  modComponents: false,
  kineticConverter: false,
  horizontalGrip: false,
};

export interface AdvisorFilterState {
  location: AdvisorLocationId | null;
  squad: AdvisorSquadMode;
  focus: AdvisorFocus;
  preferredRange: AdvisorPreferredRange;
  allowedWeaponRarities: Rarity[];
  /** Crafting material toggles — control which attachment builds are eligible per weapon. */
  craftingFilters: AdvisorCraftingFilters;
}

const INITIAL_STATE: AdvisorFilterState = {
  location: null,
  squad: "solo",
  focus: "mixed",
  preferredRange: "any",
  allowedWeaponRarities: ADVISOR_ALL_RARITIES.filter((r) => r !== "Legendary"),
  craftingFilters: ADVISOR_DEFAULT_CRAFTING,
};

export function useAdvisorFilters() {
  const [filters, setFilters] = useState<AdvisorFilterState>(INITIAL_STATE);

  const setLocation = useCallback((loc: AdvisorLocationId) => {
    setFilters((prev) => ({ ...prev, location: loc }));
  }, []);

  const setSquad = useCallback((sq: AdvisorSquadMode) => {
    setFilters((prev) => ({ ...prev, squad: sq }));
  }, []);

  const setFocus = useCallback((fc: AdvisorFocus) => {
    setFilters((prev) => ({ ...prev, focus: fc }));
  }, []);

  const setRange = useCallback((rg: AdvisorPreferredRange) => {
    setFilters((prev) => ({ ...prev, preferredRange: rg }));
  }, []);

  const toggleRarity = useCallback((rarity: Rarity) => {
    setFilters((prev) => {
      const has = prev.allowedWeaponRarities.includes(rarity);
      // Prevent deselecting all rarities
      if (has && prev.allowedWeaponRarities.length <= 1) return prev;
      return {
        ...prev,
        allowedWeaponRarities: has
          ? prev.allowedWeaponRarities.filter((r) => r !== rarity)
          : [...prev.allowedWeaponRarities, rarity],
      };
    });
  }, []);

  /**
   * Applies crafting filter updates with auto-enable rules:
   * - Mod Components ON → Mechanical Components forced ON.
   * - Mechanical Components OFF → Mod Components forced OFF.
   */
  const setCraftingFilters = useCallback((update: Partial<AdvisorCraftingFilters>) => {
    setFilters((prev) => {
      const next = { ...prev.craftingFilters, ...update };
      if (next.modComponents) next.mechanicalComponents = true;
      if (!next.mechanicalComponents) next.modComponents = false;
      return { ...prev, craftingFilters: next };
    });
  }, []);

  return {
    filters,
    setLocation,
    setSquad,
    setFocus,
    setRange,
    toggleRarity,
    setCraftingFilters,
  };
}
