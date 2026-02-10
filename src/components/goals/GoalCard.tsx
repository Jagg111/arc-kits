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
          ? "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 bg-opacity-20 shadow-lg shadow-orange-500/20"
          : "border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-orange-500/50"
      }`}
    >
      <div className="text-5xl mb-3">{goal.icon}</div>
      <h4 className="font-bold text-xl mb-2">{goal.name}</h4>
      <p className="text-sm text-gray-400 mb-3">{goal.desc}</p>
      {isSelected && (
        <div className="pt-3 border-t border-orange-500/30">
          <p className="text-sm text-orange-200 font-semibold">
            ✓ {build.fix}
          </p>
        </div>
      )}
    </button>
  );
}
