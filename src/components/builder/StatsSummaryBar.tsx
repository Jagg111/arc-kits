// ============================================================================
// FILE: components/builder/StatsSummaryBar.tsx
// PURPOSE: Mobile-only bottom bar showing build stats, effects, and costs
// USED BY: WeaponBuilder.tsx
//
// Hidden on desktop (lg:hidden). Expands upward to show cumulative effects,
// cost breakdown, and clear button. Goal picker is optional (legacy); when
// not provided, that section is omitted (Step 7 will add build list if needed).
// ============================================================================

import { useState } from "react";
import type { CumulativeEffect } from "../../types";
import { MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";

interface StatsSummaryBarProps {
  totalSlots: number;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  hasEquipped: boolean;
  onClearAll: () => void;
}

export default function StatsSummaryBar({
  totalSlots,
  buildCost,
  cumulativeEffects,
  hasEquipped,
  onClearAll,
}: StatsSummaryBarProps) {
  const [expanded, setExpanded] = useState(false);

  if (totalSlots === 0) return null;

  const totalMaterials = Object.values(buildCost).reduce((a, b) => a + b, 0);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {expanded && (
        <div className="bg-surface border-t border-border max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Cumulative Effects */}
          {cumulativeEffects.length > 0 && (
            <div>
              <h4 className="text-sm text-text-secondary font-semibold mb-2">
                Cumulative Effects
              </h4>
              <div className="space-y-2">
                {cumulativeEffects.map((effect) => (
                  <div key={effect.stat} className="bg-surface-alt rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-primary">
                        {effect.stat}
                      </span>
                      <span className="text-sm font-bold text-accent-text">
                        {effect.unit === "%" ? `${effect.total}%` : `+${effect.total}`}
                      </span>
                    </div>
                    {effect.mods.length > 1 && (
                      <div className="space-y-1 mt-2">
                        {effect.mods.map((mod, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs text-text-secondary"
                          >
                            <span>{mod.name}</span>
                            <span>{mod.effect}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          {Object.keys(buildCost).length > 0 && (
            <div>
              <h4 className="text-sm text-text-secondary font-semibold mb-2">Total Cost</h4>
              <div className="space-y-1">
                {Object.entries(buildCost).map(([item, qty]) => {
                  const info = MATERIAL_INFO[item];
                  const color = info ? RARITY_COLORS[info.rarity] : "#9ca3af";
                  return (
                    <div
                      key={item}
                      className="flex items-center justify-between text-sm bg-surface-alt rounded-lg px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-text-secondary">
                        {info?.img && (
                          <img src={info.img} alt={item} loading="lazy" className="w-5 h-5 object-contain" />
                        )}
                        {item}
                      </span>
                      <span className="font-bold" style={{ color }}>{qty}x</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clear All */}
          {hasEquipped && (
            <button
              onClick={onClearAll}
              className="w-full px-4 py-3 rounded-lg bg-danger-bg hover:bg-danger-bg-hover text-danger-text font-semibold transition-colors"
            >
              Clear All Attachments
            </button>
          )}
        </div>
      )}

      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-surface-alt border-t border-border px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary font-medium">
            Build Stats
          </span>
          {totalMaterials > 0 && (
            <span className="text-sm text-accent-text font-medium">
              {totalMaterials} materials
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
