// ============================================================================
// FILE: components/builder/ModFamilySection.tsx
// PURPOSE: Displays a single mod family in the ModDrawer with tier selection buttons
// USED BY: ModDrawer.tsx (one per compatible mod family for the slot)
//
// Each tier button shows the tier image, rarity badge, effects list, and crafting cost.
// The background color uses the `color + "18"` hex alpha pattern (~9% opacity) to give
// each tier a subtle tint matching its rarity color.
// ============================================================================

import type { ModFamily, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";

interface ModFamilySectionProps {
  mod: ModFamily;
  onSelect: (fam: string, tier: Rarity) => void;
}

export default function ModFamilySection({
  mod,
  onSelect,
}: ModFamilySectionProps) {
  const tiers = Object.keys(mod.tiers) as Rarity[];

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-800">
        <div className="font-semibold text-white text-sm">{mod.fam}</div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{mod.desc}</div>
      </div>

      <div className="p-2 space-y-2 bg-gray-850">
        {tiers.map((t) => {
          const tier = mod.tiers[t]!;
          const color = RARITY_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => onSelect(mod.fam, t)}
              className="w-full text-left p-3 rounded-lg hover:brightness-125 transition-all border border-transparent hover:border-gray-500"
              style={{ backgroundColor: color + "18" }}
            >
              <div className="flex items-start gap-3">
                {tier.img && (
                  <img
                    src={tier.img}
                    alt={`${mod.fam} ${RARITY_LABELS[t]}`}
                    loading="lazy"
                    className="shrink-0 w-12 h-12 rounded object-contain bg-gray-900"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="shrink-0 px-2 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: color, color: "white" }}
                    >
                      {RARITY_LABELS[t]}
                    </span>
                    <span className="text-xs font-medium" style={{ color }}>
                      {t}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-200 space-y-0.5">
                    {tier.e.map((effect, i) => (
                      <li key={i}>{effect}</li>
                    ))}
                  </ul>
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
