import { useState } from "react";
import type { Weapon, EquippedState, SlotType, TierKey, CumulativeEffect } from "../../types";
import { GOAL_PRESETS } from "../../data/presets";
import WeaponHeader from "../goals/WeaponHeader";
import AttachmentSlot from "./AttachmentSlot";

interface WeaponBuilderProps {
  weapon: Weapon;
  selectedGoal: string | null;
  equipped: EquippedState;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  onSelectGoal: (key: string) => void;
  onEquip: (slot: string, fam: string, tier: TierKey) => void;
  onRemove: (slot: string) => void;
  onClearAll: () => void;
}

export default function WeaponBuilder({
  weapon,
  selectedGoal,
  equipped,
  buildCost,
  cumulativeEffects,
  onSelectGoal,
  onEquip,
  onRemove,
  onClearAll,
}: WeaponBuilderProps) {
  const [goalExpanded, setGoalExpanded] = useState(true);
  const hasEquipped = Object.keys(equipped).length > 0;
  const hasCost = Object.keys(buildCost).length > 0;

  const handleSelectGoal = (key: string) => {
    onSelectGoal(key);
    setGoalExpanded(false);
  };

  const handleClearGoal = () => {
    onClearAll();
    setGoalExpanded(true);
  };

  return (
    <div className="space-y-6">
      <WeaponHeader weapon={weapon} />

      {weapon.slots.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-gray-400 font-semibold mb-2">
            No Attachment Slots
          </p>
          <p className="text-sm text-gray-500">
            This weapon cannot be modified
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Goal Picker */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              {selectedGoal && !goalExpanded ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{GOAL_PRESETS[selectedGoal].icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{GOAL_PRESETS[selectedGoal].name}</div>
                      <div className="text-xs text-gray-400">Active goal</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setGoalExpanded(true)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Quick Start</h4>
                    {selectedGoal && (
                      <button
                        onClick={() => setGoalExpanded(false)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Collapse
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(GOAL_PRESETS).map(([key, goal]) => {
                      if (!goal.builds[weapon.id]) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => handleSelectGoal(key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            selectedGoal === key
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-gray-700 bg-gray-800 hover:border-orange-500/50"
                          }`}
                        >
                          <span className="text-2xl shrink-0">{goal.icon}</span>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-white">{goal.name}</div>
                            <div className="text-xs text-gray-400 truncate">{goal.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cumulative Effects */}
            {cumulativeEffects.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h4 className="text-sm text-gray-400 font-semibold mb-3">
                  Cumulative Effects
                </h4>
                <div className="space-y-3">
                  {cumulativeEffects.map((effect) => (
                    <div key={effect.stat} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">
                          {effect.stat}
                        </span>
                        <span className="text-sm font-bold text-orange-400">
                          {effect.unit === "%"
                            ? `${effect.total}%`
                            : `+${effect.total}`}
                        </span>
                      </div>
                      {effect.mods.length > 1 && (
                        <div className="space-y-1">
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
            {hasCost && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h4 className="text-sm text-gray-400 font-semibold mb-3">
                  Total Cost
                </h4>
                <div className="space-y-2">
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
                onClick={handleClearGoal}
                className="w-full px-4 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/40 text-red-400 font-semibold transition-colors"
              >
                Clear All Attachments
              </button>
            )}
          </div>

          {/* Attachment Slots */}
          <div className="lg:col-span-2 space-y-3">
            {weapon.slots.map((slot) => (
              <AttachmentSlot
                key={slot}
                slot={slot as SlotType}
                weaponId={weapon.id}
                equipped={equipped[slot]}
                onEquip={onEquip}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
