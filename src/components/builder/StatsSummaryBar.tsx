import { useState } from "react";
import type { CumulativeEffect, GoalPreset } from "../../types";
import { GOAL_PRESETS } from "../../data/presets";

interface StatsSummaryBarProps {
  filledCount: number;
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
  filledCount,
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
        <div className="bg-gray-900 border-t border-gray-700 max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Goal picker */}
          {availableGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {selectedGoal ? "Active Goal" : "Quick Start"}
              </h4>
              {selectedGoal ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-orange-500 bg-orange-500/10">
                  <span className="text-2xl">{GOAL_PRESETS[selectedGoal].icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-white">{GOAL_PRESETS[selectedGoal].name}</div>
                    <div className="text-xs text-gray-400">Active goal</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableGoals.map(([key, goal]) => (
                    <button
                      key={key}
                      onClick={() => onSelectGoal(key)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-orange-500/50 transition-all text-left"
                    >
                      <span className="text-2xl shrink-0">{goal.icon}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-white">{goal.name}</div>
                        <div className="text-xs text-gray-400 truncate">{goal.desc}</div>
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
              <h4 className="text-sm text-gray-400 font-semibold mb-2">
                Cumulative Effects
              </h4>
              <div className="space-y-2">
                {cumulativeEffects.map((effect) => (
                  <div key={effect.stat} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {effect.stat}
                      </span>
                      <span className="text-sm font-bold text-orange-400">
                        {effect.unit === "%" ? `${effect.total}%` : `+${effect.total}`}
                      </span>
                    </div>
                    {effect.mods.length > 1 && (
                      <div className="space-y-1 mt-2">
                        {effect.mods.map((mod, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs text-gray-400"
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
              <h4 className="text-sm text-gray-400 font-semibold mb-2">Total Cost</h4>
              <div className="space-y-1">
                {Object.entries(buildCost).map(([item, qty]) => (
                  <div
                    key={item}
                    className="flex items-center justify-between text-sm bg-gray-800 rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-300">{item}</span>
                    <span className="text-orange-400 font-bold">{qty}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clear All */}
          {hasEquipped && (
            <button
              onClick={onClearAll}
              className="w-full px-4 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/40 text-red-400 font-semibold transition-colors"
            >
              Clear All Attachments
            </button>
          )}
        </div>
      )}

      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 font-medium">
            {filledCount}/{totalSlots} slots
          </span>
          {totalMaterials > 0 && (
            <span className="text-sm text-orange-400 font-medium">
              {totalMaterials} materials
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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
