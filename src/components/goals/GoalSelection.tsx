import type { Weapon, EquippedState } from "../../types";
import { GOAL_PRESETS } from "../../data/presets";
import WeaponHeader from "./WeaponHeader";
import GoalCard from "./GoalCard";
import BuildPreview from "./BuildPreview";

interface GoalSelectionProps {
  weapon: Weapon;
  selectedGoal: string | null;
  equipped: EquippedState;
  buildCost: Record<string, number>;
  onSelectGoal: (key: string) => void;
  onCustomize: () => void;
}

export default function GoalSelection({
  weapon,
  selectedGoal,
  equipped,
  buildCost,
  onSelectGoal,
  onCustomize,
}: GoalSelectionProps) {
  return (
    <div className="space-y-6">
      <WeaponHeader weapon={weapon} onCustomize={onCustomize} />

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
        <>
          <div>
            <h3 className="text-2xl font-bold mb-2">
              What Do You Want to Achieve?
            </h3>
            <p className="text-sm text-gray-400">
              Choose your goal and we'll show you exactly how to build it
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(GOAL_PRESETS).map(([key, goal]) => (
              <GoalCard
                key={key}
                goalKey={key}
                goal={goal}
                weaponId={weapon.id}
                isSelected={selectedGoal === key}
                onSelect={onSelectGoal}
              />
            ))}
          </div>

          {selectedGoal && (
            <BuildPreview
              equipped={equipped}
              buildCost={buildCost}
              onCustomize={onCustomize}
            />
          )}
        </>
      )}
    </div>
  );
}
