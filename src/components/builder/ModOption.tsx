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
      <div className="space-y-2">
        {tiers.map((t) => {
          const tier = mod.tiers[t]!;
          const color = TIER_COLORS[String(t)];
          return (
            <button
              key={String(t)}
              onClick={() => onSelect(mod.fam, t)}
              className="w-full text-left p-3 rounded-lg hover:brightness-125 transition-all border border-transparent hover:border-gray-500"
              style={{ backgroundColor: color + "18" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 px-2 py-0.5 rounded text-xs font-bold mt-0.5"
                  style={{ backgroundColor: color, color: "white" }}
                >
                  {TIER_LABELS[String(t)]}
                </span>
                <div className="min-w-0">
                  <div className="text-sm text-gray-200">{tier.e}</div>
                  {tier.cr ? (
                    <div className="text-xs text-orange-400 mt-1">{tier.cr}</div>
                  ) : (
                    <div className="text-xs text-green-500 mt-1">Free</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
