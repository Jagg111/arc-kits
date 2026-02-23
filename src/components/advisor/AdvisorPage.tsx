// ============================================================================
// FILE: components/advisor/AdvisorPage.tsx
// PURPOSE: Top-level advisor container — manages filter state, derives view state,
//          renders filter bar + the appropriate content panel
// USED BY: App.tsx
// ============================================================================

import { useMemo } from "react";
import { useAdvisorFilters } from "../../hooks/useAdvisorFilters";
import {
  ADVISOR_LOCATION_LABELS,
  ADVISOR_SQUAD_LABELS,
  ADVISOR_FOCUS_LABELS,
  ADVISOR_RANGE_LABELS,
} from "../../data/advisor_config";
import { recommendLoadouts } from "../../advisor/engine";
import AdvisorFilterBar from "./AdvisorFilterBar";
import AdvisorOnboarding from "./AdvisorOnboarding";
import AdvisorResults from "./AdvisorResults";
import AdvisorEmptyState from "./AdvisorEmptyState";

export default function AdvisorPage() {
  const { filters, setLocation, setSquad, setFocus, setRange, toggleRarity } =
    useAdvisorFilters();

  // Build context echo line from active filters
  const contextLine = filters.location
    ? [
        ADVISOR_LOCATION_LABELS[filters.location],
        ADVISOR_SQUAD_LABELS[filters.squad],
        ADVISOR_FOCUS_LABELS[filters.focus],
        filters.preferredRange !== "any" ? ADVISOR_RANGE_LABELS[filters.preferredRange] + " range" : null,
      ]
        .filter(Boolean)
        .join(" \u00b7 ")
    : "";

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

  return (
    <>
      <AdvisorFilterBar
        filters={filters}
        onSetLocation={setLocation}
        onSetSquad={setSquad}
        onSetFocus={setFocus}
        onSetRange={setRange}
        onToggleRarity={toggleRarity}
      />

      <div className="max-w-[80rem] mx-auto px-5 py-4 pb-8">
        {isIdle && <AdvisorOnboarding />}
        {hasResults && (
          <AdvisorResults recommendations={result!.recommendations} contextLine={contextLine} />
        )}
        {isEmpty && (
          <>
            <div className="flex items-baseline gap-2 py-1 mb-2.5">
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-text-muted">
                Recommendations
              </span>
              <span className="text-xs text-text-faint">&mdash; {contextLine}</span>
            </div>
            <AdvisorEmptyState message={result!.emptyState?.message} />
          </>
        )}
      </div>
    </>
  );
}
