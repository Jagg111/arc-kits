import { useWeaponBuilder } from "./hooks/useWeaponBuilder";
import { useBuildCost } from "./hooks/useBuildCost";
import { useCumulativeEffects } from "./hooks/useCumulativeEffects";
import { useBuildUrl } from "./hooks/useBuildUrl";
import Header from "./components/layout/Header";
import WeaponPicker from "./components/weapons/WeaponPicker";
import WeaponBuilder from "./components/builder/WeaponBuilder";

export default function App() {
  const {
    gun,
    gunObj,
    selectedGoal,
    equipped,
    selectWeapon,
    applyGoalBuild,
    equipMod,
    removeMod,
    clearAll,
    resetSelection,
  } = useWeaponBuilder();

  const buildCost = useBuildCost(equipped);
  const cumulativeEffects = useCumulativeEffects(equipped);

  useBuildUrl(gun, equipped, selectWeapon, equipMod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <Header
        hasWeapon={!!gun}
        weaponName={gunObj?.name}
        onReset={resetSelection}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 pb-20 lg:pb-6">
        {!gun && <WeaponPicker onSelect={selectWeapon} />}

        {gun && gunObj && (
          <WeaponBuilder
            weapon={gunObj}
            selectedGoal={selectedGoal}
            equipped={equipped}
            buildCost={buildCost}
            cumulativeEffects={cumulativeEffects}
            onSelectGoal={applyGoalBuild}
            onEquip={equipMod}
            onRemove={removeMod}
            onClearAll={clearAll}
          />
        )}
      </div>
    </div>
  );
}
