// ============================================================================
// FILE: components/builder/StatsSummaryBar.tsx
// PURPOSE: Mobile-only bottom bar showing build stats, goals, effects, and costs
// USED BY: WeaponBuilder.tsx
//
// This is the mobile equivalent of the desktop sidebar in WeaponBuilder.
// Hidden on desktop (lg:hidden). Shows a collapsed bar at the bottom that expands
// upward to reveal goal picker, cumulative effects, cost breakdown, and clear button.
// ============================================================================

import { useState } from "react";
import type { CumulativeEffect, GoalPreset } from "../../types";
import { GOAL_PRESETS } from "../../data/presets";
import { MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";

interface StatsSummaryBarProps {
  totalSlots: number;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  selectedGoal: string | null;
  availableGoals: [string, GoalPreset][];
  onSelectGoal: (key: string) => void;
  hasEquipped: boolean;
  onClearAll: () => void;
}

export default function StatsSummaryBar({
  totalSlots,
  buildCost,
  cumulativeEffects,
  selectedGoal,
  availableGoals,
  onSelectGoal,
  hasEquipped,
  onClearAll,
}: StatsSummaryBarProps) {
  const [expanded, setExpanded] = useState(false);

  if (totalSlots === 0) return null;

  const totalMaterials = Object.values(buildCost).reduce((a, b) => a + b, 0);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Expanded panel */}
      {expanded && (
        <div className="bg-surface border-t border-border max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Goal picker */}
          {availableGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                {selectedGoal ? "Active Goal" : "Quick Start"}
              </h4>
              {selectedGoal ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-accent bg-accent/10">
                  <span className="text-2xl">{GOAL_PRESETS[selectedGoal].icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-text-primary">{GOAL_PRESETS[selectedGoal].name}</div>
                    <div className="text-xs text-text-secondary">Active goal</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableGoals.map(([key, goal]) => (
                    <button
                      key={key}
                      onClick={() => onSelectGoal(key)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-alt hover:border-accent/50 transition-all text-left"
                    >
                      <span className="text-2xl shrink-0">{goal.icon}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-text-primary">{goal.name}</div>
                        <div className="text-xs text-text-secondary truncate">{goal.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
