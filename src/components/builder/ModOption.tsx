import type { ModFamily, TierKey } from "../../types";
import { TIER_LABELS, TIER_COLORS } from "../../data/constants";

interface ModOptionProps {
  mod: ModFamily;
  onSelect: (fam: string, tier: TierKey) => void;
}

export default function ModOption({ mod, onSelect }: ModOptionProps) {
  const tiers = Object.keys(mod.tiers) as unknown as TierKey[];

  return (
    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-white">{mod.fam}</div>
          <div className="text-xs text-gray-500 mt-1">{mod.desc}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {tiers.map((t) => (
          <button
            key={String(t)}
            onClick={() => onSelect(mod.fam, t)}
            className="flex-1 px-4 py-3 rounded-lg font-bold hover:brightness-125 transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: TIER_COLORS[String(t)], color: "white" }}
          >
            {TIER_LABELS[String(t)]}
          </button>
        ))}
      </div>
    </div>
  );
}
