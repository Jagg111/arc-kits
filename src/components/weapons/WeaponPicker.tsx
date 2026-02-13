// ============================================================================
// FILE: components/weapons/WeaponPicker.tsx
// PURPOSE: Weapon selection screen — groups weapons by ammo type with sort options
// USED BY: App.tsx (shown when no weapon is selected)
// IMPORTS FROM: weapons.ts, constants.ts (for sort ordering), AmmoGroup component
//
// Weapons are grouped by ammo type (Light, Medium, Heavy, Shotgun, Special).
// Users can sort within each group by Rarity, PVP grade, or ARC grade.
// ============================================================================

import { useState } from "react";
import { WEAPONS } from "../../data/weapons";
import { AMMO_TYPES, RARITY_ORDER, GRADE_ORDER } from "../../data/constants";
import type { Rarity } from "../../types";
import AmmoGroup from "./AmmoGroup";

type SortMode = "rarity" | "pvp" | "arc";

interface WeaponPickerProps {
  onSelect: (id: string) => void;
}

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "rarity", label: "Rarity" },
  { value: "pvp", label: "PVP" },
  { value: "arc", label: "ARC" },
];

export default function WeaponPicker({ onSelect }: WeaponPickerProps) {
  const [sortMode, setSortMode] = useState<SortMode>("rarity");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Weapon</h2>
        <p className="text-text-secondary text-sm">
          Select the weapon you want to build
        </p>
      </div>
      <div className="flex gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortMode(opt.value)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              sortMode === opt.value
                ? "bg-accent text-white"
                : "bg-surface-alt text-text-secondary hover:text-text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {AMMO_TYPES.map((ammoType) => {
          const guns = WEAPONS
            .filter((w) => w.ammoType === ammoType)
            .sort((a, b) => {
              if (sortMode === "rarity") {
                return RARITY_ORDER[a.rarity as Rarity] - RARITY_ORDER[b.rarity as Rarity];
              }
              return GRADE_ORDER[a[sortMode]] - GRADE_ORDER[b[sortMode]];
            });
          return (
            <AmmoGroup
              key={ammoType}
              ammoType={ammoType}
              weapons={guns}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
