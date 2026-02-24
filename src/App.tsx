// ============================================================================
// FILE: App.tsx
// PURPOSE: Root component — wires all hooks together and passes data to UI components
// USED BY: main.tsx (mounted into the DOM)
//
// This is a thin "wiring" layer with no business logic of its own.
// It calls the custom hooks, then passes their return values as props to components.
// The app has three top-level views:
//   1. WeaponPicker — shown when Weapons tab active and no weapon selected
//   2. WeaponBuilder — shown when Weapons tab active and a weapon is selected
//   3. AdvisorPage — shown when Advisor tab is active
//
// Theme state (dark/light) is managed by useTheme and passed to Header for the
// toggle button. The active theme is applied via a data-theme attribute on <html>.
// ============================================================================

import { useState } from "react";
import { useWeaponBuilder } from "./hooks/useWeaponBuilder";
import { useBuildCost } from "./hooks/useBuildCost";
import { useCumulativeEffects } from "./hooks/useCumulativeEffects";
import { useBuildUrl } from "./hooks/useBuildUrl";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/layout/Header";
import WeaponPicker from "./components/weapons/WeaponPicker";
import WeaponBuilder from "./components/builder/WeaponBuilder";
import AdvisorPage from "./components/advisor/AdvisorPage";
import type { AppView } from "./types";

export default function App() {
  // Top-level view state: which tab is active
  const [activeView, setActiveView] = useState<AppView>("weapons");

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
        activeView={activeView}
        onChangeView={setActiveView}
        hasWeapon={!!gun}
        weaponName={gunObj?.name}
        onReset={resetSelection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {activeView === "weapons" && (
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
      )}

      {activeView === "advisor" && (
        <AdvisorPage
          onSelectWeapon={selectWeapon}
          onNavigateToBuilder={() => setActiveView("weapons")}
        />
      )}
    </div>
  );
}
