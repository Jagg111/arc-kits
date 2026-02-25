// ============================================================================
// FILE: components/weapons/WeaponPicker.tsx
// PURPOSE: Weapon selection screen — groups weapons by ammo type
// USED BY: App.tsx (shown when no weapon is selected)
// IMPORTS FROM: weapons.ts, constants.ts, AmmoGroup component
//
// Weapons are grouped by ammo type (Light, Medium, Heavy, Shotgun, Special).
// ============================================================================

import { WEAPONS } from "../../data/weapons";
import { AMMO_TYPES } from "../../data/constants";
import AmmoGroup from "./AmmoGroup";

interface WeaponPickerProps {
  onSelect: (id: string) => void;
}

export default function WeaponPicker({ onSelect }: WeaponPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose A Weapon</h2>
        <p className="text-text-secondary text-sm">
          Select a weapon to see info & build options. Switch to advisor if you're looking for a recommendations.
        </p>
      </div>
      <div className="space-y-3">
        {AMMO_TYPES.map((ammoType) => {
          const guns = WEAPONS.filter((w) => w.ammoType === ammoType);
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
