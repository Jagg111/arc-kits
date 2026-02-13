// ============================================================================
// FILE: components/builder/ModFamilySection.tsx
// PURPOSE: Displays a single mod family in the ModDrawer with tier selection buttons
// USED BY: ModDrawer.tsx (one per compatible mod family for the slot)
//
// Each tier button shows the tier image, rarity badge, effects list, and crafting cost.
// Crafting costs are displayed as rarity-colored pills with material icons via CostPill.
// The background color uses color-mix() to give each tier a subtle tint matching
// its rarity color. Colors are CSS custom properties that adapt per theme.
// ============================================================================

import type { ModFamily, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";
import CostPill from "../shared/CostPill";

interface ModFamilySectionProps {
  mod: ModFamily;
  equippedTier?: Rarity;
  onSelect: (fam: string, tier: Rarity) => void;
}

export default function ModFamilySection({
  mod,
  equippedTier,
  onSelect,
}: ModFamilySectionProps) {
  const tiers = Object.keys(mod.tiers) as Rarity[];

  return (
    <div data-mod-family={mod.fam} className="border border-border rounded-lg overflow-hidden">
      <div className="p-3 bg-surface-alt">
        <div className="font-semibold text-text-primary text-sm">{mod.fam}</div>
        <div className="text-xs text-text-muted mt-0.5 truncate">{mod.desc}</div>
      </div>

      <div className="p-2 space-y-2 bg-surface">
        {tiers.map((t) => {
          const tier = mod.tiers[t]!;
          const color = RARITY_COLORS[t];
          const isEquipped = t === equippedTier;
          return (
            <button
              key={t}
              onClick={() => onSelect(mod.fam, t)}
              className={`w-full text-left p-3 rounded-lg hover:brightness-125 transition-all border ${
                isEquipped ? "border-current ring-1 ring-current" : "border-transparent hover:border-text-muted"
              }`}
              style={{ backgroundColor: `color-mix(in srgb, ${color} ${isEquipped ? "19" : "9"}%, transparent)`, color: isEquipped ? color : undefined }}
            >
              <div className="flex items-start gap-3">
                {tier.img && (
                  <img
                    src={tier.img}
                    alt={`${mod.fam} ${RARITY_LABELS[t]}`}
                    loading="lazy"
                    className="shrink-0 w-12 h-12 rounded object-contain bg-surface"
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
                  <ul className="text-sm text-text-secondary space-y-0.5">
                    {tier.e.map((effect, i) => (
                      <li key={i}>{effect}</li>
                    ))}
                  </ul>
                  {tier.cr ? (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tier.cr.split(", ").map((mat) => (
                        <CostPill key={mat} cost={mat} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-success mt-1">Free</div>
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
