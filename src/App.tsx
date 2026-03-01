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

import { useEffect, useState } from "react";
import { useWeaponBuilder } from "./hooks/useWeaponBuilder";
import { useBuildCost } from "./hooks/useBuildCost";
import { useCumulativeEffects } from "./hooks/useCumulativeEffects";
import { useBuildUrl } from "./hooks/useBuildUrl";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WeaponPicker from "./components/weapons/WeaponPicker";
import WeaponBuilder from "./components/builder/WeaponBuilder";
import AdvisorPage from "./components/advisor/AdvisorPage";
import type { AppView, GuideBuild } from "./types";

export default function App() {
  // Top-level view state: which tab is active
  const [activeView, setActiveView] = useState<AppView>("weapons");

  // Theme: dark/light mode with OS preference detection and localStorage persistence
  const { theme, toggleTheme } = useTheme();

  // Core state: selected weapon, guide (if any), equipped mods, and all actions
  const {
    gun,
    gunObj,
    guide,
    equipped,
    selectWeapon,
    openBuilderWithBuild,
    applyGuideBuild,
    equipMod,
    removeMod,
    clearAll,
    resetToBuilds,
    resetSelection,
  } = useWeaponBuilder();

  // Computed values derived from equipped mods (recalculated when equipped changes)
  const buildCost = useBuildCost(equipped);
  const cumulativeEffects = useCumulativeEffects(equipped);

  // Sync build state with URL params so builds are shareable via link
  useBuildUrl(gun, equipped, selectWeapon, equipMod);

  // Scroll to top when switching tabs or navigating within the Weapons view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView, gun]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-bg-base via-bg-mid to-bg-base text-text-primary">
      <Header
        activeView={activeView}
        onChangeView={setActiveView}
        hasWeapon={!!gun}
        onReset={resetSelection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="flex-1">
        {activeView === "weapons" && (
          <div className="max-w-6xl mx-auto px-4 py-6 pb-20 lg:pb-6">
            {!gun && <WeaponPicker onSelect={selectWeapon} />}

            {gun && gunObj && (
              <WeaponBuilder
                weapon={gunObj}
                guide={guide}
                equipped={equipped}
                buildCost={buildCost}
                cumulativeEffects={cumulativeEffects}
                onApplyGuideBuild={applyGuideBuild}
                onEquip={equipMod}
                onRemove={removeMod}
                onClearAll={clearAll}
                onBackToBuilds={resetToBuilds}
              />
            )}
          </div>
        )}

        {activeView === "advisor" && (
          <AdvisorPage
            onOpenBuilder={(weaponId: string, build?: GuideBuild | null) => {
              if (build?.slots && Object.keys(build.slots).length > 0) {
                openBuilderWithBuild(weaponId, build.slots);
              } else {
                selectWeapon(weaponId);
              }
              setActiveView("weapons");
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
