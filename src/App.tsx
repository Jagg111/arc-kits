import { useWeaponBuilder } from "./hooks/useWeaponBuilder";
import { useBuildCost } from "./hooks/useBuildCost";
import { useCumulativeEffects } from "./hooks/useCumulativeEffects";
import Header from "./components/layout/Header";
import WeaponPicker from "./components/weapons/WeaponPicker";
import GoalSelection from "./components/goals/GoalSelection";
import CustomBuilder from "./components/builder/CustomBuilder";

export default function App() {
  const {
    gun,
    gunObj,
    selectedGoal,
    equipped,
    viewMode,
    selectWeapon,
    applyGoalBuild,
    equipMod,
    removeMod,
    clearAll,
    resetSelection,
    goToCustom,
    goToGoals,
  } = useWeaponBuilder();

  const buildCost = useBuildCost(equipped);
  const cumulativeEffects = useCumulativeEffects(equipped);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <Header hasWeapon={!!gun} onReset={resetSelection} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {!gun && <WeaponPicker onSelect={selectWeapon} />}

        {gun && gunObj && viewMode === "goals" && (
          <GoalSelection
            weapon={gunObj}
            selectedGoal={selectedGoal}
            equipped={equipped}
            buildCost={buildCost}
            onSelectGoal={applyGoalBuild}
            onCustomize={goToCustom}
          />
        )}

        {gun && gunObj && viewMode === "custom" && (
          <CustomBuilder
            weapon={gunObj}
            equipped={equipped}
            buildCost={buildCost}
            cumulativeEffects={cumulativeEffects}
            onEquip={equipMod}
            onRemove={removeMod}
            onClearAll={clearAll}
            onBack={goToGoals}
          />
        )}
      </div>
    </div>
  );
}
