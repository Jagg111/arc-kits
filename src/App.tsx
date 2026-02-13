// ============================================================================
// FILE: App.tsx
// PURPOSE: Root component — wires all hooks together and passes data to UI components
// USED BY: main.tsx (mounted into the DOM)
//
// This is a thin "wiring" layer with no business logic of its own.
// It calls the custom hooks, then passes their return values as props to components.
// The app has two screens:
//   1. WeaponPicker — shown when no weapon is selected (gun === null)
//   2. WeaponBuilder — shown when a weapon is selected
//
// Theme state (dark/light) is managed by useTheme and passed to Header for the
// toggle button. The active theme is applied via a data-theme attribute on <html>.
// ============================================================================

import { useWeaponBuilder } from "./hooks/useWeaponBuilder";
import { useBuildCost } from "./hooks/useBuildCost";
import { useCumulativeEffects } from "./hooks/useCumulativeEffects";
import { useBuildUrl } from "./hooks/useBuildUrl";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/layout/Header";
import WeaponPicker from "./components/weapons/WeaponPicker";
import WeaponBuilder from "./components/builder/WeaponBuilder";

export default function App() {
  // Theme: dark/light mode with OS preference detection and localStorage persistence
  const { theme, toggleTheme } = useTheme();

  // Core state: selected weapon, goal, equipped mods, and all action functions
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

  // Computed values derived from equipped mods (recalculated when equipped changes)
  const buildCost = useBuildCost(equipped);
  const cumulativeEffects = useCumulativeEffects(equipped);

  // Sync build state with URL params so builds are shareable via link
  useBuildUrl(gun, equipped, selectWeapon, equipMod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-base via-bg-mid to-bg-base text-text-primary">
      <Header
        hasWeapon={!!gun}
        weaponName={gunObj?.name}
        onReset={resetSelection}
        theme={theme}
        toggleTheme={toggleTheme}
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
