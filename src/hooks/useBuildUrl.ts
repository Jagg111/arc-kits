import { useEffect, useRef } from "react";
import type { EquippedState, Rarity } from "../types";

export function useBuildUrl(
  gun: string | null,
  equipped: EquippedState,
  selectWeapon: (id: string) => void,
  equipMod: (slot: string, fam: string, tier: Rarity) => void,
) {
  const initialized = useRef(false);

  // On mount: parse URL and restore build
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const w = params.get("w");
    const m = params.get("m");

    if (!w) return;

    selectWeapon(w);

    if (m) {
      // Format: Slot:Family:Rarity,Slot:Family:Rarity,...
      const entries = m.split(",");
      // Use requestAnimationFrame to ensure weapon state is set first
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

  // On state change: update URL
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
      history.replaceState(null, "", window.location.pathname);
    }
  }, [gun, equipped]);
}
