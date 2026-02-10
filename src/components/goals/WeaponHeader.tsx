import type { Weapon } from "../../types";
import { CLASS_LABELS, CLASS_COLORS, AMMO_COLORS, RARITY_COLORS, GRADE_COLORS } from "../../data/constants";
import Badge from "../shared/Badge";

interface WeaponHeaderProps {
  weapon: Weapon;
}

export default function WeaponHeader({ weapon }: WeaponHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{weapon.name}</h2>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge label={CLASS_LABELS[weapon.weaponClass]} color={CLASS_COLORS[weapon.weaponClass]} />
          <Badge label={weapon.ammoType} color={AMMO_COLORS[weapon.ammoType]} />
          <Badge label={weapon.rarity} color={RARITY_COLORS[weapon.rarity]} />
          <span className="text-xs text-gray-600 mx-1">|</span>
          <Badge label={`PVP ${weapon.pvp}`} color={GRADE_COLORS[weapon.pvp]} />
          <Badge label={`ARC ${weapon.arc}`} color={GRADE_COLORS[weapon.arc]} />
        </div>
        {weapon.desc && (
          <p className="text-sm text-gray-400 mb-3">{weapon.desc}</p>
        )}
        {weapon.weakness && (
          <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-3">
            <span className="text-orange-400 text-xl shrink-0">⚠️</span>
            <div>
              <div className="text-xs font-semibold text-orange-400 mb-1">
                Known Weakness
              </div>
              <p className="text-sm text-gray-300">{weapon.weakness}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
