// ============================================================================
// FILE: components/weapons/AmmoGroup.tsx
// PURPOSE: Renders a group of weapon cards under an ammo type heading (e.g. "Light Ammo")
// USED BY: WeaponPicker.tsx
// ============================================================================

import type { AmmoType, Weapon } from "../../types";
import { AMMO_COLORS } from "../../data/constants";
import WeaponCard from "./WeaponCard";

interface AmmoGroupProps {
  ammoType: AmmoType;
  weapons: Weapon[];
  onSelect: (id: string) => void;
}

export default function AmmoGroup({ ammoType, weapons, onSelect }: AmmoGroupProps) {
  if (weapons.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3
        className="text-sm font-semibold px-2 py-1 rounded inline-block"
        style={{
          backgroundColor: `color-mix(in srgb, ${AMMO_COLORS[ammoType]} 13%, transparent)`,
          color: AMMO_COLORS[ammoType],
        }}
      >
        {ammoType} Ammo
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {weapons.map((w) => (
          <WeaponCard key={w.id} weapon={w} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
