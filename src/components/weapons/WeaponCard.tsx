import type { Weapon } from "../../types";
import { CLASS_LABELS, GRADE_COLORS, RARITY_COLORS } from "../../data/constants";

interface WeaponCardProps {
  weapon: Weapon;
  onSelect: (id: string) => void;
}

export default function WeaponCard({ weapon, onSelect }: WeaponCardProps) {
  const rarityColor = RARITY_COLORS[weapon.rarity];

  return (
    <button
      onClick={() => onSelect(weapon.id)}
      className="relative p-3 pt-4 rounded-lg border border-gray-800 bg-gray-900 hover:border-orange-500 transition-all text-left group overflow-hidden"
    >
      {/* Rarity color stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ backgroundColor: rarityColor }}
      />

      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-white group-hover:text-orange-300 transition-colors">
          {weapon.name}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {CLASS_LABELS[weapon.weaponClass]} · {weapon.fireMode}
      </p>

      {/* Quick stats */}
      <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
        <span>DMG {weapon.damage}</span>
        <span>RNG {weapon.range}m</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GRADE_COLORS[weapon.pvp] + "22", color: GRADE_COLORS[weapon.pvp] }}>
            PVP {weapon.pvp}
          </span>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GRADE_COLORS[weapon.arc] + "22", color: GRADE_COLORS[weapon.arc] }}>
            ARC {weapon.arc}
          </span>
        </div>
        {weapon.slots.length > 0 && (
          <span className="text-xs text-gray-500 font-medium">
            {weapon.slots.length} slots
          </span>
        )}
      </div>
    </button>
  );
}
