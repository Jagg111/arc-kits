// ============================================================================
// FILE: hooks/useAdvisorFilters.ts
// PURPOSE: Manages advisor filter bar state (location, squad, focus, range, rarity)
// USED BY: AdvisorPage.tsx
// ============================================================================

import { useState, useCallback } from "react";
import type {
  AdvisorLocationId,
  AdvisorSquadMode,
  AdvisorFocus,
  AdvisorPreferredRange,
  Rarity,
} from "../types";
import { ADVISOR_ALL_RARITIES } from "../data/advisor_config";

export interface AdvisorFilterState {
  location: AdvisorLocationId | null;
  squad: AdvisorSquadMode;
  focus: AdvisorFocus;
  preferredRange: AdvisorPreferredRange;
  allowedWeaponRarities: Rarity[];
}

const INITIAL_STATE: AdvisorFilterState = {
  location: null,
  squad: "solo",
  focus: "mixed",
  preferredRange: "any",
  allowedWeaponRarities: [...ADVISOR_ALL_RARITIES],
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

  return { filters, setLocation, setSquad, setFocus, setRange, toggleRarity };
}
