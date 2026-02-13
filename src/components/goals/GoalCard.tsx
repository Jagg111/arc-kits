// ============================================================================
// FILE: components/goals/GoalCard.tsx
// PURPOSE: Clickable card for a single goal preset (e.g. "Fix This Gun", "Budget Build")
// USED BY: WeaponBuilder.tsx (in the goal-first flow grid)
// NOTE: Returns null if the goal has no build defined for the current weapon.
//       The `build.fix` text (e.g. "Controls vertical climb") is shown at the bottom.
// ============================================================================

import type { GoalPreset } from "../../types";

interface GoalCardProps {
  goalKey: string;
  goal: GoalPreset;
  weaponId: string;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

export default function GoalCard({
  goalKey,
  goal,
  weaponId,
  isSelected,
  onSelect,
}: GoalCardProps) {
  const build = goal.builds[weaponId];
  if (!build) return null;

  return (
    <button
      onClick={() => onSelect(goalKey)}
      className={`p-6 rounded-2xl border-2 transition-all text-left hover:scale-105 transform ${
        isSelected
          ? "border-accent bg-gradient-to-br from-accent to-accent bg-opacity-20 shadow-lg shadow-accent-glow/20"
          : "border-border bg-gradient-to-br from-surface to-surface-alt hover:border-accent/50"
      }`}
    >
      <div className="text-5xl mb-3">{goal.icon}</div>
      <h4 className="font-bold text-xl mb-2">{goal.name}</h4>
      <p className="text-sm text-text-secondary mb-3">{goal.desc}</p>
      <div className="pt-3 border-t border-border">
        <p className={`text-sm font-semibold ${isSelected ? "text-accent-hover" : "text-text-muted"}`}>
          {isSelected ? "✓ " : ""}{build.fix}
        </p>
      </div>
    </button>
  );
}
