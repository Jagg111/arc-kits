// ============================================================================
// FILE: components/advisor/AdvisorPage.tsx
// PURPOSE: Top-level advisor container — manages filter state, derives view state,
//          renders filter bar + the appropriate content panel
// USED BY: App.tsx
// ============================================================================

import { useCallback, useMemo } from "react";
import { useAdvisorFilters } from "../../hooks/useAdvisorFilters";
import { recommendLoadouts } from "../../advisor/engine";
import { selectBuildForAdvisor } from "../../advisor/engine/attachment-selection";
import type { GuideBuild } from "../../types";
import AdvisorFilterBar from "./AdvisorFilterBar";
import AdvisorOnboarding from "./AdvisorOnboarding";
import AdvisorResults from "./AdvisorResults";
import AdvisorEmptyState from "./AdvisorEmptyState";

/** Called when user clicks "Customize →" on a weapon. Build is the recommended attachment set when present. */
export type OnOpenBuilder = (weaponId: string, build?: GuideBuild | null) => void;

interface AdvisorPageProps {
  onOpenBuilder: OnOpenBuilder;
}

export default function AdvisorPage({ onOpenBuilder }: AdvisorPageProps) {
  const { filters, setLocation, setSquad, setFocus, setRange, toggleRarity, setCraftingFilters } =
    useAdvisorFilters();

  const handleOpenBuilder = useCallback<OnOpenBuilder>((weaponId, build) => {
    onOpenBuilder(weaponId, build);
  }, [onOpenBuilder]);

  // Run engine when location is selected; idle otherwise
  const isIdle = filters.location === null;

  const result = useMemo(() => {
    if (isIdle) return null;
    return recommendLoadouts({
      location: filters.location!,
      squad: filters.squad,
      focus: filters.focus,
      preferredRange: filters.preferredRange,
      allowedWeaponRarities: filters.allowedWeaponRarities,
    });
  }, [isIdle, filters.location, filters.squad, filters.focus, filters.preferredRange, filters.allowedWeaponRarities]);

  const hasResults = result?.status === "results";
  const isEmpty = result?.status === "empty";

  // Pre-compute the best attachment build for every weapon in the results.
  // Keyed by weaponId so WeaponBlock can look up its recommended build directly.
  const buildsByWeapon = useMemo(() => {
    if (!hasResults) return {} as Record<string, GuideBuild | null>;
    const map: Record<string, GuideBuild | null> = {};
    for (const rec of result!.recommendations) {
      for (const wid of [rec.primaryWeaponId, rec.secondaryWeaponId]) {
        if (!(wid in map)) {
          map[wid] = selectBuildForAdvisor(wid, filters.preferredRange, filters.craftingFilters);
        }
      }
    }
    return map;
  }, [hasResults, result, filters.preferredRange, filters.craftingFilters]);

  return (
    <>
      <AdvisorFilterBar
        filters={filters}
        onSetLocation={setLocation}
        onSetSquad={setSquad}
        onSetFocus={setFocus}
        onSetRange={setRange}
        onToggleRarity={toggleRarity}
        onSetCraftingFilters={setCraftingFilters}
      />

      <div className="max-w-[80rem] mx-auto px-5 py-4 pb-8">
        {isIdle && <AdvisorOnboarding />}
        {hasResults && (
          <AdvisorResults recommendations={result!.recommendations} onOpenBuilder={handleOpenBuilder} buildsByWeapon={buildsByWeapon} />
        )}
        {isEmpty && <AdvisorEmptyState message={result!.emptyState?.message} />}
      </div>
    </>
  );
}
