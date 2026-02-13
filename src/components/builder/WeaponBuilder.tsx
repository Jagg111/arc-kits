// ============================================================================
// FILE: components/builder/WeaponBuilder.tsx
// PURPOSE: Main builder screen layout — orchestrates goals, attachment slots, stats, and costs
// USED BY: App.tsx (shown when a weapon is selected)
//
// THREE RENDERING STATES:
//   1. No slots — shows a "No Attachment Slots" message (e.g. Jupiter, Equalizer)
//   2. Goal-first flow — shown when weapon first selected, before any mods are equipped.
//      Displays goal preset cards + a "Build Manually" option.
//   3. Main builder — shows attachment slot grid + sidebar (desktop) / bottom bar (mobile)
//
// DESKTOP vs MOBILE:
//   Desktop: 3-column grid — sidebar (col 1) has goals/stats/cost, slots (cols 2-3)
//   Mobile: Slots only + StatsSummaryBar fixed at bottom of screen
// ============================================================================

import { useState } from "react";
import type { Weapon, EquippedState, SlotType, Rarity, CumulativeEffect } from "../../types";
import { GOAL_PRESETS } from "../../data/presets";
import { MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";
import WeaponHeader from "../goals/WeaponHeader";
import GoalCard from "../goals/GoalCard";
import AttachmentSlot from "./AttachmentSlot";
import ModDrawer from "./ModDrawer";
import StatsSummaryBar from "./StatsSummaryBar";

interface WeaponBuilderProps {
  weapon: Weapon;
  selectedGoal: string | null;
  equipped: EquippedState;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  onSelectGoal: (key: string) => void;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
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
  const [activeSlot, setActiveSlot] = useState<SlotType | null>(null);  // Which slot's ModDrawer is open
  const [goalDismissed, setGoalDismissed] = useState(false);           // Has user dismissed the goal-first flow
  const [goalExpanded, setGoalExpanded] = useState(true);              // Is the goal picker expanded in sidebar

  const hasEquipped = Object.keys(equipped).length > 0;
  const hasCost = Object.keys(buildCost).length > 0;
  const totalSlots = weapon.slots.length;

  // Show goal-first flow when weapon first selected, no mods, no goal, not dismissed
  const showGoalFirst = totalSlots > 0 && !hasEquipped && !selectedGoal && !goalDismissed;

  const handleSelectGoal = (key: string) => {
    onSelectGoal(key);
    setGoalExpanded(false);
    setGoalDismissed(true);
  };

  const handleClearGoal = () => {
    onClearAll();
    setGoalExpanded(true);
    setGoalDismissed(false);
  };

  // Filter goals to only those that have a build defined for this weapon
  const availableGoals = Object.entries(GOAL_PRESETS).filter(
    ([, goal]) => goal.builds[weapon.id],
  );

  return (
    <div className="space-y-6">
      <WeaponHeader weapon={weapon} />

      {weapon.slots.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border-subtle p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-text-secondary font-semibold mb-2">
            No Attachment Slots
          </p>
          <p className="text-sm text-text-muted">
            This weapon cannot be modified
          </p>
        </div>
      ) : showGoalFirst ? (
        /* Goal-first flow */
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-secondary">Choose a Build Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableGoals.map(([key, goal]) => (
              <GoalCard
                key={key}
                goalKey={key}
                goal={goal}
                weaponId={weapon.id}
                isSelected={false}
                onSelect={handleSelectGoal}
              />
            ))}
            {/* Build Manually tile */}
            <button
              onClick={() => setGoalDismissed(true)}
              className="flex items-center gap-4 p-5 rounded-xl border border-border bg-surface-alt/50 hover:border-text-secondary hover:bg-surface-alt transition-all text-left"
            >
              <svg className="w-8 h-8 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m3.586-3.586a2.548 2.548 0 013.586 3.586m-6.586-6.586l6.586 6.586" />
              </svg>
              <div className="min-w-0">
                <div className="font-bold text-text-primary">Build Manually</div>
                <div className="text-sm text-text-secondary mt-0.5">Pick your own attachments slot by slot</div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 lg:sticky lg:top-16 lg:self-start">
            {/* Goal Picker */}
            <div className="bg-surface rounded-xl border border-border-subtle p-4">
              {selectedGoal && !goalExpanded ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{GOAL_PRESETS[selectedGoal].icon}</span>
                    <div>
                      <div className="font-semibold text-text-primary text-sm">{GOAL_PRESETS[selectedGoal].name}</div>
                      <div className="text-xs text-text-secondary">Active goal</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setGoalExpanded(true)}
                    className="text-xs text-accent-text hover:text-accent-hover font-semibold transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Quick Start</h4>
                    {selectedGoal && (
                      <button
                        onClick={() => setGoalExpanded(false)}
                        className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                      >
                        Collapse
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {availableGoals.map(([key, goal]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectGoal(key)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                          selectedGoal === key
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface-alt hover:border-accent/50"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{goal.icon}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-text-primary">{goal.name}</div>
                          <div className="text-xs text-text-secondary truncate">{goal.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cumulative Effects */}
            {cumulativeEffects.length > 0 && (
              <div className="bg-surface rounded-xl border border-border-subtle p-4">
                <h4 className="text-sm text-text-secondary font-semibold mb-3">
                  Cumulative Effects
                </h4>
                <div className="space-y-3">
                  {cumulativeEffects.map((effect) => (
                    <div key={effect.stat} className="bg-surface-alt rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {effect.stat}
                        </span>
                        <span className="text-sm font-bold text-accent-text">
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
            {hasCost && (
              <div className="bg-surface rounded-xl border border-border-subtle p-4">
                <h4 className="text-sm text-text-secondary font-semibold mb-3">
                  Total Cost
                </h4>
                <div className="space-y-2">
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
                onClick={handleClearGoal}
                className="w-full px-4 py-3 rounded-lg bg-danger-bg hover:bg-danger-bg-hover text-danger-text font-semibold transition-colors"
              >
                Clear All Attachments
              </button>
            )}
          </div>

          {/* Attachment Slots */}
          <div className="lg:col-span-2 space-y-4">
            {/* Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weapon.slots.map((slot) => (
                <AttachmentSlot
                  key={slot}
                  slot={slot as SlotType}
                  weaponId={weapon.id}
                  equipped={equipped[slot]}
                  onEquip={onEquip}
                  onRemove={onRemove}
                  onOpenDrawer={setActiveSlot}
                />
              ))}
            </div>

            {/* Clear All - mobile only */}
            {hasEquipped && (
              <button
                onClick={handleClearGoal}
                className="lg:hidden w-full px-4 py-3 rounded-lg bg-danger-bg hover:bg-danger-bg-hover text-danger-text font-semibold transition-colors"
              >
                Clear All Attachments
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Stats Summary Bar */}
      <StatsSummaryBar
        totalSlots={totalSlots}
        buildCost={buildCost}
        cumulativeEffects={cumulativeEffects}
        selectedGoal={selectedGoal}
        availableGoals={availableGoals}
        onSelectGoal={handleSelectGoal}
        hasEquipped={hasEquipped}
        onClearAll={handleClearGoal}
      />

      {/* Mod Drawer */}
      {activeSlot && (
        <ModDrawer
          slot={activeSlot}
          weaponId={weapon.id}
          equippedMod={equipped[activeSlot]}
          onEquip={onEquip}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
