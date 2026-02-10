import type { Weapon } from "../../types";
import { CLASS_LABELS, GRADE_COLORS } from "../../data/constants";

interface WeaponCardProps {
  weapon: Weapon;
  onSelect: (id: string) => void;
}

export default function WeaponCard({ weapon, onSelect }: WeaponCardProps) {
  return (
    <button
      onClick={() => onSelect(weapon.id)}
      className="p-3 rounded-lg border border-gray-800 bg-gray-900 hover:border-orange-500 transition-all text-left group"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-white group-hover:text-orange-300 transition-colors">
          {weapon.name}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{CLASS_LABELS[weapon.weaponClass]}</p>
      <div className="flex gap-2">
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GRADE_COLORS[weapon.pvp] + "22", color: GRADE_COLORS[weapon.pvp] }}>
          PVP {weapon.pvp}
        </span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GRADE_COLORS[weapon.arc] + "22", color: GRADE_COLORS[weapon.arc] }}>
          ARC {weapon.arc}
        </span>
      </div>
    </button>
  );
}
