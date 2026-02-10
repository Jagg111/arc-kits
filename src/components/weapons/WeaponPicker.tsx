import { WEAPONS } from "../../data/weapons";
import { AMMO_TYPES, RARITY_ORDER } from "../../data/constants";
import type { Rarity } from "../../types";
import AmmoGroup from "./AmmoGroup";

interface WeaponPickerProps {
  onSelect: (id: string) => void;
}

export default function WeaponPicker({ onSelect }: WeaponPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Weapon</h2>
        <p className="text-gray-400 text-sm">
          Select the weapon you want to build
        </p>
      </div>
      <div className="space-y-3">
        {AMMO_TYPES.map((ammoType) => {
          const guns = WEAPONS
            .filter((w) => w.ammoType === ammoType)
            .sort((a, b) => RARITY_ORDER[a.rarity as Rarity] - RARITY_ORDER[b.rarity as Rarity]);
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
