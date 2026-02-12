// ============================================================================
// FILE: hooks/useBuildUrl.ts
// PURPOSE: Syncs the current build state with the browser URL for shareable builds
// USED BY: App.tsx (called once to enable URL sync)
//
// URL FORMAT: ?w=tempest&m=Muzzle:Muzzle Brake:Uncommon,Underbarrel:Vertical Grip:Rare
//   - `w` = weapon ID
//   - `m` = comma-separated list of Slot:Family:Rarity entries
//
// TWO-PHASE APPROACH:
//   Phase 1 (on mount): Read URL params and restore the saved build
//   Phase 2 (on change): Write current state back to the URL using history.replaceState
//
// The `requestAnimationFrame` trick ensures the weapon state is fully set before
// we try to equip mods — without it, the mods would fire before React processes
// the weapon selection.
// ============================================================================

import { useEffect, useRef } from "react";
import type { EquippedState, Rarity } from "../types";

export function useBuildUrl(
  gun: string | null,
  equipped: EquippedState,
  selectWeapon: (id: string) => void,
  equipMod: (slot: string, fam: string, tier: Rarity) => void,
) {
  // Prevents the mount effect from running more than once (React Strict Mode runs effects twice)
  const initialized = useRef(false);

  // Phase 1: On mount, parse URL and restore the saved build
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const w = params.get("w");
    const m = params.get("m");

    if (!w) return;

    selectWeapon(w);

    if (m) {
      const entries = m.split(",");
      // Delay mod equipping to next frame so weapon state is set first
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const parts = entry.split(":");
          if (parts.length === 3) {
            const [slot, fam, tier] = parts;
            equipMod(slot, fam, tier as Rarity);
          }
        }
      });
    }
  }, [selectWeapon, equipMod]);

  // Phase 2: On state change, update the URL to match current build
  useEffect(() => {
    if (!initialized.current) return;

    const params = new URLSearchParams();

    if (gun) {
      params.set("w", gun);

      const modEntries = Object.entries(equipped);
      if (modEntries.length > 0) {
        const m = modEntries
          .map(([slot, mod]) => `${slot}:${mod.fam}:${mod.tier}`)
          .join(",");
        params.set("m", m);
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      history.replaceState(null, "", newUrl);
    } else {
      // No weapon selected — clear URL params
      history.replaceState(null, "", window.location.pathname);
    }
  }, [gun, equipped]);
}
